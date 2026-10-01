"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TunerPage() {
  const [isListening, setIsListening] = useState(false);
  const [noteName, setNoteName] = useState("--");
  const [cents, setCents] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const noteStrings = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  function getNoteFromPitch(frequency: number) {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
    return Math.round(noteNum);
  }

  function getFrequencyFromNoteNumber(note: number) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function getCents(frequency: number, note: number) {
    const minF = getFrequencyFromNoteNumber(note - 1);
    const maxF = getFrequencyFromNoteNumber(note + 1);
    const midF = getFrequencyFromNoteNumber(note);
    if (frequency < midF) {
      return Math.floor((1200 * Math.log(frequency / midF)) / Math.log(2));
    } else {
      return Math.floor((1200 * Math.log(frequency / midF)) / Math.log(2));
    }
  }

  // algoritmo simplificado de autocorrelação pra detecção de pitch (frequência)
  function autoCorrelate(buf: Float32Array, sampleRate: number) {
    const SIZE = buf.length;
    let sum = 0;
    for (let i = 0; i < SIZE; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / SIZE);
    if (rms < 0.01) return -1; // Muito silêncio

    let r1 = 0,
      r2 = SIZE - 1;
    const threshold = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < threshold) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < r2; i++) {
      for (let j = 0; j < r2 - i; j++) {
        c[i] = c[i] + buf[j] * buf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1,
      maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;
    return sampleRate / T0;
  }

  const startTuner = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      mediaStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      updatePitch();
    } catch {
      setErrorMsg("Permissão de microfone negada ou indisponível.");
      setIsListening(false);
    }
  };

  const stopTuner = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setNoteName("--");
    setCents(0);
    setFrequency(0);
  };

  const updatePitch = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    const buf = new Float32Array(2048);
    analyserRef.current.getFloatTimeDomainData(buf);
    const ac = autoCorrelate(buf, audioContextRef.current.sampleRate);

    if (ac !== -1) {
      setFrequency(Math.round(ac));
      const note = getNoteFromPitch(ac);
      const name = noteStrings[note % 12];
      const octave = Math.floor(note / 12) - 1;
      setNoteName(`${name}${octave}`);
      const c = getCents(ac, note);
      setCents(c);
    }

    rafIdRef.current = requestAnimationFrame(updatePitch);
  };

  useEffect(() => {
    return () => {
      stopTuner();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F5F0E6] w-full flex flex-col items-center justify-between p-6 selection:bg-[#8B0000] selection:text-[#F5F0E6]">
      <div className="w-full max-w-md flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#797D62] hover:text-[#F5F0E6] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar ao Hub</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-[#F5F0E6] font-semibold bg-[#8B0000]/20 px-3 py-1 rounded-full border border-[#8B0000]/40">
          Afinador
        </span>
      </div>

      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#4A1C1A]/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F0E6]">
            Afinador Cromático
          </h1>
          <p className="text-sm text-[#797D62] mt-1">
            Detecção de pitch em tempo real via Microfone
          </p>
        </div>

        {errorMsg && (
          <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            {errorMsg}
          </div>
        )}

        {/* Display da Nota */}
        <div className="relative flex flex-col items-center justify-center w-44 h-44 rounded-full border-4 border-[#262626] bg-[#0F0F0F] shadow-inner">
          <span className="text-6xl font-extrabold tracking-tighter text-[#F5F0E6]">
            {noteName}
          </span>
          <span className="text-xs text-[#797D62] mt-1">
            {frequency ? `${frequency} Hz` : "Toque uma corda"}
          </span>
        </div>

        {/* Medidor visual de Cents (Afinado ou Desafinado) */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between text-xs text-[#797D62]">
            <span>♭ Bemol</span>
            <span
              className={
                Math.abs(cents) < 5 && noteName !== "--"
                  ? "text-emerald-400 font-bold"
                  : "text-[#F5F0E6]"
              }
            >
              {cents > 0 ? `+${cents}` : cents} cents
            </span>
            <span>Sustenido ♯</span>
          </div>
          <div className="w-full bg-[#0F0F0F] h-3 rounded-full overflow-hidden border border-[#262626] relative flex items-center justify-center">
            {/* Indicador central de precisão */}
            <div className="absolute w-1 h-full bg-[#8B0000]"></div>
            {/* Barra móvel */}
            <div
              className={`h-full w-2 rounded-full transition-all duration-75 ${
                Math.abs(cents) < 5 && noteName !== "--"
                  ? "bg-emerald-500"
                  : "bg-[#F5F0E6]"
              }`}
              style={{
                transform: `translateX(${Math.max(-100, Math.min(100, cents))}px)`,
              }}
            ></div>
          </div>
        </div>

        <button
          onClick={isListening ? stopTuner : startTuner}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
            isListening
              ? "bg-[#4A1C1A] hover:bg-[#5C2320] text-[#F5F0E6] border border-[#8B0000]/50"
              : "bg-[#8B0000] hover:bg-[#A30000] text-[#F5F0E6]"
          }`}
        >
          {isListening ? (
            <>
              <MicOff size={22} />
              <span>Desativar Microfone</span>
            </>
          ) : (
            <>
              <Mic size={22} />
              <span>Ativar Afinador</span>
            </>
          )}
        </button>
      </div>

      <div className="text-center text-xs text-[#797D62]">
        Conecte sua guitarra ou toque próximo ao microfone
      </div>
    </main>
  );
}
