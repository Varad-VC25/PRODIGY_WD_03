console.log("Welcome to Tic Tac Toe");

let music = new Audio("music.mp3");
let audioTurn = new Audio("sound.mp3");
let gameover = new Audio("gameover.mp3");
let turn = "X";
let isgameover = false;

music.loop = true;
let isMusicPlaying = false;

const musicToggleBtn = document.getElementById("music-toggle");
const reset = document.getElementById("reset");
let mode = "player"; // default mode

// Music toggle
musicToggleBtn.addEventListener("click", () => {
    if (!isMusicPlaying) {
        music.play().then(() => {
            isMusicPlaying = true;
            musicToggleBtn.innerText = "Pause Music";
        }).catch((err) => {
            console.log("Music play error: ", err);
        });
    } else {
        music.pause();
        isMusicPlaying = false;
        musicToggleBtn.innerText = "Play Music";
    }
});

// Mode selection
document.getElementById("mode").addEventListener("change", function () {
    mode = this.value;
    reset.click(); // reset board on mode change
});

const modeToggleBtn = document.getElementById("mode-toggle");

modeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    
    // Change button text
    if (document.body.classList.contains("dark-mode")) {
        modeToggleBtn.innerText = "🌞 Light Mode";
    } else {
        modeToggleBtn.innerText = "🌙 Dark Mode";
    }
});




// Function to change the turn
const changeTurn = () => {
    return turn === "X" ? "O" : "X";
};

// Function to check for a win
const checkWin = () => {
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
    ];
    wins.forEach(e => {
        if (
            boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[2]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[0]].innerText !== ""
        ) {
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " Won";
            isgameover = true;
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "200px";
            document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
            document.querySelector(".line").style.width = "20vw";

            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
        }
    });
};

// Check draw
function isDraw() {
    let filled = [...document.getElementsByClassName('boxtext')].every(e => e.innerText !== "");
    if (filled && !isgameover) {
        document.querySelector('.info').innerText = "It's a Draw!";
        isgameover = true;
    }
}

// AI logic
function makeAIMove() {
    let boxes = document.getElementsByClassName("boxtext");
    let emptyBoxes = Array.from(boxes).filter(box => box.innerText === "");

    if (emptyBoxes.length > 0 && !isgameover && turn === "O") {
        let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        randomBox.innerText = "O";
        turn = changeTurn();
        audioTurn.play();
        checkWin();
        isDraw();
        if (!isgameover) {
            document.querySelector(".info").innerText = "Turn for " + turn;
        }
    }
}

// Game logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    element.addEventListener("click", () => {
        let boxtext = element.querySelector(".boxtext");
        if (boxtext.innerText === "" && !isgameover) {
            if (mode === "player" || (mode === "ai" && turn === "X")) {
                boxtext.innerText = turn;
                turn = changeTurn();
                audioTurn.play();
                checkWin();
                isDraw();
                if (!isgameover) {
                    document.querySelector(".info").innerText = "Turn for " + turn;
                }

                // AI move after short delay
                if (mode === "ai" && turn === "O" && !isgameover) {
                    setTimeout(makeAIMove, 500);
                }
            }
        }
    });
});

// Reset button logic
reset.addEventListener("click", () => {
    let boxtexts = document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element => {
        element.innerText = "";
    });
    turn = "X";
    isgameover = false;
    document.querySelector(".line").style.width = "0vw";
    document.querySelector(".info").innerText = "Turn for " + turn;
    document.querySelector(".imgbox").getElementsByTagName("img")[0].style.width = "0px";
});
