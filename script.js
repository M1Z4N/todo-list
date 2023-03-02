const currentTasks = new Map();
const doneTasks = new Map();

function writeTasks() {
    if(currentTasks.size != 0) { // When task/tasks exist in Map add it to list
        // Clearing list before listing new tasks to prevent duplicating tasks
        document.getElementById('list').innerHTML = "";
        for(const [index, value] of currentTasks.entries()) {
            // New <li> element
            const li = document.createElement('li');
            // Inserting task to <li> element with buttons and date of create
            li.innerHTML = value.task + deleteButtonGenerateFunc(index) + doneButtonGenerateFunc(index) + "&nbsp&nbsp| Added on " + value.date;
            // Downloding <ol id='list'> element
            const list = document.getElementById('list');
            // Adding child <li> element to ToDo list with UUID as id attribute
            list.appendChild(li).setAttribute('id',index);;
        };
    } else {
        // Short message for user to add tasks
        
        // Clearing list to prevent duplicating short message
        document.getElementById('list').innerHTML = "";
        // New <p> element
        const p = document.createElement('p');
        // Inserting message to <p> element
        p.innerHTML = "Add some tasks!";
        // Downloding <ol id='list'> element
        const list = document.getElementById('list');
        // Adding child <p> element to ToDo list
        list.appendChild(p);
    }
    
    if(doneTasks.size != 0) { // When task/tasks exist in Map add it to list
        // Clearing list before listing new tasks to prevent duplicating tasks
        document.getElementById('doneList').innerHTML = "";
        for(const [index, value] of doneTasks.entries()) {
            // New <li> element
            const li = document.createElement('li');
            // Inserting task to <li> element 
            li.innerHTML = value.task + deleteButtonGenerateFunc(index) + undoneButtonGenerateFunc(index) + "&nbsp&nbsp| Added on " + value.date;
            // Downloding <ol id='doneList'> element
            const list = document.getElementById('doneList');
            // Adding child <li> element to ToDo doneList with UUID as id attribute
            list.appendChild(li).setAttribute('id',index);;
        };
    } else {
        // Short message for user that there's no finished tasks
        
        // Clearing list to prevent duplicating short message
        document.getElementById('doneList').innerHTML = "";
        // New <p> element
        const p = document.createElement('p');
        // Inserting message to <p> element
        p.innerHTML = "There's no finished tasks!";
        // Downloding <ol id='doneList'> element
        const list = document.getElementById('doneList');
        // Adding child <p> element to ToDo list
        list.appendChild(p);
    }
}

function addTask() {
    const inputTask = document.getElementById('inputTask').value;
    
    if(inputTask == '') {
        alert("Enter task first!") // If input is empty show alert
    } else {
        let uuid = generateUUID();
        
        // Checks if uuid is duplicated, if it is generating new one and checks again
        while(currentTasks.has(uuid)) {
            console.log("Damn it! Duplicated uuid: " + uuid);
            uuid = generateUUID();
        }
        // Adding new taks to map currentTasks with current time
       currentTasks.set(uuid, {task: inputTask, date: currentTime()});
    //    console.log(Array.from(currentTasks));  // For debbuging purposes
    document.getElementById("inputTask").value = ""; // Clearing input after adding task to list   
    console.log("%cCreated new task! UUID: " + uuid, "color:green");
    writeTasks(); // Refreshing lists
}
}

// Simple delete function 
function deleteTask(uuid) {
    // Checking if user checked to not ask before deleting
    if(!document.getElementById("deleteConfirm").checked) {
        // If user didn't checked ask him every time before deleting task
    if(confirm("Are you sure you want delete it? There's no way back!")) {
        // if uuid is in currentTasks map delete it
    if(currentTasks.has(uuid)) {
        console.log("Task deleted from current tasks! UUID: " + uuid);
        currentTasks.delete(uuid);
        writeTasks(); // Refreshing lists
    } else if(doneTasks.has(uuid)) { // if uuid is in doneTasks map delete it
        console.log("Task deleted from done tasks! UUID: " + uuid);
        doneTasks.delete(uuid);
        writeTasks(); // Refreshing lists
    } else {
        // If somehow there's no such a uuid return error in console
        console.log("%cError! There's no such a uuid! UUID: " + uuid, "color:red");
    }
    } else {
        // Nothing happens when user press no
    } 
}  else {
    // There's no confirm window if user check deleteConfirm checkbox, just simple removal

    // if uuid is in currentTasks map delete it
    if(currentTasks.has(uuid)) {
        console.log("Task deleted from current tasks! UUID: " + uuid);
        currentTasks.delete(uuid);
        writeTasks(); // Refreshing lists
    } else if(doneTasks.has(uuid)) { // if uuid is in doneTasks map delete it
        console.log("Task deleted from done tasks! UUID: " + uuid);
        doneTasks.delete(uuid);
        writeTasks(); // Refreshing lists
    } else {
        // If somehow there's no such a uuid return error in console
        console.log("%cError! There's no such a uuid! UUID: " + uuid, "color:red");
    }
}
}

function deleteAll(map,listName) {
    if(map.size != 0) {
    if(confirm("Are your sure you want delete " + listName + " list?")) {
        map.clear();
        console.log(listName + " list has been deleted!");
        writeTasks(); // Refreshing lists
    } else {
        // Nothing happens when user press no
    }
} else {
    alert("There's nothing to delete.")
}
}

// Function for moving task to Done: section
function moveToDoneTasks(uuid) { 
    const currentTaskContent = currentTasks.get(uuid).task;
    const currentTaskDate = currentTasks.get(uuid).date;
    doneTasks.set(uuid, {task: currentTaskContent, date: currentTaskDate});
    currentTasks.delete(uuid);
    console.log("Task moved to done section. UUID: " + uuid);
    writeTasks(); // Refreshing lists
}

// Function for returning task to Todo list from Done: section
function moveToCurrentTasks(uuid) {
    const doneTaskContent = doneTasks.get(uuid).task;
    const doneTaskDate = doneTasks.get(uuid).date;
    currentTasks.set(uuid, {task: doneTaskContent, date: doneTaskDate});
    doneTasks.delete(uuid);
    console.log("Task moved to ToDo section. UUID: " + uuid);
    writeTasks(); // Refreshing lists
}


function deleteButtonGenerateFunc(uuid) {
    return " <button style='color:red;' onclick='deleteTask(`"+ uuid +"`)'>Delete</button>";
}

function doneButtonGenerateFunc(uuid) {
    return " <button style='color:green;' onclick='moveToDoneTasks(`"+ uuid +"`)'>Done</button>";
}

function undoneButtonGenerateFunc(uuid) {
    return " <button style='color:blue;' onclick='moveToCurrentTasks(`"+ uuid +"`)'>Not done!</button>";
}

function currentTime() {
    const date = new Date();
    let dateOfTaskAdded = "" + date.getHours() +":";
    const month = date.getMonth() + 1; // Because getMonth() starts from 0
    // If minutes are underneath 10 insert 0 before minutes otherwise don't
    if(date.getMinutes() < 10) {
        dateOfTaskAdded += "0" + date.getMinutes() +" "+ date.getDate() +"-"+ month +"-"+ date.getFullYear();
    } else {
        dateOfTaskAdded += date.getMinutes() +" "+ date.getDate() +"-"+ month +"-"+ date.getFullYear();
    }

    return dateOfTaskAdded;
}

// Random UUID for easily identify tasks and element <li>
function generateUUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Triggers button click on the Enter key
document.getElementById("inputTask")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addButton").click();
    }
});