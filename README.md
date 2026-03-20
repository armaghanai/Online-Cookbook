# 📖 Cookbook — Interactive Recipe Collection

A full-stack cookbook web app with an animated **page-flip book UI**, light/dark theme, and a live JSON database. Browse, add, and delete recipes like flipping through a real cookbook.

---

## ✨ Features

- **Page-flip book** — 3D CSS `rotateY` animation; left page shows Ingredients, right page shows Instructions
- **56 recipes** pre-loaded across 10 categories (Breakfast, Pasta, Main, Soup, Dessert, and more)
- **Light / Dark theme** — toggles with a click, persists across sessions via `localStorage`
- **Add recipes** — modal form with title, emoji, category, cook time, servings, ingredients, and instructions
- **Delete recipes** — remove any recipe directly from its page
- **Live search** — filters the book in real time across title, ingredients, category, and instructions
- **Keyboard navigation** — use `←` / `→` arrow keys to flip pages
- **Responsive** — adapts gracefully down to mobile screen sizes

---

## 🗂 Project Structure

```
FastApp/
├── server.js          # Express server (API + static file serving)
├── db.json            # JSON flat-file database (all recipes)
├── package.json
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recipes` | Return all recipes |
| `POST` | `/api/recipes` | Add a new recipe |
| `DELETE` | `/api/recipes/:id` | Delete a recipe by ID |

### Recipe Schema

```json
{
  "id": 1,
  "title": "Classic Spaghetti Carbonara",
  "emoji": "🍝",
  "category": "Pasta",
  "cookTime": "25 min",
  "servings": 2,
  "ingredients": "200g spaghetti, 100g pancetta, ...",
  "instructions": "1. Cook spaghetti...\n2. Fry pancetta..."
}
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Server | Node.js + Express |
| Database | JSON flat file (`db.json`) |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Theme | CSS custom properties (`[data-theme]`) |
| Animation | CSS 3D transforms (`perspective`, `rotateY`) |

---

## 📜 License

MIT — free to use and modify.
