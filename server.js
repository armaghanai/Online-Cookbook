require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // Serves your UI

const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// GET Recipes from Cloud
app.get('/api/recipes', async (req, res) => {
    try {
        const response = await axios.get(`${URL}/latest`, { headers: { 'X-Master-Key': API_KEY } });
        res.json(response.data.record);
    } catch (err) { res.status(500).send("Cloud DB Error"); }
});

// POST Recipe to Cloud
app.post('/api/recipes', async (req, res) => {
    try {
        const getRes = await axios.get(`${URL}/latest`, { headers: { 'X-Master-Key': API_KEY } });
        let data = getRes.data.record;
        data.push({ id: Date.now(), ...req.body });
        await axios.put(URL, data, { headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY } });
        res.json(data[data.length - 1]);
    } catch (err) { res.status(500).send("Cloud Save Error"); }
});

// DELETE a recipe from JSONBin
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        // 1. Get the current list from the cloud
        const getRes = await axios.get(`${URL}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        let data = getRes.data.record;

        // 2. Filter out the recipe with the ID sent from the frontend
        // Note: req.params.id is a string, r.id might be a number
        const updatedData = data.filter(recipe => recipe.id != req.params.id);

        // 3. Push the new, smaller list back to JSONBin
        await axios.put(URL, updatedData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            }
        });

        res.json({ message: "Recipe deleted from cloud!" });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).send("Cloud Delete Error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Live on http://localhost:${PORT}`));