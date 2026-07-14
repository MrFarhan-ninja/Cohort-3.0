
///////////////////////          DOM ELEMENTS


const cards = document.querySelector(".viewcards");
const featureview = document.querySelector("#featureview");
const themeButton = document.querySelector("#themeBtn");
const dashboardCards = document.querySelectorAll(".dashboardcards");


const time = document.querySelector("#time");
const date = document.querySelector("#date");

const weather = document.querySelector("#weather");

const temperature = document.querySelector("#temperature");


const motivationalQuotes = [
    "Stay hungry, stay foolish. — Steve Jobs",
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. — Confucius",
    "Everything you've ever wanted is on the other side of fear. — George Addair"
];
let currentQuoteIndex = 0;

//////////////////////LOCAL STORAGE

let tasks = JSON.parse(localStorage.getItem("tasksList")) || [];

let goals = JSON.parse(localStorage.getItem("goalList")) || [];

let plannerData =
    JSON.parse(localStorage.getItem("planner")) || {};


// ///////////////       POMODORO VARIABLES


// const defaultDuration = 25 * 60;

// const shortBreakDuration = 5 * 60;

// const longBreakDuration = 15 * 60;

// let currentRemainingTime = defaultDuration;

// let currentSession = "work";

// let completedWorkSessions = 0;

// let interval = null;

//////////////////THEME

let currentTheme =
    localStorage.getItem("theme") || "dark";


function renderDashboard(){

    currentQuoteIndex = 0;
    featureview.innerHTML = `

    <div class="hero-section">

        <h1 id="greetingText">

            Good Morning 👋

        </h1>

        <p id="heroQuote">

            ${motivationalQuotes[0]}

        </p>

    </div>

    <div class="dashboard-overview">

        <div class="overview-card" id="goalOverview">

            <div class="overview-header">

                <i class="ri-flag-line"></i>

                <h2>Goal Progress</h2>

            </div>

            <div class="progress-bar">

                <div class="progress-fill"
                     id="goalProgress"></div>

            </div>

            <p id="goalStats">

                0 Completed • 0 Remaining

            </p>

        </div>

        <div class="overview-card">

            <div class="overview-header">

                <i class="ri-checkbox-circle-line"></i>

                <h2>Today's Tasks</h2>

            </div>

            <ul id="todayTaskList">

            </ul>

        </div>

    </div>

    `;

    cards.style.display = "grid";

  

    updateGreeting();
    updateDashboard();

}
function updateDashboard(){

    updateDashboardGoals();

    updateDashboardTasks();

}

function updateDashboardGoals(){

    const progress =
        document.getElementById("goalProgress");

    const stats =
        document.getElementById("goalStats");

    if(!progress || !stats) return;

    const completed =
        goals.filter(goal=>goal.completed).length;

    const remaining =
        goals.length - completed;

    let percentage = 0;

    if(goals.length>0){

        percentage =
        Math.round((completed/goals.length)*100);

    }

    progress.style.width =
        percentage + "%";

    stats.textContent =
        `${completed} Completed • ${remaining} Remaining`;

}
function updateDashboardTasks(){

    const tasklist =
        document.getElementById("todayTaskList");

    if(!tasklist){

        return;

    }

    tasklist.innerHTML = "";

    if(tasks.length === 0){

        tasklist.innerHTML = `

        <li>No tasks yet.</li>

        `;

        return;

    }

    tasks.slice(0,5).forEach((task)=>{

        tasklist.innerHTML += `

        <li><i class="ri-checkbox-circle-line"></i>
        ${task.text}</li>

        `;

    });

}
// renderDashboard();

/////Phase---2

cards.addEventListener("click",(e)=>{

    const clickcard = e.target.closest(".dashboardcards");

    if(!clickcard) return;

    cards.style.display = "none";

    if(clickcard.id === "todolist"){


        renderTodoPage();

    }

    else if(clickcard.id === "planner"){

        renderPlannerPage();

    }

    else if(clickcard.id === "goals"){

        renderGoalsPage();

    }

    else if(clickcard.id === "pomodorotime"){

        cards.style.display = "none";

    featureview.innerHTML = `

       <div id="pometimecard">

    <div class="pomodoroTop">
        <button class="backbtn">← Back</button>
    </div>

    <h1 id="timerheadtext">Focus Timer</h1>

    <div id="timedisplay">

        <h2 id="typeOfTime">Work Session</h2>

        <h1 id="re">25:00</h1>

    </div>

    <div id="timerbreak">

        <div class="periodtime active-session" data-session="work">
            Work - 25m
        </div>

        <div class="periodtime" data-session="shortBreak">
            Short Break - 5m
        </div>

        <div class="periodtime" data-session="longBreak">
            Long Break - 15m
        </div>

    </div>

    <div id="timerbuttons">

        <button class="timebtn" id="start">Start</button>

        <button class="timebtn" id="pause">Pause</button>

        <button class="timebtn" id="reset">Reset</button>

    </div>

</div>
    `;


    
    // ================   Reset timer whenever Pomodoro opens-========

    if (interval !== null) {

        clearInterval(interval);
        interval = null;

    }

    // currentSession = "work";
    // currentRemainingTime = defaultDuration;

    // updateDisplay();
    setSession("work")




    //=============== DOM Elements
    

    const startButton = document.querySelector("#start");
    const pauseButton = document.querySelector("#pause");
    const resetButton = document.querySelector("#reset");
    const sessionContainer = document.querySelector("#timerbreak");



    

    startButton.addEventListener("click", () => {

        if (interval !== null) return;

        interval = setInterval(() => {

            currentRemainingTime--;

            updateDisplay();

            if (currentRemainingTime <= 0) {

                clearInterval(interval);

                interval = null;

                alertMessages();

                switchSession();

            }

        }, 1000);

    });




   

    pauseButton.addEventListener("click", () => {

        if (interval === null) return;

        clearInterval(interval);

        interval = null;

    });



    resetButton.addEventListener("click", () => {

        if (interval !== null) {

            clearInterval(interval);

            interval = null;

        }

        // Reset current session
        setSession(currentSession);

    });






    

    sessionContainer.addEventListener("click", (e) => {

        const clickedCard = e.target.closest(".periodtime");

        if (!clickedCard) return;

        if (interval !== null) {

            clearInterval(interval);

            interval = null;

        }

        const selectedSession = clickedCard.dataset.session;

        setSession(selectedSession);

    });

}
  

    else if(clickcard.id === "dailymotivation"){
      cards.style.display= "none";
        featureview.innerHTML=`
<div id="quotePage">


        <div class="feature-header">

    <button class="backbtn">
        <i class="ri-arrow-left-line"></i>
        Back
    </button>
        </div>

    <h1 id="quoteTitle">
        <i class="ri-double-quotes-l"></i>
        Daily Motivation
    </h1>

    <p id="quoteSubtitle">
        One powerful thought can change your entire day.
    </p>

    <div id="quoteCard">

        <div id="quoteIcon">
            <i class="ri-chat-quote-fill"></i>
        </div>

        <h2 id="quoteText">
            Do hard things First, then everything else becomes easier.
        </h2>

        <p id="authorText">
            — Sheryians
        </p>

    </div>

    <button id="newQuoteButton">
        <i class="ri-refresh-line"></i>
        New Quote
    </button>

</div>
`;

    }

});
featureview.addEventListener("click",(e)=>{

    if(e.target.classList.contains("backbtn")){

        renderDashboard();

    }
    if(e.target.id === "addbtn"){

    const taskInput =
        document.getElementById("taskname");

    const taskText =
        taskInput.value.trim();

    if(taskText === ""){

        alert("Please enter a task.");

        return;

    }

    tasks.push({

        text: taskText,

        completed: false,

        important: false

    });

    localStorage.setItem(

        "tasksList",

        JSON.stringify(tasks)

    );

    taskInput.value = "";

    renderTasks();

}
if(e.target.closest(".deletebtn")){

    const deleteButton =
        e.target.closest(".deletebtn");

    const task =
        deleteButton.closest("li");

    const index =
        Number(task.dataset.index);

    tasks.splice(index,1);

    localStorage.setItem(

        "tasksList",

        JSON.stringify(tasks)

    );

    renderTasks();

    return;

}

if(e.target.classList.contains("taskCheck")){

    const checkbox = e.target;

    const task = checkbox.closest("li");

    const index = Number(task.dataset.index);

    tasks[index].completed = !tasks[index].completed;

    localStorage.setItem(
        "tasksList",
        JSON.stringify(tasks)
    );

    renderTasks();

}
if(e.target.closest(".impbtn")){

    const impButton = e.target.closest(".impbtn");

    const task = impButton.closest("li");

    const index = Number(task.dataset.index);

    tasks[index].important = !tasks[index].important;

    localStorage.setItem(
        "tasksList",
        JSON.stringify(tasks)
    );

    renderTasks();

}

if(e.target.classList.contains("addbtn")){

    const goalInput =
        document.getElementById("goalsvalue");

    const goalText =
        goalInput.value.trim();

    if(goalText === ""){

        alert("Please enter a goal.");

        return;

    }

    goals.push({

        text: goalText,

        completed: false

    });

    localStorage.setItem(

        "goalList",

        JSON.stringify(goals)

    );

    goalInput.value = "";

    renderGoals();

    updateGoalProgress();

}
if(e.target.closest(".deleteGoalBtn")){
    console.log("goal button deleted")
    const deleteButton =
        e.target.closest(".deleteGoalBtn");

    const goal =
        deleteButton.closest("li");

    const index =
        Number(goal.dataset.index);

    goals.splice(index,1);

    localStorage.setItem(

        "goalList",

        JSON.stringify(goals)

    );

    renderGoals();

    updateGoalProgress();

}
if(e.target.classList.contains("goalCheck")){

    const checkbox = e.target;

    const goal = checkbox.closest("li");

    const index = Number(goal.dataset.index);

    goals[index].completed =
        !goals[index].completed;

    localStorage.setItem(

        "goalList",

        JSON.stringify(goals)

    );

    renderGoals();

    updateGoalProgress();

}








});
function updateGreeting(){

    const greeting = document.getElementById("greetingText");

    if(!greeting) return;

    const hour = new Date().getHours();

    if(hour < 12){

        greeting.textContent = "Good Morning 👋";

    }

    else if(hour < 17){

        greeting.textContent = "Good Afternoon ☀";

    }

    else{

        greeting.textContent = "Good Evening 🌙";

    }

}

function updateHeroQuote() {
    const heroQuote = document.getElementById("heroQuote");
    if (!heroQuote) return;
    
    currentQuoteIndex = (currentQuoteIndex + 1) % motivationalQuotes.length;
    heroQuote.textContent = motivationalQuotes[currentQuoteIndex];
}

// Update hero quote every 10 seconds
setInterval(updateHeroQuote, 10000);
function displayTime(){

    const timeElement = document.getElementById("time");

    if(!timeElement) return;

    const now = new Date();

    timeElement.textContent =
        now.toLocaleTimeString("en-IN",{

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit",

            hour12:true

        });

}

function displayDate(){

    const dateElement = document.getElementById("date");

    if(!dateElement) return;

    const now = new Date();

    dateElement.textContent =
        now.toLocaleDateString("en-IN",{

            weekday:"long",

            day:"numeric",

            month:"long",

            year:"numeric"

        });

}
displayTime();

displayDate();


setInterval(()=>{

    displayTime();

    displayDate();

},1000);

updateGreeting();

// setInterval(updateGreeting,2000);
getCurrentLocation();

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

    }

    else{

        localStorage.setItem("theme","dark");

    }

});
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){

    document.body.classList.add("light");

}



///////TODO----List /////////////


function renderTodoPage(){

    featureview.innerHTML = `

    <div id="todoPage">

        <button class="backbtn">
            ← Back
        </button>

        <h1 class="feature-title">
            ✅ Todo List
        </h1>

        <p class="feature-subtitle">
            Stay organized and complete your daily tasks.
        </p>

        <div id="todoWrapper">

            <div id="todoInputSection">

                <input
                    type="text"
                    id="taskname"
                    placeholder="Enter your task">

                <button id="addbtn">

                    Add Task

                </button>

            </div>

            <ul id="listcontainer">

            </ul>

        </div>

    </div>

    `;

    renderTasks();
}

function renderTasks(){

    const taskContainer =
        document.getElementById("listcontainer");

    if(!taskContainer) return;

    taskContainer.innerHTML = "";

    if(tasks.length === 0){

        taskContainer.innerHTML = `

        <div class="empty-state">

            <i class="ri-checkbox-circle-line"></i>

            <h3>No Tasks Yet</h3>

            <p>Add your first task to get started.</p>

        </div>

        `;

        return;

    }

    tasks.forEach((task,index)=>{

      const completedClass =
    task.completed ? "completed-task" : "";

const importantClass =
    task.important ? "important-task" : "";

const importantIcon =
    task.important
    ? "ri-star-fill"
    : "ri-star-line";

        taskContainer.innerHTML += `

        <li
            data-index="${index}"
            class="${completedClass} ${importantClass}">

            <input
                type="checkbox"
                class="taskCheck"
                ${task.completed ? "checked" : ""}>

            <span class="taskText ${task.completed ? "completed" : ""}">

                ${task.text}

            </span>

            <button class="impbtn">

                <i class="${importantIcon}"></i>

            </button>

            <button class="deletebtn">

                <i class="ri-delete-bin-6-line"></i>

            </button>

        </li>

        `;

    });

}


function renderGoals(){

    const goalContainer =
        document.getElementById("goalsList");

    if(!goalContainer) return;

    goalContainer.innerHTML = "";

    if(goals.length === 0){

        goalContainer.innerHTML = `

        <div class="empty-state">

            <i class="ri-rocket-2-line"></i>

            <h3>No Goals Yet</h3>

            <p>Add your first goal and start your journey.</p>

        </div>

        `;

        updateGoalProgress();

        return;

    }

    goals.forEach((goal,index)=>{

        goalContainer.innerHTML += `

        <li data-index="${index}"
            class="${goal.completed ? "completed-task" : ""}">

            <input
                type="checkbox"
                class="goalCheck"
                ${goal.completed ? "checked" : ""}>

            <span class="taskText ${goal.completed ? "completed" : ""}">

                ${goal.text}

            </span>

            <button class="deleteGoalBtn">

                <i class="ri-delete-bin-6-line"></i>

            </button>

        </li>

        `;

    });

}




//////////Goals ///////////////

function renderGoalsPage(){

    featureview.innerHTML = `

    <div id="goalsPage">

        <button class="backbtn">
            ← Back
        </button>

        <h1 class="feature-title">
            🎯 Goals Tracker
        </h1>

        <p class="feature-subtitle">
            Build your future one goal at a time.
        </p>

        <div id="goalWrapper">

            <div class="goal-progress">

                <h3>Your Progress</h3>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        id="goalProgressFill">

                    </div>

                </div>

                <div class="goalPercent">

                    <span id="goalPercentValue">
                        0%
                    </span>

                </div>

                <div class="goal-stats">

                    <span id="completedGoals">
                        Completed : 0
                    </span>

                    <span id="remainingGoals">
                        Remaining : 0
                    </span>

                </div>

            </div>

            <div id="goalInputSection">

                <input
                    type="text"
                    id="goalsvalue"
                    placeholder="Enter your goal">

                <button
                class="addbtn">

                Add Goal

            </button>

            </div>

            <ul id="goalsList"></ul>

        </div>

    </div>

    `;

    renderGoals();

    updateGoalProgress();

}


function renderPlannerPage(){

    featureview.innerHTML = `

    <div id="plannerPage">

        <button class="backbtn">

            ← Back

        </button>

        <h1 class="feature-title">

            📅 Daily Planner

        </h1>

        <p class="feature-subtitle">

            Plans are stored per hour. The current hour is highlighted automatically.

        </p>

        <div id="plannerWrapper">

            <div id="plannerContainer">

            </div>

        </div>

    </div>

    `;

    loadPlanner();

    renderPlanner();

    highlightCurrentHour();

}


function updateGoalProgress(){

    const completed =
        goals.filter(goal=>goal.completed).length;

    const total = goals.length;

    const remaining =
        total - completed;

    const percentage =
        total === 0
        ? 0
        : Math.round((completed/total)*100);

    const progress =
        document.getElementById("goalProgressFill");

    const percent =
        document.getElementById("goalPercentValue");

    if(progress){

        progress.style.width =
            percentage + "%";

    }

    if(percent){

        percent.textContent =
            percentage + "%";

    }

    const completedText =
        document.getElementById("completedGoals");

    const remainingText =
        document.getElementById("remainingGoals");

    if(completedText){

        completedText.textContent =
            `Completed : ${completed}`;

    }

    if(remainingText){

        remainingText.textContent =
            `Remaining : ${remaining}`;

    }

}


//////////////Planner /////////////
function loadPlanner(){

    const saved =
        localStorage.getItem("planner");

    if(saved){

        plannerData =
            JSON.parse(saved);

    }

    else{

        plannerData = {};

    }

}
function savePlanner(){

    localStorage.setItem(

        "planner",

        JSON.stringify(plannerData)

    );

}
function renderPlanner(){

    const container =
        document.getElementById("plannerContainer");

    if(!container) return;

    container.innerHTML = "";

    for(let hour = 0; hour < 24; hour++){

        createTimeSlot(

            hour,

            container

        );

    }

}
function formatHour(hour){

    let suffix =
        hour >= 12 ? "PM" : "AM";

    let display =
        hour % 12;

    if(display === 0){

        display = 12;

    }

    return `${display}:00 ${suffix}`;

}
function createTimeSlot(hour,container){

    const row =
        document.createElement("div");

    row.className = "time-slot";

    row.dataset.hour = hour;



    const label =
        document.createElement("div");

    label.className = "time-label";

    label.textContent =
        formatHour(hour);



    const input =
        document.createElement("input");

    input.type = "text";

    input.className = "task-input";

    input.placeholder = "Enter your task...";

    input.value =
        plannerData[hour] || "";



    const clearBtn =
        document.createElement("button");

    clearBtn.className = "clear-btn";

    clearBtn.textContent = "Clear";



    row.append(

        label,

        input,

        clearBtn

    );



    container.appendChild(row);



    input.addEventListener("input",()=>{

        plannerData[hour] = input.value;

        savePlanner();

    });



    clearBtn.addEventListener("click",()=>{

        input.value = "";

        plannerData[hour] = "";

        savePlanner();

    });

}
function highlightCurrentHour(){

    const currentHour =
        new Date().getHours();

    const rows =
        document.querySelectorAll(".time-slot");

    rows.forEach((row)=>{

        if(

            Number(row.dataset.hour)

            === currentHour

        ){

            row.classList.add(

                "current-hour"

            );

        }

    });

}




//////////POMODORO- time//////////


const defaultDuration = 25 * 60;        // 25 Minutes
const shortBreakDuration = 5 * 60;      // 5 Minutes
const longBreakDuration = 15 * 60;      // 15 Minutes

let currentRemainingTime = defaultDuration;
let currentSession = "work";
let completedWorkSessions = 0;
let interval = null;




function calculateTime(totalSeconds) {

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return [minutes, seconds];
}


function formatTime(minutes, seconds) {

    let formattedMinutes = minutes;
    let formattedSeconds = seconds;

    if (minutes < 10) {
        formattedMinutes = "0" + minutes;
    }

    if (seconds < 10) {
        formattedSeconds = "0" + seconds;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
}



function updateDisplay() {

    const timerDisplay = document.querySelector("#re");

    if (!timerDisplay) return;

    const [minutes, seconds] = calculateTime(currentRemainingTime);

    timerDisplay.textContent = formatTime(minutes, seconds);

}
function updateActiveSession() {

    const sessionCards = document.querySelectorAll(".periodtime");

    sessionCards.forEach(card => {

        card.classList.remove("active-session");

        if (card.dataset.session === currentSession) {
            card.classList.add("active-session");
        }

    });

}

function setSession(session) {

    const heading = document.querySelector("#typeOfTime");

    currentSession = session;

    switch (session) {

        case "work":

            currentRemainingTime = defaultDuration;

            if (heading) {
                heading.textContent = "Work Session";
            }

            break;


        case "shortBreak":

            currentRemainingTime = shortBreakDuration;

            if (heading) {
                heading.textContent = "Short Break";
            }

            break;


        case "longBreak":

            currentRemainingTime = longBreakDuration;

            if (heading) {
                heading.textContent = "Long Break";
            }

            break;
    }

    updateDisplay();
    updateActiveSession();

}


function switchSession() {

    if (currentSession === "work") {

        completedWorkSessions++;

        if (completedWorkSessions % 4 === 0) {

            setSession("longBreak");

        } else {

            setSession("shortBreak");

        }

    }

    else {

        setSession("work");

    }

}




function alertMessages() {

    if (currentSession === "work") {

        alert("🎉 Work Session Completed!\nTake a Short Break.");

    }

    else if (currentSession === "shortBreak") {

        alert("✅ Short Break Finished!\nBack to Work.");

    }

    else {

        alert("🚀 Long Break Finished!\nLet's Focus Again.");

    }

}


//////Motivational Page //////
 featureview.addEventListener('click',async (e)=>{  
       
            if(e.target.id==="newQuoteButton"){

        const button = e.target;

    const card = document.querySelector("#quoteCard");
    const quote = document.querySelector("#quoteText");
    const author = document.querySelector("#authorText");

    button.disabled = true;

    // Fade out
    card.classList.add("fade-out");

    try{

        await new Promise(resolve => setTimeout(resolve,300));

        quote.innerHTML = `
            <i class="ri-loader-4-line rotating"></i>
            Loading...
        `;

        author.textContent = "";

        const data = await getData();

        await new Promise(resolve => setTimeout(resolve,250));

        quote.textContent = data.quote;

        author.textContent = "— " + data.author;

    }

    catch{

        quote.textContent = "Couldn't load quote.";

        author.textContent = "Check your internet.";

    }

    finally{

        card.classList.remove("fade-out");

        card.classList.add("fade-in");

        button.disabled = false;

        setTimeout(()=>{
            card.classList.remove("fade-in");
        },350);

    }

}
        })

           async function getData()
         {
            let response=await(fetch("https://dummyjson.com/quotes/random"));
            let  result=await(response.json());
            return result;
         }



//////Weather -temperature


function getCurrentLocation(){

    navigator.geolocation.getCurrentPosition(

        handleSuccess,

        handleError

    );

}
function handleSuccess(position){

    const latitude =
        position.coords.latitude;

    const longitude =
        position.coords.longitude;

    getWeather(`${latitude},${longitude}`);

}
function handleError(){

    getWeather("Kurnool");

}
async function getWeather(location){

    try{

        const apiKey =
            "4532943f3375484cbad162917261107";

        const url =
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

        const response =
            await fetch(url);

        const data =
            await response.json();

        temperature.textContent =
            `${data.current.temp_c}°C`;

        weather.textContent =
            data.current.condition.text;

    }

    catch(error){

        temperature.textContent = "--";

        weather.textContent = "Unavailable";

        console.log(error);

    }

}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeButton.innerHTML = `<i class="${theme === "dark" ? "ri-sun-line" : "ri-moon-line"}"></i>`;
  themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
}
themeButton.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
applyTheme(localStorage.getItem("theme") || "light");
