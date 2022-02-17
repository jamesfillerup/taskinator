var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    var isEdit = formEl. hasAttribute("data-task-id")
    
        if (isEdit){
            var taskId = formEl.getAttribute("data-task-id");
            completeEditTask(taskNameInput, taskTypeInput, taskId);
        }
        else {
            var taskDataObj = {
                name: taskNameInput,
                type: taskTypeInput,
                status: "to do"
            };
            createTaskEl(taskDataObj);
        }
};
    
var createTaskEl = function (taskDataObj) {
    console.log(taskDataObj);
    console.log(taskDataObj.status);

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id =taskIdCounter;

    tasks.push(taskDataObj);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    // add entire list item to list
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions=function(taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className="task-actions";

    //create edit button

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className= "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl =document.createElement("button");
    deleteButtonEl.textContent="Delete";
    deleteButtonEl.className="btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className="select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
        for (var i=0; i< statusChoices.length; i++) {
            //create option element
            var statusOptionEl=document.createElement("option");
            statusOptionEl.textContent = statusChoices[i];
            statusOptionEl.setAttribute("value", statusChoices[i]);

            //append to select
            statusSelectEl.appendChild(statusOptionEl);
        }
    return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    localStorage.setItem("tasks", JSON.stringify(tasks));

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

// other logic
var taskButtonHandler = function(event){
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if (targetEl.matches(".delete-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    };
};

var taskStatusChangeHandler = function(event){
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }
    
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status =statusValue;
        }
    };
    console.log(JSON.stringify(tasks));

    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var editTask = function(taskId) {

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;


    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);

};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++){
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

        localStorage.setItem("tasks", JSON.stringify(tasks));
    
};

var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

pageContentEl.addEventListener("click", taskButtonHandler);

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);
