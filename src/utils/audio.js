let audioCtx;

function getAudioContext() {
  if (audioCtx && audioCtx.state === 'closed') {
    audioCtx = null;
  }
  if (!audioCtx) {
    const AudioCtx =
      typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  return audioCtx;
}

export function playNotificationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1);
}

export async function closeAudioContext() {
  if (audioCtx) {
    try {
      await audioCtx.close();
    } catch (e) {
      // ignore
    }
    audioCtx = null;
  }
}
