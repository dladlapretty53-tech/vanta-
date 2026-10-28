(function () {
  function createPuzzle(state, archive) {
    const clueButtons = Array.prototype.slice.call(document.querySelectorAll('.clue-button'));
    const puzzleShell = document.querySelector('#puzzle-shell');
    const puzzleForm = document.querySelector('#puzzle-form');
    const puzzleInput = document.querySelector('#puzzle-input');
    const feedback = document.querySelector('#puzzle-feedback');
    const restartButton = document.querySelector('#restart-puzzle');

    const clueMap = {
      r: 'R',
      e: 'E',
      t: 'T'
    };

    function setClueStatus(message) {
      const clueStatus = document.querySelector('#clue-status');
      if (clueStatus) {
        clueStatus.textContent = message;
      }
    }

    function markClue(clueKey) {
      if (state.foundClues.has(clueKey)) {
        return;
      }

      state.foundClues.add(clueKey);
      const button = clueButtons.find(function (item) {
        return item.dataset.clue === clueKey;
      });

      if (button) {
        button.classList.add('found');
        button.setAttribute('aria-pressed', 'true');
        button.disabled = true;
        const clueNumber = clueKey.toUpperCase() === 'R' ? '01' : clueKey.toUpperCase() === 'E' ? '02' : '03';
        button.textContent = 'CLUE ' + clueNumber + ' // ' + clueMap[clueKey];
      }

      state.discoveredFragments.memory = true;
      archive.addLog('Recovered clue: ' + clueMap[clueKey]);

      if (state.foundClues.size === 3) {
        archive.addLog('Final codeword sequence recovered.');
        archive.revealPuzzle();
        setClueStatus('All clue fragments are aligned. The exit gate is ready to accept the final codeword.');
        state.discoveredFragments.exit = true;
        return;
      }

      setClueStatus('Recovered ' + state.foundClues.size + ' of 3 fragments. The pattern is emerging.');
    }

    function reset() {
      state.foundClues.clear();
      clueButtons.forEach(function (button) {
        button.classList.remove('found');
        button.disabled = false;
        const key = button.dataset.clue;
        const label = key.toUpperCase() === 'R' ? '01' : key.toUpperCase() === 'E' ? '02' : '03';
        button.textContent = 'CLUE ' + label + ' // ' + clueMap[key];
        button.setAttribute('aria-pressed', 'false');
      });

      state.discoveredFragments.memory = false;
      state.discoveredFragments.exit = false;
      puzzleInput.value = '';
      feedback.textContent = '';

      if (puzzleShell) puzzleShell.classList.add('hidden');

      const exitLock = document.querySelector('#exit-lock');
      if (exitLock) exitLock.classList.remove('hidden');

      const exitMessageNode = document.querySelector('#exit-message');
      if (exitMessageNode) exitMessageNode.classList.add('hidden');

      setClueStatus('Clues are dormant. The archive is still listening.');
      archive.addLog('Puzzle reset.');
    }

    clueButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        markClue(button.dataset.clue);
      });
    });

    puzzleForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const value = puzzleInput.value.trim().toLowerCase();
      const codeword = 'retrace';

      if (!state.foundClues.size || state.foundClues.size < 3) {
        feedback.textContent = 'The exit gate requires all three recovered clues first.';
        feedback.style.color = '#bfc6d0';
        return;
      }

      if (value === codeword) {
        feedback.textContent = 'Sequence accepted. The exit opens.';
        feedback.style.color = '#d8f1d1';
        archive.addLog('Final codeword accepted. The exit was unlocked.');
        archive.unlockExit();
        state.hiddenUnlocked = true;
        state.discoveredFragments.exit = true;
        return;
      }

      feedback.textContent = 'The codeword does not match. Reconstruct the trace and try again.';
      feedback.style.color = '#d8a4a7';
    });

    restartButton.addEventListener('click', reset);

    return {
      markClue: markClue,
      reset: reset,
      setClueStatus: setClueStatus
    };
  }

  window.createPuzzle = createPuzzle;
})();
