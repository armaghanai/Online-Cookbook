const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
// require('dotenv').config(); // Uncomment for local testing with a .env file

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// JSONBin Configuration from Environment Variables
const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Helper to talk to JSONBin
const getRecipesFromCloud = async () => {
    const response = await axios.get(`${JSONBIN_URL}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });
    return response.data.record; // JSONBin wraps your data in a "record" object
};

const updateCloudDB = async (newData) => {
    await axios.put(JSONBIN_URL, newData, {
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        }
    });
};

// --- ROUTES ---

// GET all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const data = await getRecipesFromCloud();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error reading from cloud DB' });
    }
});

// POST add recipe
app.post('/api/recipes', async (req, res) => {
    try {
        const data = await getRecipesFromCloud();
        const newRecipe = { id: Date.now(), ...req.body };
        data.push(newRecipe);

        await updateCloudDB(data);
        res.json(newRecipe);
    } catch (err) {
        res.status(500).json({ error: 'Error saving to cloud DB' });
    }
});

// DELETE recipe by id
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        let data = await getRecipesFromCloud();
        const id = parseInt(req.params.id);
        const originalLength = data.length;

        data = data.filter(r => r.id !== id);

        if (data.length === originalLength) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        await updateCloudDB(data);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting from cloud DB' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Kitchen open at port ${PORT}`));