/* ==========================================================
   COOKBOOK — SCRIPT
   Handles: API, book-flip state, theme, modal, search
   ========================================================== */

// ── State ──────────────────────────────────────────────────
let allRecipes = [];   // full list from server
let recipes = [];   // filtered list (what the book shows)
let spreadIndex = 0;    // current spread (0 = recipes 0+1, 1 = recipes 2+3, …)
let isFlipping = false;

// ── DOM refs ───────────────────────────────────────────────
const pageLeft = document.getElementById('pageLeft');
const pageRight = document.getElementById('pageRight');
const leftContent = document.getElementById('leftContent');
const rightContent = document.getElementById('rightContent');
const leftBackContent = document.getElementById('leftBackContent');
const rightBackContent = document.getElementById('rightBackContent');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNum = document.getElementById('pageNum');
const pageTotal = document.getElementById('pageTotal');
const emptyState = document.getElementById('emptyState');
const bookScene = document.getElementById('bookScene');

const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const recipeForm = document.getElementById('recipeForm');

// ── Theme ──────────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('cookbook-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
    document.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('cookbook-theme', next);
    updateThemeIcon(next);
}

themeToggle.addEventListener('click', toggleTheme);

// ── API helpers ────────────────────────────────────────────
async function fetchRecipes() {
    try {
        const res = await fetch('/api/recipes');
        if (!res.ok) throw new Error('Server error');
        return await res.json();
    } catch (e) {
        console.error('Failed to fetch recipes:', e);
        return [];
    }
}

async function postRecipe(data) {
    const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function deleteRecipeById(id) {
    const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    return res.json();
}

// ── Book rendering ─────────────────────────────────────────
// One recipe = one full spread (left page: ingredients, right page: instructions)
function totalSpreads() {
    return recipes.length || 1;
}

// Shared recipe header (emoji, title, category, meta)
function buildRecipeHeader(recipe, pageLabel) {
    return `
        <div class="recipe-page-number">
            <span>${recipe.emoji || '🍽️'}</span>
            <span>${pageLabel}</span>
        </div>
        <span class="recipe-emoji">${recipe.emoji || '🍽️'}</span>
        <h2 class="recipe-title-page">${recipe.title}</h2>
        ${recipe.category ? `<span class="recipe-category">${recipe.category}</span>` : ''}
        <div class="recipe-meta">
            ${recipe.cookTime ? `<span class="meta-chip">⏱ ${recipe.cookTime}</span>` : ''}
            ${recipe.servings ? `<span class="meta-chip">👤 ${recipe.servings} servings</span>` : ''}
        </div>
        <hr class="recipe-divider">`;
}

// LEFT page: header + scrollable ingredients list
function buildLeftPageHTML(recipe, spreadNum) {
    if (!recipe) {
        return `<div class="page-empty"><span class="empty-page-icon">✦</span><p>End of cookbook</p></div>`;
    }
    const ingredientsList = recipe.ingredients
        ? recipe.ingredients.split(',').map(i => `<li>${i.trim()}</li>`).join('')
        : '<li>No ingredients listed</li>';

    return `
        ${buildRecipeHeader(recipe, `Recipe ${spreadNum}`)}
        <div class="section-label">Ingredients</div>
        <ul class="recipe-ingredients">${ingredientsList}</ul>
        <button class="page-delete-btn" onclick="handleDelete(${recipe.id})">🗑 Remove recipe</button>`;
}

// RIGHT page: ONLY the instructions — no redundant header
function buildRightPageHTML(recipe, spreadNum) {
    if (!recipe) {
        return `<div class="page-empty"><span class="empty-page-icon">✦</span><p>End of cookbook</p></div>`;
    }
    const instructionsHTML = recipe.instructions
        ? recipe.instructions.split('\n').filter(l => l.trim()).map(l => `<p>${l.trim()}</p>`).join('')
        : '<p>No instructions provided.</p>';

    return `
        <div class="recipe-page-number">
            <span>${recipe.emoji || '🍽️'}</span>
            <span>Recipe ${spreadNum} · How to Cook</span>
        </div>
        <div class="section-label instructions-header">How to Make It</div>
        <div class="recipe-instructions">${instructionsHTML}</div>`;
}

function renderSpread(index) {
    // Each spread = one recipe: left page = ingredients, right page = instructions
    const recipe = recipes[index] ?? null;
    const spreadNum = index + 1;

    leftContent.innerHTML = buildLeftPageHTML(recipe, spreadNum);
    rightContent.innerHTML = buildRightPageHTML(recipe, spreadNum);

    // Pre-load back faces with the NEXT recipe for the flip illusion
    const nextRecipe = recipes[index + 1] ?? null;
    const nextSpreadNum = index + 2;
    leftBackContent.innerHTML = buildLeftPageHTML(nextRecipe, nextSpreadNum);
    rightBackContent.innerHTML = buildRightPageHTML(nextRecipe, nextSpreadNum);

    // Update indicators
    pageNum.textContent = index + 1;
    pageTotal.textContent = totalSpreads();

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= totalSpreads() - 1;
}

// ── Flip forward ───────────────────────────────────────────
function flipNext() {
    if (isFlipping || spreadIndex >= totalSpreads() - 1) return;
    isFlipping = true;

    pageRight.classList.add('flip-forward');

    setTimeout(() => {
        pageRight.classList.remove('flip-forward');
        spreadIndex++;
        renderSpread(spreadIndex);
        isFlipping = false;
    }, 720);
}

// ── Flip backward ──────────────────────────────────────────
function flipPrev() {
    if (isFlipping || spreadIndex <= 0) return;
    isFlipping = true;

    pageLeft.classList.add('flip-backward');

    setTimeout(() => {
        pageLeft.classList.remove('flip-backward');
        spreadIndex--;
        renderSpread(spreadIndex);
        isFlipping = false;
    }, 720);
}

nextBtn.addEventListener('click', flipNext);
prevBtn.addEventListener('click', flipPrev);

// ── Keyboard navigation ────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (modalBackdrop.classList.contains('open')) return;
    if (e.key === 'ArrowRight') flipNext();
    if (e.key === 'ArrowLeft') flipPrev();
});

// ── Search ─────────────────────────────────────────────────
function applySearch(term) {
    const q = term.trim().toLowerCase();
    if (!q) {
        recipes = [...allRecipes];
    } else {
        recipes = allRecipes.filter(r => {
            const haystack = [r.title, r.ingredients, r.category, r.instructions]
                .filter(Boolean).join(' ').toLowerCase();
            return haystack.includes(q);
        });
    }

    spreadIndex = 0;

    if (recipes.length === 0) {
        bookScene.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        bookScene.style.display = 'flex';
        emptyState.style.display = 'none';
        renderSpread(0);
    }

    clearSearch.classList.toggle('visible', q.length > 0);
}

searchInput.addEventListener('input', (e) => applySearch(e.target.value));
clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    applySearch('');
    searchInput.focus();
});

// ── Modal ──────────────────────────────────────────────────
function openModal() {
    modalBackdrop.classList.add('open');
    document.getElementById('fTitle').focus();
}

function closeModal() {
    modalBackdrop.classList.remove('open');
    recipeForm.reset();
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelModal.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
});

recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('fTitle').value.trim();
    const ingred = document.getElementById('fIngredients').value.trim();
    if (!title || !ingred) return;

    const recipe = {
        title,
        emoji: document.getElementById('fEmoji').value.trim() || '🍽️',
        category: document.getElementById('fCategory').value,
        cookTime: document.getElementById('fCookTime').value.trim(),
        servings: document.getElementById('fServings').value || null,
        ingredients: ingred,
        instructions: document.getElementById('fInstructions').value.trim()
    };

    const btn = recipeForm.querySelector('.btn-save');
    btn.textContent = 'Saving…';
    btn.disabled = true;

    await postRecipe(recipe);
    closeModal();
    await loadRecipes();

    // Jump to last spread to show the new recipe
    spreadIndex = totalSpreads() - 1;
    renderSpread(spreadIndex);

    btn.textContent = 'Save Recipe 🍴';
    btn.disabled = false;
});

// ── Delete ─────────────────────────────────────────────────
async function handleDelete(id) {
    if (!confirm('Remove this recipe from the cookbook?')) return;
    await deleteRecipeById(id);
    await loadRecipes();
    // Clamp spread index
    if (spreadIndex >= totalSpreads()) spreadIndex = Math.max(0, totalSpreads() - 1);
    renderSpread(spreadIndex);
}

// ── Load & boot ────────────────────────────────────────────
async function loadRecipes() {
    allRecipes = await fetchRecipes();
    recipes = [...allRecipes];
}

async function init() {
    initTheme();
    await loadRecipes();

    if (recipes.length === 0) {
        bookScene.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        renderSpread(0);
    }
}

init();