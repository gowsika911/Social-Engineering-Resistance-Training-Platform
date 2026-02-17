/**
 * CYBERSHIELD - Awareness Engine
 * Handles Simulation Logic & Firebase Data Sync
 */

// 1. Phishing Scenarios Database
const scenarios = [
    {
        title: "Internal IT Support",
        body: `<b>From:</b> it-support@compnay-security.com<br><br>
               Hi, we noticed an unusual login on your workstation. To prevent a lockout, please 
               reply with your current password and employee ID for identity verification.`,
        type: "scam",
        explanation: "Red Flag: IT will never ask for your password via email. Also, check the domain spelling 'compnay'."
    },
    {
        title: "Standard HR Policy",
        body: `<b>From:</b> HR Department<br><br>
               Please find the updated 2026 Leave Policy attached. No further action is required unless 
               you have questions regarding your balance.`,
        type: "safe",
        explanation: "This is a typical informative email with no suspicious links or urgent demands for sensitive data."
    },
    {
        title: "Urgent Invoice Payment",
        body: `<b>From:</b> accounts@vendor-services.net<br><br>
               Your payment for Invoice #8829 is 48 hours overdue. To avoid service suspension, 
               click here to pay via our portal: <a href='#'>http://pay-vendor-direct.io/login</a>`,
        type: "scam",
        explanation: "Red Flag: Creating a sense of urgency (48 hours) and using an external link to capture login credentials."
    }
];

let currentIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;
let currentUser = ""; // Tracks the logged-in employee

// 2. Authentication Logic
window.handleSignIn = function() {
    const nameInput = document.getElementById('login-name').value.trim();
    const idInput = document.getElementById('employee-id').value.trim();

    if (nameInput === "" || idInput === "") {
        alert("Access Denied: Please enter both Name and Employee ID.");
        return;
    }

    // Combine Name and ID for unique identification in Firebase
    currentUser = `${nameInput} (${idInput})`;
    
    // Switch from Login Screen to Game Screen
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('game-box').classList.remove('hidden');
    
    console.log("Mission Initialized for:", currentUser);
    loadScenario(); // Start the first scenario
};

// 3. Core Game Logic
function loadScenario() {
    if (currentIndex < scenarios.length) {
        // Update Progress Bar
        const progress = (currentIndex / scenarios.length) * 100;
        document.getElementById('progress-bar').style.width = progress + "%";

        // Display Content
        document.getElementById('scenario-title').innerText = scenarios[currentIndex].title;
        document.getElementById('scenario-body').innerHTML = scenarios[currentIndex].body;

        startTimer();
    } else {
        showResults();
    }
}

function handleChoice(userChoice) {
    clearInterval(timer);
    const current = scenarios[currentIndex];
    const scenarioBox = document.querySelector('.scenario-content');

    if (userChoice === current.type) {
        score += 10;
        document.getElementById('score').innerText = score;
        scenarioBox.style.borderLeft = "6px solid var(--success)"; // Green feedback
    } else {
        scenarioBox.style.borderLeft = "6px solid var(--danger)"; // Red feedback
        alert("SECURITY ALERT: " + current.explanation); // Explanation popup
    }

    // 0.5 second delay to show the color feedback before next scenario
    setTimeout(() => {
        scenarioBox.style.borderLeft = "6px solid var(--neon-purple)"; // Reset color
        currentIndex++;
        loadScenario();
    }, 500);
}

function startTimer() {
    timeLeft = 15;
    document.getElementById('timer').innerText = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            handleChoice('timeout'); 
        }
    }, 1000);
}

function showResults() {
    document.getElementById('game-box').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
    
    // Display which user is submitting
    document.getElementById('user-display').innerText = "Agent: " + currentUser;
}

// 4. Cloud Integration (Firebase Sync)
window.syncFinalData = function() {
    console.log("Transmitting data to CyberShield Cloud for:", currentUser);
    // Calls the global function defined in the index.html <script type="module">
    window.saveToFirebase(currentUser, score);
}

// System Initialization (Waiting for Login)
window.onload = () => {
    console.log("CyberShield Awareness Engine: Ready & Secure.");
};