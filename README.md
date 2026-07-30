# OmniMind AI – Your Second Brain 🧠✨

> **AI-Powered Universal Search Engine & Knowledge Workspace for Personal Knowledge**

OmniMind AI is a state-of-the-art personal knowledge platform that ingests, parses, embeds, and enables instant semantic search and conversational RAG (Retrieval-Augmented Generation) across all your digital files—PDFs, DOCX, PPTX, TXT, images/screenshots (via OCR), certificates, code files, and ZIP archives.

---

## 🌟 Key Features (MVP Roadmap)

- 🔐 **User Authentication**: Secure authentication powered by Supabase Auth.
- 📁 **Multi-Format File Ingestion**: Drag-and-drop upload for PDF, DOCX, PPTX, TXT, images, and code.
- 👁️ **Optical Character Recognition (OCR)**: Text extraction from screenshots, certificates, and diagrams using EasyOCR.
- ⚡ **AI Semantic Search**: Single unified search bar with vector embeddings computed by Sentence Transformers & ChromaDB.
- 💬 **RAG AI Chat**: Chat directly with your uploaded documents powered by Gemini 1.5 API.
- 📊 **Smart Document Summaries**: Instant bulleted summaries and entity extraction.
- 🎯 **Advanced Search Filters**: Filter by document type, date range, tags, and confidence scores.
- 💎 **Modern Dark Glass UI**: Premium responsive UI built with React, TypeScript, and Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS, Vite, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic |
| **Database & Auth** | PostgreSQL (Supabase), Supabase Auth |
| **Storage** | Supabase Storage |
| **AI Model** | Google Gemini 1.5 API |
| **Vector DB** | ChromaDB |
| **Embeddings** | Sentence Transformers (`all-MiniLM-L6-v2`) |
| **Parsing & OCR** | PyMuPDF (`fitz`), EasyOCR, python-docx, python-pptx |

---

## 📁 Repository Architecture

```
omnimind-ai/
├── backend/
│   ├── app/
│   │   ├── api/          # API Endpoint Routers (search, chat, files, auth)
│   │   ├── core/         # App Config, Security, Gemini & DB initializers
│   │   ├── services/     # OCR, Parsing, Vector Embeddings, RAG Service
│   │   └── models/       # Pydantic Schemas & Data Transfer Objects
│   ├── .env.example
│   ├── main.py           # FastAPI entrypoint
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Modular React Components (Upload, Search, Chat, Cards)
│   │   ├── pages/        # Dashboard, Search View, Auth Pages
│   │   ├── services/     # API Client & Supabase SDK integration
│   │   └── types/        # TypeScript Definitions
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📜 License
MIT License - Free for education, hackathons, and personal use.
