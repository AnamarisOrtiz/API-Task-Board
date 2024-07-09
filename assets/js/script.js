// Retrieve tasks and nextId from localStorage


 // TODO: Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
function getTasksfromStorage () {
    return JSON.parse(localStorage.getItem("tasks")) || [];

}
function saveTaskstoStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

  // TODO: Create a function that accepts an array of projects, stringifys them, and saves them in localStorage.
 
// Todo: create a function to generate a unique task id
function generateTaskId() {
    return Date.now();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const newTaskCard = $("<div>");
    newTaskCard.addClass("card task-card my-3 draggable");
    newTaskCard.attr("data-task-id", task.id);
    newTaskCard.attr('id', task.id);
   
    const taskHeader = $("<header>");
    taskHeader.addClass("card-header h4");
    taskHeader.text(task.title);
   
    const taskBody = $("<div>");
    taskBody.addClass("card-body");
    
    const paraEl = $("<p>");
    paraEl.addClass("card-text");
   
    const dateParaEl = $("<p>");
    dateParaEl.addClass("card-text");
    dateParaEl.text(task.dueDate);
    const dataDescEl = $("<p>");
    dataDescEl.addClass("card-descption");
    dataDescEl.text(task.description);
   
    const buttonEl = $("<button>");
    buttonEl.addClass("btn btn-danger delete btn-delete-project");
    buttonEl.text("Delete");
    buttonEl.on('click', function(e){
        handleDeleteTask(task.id);
    });
    buttonEl.attr("data-task-id", task.id);


    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            newTaskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            newTaskCard.addClass('bg-danger text-white');
            buttonEl.addClass('border-light');
        }
    }
    taskBody.append(paraEl,dataDescEl,dateParaEl, buttonEl);
    newTaskCard.append(taskHeader, taskBody);
    return newTaskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = getTasksfromStorage();
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    if (tasks) {

        for (let task of tasks) {
            if (task !== null) {
                const cardEl = createTaskCard(task);
                if (task.status === "to-do") {
                    todoList.append(cardEl);
                } else if (task.status === "in-progress") {
                    inProgressList.append(cardEl);
                } else {
                    doneList.append(cardEl);
                }
            }
        }
    }
    // reload tasks so they're draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault ();

    const taskTitle = $("#taskTitle").val();
    const taskDueDate = $("#taskDueDate").val();
    const taskDescription = $("#taskDescription").val();
    const tasks = getTasksfromStorage();
    tasks.push({
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: 'to-do',
        id: generateTaskId(),
    });
    saveTaskstoStorage(tasks);
    renderTaskList();

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(id){
   const tasks = getTasksfromStorage();
   const newTasks = tasks.filter(t => !(t && t.id && t.id === id))
   saveTaskstoStorage(newTasks);
   renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
 // ? Read projects from localStorage
 const tasks = getTasksfromStorage();

 // ? Get the project id from the event
 const taskId = Number(ui.draggable[0].dataset.taskId);

 // ? Get the id of the lane that the card was dropped into
 const newStatus = event.target.id;

 const newTasks = tasks.map((task) => {
   // ? Find the project card by the `id` and update the project status.
   if (task && task.id && task.id === taskId) {
     task.status = newStatus;
   }
   return task;
 });

 // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
 saveTaskstoStorage(newTasks);
 renderTaskList();
 
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    // Show the modal when the button is clicked
    renderTaskList();
    $("#taskDueDate").datepicker();

    $('#openTaskModalButton').on('click', function () {
        $('#taskModal').modal('show');
    });

    $('#saveTask').on('click', function (e) {
        e.preventDefault();
        handleAddTask(e);
        $('#taskModal').modal('hide');
    });


    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
});
