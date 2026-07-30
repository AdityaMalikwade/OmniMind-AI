import os
import uuid
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from pydantic import BaseModel
from app.models.user import UserProfile
from app.models.document import DocumentResponse
from app.api.auth import get_current_user
from app.services.parser import DocumentParser
from app.services.vector_store import vector_store
from app.api.documents import MOCK_DOCUMENTS_DB
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class SearchRequest(BaseModel):
    query: str
    file_type: Optional[str] = "all"
    top_k: Optional[int] = 5

@router.post("/upload", summary="Upload & Ingest Knowledge File")
async def upload_file(
    file: UploadFile = File(...),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Ingests file (PDF, DOCX, PPTX, TXT, Images OCR, Code), parses text, creates ChromaDB vector embeddings, and registers metadata.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    try:
        file_bytes = await file.read()
        file_size = len(file_bytes)
        
        # Save to local storage
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"
        saved_filename = f"{doc_id}_{file.filename}"
        storage_path = os.path.join(UPLOAD_DIR, saved_filename)
        
        with open(storage_path, "wb") as f:
            f.write(file_bytes)

        # 1. Parse text using DocumentParser (PyMuPDF / EasyOCR / docx / pptx / code)
        parse_result = DocumentParser.extract_text(file_bytes, file.filename)
        extracted_text = parse_result.get("text", "")
        pages = parse_result.get("pages", 1)
        meta = parse_result.get("metadata", {})

        # Determine file category
        ext = os.path.splitext(file.filename)[1].lower()
        if ext == '.pdf':
            file_type = 'pdf'
        elif ext in ['.png', '.jpg', '.jpeg', '.webp']:
            file_type = 'image'
        elif ext in ['.docx', '.doc']:
            file_type = 'docx'
        elif ext in ['.pptx', '.ppt']:
            file_type = 'pptx'
        elif ext in ['.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.sql']:
            file_type = 'code'
        else:
            file_type = 'txt'

        # 2. Chunk text & Index into ChromaDB Vector Store
        chunks = vector_store.chunk_text(extracted_text, chunk_size=500, chunk_overlap=50)
        indexed_chunks = vector_store.add_document_chunks(
            document_id=doc_id,
            user_id=current_user.id,
            chunks=chunks,
            filename=file.filename,
            file_type=file_type
        )

        # 3. Generate initial summary snippet
        summary_snippet = (
            extracted_text[:200].replace('\n', ' ').strip() + "..."
            if len(extracted_text) > 200 else extracted_text.strip()
        )

        new_doc = {
            "id": doc_id,
            "user_id": current_user.id,
            "filename": file.filename,
            "storage_path": storage_path,
            "file_type": file_type,
            "file_size": file_size,
            "mime_type": file.content_type,
            "summary": summary_snippet or f"Parsed {len(chunks)} vector chunks.",
            "status": "indexed",
            "error_message": None,
            "metadata": {
                "pages": pages,
                "chunks_count": len(chunks),
                **meta
            },
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # Prepend to in-memory DB list
        MOCK_DOCUMENTS_DB.insert(0, new_doc)

        return {
            "message": "File successfully parsed and indexed into vector database",
            "document": new_doc,
            "chunks_count": len(chunks)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@router.post("/search", summary="Semantic Vector Search Query")
async def semantic_search(
    req: SearchRequest,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Performs cosine similarity search against ChromaDB using SentenceTransformers embeddings.
    """
    results = vector_store.similarity_search(
        query=req.query,
        user_id=current_user.id,
        top_k=req.top_k or 5,
        file_type_filter=req.file_type
    )
    return {
        "query": req.query,
        "results_count": len(results),
        "results": results
    }
