export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
  private nextNoteTime: number = 0.0;
  private timerID: number | null = null;
  private bpm: number = 120;
  private isRunning: boolean = false;
  private lookahead: number = 25.0;
  private scheduleAheadTime: number = 0.1;
  private onBeatCallback: (() => void) | null = null;

  constructor(bpm: number, onBeat?: () => void) {
    this.bpm = bpm;
    if (onBeat) this.onBeatCallback = onBeat;
  }

  public start() {
    if (this.isRunning) return;
    
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioContextClass();

    this.isRunning = true;
    this.nextNoteTime = this.audioCtx.currentTime;
    this.timerID = window.setInterval(() => this.scheduler(), this.lookahead);
  }

  public stop() {
    this.isRunning = false;
    if (this.timerID !== null) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
    
    // CORREÇÃO: Verifica se o contexto existe e se NÃO está fechado antes de fechar
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch((err) => {
        console.warn("Erro ao fechar o AudioContext:", err);
      });
      this.audioCtx = null;
    } else {
      this.audioCtx = null;
    }
  }

  public setBpm(newBpm: number) {
    this.bpm = newBpm;
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;
  }

  private playClick(time: number) {
    if (!this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const envelope = this.audioCtx.createGain();

    osc.frequency.value = 1000;
    envelope.gain.setValueAtTime(1, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(envelope);
    envelope.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.05);

    // Dispara o callback visual exatamente no tempo agendado do áudio
    if (this.onBeatCallback) {
      const currentAudioTime = this.audioCtx.currentTime;
      const delayMs = Math.max(0, (time - currentAudioTime) * 1000);
      setTimeout(() => {
        if (this.onBeatCallback && this.isRunning) {
          this.onBeatCallback();
        }
      }, delayMs);
    }
  }

  private scheduler() {
    if (!this.audioCtx) return;
    
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.playClick(this.nextNoteTime);
      this.nextNote();
    }
  }
}