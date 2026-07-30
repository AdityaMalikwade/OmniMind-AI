from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_type: str
    file_size: int
    mime_type: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class DocumentCreate(DocumentBase):
    storage_path: str
    user_id: str

class DocumentUpdate(BaseModel):
    summary: Optional[str] = None
    status: Optional[str] = None
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class DocumentResponse(DocumentBase):
    id: str
    user_id: str
    storage_path: str
    summary: Optional[str] = None
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentChunkModel(BaseModel):
    id: str
    document_id: str
    user_id: str
    chunk_index: int
    content: str
    embedding_id: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class DocumentFilter(BaseModel):
    file_type: Optional[str] = None
    status: Optional[str] = None
    search_query: Optional[str] = None
    tag: Optional[str] = None
