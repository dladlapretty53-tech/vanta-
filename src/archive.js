(function () {
  function createArchive(state) {
    const shell = document.querySelector('#archive-shell');
    const navButtons = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
    const fragments = {
      signal: document.querySelector('#signal-fragment'),
      memory: document.querySelector('#memory-fragment'),
      exit: document.querySelector('#exit-fragment')
    };
    const logList = document.querySelector('#archive-log');
    const clockEl = document.querySelector('#session-clock');
    const replayButton = document.querySelector('#replay-intro');
    const clueStatus = document.querySelector('#clue-status');

    function formatClock(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return hours + ':' + minutes + ':' + seconds;
    }

    function updateClock() {
      if (clockEl) {
        clockEl.textContent = formatClock(Date.now() - state.sessionStartedAt);
      }
    }

    function setFragment(fragmentKey) {
      navButtons.forEach(function (button) {
        const isActive = button.dataset.fragment === fragmentKey;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      Object.keys(fragments).forEach(function (key) {
        if (fragments[key]) {
          fragments[key].classList.toggle('active', key === fragmentKey);
        }
      });

      state.activeFragment = fragmentKey;
    }

    function addLog(message) {
      const item = document.createElement('li');
      item.textContent = message;
      logList.prepend(item);

      while (logList.children.length > 8) {
        logList.removeChild(logList.lastChild);
      }
    }

    function revealPuzzle() {
      const puzzleShell = document.querySelector('#puzzle-shell');
      const exitLock = document.querySelector('#exit-lock');
      if (puzzleShell && exitLock) {
        puzzleShell.classList.remove('hidden');
        exitLock.classList.add('hidden');
      }
    }

    function updateClueStatus() {
      const foundClues = state.foundClues.size;
      if (!foundClues) {
        clueStatus.textContent = 'Clues are dormant. The archive is still listening.';
        return;
      }

      clueStatus.textContent = foundClues + ' clue' + (foundClues > 1 ? 's' : '') + ' recovered. The archive recognizes the pattern.';
    }

    function unlockExit() {
      const exitMessage = document.querySelector('#exit-message');
      const exitLock = document.querySelector('#exit-lock');
      if (exitMessage) {
        exitMessage.classList.remove('hidden');
      }
      if (exitLock) {
        exitLock.classList.add('hidden');
      }
      const label = document.querySelector('.discovery-tag');
      if (label) {
        label.textContent = 'open';
      }
    }

    function replayIntro() {
      state.bootSequencePending = true;
      document.querySelector('#boot-screen').classList.remove('hidden');
      shell.classList.add('hidden');
      const trigger = document.querySelector('#boot-trigger');
      if (trigger) {
        trigger.focus();
      }
    }

    navButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setFragment(button.dataset.fragment);
      });
    });

    if (replayButton) {
      replayButton.addEventListener('click', replayIntro);
    }

    updateClock();
    setInterval(updateClock, 1000);

    return {
      shell: shell,
      setFragment: setFragment,
      addLog: addLog,
      revealPuzzle: revealPuzzle,
      updateClueStatus: updateClueStatus,
      unlockExit: unlockExit,
      replayIntro: replayIntro,
      updateClock: updateClock
    };
  }

  window.createArchive = createArchive;
})();
