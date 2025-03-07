// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration (Replace with your credentials)
const firebaseConfig = {
    apiKey: "AIzaSyBV9rDEX9k17uzbGpSh11vEF-YF4EVzn6w",
    authDomain: "quiz-app-7046a.firebaseapp.com",
    projectId: "quiz-app-7046a",
    storageBucket: "quiz-app-7046a.appspot.com",
    messagingSenderId: "268669012839",
    appId: "1:268669012839:web:1803d5a811e19fe7b5fdc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Quiz variables
let questions = [];
let currentQuestionIndex = -1;
let score = 0;
let timer;
let timeLeft;

// Fetch questions from Firestore
async function fetchQuestions() {
    try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        querySnapshot.forEach((doc) => {
            questions.push(doc.data());
        });

        if (questions.length > 0) {
            document.getElementById("question").innerText = "Click Next to start the quiz!";
            document.getElementById("next-btn").style.display = "block";
        } else {
            document.getElementById("question").innerText = "No questions found!";
        }
    } catch (error) {
        document.getElementById("question").innerText = "Error: " + error.message;
    }
}

// Start timer function
function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById("time").innerText = ` ${timeLeft}`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").innerText = ` ${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

// Display question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById("question").innerText = "Quiz Over!";
        document.getElementById("options").innerHTML = "";
        document.getElementById("next-btn").style.display = "none";
        return;
    }

    if (currentQuestionIndex === -1) {
        document.getElementById("question").innerText = "Click Next to start the quiz!";
        document.getElementById("options").innerHTML = "";
        document.getElementById("next-btn").style.display = "block";
        return;
    }

    let questionData = questions[currentQuestionIndex];
    
    // Ensure question data is valid
    if (!questionData || !questionData.question || !questionData.options) {
        document.getElementById("question").innerText = "Invalid question data!";
        return;
    }

    document.getElementById("question").innerText = questionData.question;
    
    let optionsHtml = "";
    questionData.options.forEach((option, index) => {
        optionsHtml += `<div class="option" onclick="checkAnswer(${index})">${option}</div>`;
    });

    document.getElementById("options").innerHTML = optionsHtml;
    document.getElementById("next-btn").style.display = "none"; // Hide Next button initially
    startTimer(); // Start timer when the question is displayed
}

// Check answer
window.checkAnswer = function (selectedIndex) {
    clearInterval(timer); // Stop timer when user selects an answer
    
    let correctIndex = questions[currentQuestionIndex].correctAnswer;
    let options = document.querySelectorAll(".option");

    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add("correct");
        } else if (index === selectedIndex) {
            option.classList.add("wrong");
        }
        option.onclick = null; // Disable further clicks
    });

    if (selectedIndex === correctIndex) {
        score++;
    }

    document.getElementById("score").innerText = `${score}`;
    document.getElementById("next-btn").style.display = "block"; // Show the Next button
};

// Load next question
window.nextQuestion = function () {
    currentQuestionIndex++;
    displayQuestion();
};

// Load questions when the page loads
fetchQuestions();
