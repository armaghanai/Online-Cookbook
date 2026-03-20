const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('frontend'));

const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw || '[]');
    } catch (err) {
        console.error('DB read error:', err);
        return [];
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET all recipes
app.get('/api/recipes', (req, res) => {
    const data = readDB();
    res.json(data);
});

// POST add recipe
app.post('/api/recipes', (req, res) => {
    const data = readDB();
    const newRecipe = { id: Date.now(), ...req.body };
    data.push(newRecipe);
    writeDB(data);
    res.json(newRecipe);
});

// DELETE recipe by id
app.delete('/api/recipes/:id', (req, res) => {
    let data = readDB();
    const id = parseInt(req.params.id);
    const len = data.length;
    data = data.filter(r => r.id !== id);
    if (data.length === len) return res.status(404).json({ error: 'Recipe not found' });
    writeDB(data);
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Kitchen open at http://localhost:${PORT}`));