import { DocumentItem, UserProfile, SearchResult } from '../types';

const API_BASE = '/api/v1';

export interface RAGResponse {
  query: string;
  answer: str;
  sources: Array<{ source_id: number; filename: string; similarity_score: number }>;
  confidence: number;
}

export async function fetchHealthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('API Health check failed');
  return res.json();
}

export async function getCurrentUser(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/me`);
  if (!res.ok) throw new Error('Failed to get user');
  return res.json();
}

export async function fetchUserDocuments(fileType?: string): Promise<DocumentItem[]> {
  const url = fileType && fileType !== 'all' 
    ? `${API_BASE}/documents?file_type=${fileType}` 
    : `${API_BASE}/documents`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function deleteDocument(documentId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/documents/${documentId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete document');
}

export async function uploadDocumentFile(file: File): Promise<{ message: string; document: DocumentItem; chunks_count: number }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/ingest/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function searchVectorDB(query: string, fileType: string = 'all'): Promise<SearchResult[]> {
  const res = await fetch(`${API_BASE}/ingest/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, file_type: fileType, top_k: 5 }),
  });

  if (!res.ok) throw new Error('Vector search failed');
  const data = await res.json();
  return data.results;
}

export async function sendRAGChatQuery(query: string, fileType: string = 'all'): Promise<RAGResponse> {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, file_type: fileType, top_k: 5 }),
  });

  if (!res.ok) throw new Error('Gemini RAG chat failed');
  return res.json();
}

export async function summarizeDocumentAI(documentId: string): Promise<{ document_id: string; filename: string; summary: string }> {
  const res = await fetch(`${API_BASE}/ai/summarize/${documentId}`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error('Summarization failed');
  return res.json();
}
