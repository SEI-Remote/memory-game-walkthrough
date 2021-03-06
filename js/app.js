/*-------------------------------- Constants --------------------------------*/
const deck = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]

const difficulty = {
  "easy": 5,
  "medium": 10,
  "hard": 15
}


/*---------------------------- Variables (state) ----------------------------*/
let cards, message, matchesRemaining, turn, seconds, tickInterval, waitingForTimeout, card1Idx, card1Val, card2Idx, card2Val


/*------------------------ Cached Element References ------------------------*/
const resetDiv = document.getElementById('reset-div')
const difficultyBtns = document.getElementById('difficulty-buttons')
const messageEl = document.getElementById('message')
const playArea = document.getElementById('play-area')
const resetBtn = document.getElementById('reset-button')

/*----------------------------- Event Listeners -----------------------------*/
difficultyBtns.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('btn')) {
    difficultyBtns.classList.add("hidden")
    resetDiv.classList.remove("hidden")
    setDifficulty(difficulty[evt.target.id])
  }
})

resetBtn.addEventListener('click', init)

playArea.addEventListener('click', function (evt) {
  
  if (
    !isNaN(parseInt(evt.target.id)) &&
    cards[parseInt(evt.target.id)]['faceDown'] && 
    !waitingForTimeout
  ) {
    handleCardClick(parseInt(evt.target.id))
  }
})


/*-------------------------------- Functions --------------------------------*/

init()

function init() {
  difficultyBtns.classList.remove("hidden")
  resetDiv.classList.add("hidden")
  message = 'Please select difficulty:'
  waitingForTimeout = false
  turn = 1
  playArea.innerHTML = ''
  cards = []
  matchesRemaining = 0
  seconds = 0
  clearInterval(tickInterval)
  tickInterval = setInterval(tick, 1000)
  render()
}

function tick() {
  seconds++
}

function handleCardClick(cardIdx) {
  if (turn === 1) {
    message = 'Find the match!'
    card1Idx = cardIdx
    card1Val = cards[card1Idx]['faceDown']
    cards[card1Idx] = {'currentPick': card1Val}
  } else {
    card2Idx = cardIdx
    card2Val = cards[card2Idx]['faceDown']
    cards[card2Idx] = {'currentPick': card2Val}
    waitingForTimeout = true
    setTimeout(function() {
      compareCards(card1Val, card2Val)
    }, 1000)
  }
  turn *= -1
  render()
}

function compareCards(card1Val, card2Val) {
  if (card1Val === card2Val) {
    matchesRemaining -= 1
    message = `Nice work! ${matchesRemaining} pair${matchesRemaining !== 1 ? 's' : ''} left!`
    if (matchesRemaining === 0) {
      message = `Congratulations, you found all the matches in ${Math.floor(seconds/60)}:${seconds}`
      clearInterval(tickInterval)
    }
  } else {
    message = 'Try again!'
    cards[card1Idx] = {'faceDown': card1Val}
    cards[card2Idx] = {'faceDown': card2Val}
  }
  waitingForTimeout = false
  render()
}

function setDifficulty(numCards) {
  message = 'Pick a card!'
  let deckCopy = [...deck]
  let randomCard
  let cardsToShuffle = []
  for (let i = 0; i < numCards; i++) {
    randomCard = deckCopy.splice(Math.random() * deckCopy.length , 1)[0]
    cardsToShuffle.push(randomCard, randomCard)
  }
  matchesRemaining = numCards
  shuffle(cardsToShuffle)
}

function shuffle(cardsIn) {
  let cardToShuffle 
  for (let i = 0; i = cardsIn.length; i++) {
    cardToShuffle = cardsIn.splice(Math.random() * cardsIn.length, 1)
    cards.push({'faceDown': `${cardToShuffle}`})
  }
  render()
}

function render() {
  messageEl.textContent = message
  playArea.innerHTML = ''
  let appendCard
  cards.forEach(function(card, idx) {
    appendCard = document.createElement("div")
    appendCard.id = idx
    if (card['faceDown']) {
      appendCard.className = "card large back-blue"
    } else if (card['currentPick']) {
      appendCard.className = `card large ${card['currentPick']}`
    } else if (card['matched']) {
      appendCard.className = `card large ${card['matched']}`
    }
    playArea.appendChild(appendCard)
  })
}

