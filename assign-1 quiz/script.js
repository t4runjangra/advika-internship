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
    let userScore = 0

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }

    })

    usernameForm.addEventListener("submit", (event) => {
        const username = usernameInput.value.trim().toLowerCase()
        event.preventDefault()

        // if (username === '') { 
        //     alert('Please enter your username to start the quiz')
        //     return
        // } else 
        if (username.length < 3) {
            alert('Username must be at least 3 characters long.')
            return
        }
        user.textContent = username
        usernameForm.classList.add('hidden')
        questionContainer.classList.remove('hidden')
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
            currentQuestion.innerHTML = `${currentQuestionIndex+1} / ${questions.length}`
            const li = document.createElement('li')
            li.textContent = choice
            li.addEventListener('click', () => selectAnswer(index))
            choicesList.appendChild(li)
        })
    }

    function selectAnswer(index) {
        const correctAnswer = questions[currentQuestionIndex].correctAnswerIndex
        console.log(correctAnswer, index)
        if (index == correctAnswer) {
            score++
        }
        userScoreCard.innerHTML = `${score}/${questions.length}`
        nextButton.classList.remove("hidden")
    }
    function showResult() {
        questionContainer.classList.add('hidden')
        resultContainer.classList.remove('hidden')
        scoreDisplay.textContent = `${score} out of ${questions.length}`
    }
    restartButton.addEventListener("click", () => {
        currentQuestionIndex = 0
        score = 0
        
        resultContainer.classList.add('hidden')
        startButton.classList.remove('hidden')
    })
})