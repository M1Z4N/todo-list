let liIndex = 0; // Index for buttons and li elements
let deleteButton = "";
let doneButton = "";
let undoneButton = "";

function addToList() {
    const inputTask = document.getElementById("inputTask").value;

    if (inputTask == '') {
        alert("Enter task first!") // If input is empty show alert
    } else {
        const li = document.createElement('li'); // New li element
        // Putting current liIndex to buttons for new task
        deleteButton = " <button style='color:red;' onclick='deleteTask("+liIndex+")'>Delete</button>";
        doneButton = " <button style='color:green;' onclick='doneTask(`span"+liIndex+"`,"+ liIndex +")'>Done</button>";
        // Adding task from input to li element with buttons
        li.innerHTML = "<span id=span" + liIndex + ">" + inputTask + "</span>" + deleteButton + doneButton;
        const list = document.getElementById('list');
        // Adding index to li as attribute id so i can delete it later easily
        list.appendChild(li).setAttribute('id',liIndex);
        liIndex++; // Incrementing index for new buttons and li elements
        document.getElementById("inputTask").value = ""; // Clearing input after adding task to list
    }
}

// Function for moving task to Done: section
function doneTask(taskSpanIndex,indexOfLi) { 
    const taskContent = document.getElementById(taskSpanIndex).innerText;
    const li = document.createElement('li');
    // Putting current indexForLi to button for new task in done section
    deleteButton = " <button style='color:red;' onclick='deleteTask("+indexOfLi+")'>Delete</button>";
    undoneButton = " <button style='color:blue;' onclick='undoTask(`"+ taskSpanIndex + "`," + indexOfLi+")'>Not done!</button>";

    li.innerHTML = "<span id=span" + indexOfLi + ">" + taskContent + "</span>" + deleteButton + undoneButton;
    const doneList = document.getElementById('doneList');
    doneList.appendChild(li).setAttribute('id',indexOfLi);
    document.getElementById(indexOfLi).remove();
    
}

// Function for returning task to Todo list from Done: section
function undoTask(taskSpanId, indexOfLi) {
    const taskContent = document.getElementById(taskSpanId).innerText;
    const li = document.createElement('li');
    deleteButton = " <button style='color:red;' onclick='deleteTask("+indexOfLi+")'>Delete</button>";
    doneButton = " <button style='color:green;' onclick='doneTask(`"+taskSpanId+"`,"+ indexOfLi +")'>Done</button>";
    
    li.innerHTML = "<span id=" + taskSpanId + ">" + taskContent + "</span>" + deleteButton + doneButton;
    document.getElementById(indexOfLi).remove();
    const list = document.getElementById('list');
    list.appendChild(li).setAttribute('id',indexOfLi);
}

// Simple delete function 
function deleteTask(indexOfLi) {
    if(!document.getElementById("deleteConfirm").checked) {
    if(confirm("Are you sure you want delete it? There's no way back!")) {
    document.getElementById(indexOfLi).remove();
    } else {
        // Nothing happens when user press no
    } 
}  else {
    // There's no confirm window if user check delteConfirm checkbox, just simple removal
    document.getElementById(indexOfLi).remove();
}
}

// Triggers button click on the Enter key
document.getElementById("inputTask")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addButton").click();
    }
});