document.addEventListener("DOMContentLoaded", () => {


    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const questionText = document.getElementById('question-text');
    const choicesList = document.getElementById('choices-list');
    const startButton = document.getElementById('start-btn');
    const nextButton = document.getElementById('next-btn');
    const restartButton = document.getElementById('restart-btn');
    const scoreDisplay = document.getElementById('score');
    const navbarContainer = document.getElementById('navbarContainer');
    const navbar = document.getElementById('navbar');
    const scoreCard = document.getElementById('score-card');
    const userScoreCard = document.getElementById('user-score');
    const currentQuestion = document.getElementById('currentQuestion');
    const profileScoreboard = document.getElementById('profile-scoreboard');
    const profilePic = document.getElementById('profile-pic');
    const user = document.getElementById('username');
    const usernameForm = document.getElementById('username-form');
    const usernameInput = document.getElementById('username-input');
    const submitbtn = document.getElementById('submit')

    const hamIcon = document.getElementById('ham-icon');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const closeBtn = document.getElementById('close-hamburger');
    const scoreHistory = document.getElementById('score-history');
    const clearBtn = document.getElementById('clear-scores');
    const logout = document.getElementById('logout')



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
    let userScore = JSON.parse(localStorage.getItem("userScore")) || []
    addingScore()

    
    const localUserName = user.textContent = localStorage.getItem("username");
    if (localUserName) {
        usernameForm.classList.add('hidden')
        startButton.classList.remove('hidden')
        hamIcon.classList.remove('hidden')
        startQuiz()
    }
    else {
        user.textContent = "Guest"
        hamIcon.classList.add('hidden')
    }
    
    hamIcon.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('hidden')
        
    })
    
    closeBtn.addEventListener('click', () => {
        hamburgerMenu.classList.add('hidden')
    })

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
        
    })
    clearBtn.addEventListener('click', () => {
        localStorage.removeItem("userScore")
        scoreHistory.innerHTML = '<p>No previous scores available.</p>';
        
        
    })
    
    logout.addEventListener('click', () => {
        confirm("Are you sure!")
        localStorage.clear()
        location.reload()
    })

    usernameForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const username = usernameInput.value.trim().toLowerCase()
        if (!localStorage.getItem("username")) {
            localStorage.setItem("username", username);
            user.textContent = username
            console.log("Username stored in localStorage.");
        } else {
            console.log("Username already exists in localStorage.");
        }
        if (username.length < 3) {
            alert('Username must be at least 3 characters long.')
            return
        }
        console.log(localStorage.getItem("username"));
        
        user.textContent = localStorage.getItem("username")
        usernameForm.classList.add('hidden')
        questionContainer.classList.remove('hidden')
        hamIcon.classList.remove('hidden')
        startButton.classList.remove('hidden')
        
    })
    startButton.classList.add('hidden')
    startButton.addEventListener("click", startQuiz)

    


    function startQuiz() {
        scoreCard.classList.remove('hidden')
        startButton.classList.add('hidden')
        resultContainer.classList.add('hidden')
        questionContainer.classList.remove('hidden')
        showQuestion()
    }

    function showQuestion() {
        nextButton.classList.add('hidden')
        questionText.textContent = questions[currentQuestionIndex].question;
        choicesList.innerHTML = "" // clear previous question 

        questions[currentQuestionIndex].choices.forEach((choice, index) => {
            currentQuestion.innerHTML = `${currentQuestionIndex + 1} / ${questions.length}`
            const li = document.createElement('li')
            li.textContent = choice
            li.addEventListener('click', () => selectAnswer(index))
            choicesList.appendChild(li)
        })
    }

    function selectAnswer(index) {
        const correctAnswer = questions[currentQuestionIndex].correctAnswerIndex
        if (index == correctAnswer) {
            score++
        }

        userScoreCard.innerHTML = `${score}/${questions.length}`
        nextButton.classList.remove("hidden")
    }
    function showResult() {
        const history = {
            "Score": score,
            "Total": questions.length
        }
        console.log(history);
        userScore.push(history)
        saveUser()
        addingScore()
        
        questionContainer.classList.add('hidden')
        resultContainer.classList.remove('hidden')
        scoreDisplay.textContent = `${score} out of ${questions.length}`
    }
    restartButton.addEventListener("click", () => {
        currentQuestionIndex = 0
        score = 0
        resultContainer.classList.add('hidden')
        startButton.classList.remove('hidden')
        userScoreCard.innerHTML = `-/-`
        currentQuestion.innerHTML = `-/-`
    })
    
    function addingScore() {
        if (userScore.length === 0) {
            scoreHistory.innerHTML = '<p>No previous scores available.</p>';
        } else {
            scoreHistory.innerHTML = userScore.map((s, i) =>
                `<p>Quiz ${i + 1}: ${s.Score} / ${s.Total}</p>`).join('');
        }
    }
    function saveUser() {
        localStorage.setItem("userScore", JSON.stringify(userScore))
    }
})