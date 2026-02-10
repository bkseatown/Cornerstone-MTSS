(function () {
  if (window.csDelight && window.csDelight.__installed) return;

  const SOUND_KEY = 'cs_delight_sound';
  const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

  const state = {
    layer: null,
    meter: null,
    stars: [],
    label: null,
    particles: null,
    soundToggle: null,
    hideTimer: 0,
    fillTimers: [],
    burstSerial: 0,
    audioContext: null,
    reducedMotionMedia: null,
    wordQuestObserver: null
  };

  function clearTimers() {
    if (state.hideTimer) {
      clearTimeout(state.hideTimer);
      state.hideTimer = 0;
    }
    while (state.fillTimers.length) {
      clearTimeout(state.fillTimers.pop());
    }
  }

  function prefersReducedMotion() {
    if (!state.reducedMotionMedia && typeof window.matchMedia === 'function') {
      state.reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    }
    return !!state.reducedMotionMedia?.matches;
  }

  function readSoundSetting() {
    try {
      const raw = String(localStorage.getItem(SOUND_KEY) || '').trim().toLowerCase();
      return raw === 'off' ? 'off' : 'on';
    } catch {
      return 'on';
    }
  }

  function writeSoundSetting(next) {
    const value = String(next || '').trim().toLowerCase() === 'off' ? 'off' : 'on';
    try {
      localStorage.setItem(SOUND_KEY, value);
    } catch {}
    return value;
  }

  function ensureLayer() {
    if (state.layer) return state.layer;
    const existing = document.getElementById('cs-delight-layer');
    if (existing) {
      state.layer = existing;
      state.meter = existing.querySelector('#cs-delight-meter');
      state.stars = Array.from(existing.querySelectorAll('.cs-delight-star'));
      state.label = existing.querySelector('#cs-delight-label');
      state.particles = existing.querySelector('#cs-delight-particles');
      return existing;
    }

    const layer = document.createElement('div');
    layer.id = 'cs-delight-layer';
    layer.className = 'cs-delight-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
      <div id="cs-delight-meter" class="cs-delight-meter">
        <div class="cs-delight-stars" role="status" aria-live="polite">
          <span class="cs-delight-star" data-index="1">★</span>
          <span class="cs-delight-star" data-index="2">★</span>
          <span class="cs-delight-star" data-index="3">★</span>
        </div>
        <div id="cs-delight-label" class="cs-delight-label"></div>
      </div>
      <div id="cs-delight-particles" class="cs-delight-particles"></div>
    `;
    document.body.appendChild(layer);
    state.layer = layer;
    state.meter = layer.querySelector('#cs-delight-meter');
    state.stars = Array.from(layer.querySelectorAll('.cs-delight-star'));
    state.label = layer.querySelector('#cs-delight-label');
    state.particles = layer.querySelector('#cs-delight-particles');
    return layer;
  }

  function ensureSoundToggle() {
    if (state.soundToggle) return state.soundToggle;
    let toggle = document.getElementById('cs-delight-sound-toggle');
    if (!(toggle instanceof HTMLButtonElement)) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = 'cs-delight-sound-toggle';
      toggle.className = 'cs-delight-sound-toggle';
      toggle.setAttribute('aria-label', 'Toggle delight sounds');
      document.body.appendChild(toggle);
    }
    state.soundToggle = toggle;
    syncSoundToggleUi();
    if (toggle.dataset.bound !== 'true') {
      toggle.dataset.bound = 'true';
      toggle.addEventListener('click', () => {
        const next = readSoundSetting() === 'on' ? 'off' : 'on';
        writeSoundSetting(next);
        syncSoundToggleUi();
      });
    }
    return toggle;
  }

  function syncSoundToggleUi() {
    if (!(state.soundToggle instanceof HTMLButtonElement)) return;
    const mode = readSoundSetting();
    state.soundToggle.textContent = mode === 'on' ? 'Delight sound: On' : 'Delight sound: Off';
    state.soundToggle.setAttribute('aria-pressed', mode === 'on' ? 'true' : 'false');
  }

  function ensureAudioContext() {
    if (state.audioContext) return state.audioContext;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try {
      state.audioContext = new Ctor();
    } catch {
      state.audioContext = null;
    }
    return state.audioContext;
  }

  function unlockAudio() {
    if (window.csAudioUnlocked === true) return;
    window.csAudioUnlocked = true;
    const audioContext = ensureAudioContext();
    if (!audioContext) return;
    if (audioContext.state === 'suspended' && typeof audioContext.resume === 'function') {
      audioContext.resume().catch(() => {});
    }
  }

  function bindAudioUnlock() {
    if (window.__csDelightAudioUnlockBound) return;
    window.__csDelightAudioUnlockBound = true;
    window.csAudioUnlocked = window.csAudioUnlocked === true;
    const onGesture = () => unlockAudio();
    document.addEventListener('pointerdown', onGesture, { capture: true, passive: true });
    document.addEventListener('keydown', onGesture, { capture: true });
  }

  function canPlaySound() {
    return readSoundSetting() === 'on' && window.csAudioUnlocked === true;
  }

  function playStarPing() {
    if (!canPlaySound()) return false;
    const audioContext = ensureAudioContext();
    if (!audioContext) return false;
    if (audioContext.state === 'suspended' && typeof audioContext.resume === 'function') {
      audioContext.resume().catch(() => {});
    }

    const now = audioContext.currentTime;
    const master = audioContext.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    master.connect(audioContext.destination);

    const tones = [659.25, 783.99, 987.77];
    tones.forEach((freq, idx) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.01);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.01);
      gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + 0.03 + idx * 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2 + idx * 0.02);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.01);
      osc.stop(now + 0.21 + idx * 0.02);
    });
    return true;
  }

  function setFilledStars(count = 0) {
    const total = Math.max(0, Math.min(3, Number(count) || 0));
    state.stars.forEach((star, index) => {
      const filled = index < total;
      star.classList.toggle('is-filled', filled);
    });
  }

  function pulseStar(index) {
    const star = state.stars[index];
    if (!(star instanceof HTMLElement)) return;
    star.classList.add('is-shine');
    setTimeout(() => {
      star.classList.remove('is-shine');
    }, 360);
  }

  function hideMeterSoon(delayMs = 2200) {
    clearTimeout(state.hideTimer);
    state.hideTimer = setTimeout(() => {
      state.meter?.classList.remove('is-visible');
      setFilledStars(0);
      if (state.label) state.label.textContent = '';
    }, delayMs);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function burst(options = {}) {
    ensureLayer();
    if (!(state.particles instanceof HTMLElement)) return;
    if (prefersReducedMotion()) return;

    const x = Number(options.x);
    const y = Number(options.y);
    const cx = Number.isFinite(x) ? x : window.innerWidth / 2;
    const cy = Number.isFinite(y) ? y : Math.max(56, window.innerHeight * 0.16);
    const count = Math.max(10, Math.min(18, Number(options.count) || 14));
    const serial = ++state.burstSerial;

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'cs-delight-particle';
      const angle = (Math.PI * 2 * i) / count + randomBetween(-0.24, 0.24);
      const distance = randomBetween(28, 72);
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance - randomBetween(12, 24)}px`;
      const hue = Math.round(randomBetween(190, 260));
      particle.style.left = `${cx}px`;
      particle.style.top = `${cy}px`;
      particle.style.background = `hsl(${hue} 88% 64%)`;
      particle.style.setProperty('--dx', dx);
      particle.style.setProperty('--dy', dy);
      particle.style.setProperty('--rot', `${randomBetween(-160, 160)}deg`);
      particle.dataset.serial = String(serial);
      state.particles.appendChild(particle);
      requestAnimationFrame(() => particle.classList.add('is-live'));
      setTimeout(() => {
        particle.remove();
      }, 720);
    }
  }

  function burstFromEl(el) {
    if (!(el instanceof Element)) {
      burst();
      return;
    }
    const rect = el.getBoundingClientRect();
    burst({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  }

  function awardStars(count = 1, options = {}) {
    ensureLayer();
    ensureSoundToggle();
    clearTimers();
    if (!(state.meter instanceof HTMLElement)) return;

    const total = Math.max(1, Math.min(3, Number(count) || 1));
    const label = String(options.label || '').trim();
    if (state.label) state.label.textContent = label;
    setFilledStars(0);
    state.meter.classList.add('is-visible');

    if (prefersReducedMotion()) {
      setFilledStars(total);
      hideMeterSoon(1700);
      return;
    }

    playStarPing();
    for (let i = 0; i < total; i += 1) {
      const timer = setTimeout(() => {
        setFilledStars(i + 1);
        pulseStar(i);
      }, i * 240);
      state.fillTimers.push(timer);
    }
    const burstTimer = setTimeout(() => {
      burstFromEl(state.meter);
    }, total * 240 + 40);
    state.fillTimers.push(burstTimer);
    hideMeterSoon(total * 240 + 2100);
  }

  function setupWordQuestHook() {
    const modal = document.getElementById('modal');
    if (!(modal instanceof HTMLElement)) return;
    if (state.wordQuestObserver) return;

    let wasOpen = !modal.classList.contains('hidden');
    const onModalState = () => {
      const isOpen = !modal.classList.contains('hidden');
      if (isOpen && !wasOpen && modal.classList.contains('win')) {
        const label = 'Round complete';
        awardStars(3, { label });
        burstFromEl(document.getElementById('modal-word') || modal);
      }
      wasOpen = isOpen;
    };

    state.wordQuestObserver = new MutationObserver(() => {
      requestAnimationFrame(onModalState);
    });
    state.wordQuestObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
    onModalState();
  }

  function demo() {
    awardStars(3, { label: 'Delight demo' });
    burst();
  }

  function init() {
    ensureLayer();
    ensureSoundToggle();
    bindAudioUnlock();
    setupWordQuestHook();
    if (prefersReducedMotion()) {
      state.meter?.classList.remove('is-visible');
    }
  }

  window.csDelight = {
    __installed: true,
    awardStars,
    burst,
    burstFromEl,
    playStarPing,
    demo,
    getSoundSetting: readSoundSetting,
    setSoundSetting: writeSoundSetting
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
