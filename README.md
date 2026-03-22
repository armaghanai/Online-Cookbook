# 📖 Cookbook — Interactive Recipe Collection

A full-stack cookbook web app featuring an animated 3D page-flip UI, secure Chef Mode authentication, and a live JSON database. Browse, add, and manage recipes with the feel of a real physical book.

---

## ✨ Features

- **3D Page-Flip Engine** — Realistic CSS rotateY animations; left pages show Ingredients, right pages show Instructions.
- **Chef Mode (Admin Auth)** — Secure access control. The "Add" and "Delete" buttons are disabled by default and only unlock once the correct Admin Password is verified by the server.
- **Live Search & Filtering** — Real-time filtering across titles, ingredients, and categories with empty-state handling.
- **Cloud-Synced Database** — Integrated with JSONBin.io (via axios on the backend) for persistent, live data storage across Vercel deployments.
- **Dual-Theme System** — High-contrast Light and Dark modes using CSS Custom Properties and localStorage persistence.
- **Keyboard Navigation** — Use ← / → arrow keys to flip through the collection.

---

## 🗂 Project Structure

```
FastApp/
├── server.js          # Express API (Auth logic + JSONBin Cloud Proxy)
├── package.json       # Project dependencies & scripts
└── frontend/
    ├── index.html     # App shell — book scene, navbar, modal
    ├── style.css      # Full theme system + 3D flip animations
    └── script.js      # Book state machine, API calls, search, theme
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v14 or higher

### Install & Run

```bash
# Install dependencies
npm install

# Start the server
node server.js
```

Then open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint |Auth Required| Description |
|--------|----------|-------------|-------------|
| `GET` | `/api/recipes` | No | Return all recipes |
| `POST` | `/api/login` | No | Verify Chef password |
| `POST` | `/api/recipes` | Yes | Add a new recipe |
| `DELETE` | `/api/recipes/:id` | Yes | Delete a recipe by ID |


---

## 🛠 Tech Stack

|Layer|Technology|
|--------|----------|
|Server|Node.js + Express|
|Security|Stateless Header-based Auth (admin-auth)|
|Database|JSONBin.io Cloud Storage|
|Frontend|"Vanilla JS (ES6+), CSS Grid/Flexbox"|
|Animation|"CSS 3D Transforms (perspective, rotateY)"|
|Deployment|Vercel (CI/CD)|

---

## 📜 License

MIT — free to use and modify.
