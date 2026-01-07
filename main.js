const input = document.querySelector('#todo-input') // Input field for adding new items to list
const myForm = document.querySelector('#todo-form') // Form that contains the input fields
const list = document.querySelector('#todo-list'); // The list that contains all the items
const search = document.querySelector('#search-bar'); // Search bar to search items in the list

const savedTodoList = localStorage.getItem('todoList'); // Retrieve the saved todo list from local storage
if (savedTodoList) {
    list.innerHTML = savedTodoList; // If there is a saved todo list, set the inner HTML of the list to the saved todo list
}


// Event listener for searching items in the list
// This loops through the current to-do list for each input in the search text box
// if the searchedTerm is found within itemText[i] (> -1), then the list displays the item
// else if hides the item using the style.display = 'none';
search.addEventListener('input', (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    const searchTerm = e.target.value.toLowerCase(); // Get the search term from the input field and set to lowercase
    for (let i = 0; i < list.children.length; i++) {
        const itemText = list.children[i].children[0].children[1].innerText.toLowerCase(); // Get the text of the item in the list and set to lowercase by calling children
        if (itemText.indexOf(searchTerm) > -1) {
            list.children[i].style.display = ''; // If the item text [i] contains the search term, display it by setting display to empty string
        }
        else{
            list.children[i].style.display = 'none'; // If the item text [i] does not contain the search term, hide it by setting display to none
        }
    }
});

// Event listener for the form submission to create a new item 
// See createNewItem for more info
myForm.addEventListener('submit', createNewItem); 


// This function creates a new item in the list when the item is submitted
// If you want to see the html for a item in the list, see index.html
function createNewItem(e) {
    e.preventDefault();
    // Creating hero label
    const heroLabel = createHeroLabel(input.value); // call createHeroLabel function to create the hero label with the input value

    //Create edit button that edit item from list
    const editButton = document.createElement("SPAN"); // creates the span element for the edit button
    editButton.innerHTML = "Edit"; // adding text to the edit button
    editButton.setAttribute("title", "Edit Item"); // set title attribute for the edit button (when hovered over for css)
    editButton.className = "edit"; // set class name for the edit button for css

   //Create delete button that deletes item from list
    const deleteButton = document.createElement("SPAN");
    deleteButton.innerHTML = "\u00D7"; // Adding the close button text (inner html)
    deleteButton.setAttribute("title", "Delete Item"); // LOOK AT EDIT BUTTON
    deleteButton.className = "close";

    // Create list element and input it into the ul element in DOM
    const li = document.createElement('li');

    // Adding elements to li (This adds in order)
    li.appendChild(heroLabel);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    

    // Putting li into ul #todo-list element
    list.appendChild(li);

    input.value = ''; // resets input
}

// Event listener for checkbox functionality
// If a list item in list changed and contains the type 'checkbox" it will toggle the checked css
list.addEventListener('change', (e) => {
        e.preventDefault();
    if (e.target.type === 'checkbox') { // If the list(item)
        e.target.parentElement.classList.toggle('checked') // Toggle the 'checked' class on the parent element of the checkbox 
    }

});


// Event listener for delete button functionality
// If a list item in list is clicked and contains the type 'close" it will use remove() to delete item from list
list.addEventListener('click', (e) => {
    if (e.target.classList.contains('close')) {
        e.target.parentElement.remove(); // Remove the parent element of the clicked close button
    }
});

//Event listener for edit functionality to edit task
// If a list item in list is clicked and contains the type 'edit" it will edit item by:
// * Create a text box and button elements and use the replaceChild function to replace the text and edit button elements
// * Once user clicks the confirm edit button, it will replace the text with what the user put in the turnToTextBox textbox element
// * Saves the edit
list.addEventListener('click', (e) => {
    if(e.target.classList.contains('edit')){
        //Creating Text bar to edit change
        const currentLi = e.target.parentElement // Get the parent list item of the clicked edit button
        const turnToTextBox = document.createElement("INPUT"); // Create a new input element to turn the item into a text box for editing
        turnToTextBox.setAttribute("type", "text"); // set the type of the input to text box
        turnToTextBox.setAttribute("id", "confirm-edit-input"); // Set the id for the text box
        turnToTextBox.setAttribute("value", currentLi.children[0].children[1].innerText); // Set the value to the current item text
        currentLi.replaceChild(turnToTextBox, currentLi.children[0]) // Replace the hero label (children[0]) with the text box (turnToTextBox)
        
        //Creating button to allow edits when edit was made
        const confirmEdit = document.createElement("INPUT");
        confirmEdit.setAttribute("type", "submit");
        confirmEdit.className = "confirmedit-btn"; // see css
        confirmEdit.setAttribute("value", "Confirm Edit"); 
        currentLi.replaceChild(confirmEdit, currentLi.children[1]); // Replace the edit button (children[1]) with the confirm edit button
        
        //Confirms edit
        currentLi.children[1].addEventListener('click', (e2)=>{ // Event listener for the confirm edit button
            const label = createHeroLabel(e2.target.parentElement.children[0].value) // Create a new hero label with the value from the text box
            currentLi.replaceChild(label, currentLi.children[0]); // Replace the text box back with the hero label

            //Re create edit button that edit item from list
            const editButton = document.createElement("SPAN");
            editButton.innerHTML = "Edit"; // Adding the edit button
            editButton.setAttribute("title", "Edit Item");
            editButton.className = "edit";
            currentLi.replaceChild(editButton, currentLi.children[1]); //Replace the confirm edit button back with the edit button
        });
    }

});


// This function creates the Hero Label that stores the checkbox and item name
// Creates the general html for the checkmark and text in the list (hero label --> See the html)
function createHeroLabel(wordInput){
    
    const heroLabel = document.createElement("label"); // First create a label element and set it to class name hero
    heroLabel.className = "hero";

    //Append box div to hero label
    const boxDiv = document.createElement("div"); // Create a div element to represent the checkbox box
    boxDiv.className = "box";
    heroLabel.appendChild(boxDiv); // Append the box div to the hero label
    
    //Append text input to hero label
    const itemDiv = document.createElement("div");
    const item = document.createTextNode(wordInput); // Create a text node with the input value
    itemDiv.appendChild(item);
    itemDiv.setAttribute("id", "list-item");
    heroLabel.appendChild(itemDiv); // Append the item div to the hero label

    //Create checkbox and append to hero label
    const checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    heroLabel.appendChild(checkbox);

    //Create span element checkbox and append to hero label (for styling)
    const span = document.createElement("SPAN");
    span.className = "checkmark";
    heroLabel.appendChild(span);

    return heroLabel;
}


// This saves the current state of the todo list to local storage
window.addEventListener('beforeunload', saveTodoList); // Save the todo list before the window is unloaded
function saveTodoList() {  
    if(list.innerHTML.includes('<li')){ // Check if the todo list is not empty
        localStorage.setItem('todoList', list.innerHTML); // Save the inner HTML of the todo list to local storage
    }
    else{
        localStorage.clear();
    }
}

