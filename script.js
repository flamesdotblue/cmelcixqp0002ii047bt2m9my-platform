(function () {
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const resetEl = document.getElementById('reset');

  const WIN_LINES = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];

  let board = Array(9).fill(null); // values: 'X' | 'O' | null
  let xTurn = true;
  let gameOver = false;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function currentPlayer() {
    return xTurn ? 'X' : 'O';
  }

  function checkWinner(b) {
    for (const [a, c, d] of WIN_LINES) {
      if (b[a] && b[a] === b[c] && b[c] === b[d]) return { winner: b[a], line: [a, c, d] };
    }
    if (b.every(Boolean)) return { winner: null, line: null, draw: true };
    return null;
  }

  function updateUI(result) {
    // Update each cell label and class
    boardEl.querySelectorAll('.cell').forEach((btn, i) => {
      const v = board[i];
      btn.textContent = v ? v : '';
      btn.classList.toggle('x', v === 'X');
      btn.classList.toggle('o', v === 'O');
      btn.disabled = !!gameOver || !!v; // stop clicking occupied cells or after game end
      btn.setAttribute('aria-label', `Cell ${i+1}${v ? ', ' + v : ''}`);
    });

    if (result?.winner) {
      setStatus(`Player ${result.winner} wins!`);
      for (const idx of result.line) {
        boardEl.querySelector(`.cell[data-index="${idx}"]`).classList.add('win');
      }
    } else if (result?.draw) {
      setStatus('It\'s a draw.');
    } else {
      setStatus(`Player ${currentPlayer()}’s turn`);
    }
  }

  function handleClick(e) {
    const btn = e.target.closest('.cell');
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    if (Number.isNaN(idx) || board[idx] || gameOver) return;

    board[idx] = currentPlayer();
    const result = checkWinner(board);
    if (result) {
      gameOver = true;
      updateUI(result);
      return;
    }

    xTurn = !xTurn;
    updateUI(null);
  }

  function reset() {
    board = Array(9).fill(null);
    xTurn = true;
    gameOver = false;
    boardEl.querySelectorAll('.cell').forEach((btn) => btn.classList.remove('win'));
    updateUI(null);
  }

  // Event listeners
  boardEl.addEventListener('click', handleClick);
  resetEl.addEventListener('click', reset);

  // Keyboard support: navigate cells with tab, press Enter/Space to place
  boardEl.addEventListener('keydown', (e) => {
    const target = e.target.closest('.cell');
    if (!target) return;
    if ((e.key === 'Enter' || e.key === ' ') && !target.disabled) {
      e.preventDefault();
      target.click();
    }
  });

  // Initialize UI
  updateUI(null);
})();
