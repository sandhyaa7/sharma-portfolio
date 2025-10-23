// ====== Elements ======
const recipeList = document.getElementById('recipe-list');
const recipes = recipeList.querySelectorAll('li');

const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('recipe-search');

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

// ====== Modal Event Listeners ======
recipes.forEach(recipe => {
    recipe.addEventListener('click', () => openModal(recipe.textContent.trim(), recipe.dataset.category));
    recipe.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(recipe.textContent.trim(), recipe.dataset.category);
        }
    });
});

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

// ====== Filter & Search Functionality ======
function filterRecipes() {
    const selectedCategory = categoryFilter.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    recipes.forEach(recipe => {
        const name = recipe.textContent.toLowerCase();
        const category = recipe.dataset.category.toLowerCase();

        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        const matchesSearch = name.includes(searchTerm);

        recipe.style.display = matchesCategory && matchesSearch ? 'flex' : 'none';
    });
}

categoryFilter.addEventListener('change', filterRecipes);
searchInput.addEventListener('input', filterRecipes);
