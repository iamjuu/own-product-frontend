// Modern Web Audio API Order Chime & Continuous Alarm Synthesizer
// Completely zero-dependency, works offline, and handles browser autoplay policies.

let audioCtx = null;

export const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const unlockAudioContext = async () => {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx?.state === 'running';
  } catch (e) {
    return false;
  }
};

// Global click & gesture listeners to immediately unlock AudioContext
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    unlockAudioContext();
    if (audioCtx && audioCtx.state === 'running') {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('focus', unlockAudio);
    }
  };

  window.addEventListener('click', unlockAudio);
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
  window.addEventListener('focus', unlockAudio);
  window.addEventListener('mousemove', unlockAudio, { once: true });
}

/**
 * 1. Single kitchen order chime
 */
export const playOrderChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tone 1: High crisp initial strike (880 Hz - Note A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.1);

    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Tone 2: Warm melodic ring (1174.66 Hz - Note D6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(1396.91, now + 0.35);

    gain2.gain.setValueAtTime(0.45, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 1.2);
  } catch (err) {
    console.warn('[Audio Chime Notice]:', err.message);
  }
};

/**
 * 1b. Customer Rider-Assigned Push Chime (Melodic 4-note ascending notification)
 */
export const playCustomerRiderAssignedChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 587.33, delay: 0.0, dur: 0.22 },   // D5
      { freq: 739.99, delay: 0.12, dur: 0.25 },  // F#5
      { freq: 880.0, delay: 0.24, dur: 0.3 },   // A5
      { freq: 1174.66, delay: 0.38, dur: 0.7 }, // D6
    ];

    notes.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.35, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur);
    });
  } catch (err) {
    console.warn('[Customer Chime Notice]:', err.message);
  }
};

/**
 * 2. High-urgency rider broadcast radar alert ping (Single Pulse)
 */
export const playRadarPing = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1318.51, now); // E6
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.25); // E5

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    console.warn('[Radar Ping Notice]:', err.message);
  }
};

/**
 * 3. LOUD CONTINUOUS DELIVERY BOY ALARM
 * Alternating siren-style urgent tones that cycle repeatedly until rider accepts or rejects.
 */
let deliveryAlarmTimer = null;

const playDeliverySirenBurst = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pulse 1: Urgent High Beep (880 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.18);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Pulse 2: Secondary Warning (1174.66 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(1174.66, now + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.42);
    gain2.gain.setValueAtTime(0.35, now + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.22);
    osc2.stop(now + 0.5);

    // Pulse 3: Decisive radar ping (1760 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1760, now + 0.48);
    osc3.frequency.exponentialRampToValueAtTime(880, now + 0.75);
    gain3.gain.setValueAtTime(0.35, now + 0.48);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.48);
    osc3.stop(now + 0.8);
  } catch (err) {
    console.warn('[Continuous Alarm Notice]:', err.message);
  }
};

export const startDeliveryBoyContinuousAlarm = () => {
  if (deliveryAlarmTimer) {
    // Already sounding
    return { stop: stopDeliveryBoyContinuousAlarm };
  }

  // Play immediately
  playDeliverySirenBurst();

  // Loop continuously every 1.8 seconds until stopped
  deliveryAlarmTimer = setInterval(() => {
    playDeliverySirenBurst();
  }, 1800);

  return { stop: stopDeliveryBoyContinuousAlarm };
};

export const stopDeliveryBoyContinuousAlarm = () => {
  if (deliveryAlarmTimer) {
    clearInterval(deliveryAlarmTimer);
    deliveryAlarmTimer = null;
  }
};

export const isDeliveryAlarmSounding = () => {
  return deliveryAlarmTimer !== null;
};

/**
 * 4. RESTAURANT KITCHEN REPEATING BEEP
 * Clear electronic dual-tone kitchen ticket beep that rings periodically (every 3.2s)
 * until the kitchen accepts or prepares the order.
 */
let kitchenBeepTimer = null;

const playKitchenElectronicBeep = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Beep 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now); // C6
    gain1.gain.setValueAtTime(0.28, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    // Beep 2 (quick interval)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.18); // E6
    gain2.gain.setValueAtTime(0.3, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.42);
  } catch (err) {
    console.warn('[Kitchen Beep Notice]:', err.message);
  }
};

export const startRestaurantKitchenBeep = () => {
  if (kitchenBeepTimer) {
    return { stop: stopRestaurantKitchenBeep };
  }

  playKitchenElectronicBeep();

  kitchenBeepTimer = setInterval(() => {
    playKitchenElectronicBeep();
  }, 3200);

  return { stop: stopRestaurantKitchenBeep };
};

export const stopRestaurantKitchenBeep = () => {
  if (kitchenBeepTimer) {
    clearInterval(kitchenBeepTimer);
    kitchenBeepTimer = null;
  }
};

export const isKitchenBeepActive = () => {
  return kitchenBeepTimer !== null;
};
