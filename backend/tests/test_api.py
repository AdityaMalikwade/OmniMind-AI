import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add parent app path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.services.parser import DocumentParser
from app.services.vector_store import vector_store

client = TestClient(app)

def test_health_check_endpoint():
    """
    Verifies that the /api/v1/health API returns status 200 and 'online'.
    """
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["app_name"] == "OmniMind AI"

def test_text_file_parser():
    """
    Verifies DocumentParser correctly extracts plain text and source code.
    """
    sample_code = b"def hello_omnimind():\n    print('Hello Second Brain')\n"
    result = DocumentParser.extract_text(sample_code, "test_script.py")
    
    assert "hello_omnimind" in result["text"]
    assert result["metadata"]["file_type"] == "code"
    assert result["metadata"]["extension"] == ".py"

def test_vector_store_chunking():
    """
    Verifies text sliding-window chunker splits long paragraphs into expected lengths.
    """
    long_text = "OmniMind AI " * 100  # ~1200 characters
    chunks = vector_store.chunk_text(long_text, chunk_size=500, chunk_overlap=50)
    
    assert len(chunks) >= 2
    assert len(chunks[0]) <= 500

def test_rag_chat_endpoint():
    """
    Verifies RAG chat endpoint accepts query and returns grounded answer structure.
    """
    payload = {
        "query": "What is OmniMind AI?",
        "file_type": "all",
        "top_k": 3
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert "answer" in data
    assert "confidence" in data
