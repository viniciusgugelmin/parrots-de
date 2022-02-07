let cardsNeeded = 4;
let images = [];
let playing = false;

let cards = [];
let contCardsFlipped = 0;
let cardsFlipping = false;
let rounds = 0;
let time = 0;

window.onload = () => {
    loadImages();
    askCards();
}

const askCards = (newGame = false) => {
    do {
        cardsNeeded = prompt("How many cards do you need?");
    } while (cardsNeeded < 4 || cardsNeeded > 14 || cardsNeeded % 2 !== 0);

    cards = [];
    contCardsFlipped = 0;
    cardsFlipping = false;
    rounds = 0;
    time = 0;

    if (newGame) sortCards();
};

const loadImages = async () => {
    await fetch(`https://jsonplaceholder.typicode.com/photos`)
        .then(response => response.json())
        .then(data => {
            images = data.slice(0, 7);
        })
        .catch(error => {
            alert('An error occurred while loading images');
            console.log(error);
        });

    sortCards();
};

const sortCards = () => {
    for (let i = 0; i < cardsNeeded / 2; i++) {
        cards.push(images[i]);
        cards.push(images[i]);
    }

    cards.sort(() => Math.random() - 0.5);

    createCards();
};

const createCards = () => {
    let board = document.querySelector('#board');
    board.innerHTML = '';

    for (let cardIndex in cards) {
        let card = document.createElement('div');
        card.classList.add('de-board__card');
        card.innerHTML = `
            <div class="de-board__face de-board__front-face">
                <img src="../../assets/parrot.png" alt="Parrot">
            </div>
            <div class="de-board__face de-board__back-face">
                <img src="${cards[cardIndex].url}" alt="${cards[cardIndex].title}">
            </div>
        `;

        card.onclick = () => flipCard(card);

        board.appendChild(card);
    }

    playing = true;
};

const flipCard = (card) => {
    const cardAlreadyFlippedOrMatched = card.classList.contains('de-board__card--flipped') || card.classList.contains('de-board__card--matched');

    if (cardsFlipping || cardAlreadyFlippedOrMatched || (contCardsFlipped > 1)) return;

    cardsFlipping = true;

    card.classList.add('de-board__card--flipped');
    contCardsFlipped++;

    if (contCardsFlipped === 2) {
        setTimeout(() => {
            checkCards();
        }, 750);
        return;
    }

    cardsFlipping = false;
};

const checkCards = () => {
    let cardsFlipped = document.querySelectorAll('.de-board__card--flipped');
    let cardsMatched = false;
    const getCardImgSrc = (index) => cardsFlipped[index].querySelector('.de-board__back-face img').src;

    if (getCardImgSrc(0) === getCardImgSrc(1)) cardsMatched = true;

    cardsFlipped.forEach(card => {
        if (cardsMatched) card.classList.add('de-board__card--matched');

        card.classList.remove('de-board__card--flipped');
    });

    if (cardsMatched) {
        setTimeout(() => {
            checkGameOver();
        }, 500);
        return;
    }

    finishRound();
};

const checkGameOver = () => {
    finishRound();

    let cardsMatched = document.querySelectorAll('.de-board__card--matched');

    if (cardsMatched.length !== cards.length) return;

    alert(`Congratulations! You won in ${rounds} rounds! It took you ${time} seconds.`);

    if (confirm('Do you want to play again?')) askCards(true);
};

const finishRound = () => {
    contCardsFlipped = 0;
    cardsFlipping = false;
    rounds++;
};

setInterval(() => {
    if (playing) {
        time++;
        document.querySelector('#time').innerHTML = time;
        return;
    }

    time = 0;
    document.querySelector('#time').innerHTML = '';
}, 1000);





