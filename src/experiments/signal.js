(function () {
  function createSignalExperiment() {
    const canvas = document.getElementById('signal-canvas');
    if (!canvas) {
      return {
        start: function () {},
        triggerPulse: function () {},
        resume: function () {},
        destroy: function () {}
      };
    }

    const context = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = prefersReducedMotion ? 140 : 500;
    const particles = [];
    const pointer = { x: 0, y: 0, active: false };
    const pulses = [];
    let rafId = null;

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * ratio);
      canvas.height = Math.max(1, rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createParticle() {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 180 + 30;
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      return {
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.8 + 0.2
      };
    }

    function initializeParticles() {
      particles.length = 0;
      for (let index = 0; index < particleCount; index += 1) {
        particles.push(createParticle());
      }
    }

    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    }

    function handleTouch(event) {
      if (!event.touches || !event.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      pointer.x = touch.clientX - rect.left;
      pointer.y = touch.clientY - rect.top;
      pointer.active = true;
    }

    function triggerPulse() {
      pulses.push({
        x: pointer.x || canvas.clientWidth / 2,
        y: pointer.y || canvas.clientHeight / 2,
        radius: 0,
        life: 1
      });
    }

    function animate(time) {
      if (!context) {
        return;
      }

      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;

      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(5, 6, 8, 0.84)';
      context.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const distanceX = particle.baseX - centerX;
        const distanceY = particle.baseY - centerY;
        const orbital = Math.sin(time * 0.001 + index * 0.37) * 18;
        const driftX = (distanceX / 200) * Math.sin(time * 0.0006 + index) * 10;
        const driftY = (distanceY / 200) * Math.cos(time * 0.0005 + index) * 10;

        particle.x += (particle.baseX + driftX + orbital - particle.x) * 0.015;
        particle.y += (particle.baseY + driftY - particle.y) * 0.015;

        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.hypot(dx, dy) || 1;
          const influence = Math.max(0, 160 - distance) / 160;
          if (distance < 160) {
            particle.x += (dx / distance) * influence * 10;
            particle.y += (dy / distance) * influence * 10;
          }
        }

        const wave = Math.sin((particle.x + time * 0.05) * 0.03) * 5;
        context.beginPath();
        context.fillStyle = 'rgba(232, 234, 240, ' + particle.alpha + ')';
        context.arc(particle.x + wave, particle.y + wave, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      for (let index = 0; index < pulses.length; index += 1) {
        const pulse = pulses[index];
        pulse.radius += 1.2;
        pulse.life -= 0.02;
        context.beginPath();
        context.strokeStyle = 'rgba(181, 68, 73, ' + (pulse.life * 0.8) + ')';
        context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        context.stroke();

        if (pulse.life <= 0) {
          pulses.splice(index, 1);
          index -= 1;
        }
      }

      context.beginPath();
      context.strokeStyle = 'rgba(181, 68, 73, 0.25)';
      context.lineWidth = 1;
      context.arc(centerX, centerY, 150, 0, Math.PI * 2);
      context.stroke();

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(animate);
      }
    }

    function start() {
      resizeCanvas();
      initializeParticles();

      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerdown', triggerPulse);
      canvas.addEventListener('touchstart', handleTouch, { passive: true });
      canvas.addEventListener('touchmove', handleTouch, { passive: true });
      window.addEventListener('resize', resizeCanvas);

      if (prefersReducedMotion) {
        animate(0);
        return;
      }

      rafId = requestAnimationFrame(animate);
    }

    function destroy() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', triggerPulse);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('resize', resizeCanvas);
    }

    function resume() {
      if (prefersReducedMotion) {
        animate(0);
        return;
      }
      rafId = requestAnimationFrame(animate);
    }

    return {
      start: start,
      destroy: destroy,
      resume: resume,
      triggerPulse: triggerPulse
    };
  }

  window.createSignalExperiment = createSignalExperiment;
})();
