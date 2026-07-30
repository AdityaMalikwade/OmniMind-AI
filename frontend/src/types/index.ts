export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export type DocumentFileType = 'pdf' | 'docx' | 'pptx' | 'txt' | 'image' | 'code' | 'zip' | 'other';
export type DocumentStatus = 'pending' | 'processing' | 'indexed' | 'error';

export interface DocumentItem {
  id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  file_type: DocumentFileType;
  file_size: number;
  mime_type?: string;
  summary?: string;
  status: DocumentStatus;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  embedding_id: string;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  chunk_id: string;
  document_id: string;
  filename: string;
  file_type: DocumentFileType;
  content: string;
  similarity_score: number;
  page_number?: number;
  summary?: string;
}
