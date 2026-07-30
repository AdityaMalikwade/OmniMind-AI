import os
import io
import re
from typing import Dict, Any, List

class DocumentParser:
    """
    Universal Document Extractor supporting PDF, DOCX, PPTX, Images (OCR), and Code/Text files.
    """

    @staticmethod
    def extract_text(file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """
        Main entrypoint. Inspects file extension and extracts structured text content and metadata.
        """
        ext = os.path.splitext(filename)[1].lower()
        
        if ext == '.pdf':
            return DocumentParser._parse_pdf(file_bytes)
        elif ext in ['.docx', '.doc']:
            return DocumentParser._parse_docx(file_bytes)
        elif ext in ['.pptx', '.ppt']:
            return DocumentParser._parse_pptx(file_bytes)
        elif ext in ['.png', '.jpg', '.jpeg', '.webp', '.bmp']:
            return DocumentParser._parse_image_ocr(file_bytes)
        elif ext in ['.txt', '.md', '.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.csv', '.sql']:
            return DocumentParser._parse_text_file(file_bytes, ext)
        else:
            # General fallback for unrecognized text files
            try:
                text = file_bytes.decode('utf-8', errors='ignore')
                return {"text": text, "pages": 1, "metadata": {"file_type": "plain_text"}}
            except Exception:
                return {"text": "", "pages": 0, "metadata": {"file_type": "unknown"}}

    @staticmethod
    def _parse_pdf(file_bytes: bytes) -> Dict[str, Any]:
        """
        Parses PDF documents page by page using PyMuPDF (fitz).
        """
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            extracted_pages = []
            full_text = []

            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text("text")
                if page_text.strip():
                    full_text.append(f"--- Page {page_num + 1} ---\n{page_text}")
                    extracted_pages.append({"page": page_num + 1, "text": page_text})

            return {
                "text": "\n\n".join(full_text),
                "pages": len(doc),
                "page_details": extracted_pages,
                "metadata": {
                    "file_type": "pdf",
                    "page_count": len(doc)
                }
            }
        except ImportError:
            return {"text": "[PyMuPDF fitz not installed. Please install pymupdf]", "pages": 0, "metadata": {"error": "missing_dependency"}}
        except Exception as e:
            return {"text": f"PDF parsing error: {str(e)}", "pages": 0, "metadata": {"error": str(e)}}

    @staticmethod
    def _parse_docx(file_bytes: bytes) -> Dict[str, Any]:
        """
        Parses Microsoft Word DOCX documents using python-docx.
        """
        try:
            import docx
            doc = docx.Document(io.BytesIO(file_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            full_text = "\n".join(paragraphs)
            
            return {
                "text": full_text,
                "pages": max(1, len(paragraphs) // 5),
                "metadata": {
                    "file_type": "docx",
                    "paragraph_count": len(paragraphs)
                }
            }
        except ImportError:
            return {"text": "[python-docx not installed]", "pages": 0, "metadata": {"error": "missing_dependency"}}
        except Exception as e:
            return {"text": f"DOCX parsing error: {str(e)}", "pages": 0, "metadata": {"error": str(e)}}

    @staticmethod
    def _parse_pptx(file_bytes: bytes) -> Dict[str, Any]:
        """
        Parses Microsoft PowerPoint PPTX slide decks using python-pptx.
        """
        try:
            from pptx import Presentation
            prs = Presentation(io.BytesIO(file_bytes))
            slide_texts = []

            for idx, slide in enumerate(prs.slides):
                text_runs = []
                for shape in slide.shapes:
                    if hasattr(shape, "text") and shape.text.strip():
                        text_runs.append(shape.text)
                if text_runs:
                    slide_texts.append(f"--- Slide {idx + 1} ---\n" + "\n".join(text_runs))

            return {
                "text": "\n\n".join(slide_texts),
                "pages": len(prs.slides),
                "metadata": {
                    "file_type": "pptx",
                    "slide_count": len(prs.slides)
                }
            }
        except ImportError:
            return {"text": "[python-pptx not installed]", "pages": 0, "metadata": {"error": "missing_dependency"}}
        except Exception as e:
            return {"text": f"PPTX parsing error: {str(e)}", "pages": 0, "metadata": {"error": str(e)}}

    @staticmethod
    def _parse_image_ocr(file_bytes: bytes) -> Dict[str, Any]:
        """
        Parses images, screenshots, and certificates using EasyOCR / PIL.
        """
        try:
            import easyocr
            from PIL import Image

            # Initialize EasyOCR reader (English)
            reader = easyocr.Reader(['en'], gpu=False)
            image = Image.open(io.BytesIO(file_bytes))
            
            # Save temporary byte buffer to numpy array or bytes
            results = reader.readtext(file_bytes, detail=0)
            ocr_text = "\n".join(results)

            return {
                "text": ocr_text if ocr_text.strip() else "[No text detected in image via OCR]",
                "pages": 1,
                "metadata": {
                    "file_type": "image",
                    "ocr_engine": "EasyOCR",
                    "image_size": f"{image.width}x{image.height}"
                }
            }
        except Exception as e:
            # Fallback OCR notice
            return {
                "text": f"OCR Extraction Notice: Image ingested. OCR engine status: {str(e)}",
                "pages": 1,
                "metadata": {"file_type": "image", "ocr_fallback": True}
            }

    @staticmethod
    def _parse_text_file(file_bytes: bytes, ext: str) -> Dict[str, Any]:
        """
        Parses plain text, Markdown, or source code files with line formatting.
        """
        try:
            text = file_bytes.decode('utf-8', errors='ignore')
            lines = text.splitlines()
            return {
                "text": text,
                "pages": max(1, len(lines) // 40),
                "metadata": {
                    "file_type": "code" if ext in ['.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.sql'] else "text",
                    "line_count": len(lines),
                    "extension": ext
                }
            }
        except Exception as e:
            return {"text": f"Text read error: {str(e)}", "pages": 0, "metadata": {"error": str(e)}}
