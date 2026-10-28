(function () {
  var state = {
    sessionStartedAt: Date.now(),
    activeFragment: 'signal',
    discoveredFragments: {
      signal: true,
      memory: false,
      exit: false
    },
    foundClues: new Set(),
    hiddenUnlocked: false,
    bootSequencePending: true
  };

  var archive = window.createArchive(state);
  var terminal = window.createTerminal(state, archive);
  var puzzle = window.createPuzzle(state, archive);
  var signalExperiment = window.createSignalExperiment();

  var bootScreen = document.querySelector('#boot-screen');
  var archiveShell = document.querySelector('#archive-shell');
  var bootTrigger = document.querySelector('#boot-trigger');

  function initializeBootSequence() {
    if (!state.bootSequencePending) {
      return;
    }

    state.bootSequencePending = false;
    archiveShell.classList.remove('hidden');
    bootScreen.classList.add('hidden');
    archive.addLog('Archive initialized.');
    archive.setFragment('signal');

    var messages = [
      'INITIATING RECOVERY...',
      'SIGNAL INTEGRITY: 92%',
      'INDEX FRAGMENTS DETECTED',
      'EXPERIMENT LOCATION ALIGNED',
      'ARCHIVE READY'
    ];

    var output = document.querySelector('#terminal-output');
    messages.forEach(function (message, index) {
      setTimeout(function () {
        var line = document.createElement('div');
        line.className = 'line system';
        line.textContent = '> ' + message;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
      }, (index + 1) * 500);
    });

    setTimeout(function () {
      terminal.printWelcome();
      archive.addLog('Fragment accessed.');
      archive.setFragment('signal');
    }, 3000);
  }

  bootTrigger.addEventListener('click', initializeBootSequence);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !archiveShell.classList.contains('hidden')) {
      return;
    }

    if (event.key === 'Enter' && !bootScreen.classList.contains('hidden')) {
      initializeBootSequence();
    }
  });

  var replayButton = document.querySelector('#replay-intro');
  replayButton.addEventListener('click', function () {
    state.bootSequencePending = true;
    bootScreen.classList.remove('hidden');
    archiveShell.classList.add('hidden');
    var output = document.querySelector('#terminal-output');
    output.innerHTML = '';
    terminal.printWelcome();
    signalExperiment.resume();
    archive.addLog('Archive initialized.');
    archive.setFragment('signal');
  });

  var clueButtons = Array.prototype.slice.call(document.querySelectorAll('.clue-button'));
  clueButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (!state.discoveredFragments.memory) {
        state.discoveredFragments.memory = true;
        archive.addLog('Memory fragment accessed.');
      }
    });
  });

  signalExperiment.start();
  window.addEventListener('beforeunload', function () {
    signalExperiment.destroy();
  });

  var triggerPulse = document.querySelector('#pulse-signal');
  if (triggerPulse) {
    triggerPulse.addEventListener('click', function () {
      signalExperiment.triggerPulse();
    });
  }

  archive.addLog('Archive initialized.');
  archive.setFragment('signal');
  terminal.printWelcome();

  var exitLockText = document.querySelector('#exit-lock');
  if (exitLockText) {
    exitLockText.textContent = 'The final archive door remains sealed.';
  }

  window.vantaState = state;
  window.vantaArchive = archive;
  window.vantaTerminal = terminal;
  window.vantaPuzzle = puzzle;
  window.vantaSignal = signalExperiment;
})();
