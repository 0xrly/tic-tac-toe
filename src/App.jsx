import { useState, useEffect } from "react";
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import { checkWinner, checkEndGame } from "./logic/board";
import confetti from "canvas-confetti";
import { WinnerModal } from "./components/WinnerModal";
import { BoardGame } from "./components/BoardGame";

const App = () => {
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");

    return turnFromStorage ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");

    if (boardFromStorage) return JSON.parse(boardFromStorage);

    return Array(9).fill(null);
  });

  useEffect(() => {
    console.log("init");
  }, []);

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn == TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    //guardar partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));

    window.localStorage.setItem("turn", newTurn);

    const newWinner = checkWinner(newBoard);

    if (newWinner) {
      setWinner(newWinner);
      confetti();
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };
  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <BoardGame board={board} updateBoard={updateBoard}></BoardGame>

      <section className="turn">
        <Square isSelected={turn == TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn == TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame}></WinnerModal>
    </main>
  );
};

export default App;
