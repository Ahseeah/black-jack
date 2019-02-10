let suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs']
let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
let deck = []

const createDeck = () => {
  deck = []
  for (let i = 0; i < values.length; i++) {
    for (let x = 0; x < suits.length; x++) {
      let weight = parseInt(values[i])
      if (values[i] === 'J' || values[i] === 'Q' || values[i] === 'K') {
        weight = 10
      }
      if (values[i] === 'A') weight = 11
      let card = { Value: values[i], Suit: suits[x], Weight: weight }
      deck.push(card)
    }
  }
}

const shuffle = () => {
  // for 1000 turns
  // switch the values of two random cards
  for (let i = 0; i < 1000; i++) {
    let location1 = Math.floor(Math.random() * deck.length)
    let location2 = Math.floor(Math.random() * deck.length)
    let tmp = deck[location1]

    deck[location1] = deck[location2]
    deck[location2] = tmp
  }
}

let players = []
const createPlayers = num => {
  players = []
  for (let i = 1; i <= num; i++) {
    let hand = []
    let player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand }
    players.push(player)
  }
}

const createPlayersUI = () => {
  document.getElementById('players').innerHTML = ''
  for (let i = 0; i < players.length; i++) {
    let section_player = document.createElement('section')
    let section_playerid = document.createElement('section')
    let section_hand = document.createElement('section')
    let section_points = document.createElement('section')

    section_points.className = 'points'
    section_points.id = 'points_' + i
    section_player.id = 'player_' + i
    section_player.className = 'player'
    section_hand.id = 'hand_' + i

    section_playerid.innerHTML = players[i].ID
    section_player.appendChild(section_playerid)
    section_player.appendChild(section_hand)
    section_player.appendChild(section_points)
    document.getElementById('players').appendChild(section_player)
  }
}

const startBlackJack = () => {
  document.querySelector('btnStart').value = 'Restart'
  document.querySelector('status').style.display = 'none'
  // deal 2 cards to every player object
  currentPlayer = 0
  createDeck()
  shuffle()
  createPlayers(2)
  createPlayersUI()
  dealHands()
  document.getElementById('player_' + currentPlayer).classList.add('active')
}

const dealHands = () => {
  // alternate handing cards to each player
  // 2 cards each
  for (let i = 0; i < 2; i++) {
    for (let x = 0; x < players.length; x++) {
      let card = deck.pop()
      players[x].Hand.push(card)
      dealCard(card, x)
      updatePoints()
    }
  }

  updateDeck()
}

const dealCard = (card, player) => {
  let hand = document.getElementById('hand_' + player)
  hand.appendChild(getCardUI(card))
}

const getCardUI = card => {
  let el = document.createElement('section')
  el.className = 'card'
  el.innerHTML = card.Suit + ' ' + card.Value
  return el
}

let currentPlayer = 0
const hitMe = () => {
  // pop a card from the deck to the current player
  // check if current player new points are over 21
  let card = deck.pop()
  players[currentPlayer].Hand.push(card)
  dealCard(card, currentPlayer)
  updatePoints()
  check()
}

const check = () => {
  if (players[currentPlayer].Points > 21) {
    document.getElementById('status').innerHTML =
      'Player: ' + players[currentPlayer].ID + ' LOST'
  }
}

const stay = () => {
  // move on to next player, if any
  if (currentPlayer != players.length - 1) {
    document
      .getElementById('player_' + currentPlayer)
      .classList.remove('active')
    currentPlayer += 1
    document.getElementById('player_' + currentPlayer).classList.add('active')
  } else {
    end()
  }
}

const end = () => {
  let winner = -1
  let score = 0

  for (let i = 0; i < players.length; i++) {
    if (players[i].Points > score && players[i].Points < 22) {
      winner = i
    }

    score = players[i].Points
  }

  document.querySelector('status').innerHTML =
    'Winner: Player ' + players[winner].ID
}
