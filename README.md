# 🚀 VentureIQ 

An AI-powered startup analysis platform that evaluates business ideas using Machine Learning. The application predicts startup success, growth potential, and business risk based on key business parameters.

---

## ✨ Features

- Business Success Prediction
- Growth Potential Analysis
- Risk Level Prediction
- Startup Score Evaluation
- Interactive Dashboard
- REST API Integration
- Machine Learning Prediction Model

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Machine Learning
- Python
- Scikit-learn
- Pickle (.pkl)

---

## 📂 Project Structure

```text
Vent-AI-main
│
├── artifacts
│   ├── venture-iq
│   │   ├── src
│   │   ├── public
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api-server
│       ├── src
│       │   ├── routes
│       │   ├── middlewares
│       │   ├── lib
│       │   ├── app.ts
│       │   └── index.ts
│       ├── build.mjs
│       └── package.json
│
├── attached_assets
├── lib
├── scripts
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## ⚙️ Installation

```bash
git clone https://github.com/PraptiTanisha/VentureIQ.git

cd VentureIQ

pnpm install
```

---

## ▶️ Run Frontend

```bash
cd artifacts/venture-iq

pnpm dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## ▶️ Run Backend

```bash
cd artifacts/api-server

pnpm run build

$env:PORT=3000

node dist/index.mjs
```

Backend runs at:

```
http://localhost:3000
```

Health Check:

```
http://localhost:3000/api/healthz
```

---

## 🤖 Machine Learning

The project uses a trained Python Machine Learning model to evaluate startup ideas based on business parameters such as:

- Initial Investment
- Team Size
- Founder Experience
- Marketing Budget
- Competition Level
- Target Market Size

The trained model returns business prediction, growth potential, and overall startup score.


---

## 👩‍💻 Author

**Prapti Tanisha**

GitHub:
https://github.com/PraptiTanisha
