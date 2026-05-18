<div align="center">

# ✦ GANESH BAMALWA ✦
**Software Engineer | AI Systems Architect | Full-Stack Developer**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

*I don't just study AI. I ship it.*

</div>

---

## 🌌 Overview

Welcome to the source code of my interactive 3D portfolio. Designed as a cinematic, high-performance web experience, this platform serves as both a showcase of my work and a testament to my engineering capabilities in rendering, physics, and AI systems.

The interface revolves around a **hyper-realistic 3D brilliant-cut crystal**, complex zero-gravity 2D physics engines, and an integrated **Hugging Face AI Assistant** (Réne) capable of answering detailed questions about my architecture, stack, and experience.

---

## ⚡ Core Architectural Features

### 1. WebGL & Physically-Based Rendering (PBR)
- **Diamond Refraction System:** Custom 3D mesh leveraging `@react-three/drei`'s `MeshTransmissionMaterial` with calculated IOR (Index of Refraction), chromatic aberration, and physical back-side transmission to emulate genuine diamond optics.
- **Cinematic Choreography:** Intelligent camera dollies and rim-lighting sweeps that dynamically bind to scroll progress, maintaining a luxury product aesthetic natively at 60FPS.

### 2. Custom 2D Physics Engines
- **Zero-Gravity Name Disintegration:** A fully custom `requestAnimationFrame` 60FPS physics loop handling velocity, collision boundaries, and pointer drag-throws for text elements.
- **Organic Spaced Particle Networks:** A jittered grid Poisson-like distribution engine managing thousands of background nodes. It utilizes **Depth-First Search (DFS) clustering** and repulsion boundaries to render clean constellation lines without overlapping visual noise.

### 3. Integrated AI Assistant ("Talk to Réne")
- **Live AI Inference:** The UI seamlessly connects to a remote LLM backend via a `POST /chat` API hosted on Hugging Face Spaces.
- **State Segregation:** Strict separation of concerns where the React frontend handles UI typing effects, conversational history, and skeleton loading states, while the remote API strictly handles intelligence.

---

## 🛠️ The Arsenal (Tech Stack)

### 🔹 Web Frontend & 3D Core
- **Framework:** React 19 + TypeScript + Vite
- **3D Engine:** Three.js, React Three Fiber, React Three Drei
- **Styling & Motion:** Tailwind CSS v4, Framer Motion, GSAP
- **State Management:** Jotai

### 🔹 AI & Backend Orchestration
- **Frameworks:** Python, FastAPI, asyncio, LangChain
- **Protocols:** Model Context Protocol (MCP), OAuth2, JWT
- **Data Layers:** Redis, PostgreSQL, MySQL, SQLite, ChromaDB (Vector), Elasticsearch
- **Models:** Gemini 2.0, OpenAI GPT-4o, Groq Llama 3

---

## 🚀 Featured Engineering Projects

*The actual logic behind the UI visualizations.*

1. **ATLAS**
   - *A distributed multi-agent AI orchestration platform.* Built to decompose natural language requests into structured multi-step workflows and execute them across specialized services.
   - 🏆 **1st Place** at Samsung PRISM out of 150+ competing teams.
   
2. **NEXORA**
   - *A production-ready AI-powered customer support platform.* Features three user tiers, REST endpoints, ticket lifecycle management, and a Gemini 2.0 triage engine.
   - Built to be secure, scalable, and beautifully designed.

3. **STRATOS**
   - *Scalable Backend Automation Systems.* Combining containerized deployments with high-reliability event-driven architectures.

---

## ⚙️ Running Locally

Want to spin up the immersive environment locally?

### Prerequisites
- Node.js (v18+)
- `pnpm` or `npm`

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/GaneshBamalwa/portfolio-3d.git
   cd portfolio-3d
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

> **Note on AI Backend:** The portfolio features an AI assistant relying on a live Hugging Face endpoint (`https://whodisbruhhh-rene-ai.hf.space/chat`). If the space is asleep, the frontend will automatically handle the graceful degradation/timeout.

---

## 📜 License

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2026 Ganesh Bamalwa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---
<div align="center">
  <p>Engineered by Ganesh Bamalwa.</p>
  <a href="https://github.com/GaneshBamalwa">GitHub</a> • 
  <a href="https://linkedin.com/in/ganeshbamalwa">LinkedIn</a>
</div>
