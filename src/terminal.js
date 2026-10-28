(function () {
  function createTerminal(state, archive) {
    const outputEl = document.querySelector('#terminal-output');
    const inputEl = document.querySelector('#terminal-input');
    const resetButton = document.querySelector('#reset-terminal');

    const commandRegistry = {
      help: function () {
        return [
          'Available commands:',
          'help — list commands',
          'whoami — reveal anonymous operator record',
          'trace — display recovered fragments',
          'projects — list experiments and archives',
          'status — report archive health',
          'secret — reveal a hidden message',
          'clear — clear terminal output'
        ];
      },
      whoami: function () {
        return [
          'operator: unknown',
          'identity: unregistered',
          'signal source: intermittent',
          'status: archive witness'
        ];
      },
      trace: function () {
        return [
          'Recovered fragments:',
          'signal // ' + (state.discoveredFragments.signal ? 'recovered' : 'dormant'),
          'memory // ' + (state.discoveredFragments.memory ? 'indexed' : 'latent'),
          'exit // ' + (state.discoveredFragments.exit ? 'visible' : 'sealed')
        ];
      },
      projects: function () {
        return [
          'available experiments:',
          'signal lattice — responsive particle field',
          'memory index — recovered records and pattern fragments',
          'exit gate — hidden codeword challenge'
        ];
      },
      status: function () {
        return [
          'archive status: partially recovered',
          'signal integrity: stable',
          'operator record: anonymous',
          'priority: preserve and trace'
        ];
      },
      secret: function () {
        if (state.hiddenUnlocked) {
          return ['hidden message: THE ARCHIVE WAS NEVER MEANT TO BE FOUND.'];
        }

        return ['hidden message: unrevealed. Discover the archive sequence.'];
      },
      clear: function () {
        outputEl.innerHTML = '';
        return [];
      }
    };

    function renderLine(content, type) {
      const line = document.createElement('div');
      line.className = 'line ' + (type || 'response');
      line.textContent = content;
      outputEl.appendChild(line);
    }

    function printWelcome() {
      renderLine('recovery interface online', 'system');
      renderLine('type "help" for command list', 'response');
      outputEl.scrollTop = outputEl.scrollHeight;
    }

    function handleCommand(rawCommand) {
      const command = rawCommand.trim();
      if (!command) return;

      renderLine(command, 'command');

      const parts = command.split(/\s+/);
      const name = parts[0].toLowerCase();
      const action = commandRegistry[name];

      if (!action) {
        renderLine('unknown command: ' + name + '. Enter "help" for available options.', 'system');
        outputEl.scrollTop = outputEl.scrollHeight;
        return;
      }

      const result = action(parts.slice(1));
      if (result && result.length) {
        result.forEach(function (line) {
          renderLine(line, 'response');
        });
      }

      if (name === 'secret' && state.hiddenUnlocked) {
        archive.addLog('Hidden message recovered.');
      }

      outputEl.scrollTop = outputEl.scrollHeight;
    }

    function reset() {
      outputEl.innerHTML = '';
      printWelcome();
    }

    inputEl.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleCommand(inputEl.value);
        inputEl.value = '';
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        inputEl.value = '';
        reset();
        archive.addLog('Terminal reset.');
      });
    }

    printWelcome();

    return {
      handleCommand: handleCommand,
      reset: reset,
      printWelcome: printWelcome
    };
  }

  window.createTerminal = createTerminal;
})();
