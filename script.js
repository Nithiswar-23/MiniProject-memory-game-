const gameBoard = document.getElementById('game-board');
const moveCountEl = document.getElementById('move-count');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let pairsFound = 0;

// Card data (using Emojis for simplicity)
const items = ['🍕', '🚀', '🐱', '🌵', '🎸', '🍦', '💎', '🎈'];

// Helper function for Day 18 Async/Await style delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function createCard(item) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.framework = item;

    const frontFace = document.createElement('div');
    frontFace.classList.add('front-face');
    frontFace.textContent = item;

    const backFace = document.createElement('div');
    backFace.classList.add('back-face');
    backFace.textContent = '?';

    card.appendChild(frontFace);
    card.appendChild(backFace);
    
    card.addEventListener('click', flipCard);
    return card;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    // Reset State
    gameBoard.innerHTML = '';
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    pairsFound = 0;
    moveCountEl.innerText = moves;

    // Create pairs and shuffle
    const deck = [...items, ...items];
    shuffle(deck);

    // Render to DOM
    deck.forEach(item => {
        const card = createCard(item);
        gameBoard.appendChild(card);
    });
}

// Using async function here to handle the delay cleanly (Day 18 knowledge)
async function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    moves++;
    moveCountEl.innerText = moves;
    
    await checkForMatch();
}

async function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    if (isMatch) {
        disableCards();
    } else {
        await unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    pairsFound++;
    resetBoard();

    if(pairsFound === items.length) {
        // Short delay before alerting to let the CSS animation finish
        setTimeout(() => {
            alert(`Congratulations! You won in ${moves} moves.`);
        }, 500);
    }
}

async function unflipCards() {
    lockBoard = true;

    // Day 18 skill: Using await + Promise based delay instead of nested timeouts
    await wait(1000);

    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Initialize game on load
startGame();