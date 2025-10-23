//THE API ENDPOINT WE ARE MAKING A REQUEST TO.
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

//Select the container where we will display the data.
const recipesContainer = document.getElementById('recipes-container');

//A function to fetch the data from the API.
function fetchRecipes() {
    //Show a loading message while we wait for the data.
    recipesContainer.innerHTML = '<p>Loading recipes...</p>';

    //The fetch() function makes an HTTP GET request to the API.
    fetch(apiUrl)
        .then(response => {
        //The .then() method handles the response from the server.
        //We check if the response was successful.
            if (!response.ok) {
                //If not, we throw an error.
                throw new Error("Network response was not ok");               
            }
            //We parse the JSON data from the response.
            return response.json();
        })
        .then(data => {
            //The next .then() handles the parsed JSON data.
            //We now have the array of posts(our recipes).

            //We will clear the loading message.
            recipesContainer.innerHTML = '';

            //Now we will loop through each item in the data array.
            data.forEach(recipe => {
                //For each item, we create a new HTML element.
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe-card'); //We willstyle this later

                //We populate the HTML with data from the API.
                //We use the 'title ad body from the API response.
                recipeElement.innerHTML = `
                    <h2>${recipe.title}</h2>
                    <p>${recipe.body}</p>                
                `

                //Finally we add the new element to our container page.
                recipesContainer.appendChild(recipeElement); 
                
            });
        })
        .catch(error => {
            //THe .catch() method handles any errors that occur during the fetch.
            console.error("There was a problem with the fetch operation:", error);
            recipesContainer.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
        });

}

// Select the form and the input fields.
const addRecipeForm = document.getElementById('add-recipe-form');
const recipeTitleInput = document.getElementById('recipe-title');
const recipeBodyInput = document.getElementById('recipe-body');

// Add an event listener to the form to handle when it's submitted.
addRecipeForm.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior (which would refresh the page).
    event.preventDefault();

    // Get the values from the form inputs.
    const newRecipe = {
        title: recipeTitleInput.value,
        body: recipeBodyInput.value,
        userId: 1, // A placeholder since this API requires a userId.
    };

    // Call a new function to post the data to the API.
    postNewRecipe(newRecipe);
});

// A function to send the new recipe data to the API.
function postNewRecipe(recipe) {
    // The API endpoint for posting new data is the same URL.
    const postUrl = 'https://jsonplaceholder.typicode.com/posts';
    
    // The fetch() function to make a POST request.
    fetch(postUrl, {
        method: 'POST', // The HTTP method we are using.
        headers: {
            'Content-Type': 'application/json', // We're sending JSON data.
        },
        body: JSON.stringify(recipe), // Convert the JavaScript object to a JSON string.
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // The API returns the new item with an ID.
        // Let's add it to our display on the page.
        // We'll add it to the top of the list for now.
        console.log('Success! New recipe added:', data);
        
        // This is a common way to display the new item on the page without re-fetching all data.
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe-card');
        recipeElement.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.body}</p>
        `;
        
        // Use insertAdjacentElement to put the new recipe at the top.
        recipesContainer.insertAdjacentElement('afterbegin', recipeElement);

        // Clear the form fields after a successful submission.
        recipeTitleInput.value = '';
        recipeBodyInput.value = '';
    })
    .catch(error => {
        console.error('There was a problem with the POST operation:', error);
    });
}

//Call the function to start the process when the page loads.
fetchRecipes();