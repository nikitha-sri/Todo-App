const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("creativeTasks")) || [];
let currentFilter = "all";

function displayDate() {

    const date = new Date();

    const options = {
        weekday: "short",
        day: "numeric",
        month: "short"
    };

    document.getElementById("currentDate").innerText =
        date.toLocaleDateString("en-US", options);
}

function saveTasks() {
    localStorage.setItem("creativeTasks", JSON.stringify(tasks));
}

function updateStats() {

    totalTasks.innerText = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.innerText = completed;

    pendingTasks.innerText = tasks.length - completed;
}

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    }
    else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

            </div>

            <div class="task-actions">
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const checkbox = li.querySelector("input");
        const deleteBtn = li.querySelector(".delete-btn");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            updateStats();
            renderTasks();
        });

        deleteBtn.addEventListener("click", () => {

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();
            updateStats();
            renderTasks();
        });

        taskList.appendChild(li);
    });
}

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    updateStats();
    renderTasks();

    taskInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);

window.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        addTask();
    }
});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

updateStats();
renderTasks();
displayDate();
