from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.models.user import UserProfile
from app.api.auth import get_current_user
from app.services.vector_store import vector_store
from app.services.ai_rag import gemini_rag
from app.api.documents import MOCK_DOCUMENTS_DB

router = APIRouter()

class RAGChatRequest(BaseModel):
    query: str
    file_type: Optional[str] = "all"
    top_k: Optional[int] = 5

class RAGChatResponse(BaseModel):
    query: str
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float

@router.post("/chat", response_model=RAGChatResponse, summary="Gemini 1.5 RAG Chat over Knowledge Base")
async def rag_chat(
    req: RAGChatRequest,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    1. Vector searches ChromaDB for top-K relevant text chunks matching query.
    2. Feeds retrieved context into Gemini 1.5 API to synthesize grounded response with source citations.
    """
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    # Step 1: Vector Search in ChromaDB
    retrieved_chunks = vector_store.similarity_search(
        query=req.query,
        user_id=current_user.id,
        top_k=req.top_k or 5,
        file_type_filter=req.file_type
    )

    # Step 2: Gemini 1.5 RAG Answer Generation
    rag_result = gemini_rag.answer_rag_question(
        query=req.query,
        retrieved_chunks=retrieved_chunks
    )

    return RAGChatResponse(
        query=req.query,
        answer=rag_result["answer"],
        sources=rag_result["sources"],
        confidence=rag_result["confidence"]
    )

@router.post("/summarize/{document_id}", summary="Generate Gemini AI Summary for Document")
async def summarize_document_endpoint(
    document_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Generates an executive summary, key takeaways, and tags using Gemini AI.
    """
    target_doc = None
    for doc in MOCK_DOCUMENTS_DB:
        if doc["id"] == document_id:
            target_doc = doc
            break

    if not target_doc:
        raise HTTPException(status_code=404, detail="Document not found")

    text_content = target_doc.get("summary", "") or target_doc.get("filename", "")
    summary_data = gemini_rag.summarize_document(text_content, target_doc["filename"])
    
    # Update document summary record
    target_doc["summary"] = summary_data.get("summary_raw", "")

    return {
        "document_id": document_id,
        "filename": target_doc["filename"],
        "summary": summary_data.get("summary_raw", "")
    }
