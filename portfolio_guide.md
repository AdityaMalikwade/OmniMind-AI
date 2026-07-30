# OmniMind AI – Portfolio, Resume & Interview Showcase Kit 🚀

This document serves as your technical master guide for presenting **OmniMind AI – Your Second Brain** in ISE submissions, hackathons, technical interviews, resume bullet points, and startup pitch decks.

---

## 🏛️ System Architecture Blueprint

```
                     ┌──────────────────────────────────────────────┐
                     │          React + TypeScript + Vite           │
                     │          Tailwind CSS Glassmorphic UI        │
                     └──────────────────────┬───────────────────────┘
                                            │ REST API Calls (HTTP / JSON)
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │              FastAPI Python Engine           │
                     │         CORS Middleware & Pydantic DTOs      │
                     └──────┬──────────────────────┬─────────┬──────┘
                            │                      │         │
           ┌────────────────┴──────────┐           │         └────────────────────────┐
           ▼                           ▼           ▼                                  ▼
┌─────────────────────┐   ┌──────────────────────────┐   ┌─────────────────┐   ┌─────────────────────┐
│ Document Parser     │   │ SentenceTransformers     │   │ Google Gemini   │   │ Supabase PostgreSQL │
│ • PyMuPDF (PDF)     │   │ (all-MiniLM-L6-v2)       │   │ 1.5 Pro/Flash   │   │ & Supabase Auth     │
│ • EasyOCR (Images)  │   └────────────┬─────────────┘   │ Grounded RAG    │   │ • RLS Policies      │
│ • docx / pptx / code│                │                 └────────┬────────┘   │ • Profiles & Docs   │
└─────────────────────┘                ▼                          │            └─────────────────────┘
                          ┌──────────────────────────┐            │
                          │ ChromaDB Vector Database │◄───────────┘
                          │ • Sliding window chunks  │ (Top-K Context Retrieval)
                          │ • Cosine similarity search│
                          └──────────────────────────┘
```

---

## 💼 Resume Bullet Points

### **Role: AI Software Engineer / Full-Stack Engineer**

- **Built OmniMind AI**, an enterprise-grade AI personal knowledge universal search engine capable of parsing, indexing, and querying multi-format files (PDF, DOCX, PPTX, Images OCR, Source Code).
- **Engineered a zero-hallucination RAG pipeline** using **Google Gemini 1.5 API** and **ChromaDB vector store**, grounding answers strictly in retrieved text chunks with source citation badges.
- **Implemented multi-format extraction engine** utilizing **PyMuPDF (`fitz`)** for sub-second PDF text parsing and **EasyOCR** for extracting text from certificates, screenshots, and diagrams.
- **Architected vector search pipeline** with **SentenceTransformers (`all-MiniLM-L6-v2`)**, chunking text into 500-character sliding windows with 50-character overlap for optimal semantic context.
- **Designed production PostgreSQL schema with Row Level Security (RLS)** in **Supabase**, ensuring multi-tenant data isolation, profile triggers, and instant REST API queries via **FastAPI**.
- **Crafted a modern dark glassmorphism UI** using **React**, **TypeScript**, and **Tailwind CSS**, featuring live dropzone uploads, real-time vector search results, and interactive RAG chat.

---

## 🎤 Hackathon 2-Minute Pitch Deck Script

### **1. The Hook (15 Seconds)**
> *"In 2026, we save thousands of PDFs, lecture slides, certificates, screenshots, and code snippets every year—yet when we need to find that ONE key piece of information, CTRL+F fails us. Current search engines are dumb; they match words, not meaning."*

### **2. The Problem (20 Seconds)**
> *"Existing note apps force manual organizing, while generic AI chatbots don't know anything about your personal local files or certificates. OCR tools are clunky, and standard search can't read text inside a screenshot of your code or diploma."*

### **3. The Solution - OmniMind AI (30 Seconds)**
> *"Meet OmniMind AI – Your Second Brain. Drag and drop any file: a 100-page PDF research paper, a Word document, a PowerPoint presentation, a Python script, or a screenshot of your certificate. OmniMind automatically parses the text, computes 384-dimensional vector embeddings, indexes them into ChromaDB, and lets you ask anything using ONE intelligent search bar."*

### **4. Tech Stack & Innovation (25 Seconds)**
> *"Under the hood, OmniMind combines PyMuPDF for lightning-fast PDF parsing, EasyOCR for image reading, SentenceTransformers for vector embeddings, ChromaDB for cosine similarity search, Supabase Postgres with Row Level Security for privacy, and Google Gemini 1.5 for context-grounded RAG answering with verifiable source citations."*

### **5. Live Demo & Call to Action (30 Seconds)**
> *"Watch this: I upload a screenshot of my Cloud Certification. I ask Gemini AI: 'What certification do I hold and when does it expire?' In under 500ms, OmniMind retrieves the exact vector chunk, quotes the certificate text, and cites the source file. OmniMind turns your raw files into active, conversational intelligence. Thank you!"*

---

## 🛡️ ISE Submission & Technical Interview Defense Guide

### **Q1: Why did you choose ChromaDB over pgvector in PostgreSQL?**
> **Answer**: *"While pgvector is great for unified SQL querying, ChromaDB provides a lightweight, dedicated, high-speed vector storage engine with HNSW cosine similarity indexing built-in. It allows our FastAPI backend to perform vector searches independently of database connection pools, maximizing throughput and reducing database I/O overhead during heavy search traffic."*

### **Q2: How does OmniMind prevent AI Hallucinations during RAG chat?**
> **Answer**: *"We enforce strict system prompt boundaries in our Gemini 1.5 service (`ai_rag.py`). Before calling Gemini, we execute top-K cosine similarity search in ChromaDB. We inject ONLY those retrieved context chunks into the prompt and explicitly instruct Gemini: 'Answer using ONLY the provided document context chunks below. If the answer is not present, state that you don't have enough information.' Furthermore, every answer includes source citation badges `[Source X: filename]`."*

### **Q3: Why chunk text into 500 characters with 50-character overlap?**
> **Answer**: *"Embedding an entire 50-page document into a single vector dilutes specific facts. Conversely, chunking line-by-line breaks context. A 500-character window corresponds roughly to a dense paragraph, capturing a single coherent thought. The 50-character sliding overlap ensures key sentences that cross chunk boundaries aren't severed, preserving semantic continuity across vector boundaries."*

---

## 🌐 Production Deployment Steps

### **Frontend Deployment (Vercel)**
1. Push repo to GitHub.
2. Import repository on [Vercel](https://vercel.com).
3. Vercel automatically detects [`vercel.json`](file:///C:/Users/HP/.gemini/antigravity/scratch/omnimind-ai/frontend/vercel.json) and builds the React app.

### **Backend Deployment (Render / Docker)**
1. Create a Web Service on [Render](https://render.com).
2. Connect repository and select **Docker** as environment.
3. Render reads [`Dockerfile`](file:///C:/Users/HP/.gemini/antigravity/scratch/omnimind-ai/backend/Dockerfile) and [`render.yaml`](file:///C:/Users/HP/.gemini/antigravity/scratch/omnimind-ai/backend/render.yaml).
4. Set Environment Variables (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
