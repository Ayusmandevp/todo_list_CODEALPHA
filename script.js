const taskInput =
    document.getElementById("taskInput");

const categoryInput =
    document.getElementById("category");

const priorityInput =
    document.getElementById("priority");

const dueDateInput =
    document.getElementById("dueDate");

const taskList =
    document.getElementById("taskList");

const error =
    document.getElementById("error");



window.onload = function(){

    loadTasks();
}



document.addEventListener("keydown",function(event){

    if(event.key === "Enter"){
        addTask();
    }

});



function addTask(){

    const text =
        taskInput.value.trim();

    const category =
        categoryInput.value;

    const priority =
        priorityInput.value;

    const dueDate =
        dueDateInput.value;

    error.innerHTML = "";

    if(text === ""){

        error.innerHTML =
            "Please enter a task!";

        return;
    }

    createTask(
        text,
        category,
        priority,
        dueDate,
        false
    );

    saveTasks();

    taskInput.value = "";
}



function createTask(
    text,
    category,
    priority,
    dueDate,
    completed
){

    const li =
        document.createElement("li");

    li.className = "task";

    li.draggable = true;

    li.innerHTML = `

        <div class="task-info">

            <div class="task-title ${completed ? "completed" : ""}">
                ${text}
            </div>

            <div class="task-details">

                Category:
                <strong>${category}</strong>

                |

                Due:
                <strong>${dueDate || "No Date"}</strong>

                |

                Priority:
                <strong class="
                priority-${priority.toLowerCase()}
                ">
                    ${priority}
                </strong>

            </div>

        </div>

        <div class="actions">

            <button class="complete-btn"
            onclick="toggleComplete(this)">
                <i class="fa-solid fa-check"></i>
            </button>

            <button class="edit-btn"
            onclick="editTask(this)">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button class="delete-btn"
            onclick="deleteTask(this)">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `;

    addDragEvents(li);

    taskList.appendChild(li);
}


function toggleComplete(button){

    const task =
        button.parentElement
        .parentElement
        .querySelector(".task-title");

    task.classList.toggle("completed");

    saveTasks();
}



function editTask(button){

    const task =
        button.parentElement
        .parentElement
        .querySelector(".task-title");

    const updated =
        prompt(
            "Edit task:",
            task.innerText
        );

    if(updated && updated.trim() !== ""){

        task.innerText = updated;

        saveTasks();
    }
}



function deleteTask(button){

    button.parentElement
    .parentElement
    .remove();

    saveTasks();
}



function searchTasks(){

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const tasks =
        document.querySelectorAll(".task");

    tasks.forEach(task => {

        const text =
            task.innerText.toLowerCase();

        task.style.display =
            text.includes(search)
            ? "flex"
            : "none";

    });

}



function saveTasks(){                                      //local storage use

    const tasks = [];

    document.querySelectorAll(".task")
    .forEach(task => {

        tasks.push({

            text:
                task.querySelector(".task-title")
                .innerText,

            completed:
                task.querySelector(".task-title")
                .classList.contains("completed"),

            category:
                task.querySelectorAll("strong")[0]
                .innerText,

            dueDate:
                task.querySelectorAll("strong")[1]
                .innerText,

            priority:
                task.querySelectorAll("strong")[2]
                .innerText

        });

    });

    localStorage.setItem(
        "ultimateTasks",
        JSON.stringify(tasks)
    );
}



function loadTasks(){

    const tasks =
        JSON.parse(
            localStorage.getItem("ultimateTasks")
        ) || [];

    tasks.forEach(task => {

        createTask(
            task.text,
            task.category,
            task.priority,
            task.dueDate,
            task.completed
        );

    });

}


function toggleTheme(){

    document.body.classList.toggle(
        "light-mode"
    );
}



let draggedItem = null;

function addDragEvents(task){

    task.addEventListener("dragstart",function(){

        draggedItem = task;
    });

    task.addEventListener("dragover",function(e){

        e.preventDefault();
    });

    task.addEventListener("drop",function(){

        if(draggedItem !== task){

            let allTasks =
                [...taskList.children];

            const draggedIndex =
                allTasks.indexOf(draggedItem);

            const droppedIndex =
                allTasks.indexOf(task);

            if(draggedIndex < droppedIndex){

                task.after(draggedItem);

            }else{

                task.before(draggedItem);
            }

            saveTasks();
        }

    });

}