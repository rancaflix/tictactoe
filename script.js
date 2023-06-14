// Gameboard module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
  
    const getBoard = () => board;
  
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
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
  
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const startButton = document.getElementById("start-button");
  
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
          message.textContent = `${currentPlayer.name} wins!`;
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
  
    const checkWin = (marker) => {
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
  
      return winningCombos.some((combo) => {
        return combo.every((index) => Gameboard.getBoard()[index] === marker);
      });
    };
  
    const checkTie = () => {
      return Gameboard.getBoard().every((cell) => cell !== "");
    };
  
    const startGame = () => {
      Gameboard.resetBoard();
      currentPlayer = player1;
      gameOver = false;
      message.textContent = `${currentPlayer.name}'s turn`;
      renderBoard();
    };
  
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (!gameOver) {
          handleClick(e);
        }
      });
    });
  
    startButton.addEventListener("click", startGame);
  
    return {};
  })();










