from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.models.user import UserProfile
from app.models.document import DocumentResponse, DocumentFilter
from app.api.auth import get_current_user
from app.core.supabase import supabase_client
from datetime import datetime

router = APIRouter()

# In-memory mock documents store for offline / dev execution
MOCK_DOCUMENTS_DB = [
    {
        "id": "doc-101",
        "user_id": "00000000-0000-0000-0000-000000000001",
        "filename": "System_Architecture_Overview.pdf",
        "storage_path": "uploads/System_Architecture_Overview.pdf",
        "file_type": "pdf",
        "file_size": 2450100,
        "mime_type": "application/pdf",
        "summary": "Technical architecture detailing microservices, vector search with ChromaDB, and Gemini 1.5 RAG API.",
        "status": "indexed",
        "error_message": None,
        "metadata": {"pages": 12, "author": "OmniMind Team"},
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "doc-102",
        "user_id": "00000000-0000-0000-0000-000000000001",
        "filename": "AWS_Certified_Solutions_Architect.png",
        "storage_path": "uploads/AWS_Certified_Solutions_Architect.png",
        "file_type": "image",
        "file_size": 845200,
        "mime_type": "image/png",
        "summary": "OCR extracted certificate verifying AWS Certified Solutions Architect Associate credentials.",
        "status": "indexed",
        "error_message": None,
        "metadata": {"resolution": "1920x1080", "ocr_confidence": 0.96},
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

@router.get("/", response_model=List[DocumentResponse], summary="List User Documents")
async def list_documents(
    file_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Lists all documents owned by the authenticated user with optional status and type filters.
    """
    if supabase_client:
        try:
            query = supabase_client.table("documents").select("*").eq("user_id", current_user.id)
            if file_type:
                query = query.eq("file_type", file_type)
            if status:
                query = query.eq("status", status)
            
            res = query.order("created_at", desc=True).execute()
            return res.data
        except Exception as e:
            print(f"Supabase query failed, falling back to mock database: {e}")
    
    # Filter in-memory fallback
    results = MOCK_DOCUMENTS_DB
    if file_type and file_type != 'all':
        results = [d for d in results if d["file_type"] == file_type]
    if status:
        results = [d for d in results if d["status"] == status]
    return results

@router.get("/{document_id}", response_model=DocumentResponse, summary="Get Document Details")
async def get_document(
    document_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    if supabase_client:
        try:
            res = supabase_client.table("documents").select("*").eq("id", document_id).eq("user_id", current_user.id).single().execute()
            if res.data:
                return res.data
        except Exception:
            pass

    for doc in MOCK_DOCUMENTS_DB:
        if doc["id"] == document_id:
            return doc
    
    raise HTTPException(status_code=404, detail="Document not found")

@router.delete("/{document_id}", summary="Delete Document Metadata & Storage")
async def delete_document(
    document_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    if supabase_client:
        try:
            supabase_client.table("documents").delete().eq("id", document_id).eq("user_id", current_user.id).execute()
            return {"message": "Document deleted successfully", "id": document_id}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    global MOCK_DOCUMENTS_DB
    MOCK_DOCUMENTS_DB = [d for d in MOCK_DOCUMENTS_DB if d["id"] != document_id]
    return {"message": "Document deleted successfully", "id": document_id}
