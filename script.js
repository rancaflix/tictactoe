// Gameboard module
const Gameboard = (() => {
  
  // creates array
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  // this receives a marker and modifies the array on the passed index
  const updateCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, updateCell, resetBoard };
})();
  
// Player factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game controller module
const GameController = (() => {

  // initialize some variables
  let currentPlayer;
  let gameOver;
  let player1;
  let player2;

  // what happens after clicking first button, this should take other route for bot player
  const startDisplay = () => {
    const start = document.getElementById("start");
    const decision = document.getElementById("decision");
    const playerName = document.getElementById("player-name");
    start.style.display = "none";
    decision.style.display = "flex";
    // bifurcation in the road
    const pvp = document.getElementById("1v1");
    const pvb = document.getElementById("1vBot");
    pvp.addEventListener("click", () => {chosePlayer(playerName.value)});
    pvb.addEventListener("click", () => {choseBot(playerName.value)});
  }

  const chosePlayer = (playerInput) => {
    const decision = document.getElementById("decision");
    const secondNameDiv = document.getElementById("second-input");
    const gametime = document.getElementById("gametime");
    const secondButton = document.getElementById("second-button");
    const secondName = document.getElementById("second-name");
    decision.style.display = "none";
    secondNameDiv.style.display = "flex";
    secondButton.addEventListener("click", () => {
      player2 = Player(secondName.value, "O");
      secondNameDiv.style.display = "none";
      gametime.style.display = "flex";
    })
    player1 = Player(playerInput, "X");
    currentPlayer = player1;
    gameOver = false;
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (!gameOver) {
          handleClick(e);
        };
      });
    });
  }

  const choseBot = (playerInput) => {
    const decision = document.getElementById("decision");
    const gametime = document.getElementById("gametime");
    decision.style.display = "none";
    gametime.style.display = "flex";
    player1 = Player(playerInput, "X");
    player2 = Player("Bot", "O");
    currentPlayer = player1;
    gameOver = false;
    handleBot(player1, player2);
  }

  const handleBot = (player1, player2) => {
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (!gameOver) {
          const index = Array.from(cells).indexOf(e.target);
          e.target.style.color = "red";
          startButton.innerText = "Restart Game";
          if (Gameboard.updateCell(index, currentPlayer.marker)) {
            renderBoard();
            if (checkWin(currentPlayer.marker)) {
              message.textContent = `${currentPlayer.name} wins! Congratulations!`;
              gameOver = true;
              startButton.innerText = "New Game";
            } else if (checkTie()) {
              message.textContent = "It's a tie!";
              gameOver = true;
              startButton.innerText = "New Game";
            } else {
              Gameboard.updateCell(botPlayer(player2.marker), player2.marker);
              renderBoard();
              if(checkWin(player2.marker)){
                message.textContent = `${player2.name} wins!`;
                gameOver = true;
                startButton.innerText = "New Game";
              }
          };
        };
      };
    });
    });
  };

  const cells = document.querySelectorAll(".cell");
  const message = document.getElementById("message");
  const startButton = document.getElementById("start-button");

  const firstButton = document.getElementById("first-button");
  firstButton.addEventListener("click", () => {startDisplay()});
  
  const renderBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const handleClick = (e) => {
    const index = Array.from(cells).indexOf(e.target);
    startButton.innerText = "Restart Game";
    if (Gameboard.updateCell(index, currentPlayer.marker)) {
      renderBoard();
      if (checkWin(currentPlayer.marker)) {
        message.textContent = `${currentPlayer.name} wins! Congratulations!`;
        gameOver = true;
        startButton.innerText = "New Game";
      } else if (checkTie()) {
        message.textContent = "It's a tie!";
        gameOver = true;
        startButton.innerText = "New Game";
      } else {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        message.textContent = `${currentPlayer.name}'s turn`;
      }
    }
  };

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // bot that plays against you
  const botPlayer = () => {
    const marker = "O";
    const board = Gameboard.getBoard();
    const emptyCells = board.map((cell, index) => (cell === '') ? index : -1).filter(index => index !== -1);
  
    // Scenarios in the order of priority
    const scenarios = [
      (combo, markers) => markers.own === 2 && combo.some((index) => board[index] === ''),
      (combo, markers) => markers.rival === 2 && combo.some((index) => board[index] === ''),
      (combo, markers, emptyIndices) => markers.own === 1 && emptyIndices.length === 2,
      (combo, markers, emptyIndices) => markers.rival === 1 && emptyIndices.length === 2
    ];
  
    for (const scenario of scenarios) {
      for (const combo of winningCombos) {
        const ownMarkers = combo.filter((index) => board[index] === marker);
        const rivalMarkers = combo.filter((index) => board[index] !== marker && board[index] !== '');
        const emptyIndices = combo.filter((index) => board[index] === '');
  
        const markers = {
          own: ownMarkers.length,
          rival: rivalMarkers.length
        };
  
        if (scenario(combo, markers, emptyIndices)) {
          if (markers.own === 2 || markers.rival === 2) {
            return combo.find((index) => board[index] === '');
          } else if (markers.own === 1 || markers.rival === 1) {
            // If only one marker is present, select an empty index at random
            const randomIndex = Math.floor(Math.random() * emptyIndices.length);
            return emptyIndices[randomIndex];
          } else {
            // If neither 2 nor 1 markers are present, select a random empty cell
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
          }
        }
      }
    }
  
    // If no suitable move found, return a random move
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };
  

  const checkWin = (marker) => {
  return winningCombos.some((combo) => {
    return combo.every((index) => Gameboard.getBoard()[index] === marker);
    });
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const startGame = () => {
    Gameboard.resetBoard();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.style.color = "black";
    });
    currentPlayer = player1;
    gameOver = false;
    message.textContent = `${currentPlayer.name}'s turn`;
    renderBoard();
  };

  startButton.addEventListener("click", startGame);

  return {};
})();