// Downloading tasks from local storage
const currentTasks = new Map(JSON.parse(localStorage.getItem('currentTasks')));
const doneTasks = new Map(JSON.parse(localStorage.getItem('doneTasks')));

function writeTasks() {
    if (currentTasks.size != 0) { // When task/tasks exist in Map add it to list

        // If p element with short message exist then remove it
        if (!!document.getElementById('list').getElementsByTagName('p')[0]) {
            document.getElementById('list').getElementsByTagName('p')[0].remove();
        }
        // Check if table has attribute hidden if yes then remove it
        if (document.getElementById('list').getElementsByTagName('table')[0].hasAttribute('hidden')) {
            document.getElementById('list').getElementsByTagName('table')[0].removeAttribute('hidden');
        }
        // Clearing tbody before listing new tasks to prevent duplicating tasks
        document.getElementById('list').getElementsByTagName('tbody')[0].innerHTML = "";

        for (const [index, value] of currentTasks.entries()) {
            // Downloading tbody from <ol id='list'>
            const tbody = document.getElementById('list').getElementsByTagName('tbody')[0];
            // New row with cells
            const row = tbody.insertRow(0);
            const cell1 = row.insertCell(-1);
            const cell2 = row.insertCell(-1);
            const cell3 = row.insertCell(-1);
            // New <li> element
            const li = document.createElement('li');
            // Inserting task to <li> element and fillig up <td>
            li.innerHTML = value.task;
            cell1.appendChild(li).setAttribute('id', index);
            cell2.innerHTML = value.date;
            cell3.innerHTML = deleteButtonGenerateFunc(index) + doneButtonGenerateFunc(index);
        }
    } else {
        // Short message for user to add tasks

        // Check if p element already exist
        if (!!document.getElementById('list').getElementsByTagName('p')[0]) {
            // Don't do anything when p already exist
        } else {
            // Clearing table 
            document.getElementById('list').getElementsByTagName('tbody')[0].innerHTML = "";
            // Hidding table
            document.getElementById('list').getElementsByTagName('table')[0].setAttribute('hidden', '');
            // New <p> element
            const p = document.createElement('p');
            // Inserting message to <p> element
            p.innerHTML = "Add some tasks!";
            // Downloding <ol id='list'> element
            const list = document.getElementById('list');
            // Adding child <p> element to ToDo list
            list.appendChild(p);
        }
    }

    if (doneTasks.size != 0) { // When task/tasks exist in Map add it to list
        // If p element with short message exist then remove it
        if (!!document.getElementById('doneList').getElementsByTagName('p')[0]) {
            document.getElementById('doneList').getElementsByTagName('p')[0].remove();
        }
        // Check if table has attribute hidden if yes then remove it
        if (document.getElementById('doneList').getElementsByTagName('table')[0].hasAttribute('hidden')) {
            document.getElementById('doneList').getElementsByTagName('table')[0].removeAttribute('hidden');
        }
        // Clearing tbody before listing new tasks to prevent duplicating tasks
        document.getElementById('doneList').getElementsByTagName('tbody')[0].innerHTML = "";

        for (const [index, value] of doneTasks.entries()) {
            // Downloading tbody from <ol id='list'>
            const tbody = document.getElementById('doneList').getElementsByTagName('tbody')[0];
            // New row with cells (-1 is for insert on bottom of table)
            const row = tbody.insertRow(0);
            const cell1 = row.insertCell(-1);
            const cell2 = row.insertCell(-1);
            const cell3 = row.insertCell(-1);
            // New <li> element
            const li = document.createElement('li');
            // Inserting task to <li> element and fillig up <td>
            li.innerHTML = value.task;
            cell1.appendChild(li).setAttribute('id', index);
            cell2.innerHTML = value.date;
            cell3.innerHTML = deleteButtonGenerateFunc(index) + undoneButtonGenerateFunc(index);
        }
    } else {
        // Short message for user that there's no finished tasks

        // Check if p element already exist
        if (!!document.getElementById('doneList').getElementsByTagName('p')[0]) {
            // Don't do anything when p already exist
        } else {
            // Clearing table 
            document.getElementById('doneList').getElementsByTagName('tbody')[0].innerHTML = "";
            // Hidding table
            document.getElementById('doneList').getElementsByTagName('table')[0].setAttribute('hidden', '');
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
}

// Simple function to easy refresh local storage after changes
function refreshStorage(localStorageItemKey, map) {
    localStorage.setItem(localStorageItemKey, JSON.stringify([...map]));
}

function addTask() {
    const inputTask = document.getElementById('inputTask').value;

    if (inputTask == '') {
        alert("Enter task first!") // If input is empty show alert
    } else {
        let uuid = generateUUID();

        // Checks if uuid is duplicated, if it is generating new one and checks again
        while (currentTasks.has(uuid)) {
            console.log("Damn it! Duplicated uuid: " + uuid);
            uuid = generateUUID();
        }
        // Adding new taks to map currentTasks with current time
        currentTasks.set(uuid, { task: inputTask, date: currentTime() });
        //    Adding tasks to local storage using json
        refreshStorage('currentTasks', currentTasks);
        //    console.log(Array.from(currentTasks));  // For debbuging purposes
        document.getElementById("inputTask").value = ""; // Clearing input after adding task to list   
        console.log("%cCreated new task! UUID: " + uuid, "color:green");
        writeTasks(); // Refreshing lists
    }
}

// Simple delete function 
function deleteTask(uuid) {
    // Checking if user checked to not ask before deleting
    if (!document.getElementById("deleteConfirm").checked) {
        // If user didn't checked ask him every time before deleting task
        if (confirm("Are you sure you want delete it? There's no way back!")) {
            // if uuid is in currentTasks map delete it
            if (currentTasks.has(uuid)) {
                console.log("Task deleted from current tasks! UUID: " + uuid);
                currentTasks.delete(uuid);
                // Refreshing local storage after deleting task
                refreshStorage('currentTasks', currentTasks);
                writeTasks(); // Refreshing lists
            } else if (doneTasks.has(uuid)) { // if uuid is in doneTasks map delete it
                console.log("Task deleted from done tasks! UUID: " + uuid);
                doneTasks.delete(uuid);
                // Refreshing local storage after deleting task
                refreshStorage('doneTasks', doneTasks);
                writeTasks(); // Refreshing lists
            } else {
                // If somehow there's no such a uuid return error in console
                console.log("%cError! There's no such a uuid! UUID: " + uuid, "color:red");
            }
        } else {
            // Nothing happens when user press no
        }
    } else {
        // There's no confirm window if user check deleteConfirm checkbox, just simple removal

        // if uuid is in currentTasks map delete it
        if (currentTasks.has(uuid)) {
            console.log("Task deleted from current tasks! UUID: " + uuid);
            currentTasks.delete(uuid);
            // Refreshing local storage after deleting task
            refreshStorage('currentTasks', currentTasks);
            writeTasks(); // Refreshing lists
        } else if (doneTasks.has(uuid)) { // if uuid is in doneTasks map delete it
            console.log("Task deleted from done tasks! UUID: " + uuid);
            doneTasks.delete(uuid);
            // Refreshing local storage after deleting task
            refreshStorage('doneTasks', doneTasks);
            writeTasks(); // Refreshing lists
        } else {
            // If somehow there's no such a uuid return error in console
            console.log("%cError! There's no such a uuid! UUID: " + uuid, "color:red");
        }
    }
}

function deleteAll(map, listName, localStorageItemKey) {
    if (map.size != 0) {
        if (confirm("Are your sure you want delete " + listName + " list?")) {
            map.clear();
            // Refreshing local storage after deleting tasks
            refreshStorage(localStorageItemKey, map);
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
    doneTasks.set(uuid, { task: currentTaskContent, date: currentTaskDate });
    currentTasks.delete(uuid);
    // Refreshing local storage 
    refreshStorage('currentTasks', currentTasks);
    refreshStorage('doneTasks', doneTasks);
    console.log("Task moved to done section. UUID: " + uuid);
    writeTasks(); // Refreshing lists
}

// Function for returning task to Todo list from Done: section
function moveToCurrentTasks(uuid) {
    const doneTaskContent = doneTasks.get(uuid).task;
    const doneTaskDate = doneTasks.get(uuid).date;
    currentTasks.set(uuid, { task: doneTaskContent, date: doneTaskDate });
    doneTasks.delete(uuid);
    // Refreshing local storage 
    refreshStorage('currentTasks', currentTasks);
    refreshStorage('doneTasks', doneTasks);
    console.log("Task moved to ToDo section. UUID: " + uuid);
    writeTasks(); // Refreshing lists
}


function deleteButtonGenerateFunc(uuid) {
    return " <button onclick='deleteTask(`" + uuid + "`)'><i class='fa-solid fa-trash-can'></i></button>";
}

function doneButtonGenerateFunc(uuid) {
    return " <button style='color:green;' onclick='moveToDoneTasks(`" + uuid + "`)'>Done</button>";
}

function undoneButtonGenerateFunc(uuid) {
    return " <button style='color:blue;' onclick='moveToCurrentTasks(`" + uuid + "`)'>Not done!</button>";
}

function currentTime() {
    const date = new Date();
    let dateOfTaskAdded = "" + date.getHours() + ":";
    const month = date.getMonth() + 1; // Because getMonth() starts from 0
    // If minutes are underneath 10 insert 0 before minutes otherwise don't
    if (date.getMinutes() < 10) {
        dateOfTaskAdded += "0" + date.getMinutes() + " | " + date.getDate() + "-" + month + "-" + date.getFullYear();
    } else {
        dateOfTaskAdded += date.getMinutes() + " | " + date.getDate() + "-" + month + "-" + date.getFullYear();
    }

    return dateOfTaskAdded;
}

// Random UUID for easily identify tasks and element <li>
function generateUUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Triggers button click on the Enter key
document.getElementById("inputTask")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("addButton").click();
        }
    });