document.addEventListener("DOMContentLoaded", () => {


    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const questionText = document.getElementById('question-text');
    const choicesList = document.getElementById('choices-list');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    const scoreDisplay = document.getElementById('score');
    const userScoreCard = document.getElementById('user-score');
    const user = document.getElementById('username');
    const usernameForm = document.getElementById('username-form');
    const usernameInput = document.getElementById('username-input');
    const hamIcon = document.getElementById('ham-icon');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const closeBtn = document.getElementById('close-hamburger');
    const scoreHistory = document.getElementById('score-history');
    const clearBtn = document.getElementById('clear-scores');
    const logout = document.getElementById('logout')
    const welcomeMessage = document.getElementById("welcome-message");



    const questions = [
        {
            question: "Which HTML element is used to link an external CSS file?",
            choices: [
                "<style>",
                "<link>",
                "<script>",
                "<head>"
            ],
            correctAnswerIndex: 1, // <link>
            score: 1
        },
        {
            question: "Which HTML5 element is specifically designed to contain independent, self-contained content?",
            choices: [
                "<section>",
                "<article>",
                "<div>",
                "<main>"
            ],
            correctAnswerIndex: 1, // <article>
            score: 1
        },

        {
            question: "Which CSS property is used to change the background color of an element?",
            choices: [
                "color",
                "bgcolor",
                "background-color",
                "background"
            ],
            correctAnswerIndex: 2, // background-color
            score: 1
        },
        {
            question: "What does the 'C' in CSS stand for?",
            choices: [
                "Creative",
                "Computer",
                "Cascading",
                "Colorful"
            ],
            correctAnswerIndex: 2, // Cascading
            score: 1
        },
        {
            question: "In CSS, what is the default value of the 'position' property?",
            choices: [
                "relative",
                "fixed",
                "static",
                "absolute"
            ],
            correctAnswerIndex: 2, // static
            score: 1
        },

        {
            question: "Which keyword is used to declare a constant variable in JavaScript?",
            choices: [
                "var",
                "let",
                "const",
                "constant"
            ],
            correctAnswerIndex: 2, // const
            score: 1
        },
        {
            question: "What is the correct way to write an IF statement in JavaScript?",
            choices: [
                "if i == 5 then",
                "if (i == 5)",
                "if i = 5",
                "if i = 5 then"
            ],
            correctAnswerIndex: 1, // if (i == 5)
            score: 1
        },
        {
            question: "Which operator is used to check for both value and type equality in JavaScript?",
            choices: [
                "==",
                "!=",
                "===",
                "="
            ],
            correctAnswerIndex: 2, // ===
            score: 1
        },
        {
            question: "Which method is used to remove the last element from a JavaScript array and return that element?",
            choices: [
                "shift()",
                "splice()",
                "push()",
                "pop()"
            ],
            correctAnswerIndex: 3, // pop()
            score: 1
        },

        {
            question: "What does the DOM stand for?",
            choices: [
                "Data Object Model",
                "Document Object Model",
                "Design Object Markup",
                "Direct Order Module"
            ],
            correctAnswerIndex: 1, // Document Object Model
            score: 1
        }
    ];

    let currentQuestionIndex = 0
    let score = 0
    const PASSING_THRESHOLD_PERCENTAGE = 60;
    const TOTAL_QUESTIONS = questions.length;
    let userScore = JSON.parse(localStorage.getItem("userScore")) || []
    addingScore()


    const localUserName = user.textContent = localStorage.getItem("username");
    if (localUserName) {
        usernameForm.classList.add('hidden')
        startButton.classList.remove('hidden')
        hamIcon.classList.remove('hidden')
        startQuiz()
    } else {
        user.textContent = "Guest"
        hamIcon.classList.add('hidden')
    }

    hamIcon.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('hidden')
    })

    closeBtn.addEventListener('click', () => {
        hamburgerMenu.classList.add('hidden')
    })

    clearBtn.addEventListener('click', () => {
        localStorage.removeItem("userScore")
        scoreHistory.innerHTML = '<p>No previous scores available.</p>';
        userScore = []
    })

    logout.addEventListener('click', () => {
        confirm("Are you sure!")
        localStorage.clear()
        location.reload()
    })

    usernameForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const username = usernameInput.value.trim().toLowerCase()
        if (username.length < 3) {
            alert('Username must be at least 3 characters long.')
            return;
        }
        if (!localStorage.getItem("username")) {
            localStorage.setItem("username", username);
            user.textContent = username
        }
        if (username) {
            welcomeMessage.innerHTML = `Hey!!! ${username},<br> <span style="font-size:20px; color:black">ready to test your skills? Let's get started! 🚀</span>`;
        }


        user.textContent = localStorage.getItem("username")
        usernameForm.classList.add('hidden')
        questionContainer.classList.remove('hidden')
        hamIcon.classList.remove('hidden')
        startButton.classList.remove('hidden')

    })

    startButton.classList.add('hidden')
    startButton.addEventListener("click", startQuiz)


    function startQuiz() {
        welcomeMessage.classList.add('hidden')
        startButton.classList.add('hidden')
        resultContainer.classList.add('hidden')
        questionContainer.classList.remove('hidden')
        shuffleArray(questions);
        showQuestion()
    }

    function showQuestion() {
        questionText.innerHTML = `
            <div class="question-card">
                <div class="question-circle">Q-${currentQuestionIndex + 1}/${questions.length} </div>
               <div class="question-title">${questions[currentQuestionIndex].question}</div>
            </div>`;

        choicesList.innerHTML = "" // clear previous question 

        questions[currentQuestionIndex].choices.forEach((choice, index) => {
            const li = document.createElement('li')
            li.textContent = choice
            li.addEventListener('click', () => selectAnswer(index, li))
            choicesList.appendChild(li)
        })
    }

    function selectAnswer(index, liElement) {
        const correctAnswer = questions[currentQuestionIndex].correctAnswerIndex
        if (index == correctAnswer) {
            score++
            liElement.classList.add('correct-option')
            setTimeout(() => {
                liElement.classList.remove('correct-option')
                nextQuestion()
            }, 600);
        }
        else {
            const choices = Array.from(choicesList.children);
            const correctLi = choices[correctAnswer];
            correctLi.classList.add('correct-option');

            liElement.classList.add('incorrect-option')
            setTimeout(() => {
                liElement.classList.remove('incorrect-option')
                correctLi.classList.remove('correct-option');
                nextQuestion()
            }, 600);
        }

        userScoreCard.innerHTML = `${score}/${questions.length}`
        Array.from(choicesList.children).forEach(li => li.style.pointerEvents = "none")
    }
    function nextQuestion() {
        currentQuestionIndex++
        if (currentQuestionIndex < questions.length) {
            showQuestion()
        } else {
            showResult()
        }
    }
    function showResult() {
        const percentageScore = (score / TOTAL_QUESTIONS) * 100;

        let resultMessage = '';
        let resultClass = '';
        if (percentageScore >= PASSING_THRESHOLD_PERCENTAGE) {
            resultMessage = `Congratulations! You PASSED! 🎉`;
            resultClass = 'passed';
        } else {
            resultMessage = `Sorry, you FAILED. Try again! `;
            resultClass = 'failed';
        }
        const history = {
            "Score": score,
            "Total": questions.length,
            "Status": percentageScore >= PASSING_THRESHOLD_PERCENTAGE ? "Passed" : "Failed"
        }
        console.log(history);
        userScore.push(history)
        saveUser()
        addingScore()

        questionContainer.classList.add('hidden')
        resultContainer.classList.remove('hidden')
        scoreDisplay.innerHTML = `
                              <br>
                              <p style="font-size:2em;">  ${score} / ${TOTAL_QUESTIONS}</p> <br>
                              <p class="${resultClass}" style=" height: 100px font-size:3em; "> ${resultMessage}</p>
                              `;
    }
    restartButton.addEventListener("click", () => {
        currentQuestionIndex = 0
        score = 0
        resultContainer.classList.add('hidden')
        startButton.classList.remove('hidden')
    })

    function addingScore() {
        if (userScore.length === 0) {
            scoreHistory.innerHTML = '<p>No previous scores available.</p>';
        } else {
            scoreHistory.innerHTML = userScore.map((s, i) =>
                `<p>Quiz ${i + 1}: ${s.Score} / ${s.Total} - ${s.Status} </p>`).join('');
        }
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function saveUser() {
        localStorage.setItem("userScore", JSON.stringify(userScore))
    }
})