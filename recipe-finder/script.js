// ====== Elements ======
const recipeList = document.getElementById('recipe-list');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('recipe-search');
const vegetarianCheckbox = document.getElementById('vegetarian-only');

// ====== Modal Setup ======
const modal = document.createElement('div');
modal.id = 'recipeModal';
modal.classList.add('modal');
modal.setAttribute('tabindex', '-1');
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-hidden', 'true');
modal.innerHTML = `
  <div class="modal-content" role="document">
    <button class="close" aria-label="Close modal">&times;</button>
    <h2 id="modalTitle">Recipe Name</h2>
    <p id="modalDescription">Recipe details...</p>
  </div>
`;
document.body.appendChild(modal);

const modalContent = modal.querySelector('.modal-content');
const modalTitle = modal.querySelector('#modalTitle');
const modalDescription = modal.querySelector('#modalDescription');
const closeButton = modal.querySelector('.close');
let lastFocusedElement = null;

// ====== Open & Close Modal ======
function openModal(recipeName, category) {
    lastFocusedElement = document.activeElement;
    modalTitle.textContent = recipeName;
    modalDescription.textContent = `Category: ${category}`;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    closeButton.focus();
}

function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocusedElement) lastFocusedElement.focus();
}

// Close modal events
closeButton.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

// Trap focus inside modal
modal.addEventListener('keydown', (e) => {
    const focusableElements = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
        }
    }
});

// ====== Fetch & Display Recipes from API ======
async function fetchRecipes(query, category, vegetarianOnly) {
    const apiKey = '8f5fec2802554853a412e673880c1ff1'; // <-- Your Spoonacular API key
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=10&addRecipeInformation=true`;

    if (query) url += `&query=${query}`;

    // Correct category mapping
    if (category && category !== 'all') {
        url += `&type=${category}`; // Make sure your HTML <select> uses 'main course', 'dessert', 'salad'
    }

    if (vegetarianOnly) url += `&diet=vegetarian`; // Filter for vegetarian recipes

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data); // <-- Debug: check API response
        displayRecipes(data.results);
    } catch (error) {
        recipeList.innerHTML = "<li>Error fetching recipes. Please try again.</li>";
        console.error(error);
    }
}

function displayRecipes(recipes) {
    recipeList.innerHTML = ''; // Clear previous results

    if (!recipes || recipes.length === 0) {
        recipeList.innerHTML = '<li>No recipes found.</li>';
        return;
    }

    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.tabIndex = 0;
        li.dataset.category = (recipe.dishTypes && recipe.dishTypes.length > 0) ? recipe.dishTypes[0] : 'main course';
        li.innerHTML = `${recipe.title}<span class="category-badge">${li.dataset.category}</span>`;
        recipeList.appendChild(li);

        // Attach modal events
        li.addEventListener('click', () => openModal(recipe.title, li.dataset.category));
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(recipe.title, li.dataset.category);
            }
        });
    });
}

// ====== Event Listeners for Search, Filter & Vegetarian Only ======
categoryFilter.addEventListener('change', () => {
    fetchRecipes(searchInput.value, categoryFilter.value, vegetarianCheckbox.checked);
});

searchInput.addEventListener('input', () => {
    fetchRecipes(searchInput.value, categoryFilter.value, vegetarianCheckbox.checked);
});

vegetarianCheckbox.addEventListener('change', () => {
    fetchRecipes(searchInput.value, categoryFilter.value, vegetarianCheckbox.checked);
});

// ====== Initial Load ======
fetchRecipes('', 'all', vegetarianCheckbox.checked);
