import { db, collection, addDoc } from "./firebase.js";

const navBar = document.getElementById('navbar');
const text = document.getElementById('text');
const btn = document.getElementById('quiz-btn');
const ratingBtns = document.getElementById('rating-btns');
const quizContainer = document.getElementById('quiz-container');
const kittyOverlay = document.getElementById("kitty-overlay");
const kittyImg = document.getElementById("kitty-img");
const hearts = document.getElementById("hearts");

let questionIndex = 0;

let trippyCount = 0;

const questions = [

    {
        text: "Druk op de knop om verder te gaan",
        type: "normal",
        btnText: "Start",
        img: "Images/date1.webp"
    },
    {
        text: "Geef een cijfer aan deze date:",
        type: "btnMadness",
        btnText: "Next",
        img: "Images/date2.webp"
    },
    {
        text: "Kies je favoriet:",
        type: "multipleChoice",
        btnText: "Next",
        img: "Images/date3.webp"
    },
    {
        text: "Deze is heel simpel, druk op de 'Next' knop!",
        type: "trippyBtn",
        btnText: "Next",
        img: "Images/date4.webp"
    },
    {
        text: "Oke nu even serieus haha, heb je het naar je zin gehad?",
        type: "trueOrFalse",
        btnText: "Next",
        img: "Images/date5.webp"
    }

];

const preloadImages = () => {

    questions.forEach(question => {

        if(question.img){

            const img = new Image();
            img.src = question.img;

        }

    });

};

const rmNavbar = () => {

    if (questionIndex !== 0) {
        navBar.style.display = "none";
    }

};

const addBtns = () => {

    ratingBtns.innerHTML = "";

    for (let i = 1; i <= 10; i++) {

        ratingBtns.innerHTML += `
        <button class="numberBtns btn btn-danger m-1">
        ${i}
        </button>
        `;

    }

    document.querySelectorAll(".numberBtns").forEach(button => {

        button.addEventListener("click", () => {

            if (button.textContent.trim() !== "10") {

                button.style.backgroundColor = "grey";
                text.textContent = "Kies het juiste antwoord";

            } else {
                saveAnswer(
                    questions[questionIndex].text,
                    button.textContent.trim()
                );

                alert("Had ik niet verwacht, dankjewel!!");
                showKittyAnimation(questionIndex + 1, () => {

                    questionIndex++;
                    loadQuiz();

                });
            }
        });
    });
};

const addMultipleChoiceBtns = () => {

    ratingBtns.innerHTML = "";
    ratingBtns.classList.add("rose-grid");

    const roses = [
        "Images/redRose.jpg",
        "Images/pinkRose.jpeg",
        "Images/whiteRose.jpg",
        "Images/yellowRose.jpg"
    ];

    roses.forEach(image => {
        ratingBtns.innerHTML += `
        <button 
        class="roseBtn"
        style="background-image:url('${image}')">
        </button>
        `;
    });

    document.querySelectorAll(".roseBtn").forEach(button => {

        button.addEventListener("click", () => {
            saveAnswer(
                questions[questionIndex].text,
                button.style.backgroundImage
            );
            showKittyAnimation(questionIndex + 1, () => {

                questionIndex++;
                rmNavbar();
                loadQuiz();

            });

        });
    });
};

const addTrippyBtn = () => {

    trippyCount = 0;

    btn.removeEventListener("click", trippyMove);
    btn.addEventListener("click", trippyMove);
};

const trippyMove = () => {

    if (questions[questionIndex].type !== "trippyBtn") {
        return;
    }

    if (trippyCount < 3) {

        const containerRect = quizContainer.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();

        const maxX = containerRect.width - btnRect.width - 40;
        const maxY = containerRect.height - btnRect.height - 40;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        btn.style.position = "absolute";
        btn.style.left = `${randomX}px`;
        btn.style.top = `${randomY}px`;

        trippyCount++;
        if (trippyCount <= 3) {
            text.textContent = "Probeer het nog een keer!";
            console.log(trippyCount);
        }
    } else {

        // Terug naar normale positie
        btn.style.position = "static";
        btn.style.left = "";
        btn.style.top = "";

        btn.removeEventListener("click", trippyMove);
        text.textContent = "Deze keer echt😘";

        btn.addEventListener("click", () => {

            showKittyAnimation(questionIndex + 1, () => {

                questionIndex++;
                rmNavbar();
                loadQuiz();

            });
        });
    }
};

const addTrueFalseBtns = () => {
    btn.style.display = "none";

    ratingBtns.innerHTML += `
        <button id="true-btn" class="btn btn-lg btn-danger">Ja!!🥳</button>
        <button id="false-btn" class="btn btn-lg btn-danger">Nee😠</button>
        `;
}

const showKittyAnimation = (kittyNumber, callback) => {

    kittyImg.src = `Images/kitty${kittyNumber}.webp`;

    kittyOverlay.style.display = "flex";

    hearts.innerHTML = "";

    for (let i = 0; i < 15; i++) {

        const heart = document.createElement("div");

        heart.className = "heart";
        heart.innerHTML = "❤️";

        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${50 + Math.random() * 20}%`;

        hearts.appendChild(heart);
    }

    setTimeout(() => {

        kittyOverlay.style.display = "none";
        hearts.innerHTML = "";

        callback();

    }, 2000);

};

const saveAnswer = async (question, answer) => {
    try {
        await addDoc(collection(db, "answers"), {
            question: question,
            answer: answer,
            timestamp: new Date()
        });
        console.log("Answer saved");
    } catch (error) {
        console.error("Error:", error);
    }
};

const loadQuiz = () => {

    // Verwijder alle oude knoppen en styling
    ratingBtns.innerHTML = "";
    ratingBtns.className = "";

    if (questionIndex >= questions.length) {

        quizContainer.style.backgroundImage = "url('Images/date6.jpeg')";
        quizContainer.style.backgroundSize = "cover";
        quizContainer.style.backgroundPosition = "center";

        text.textContent = "Ik hoop dat je hebt genoten, op naar de volgende 😉";
        btn.style.display = "none";
        ratingBtns.innerHTML = "";

        return;
    }

    const current = questions[questionIndex];

    text.textContent = current.text;
    btn.textContent = current.btnText;

    if (current.img) {

        quizContainer.style.backgroundImage = `url('${current.img}')`;
        quizContainer.style.backgroundSize = "cover";
        quizContainer.style.backgroundPosition = "center";

    } else {

        quizContainer.style.backgroundImage = "";

    }

    if (current.type === "btnMadness") {

        btn.style.display = "none";
        addBtns();

    } else if (current.type === "multipleChoice") {

        btn.style.display = "none";
        addMultipleChoiceBtns();

    } else if (current.type === "trippyBtn") {

        btn.style.display = "block";
        btn.style.position = "absolute";
        addTrippyBtn();
    }
    else if (current.type === "trueOrFalse") {
        addTrueFalseBtns();
        const trueBtn = document.getElementById('true-btn');
        const falseBtn = document.getElementById('false-btn');
        trueBtn.addEventListener('click', () => {
            saveAnswer(
                questions[questionIndex].text,
                "Ja"
            );
            showKittyAnimation(questionIndex + 1, () => {

                questionIndex++;
                loadQuiz();

            });

        });

        falseBtn.addEventListener('click', () => {
            saveAnswer(
                questions[questionIndex].text,
                "Nee"
            );
            showKittyAnimation(questionIndex + 1, () => {

                questionIndex++;
                loadQuiz();

            });

        });
    }
    else {

        btn.style.display = "block";
    }
};

btn.addEventListener("click", () => {

    if (questions[questionIndex].type === "trippyBtn") {
        return;
    }

    showKittyAnimation(questionIndex + 1, () => {

        questionIndex++;
        rmNavbar();
        loadQuiz();

    });

});

document.addEventListener("DOMContentLoaded", () => {
    preloadImages();
    loadQuiz();
});