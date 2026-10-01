"use client";

import { useState, useEffect, useRef } from "react";
import { MetronomeEngine } from "@/src/lib/metronomeEngine";
import { Play, Pause, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MetronomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [isBeat, setIsBeat] = useState(false);
  
  const metronomeRef = useRef<MetronomeEngine | null>(null);

  useEffect(() => {
    metronomeRef.current = new MetronomeEngine(bpm, () => {
      setIsBeat(true);
      setTimeout(() => setIsBeat(false), 80);
    });

    return () => {
      if (metronomeRef.current) {
        metronomeRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.setBpm(bpm);
    }
  }, [bpm]);

  const toggleMetronome = () => {
    if (!metronomeRef.current) return;

    if (isPlaying) {
      metronomeRef.current.stop();
      setIsPlaying(false);
    } else {
      metronomeRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    const clamped = Math.max(40, Math.min(240, newBpm));
    setBpm(clamped);
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F5F0E6] flex flex-col items-center justify-between p-6 selection:bg-[#8B0000] selection:text-[#F5F0E6]">
      <div className="w-full flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[#797D62] hover:text-[#F5F0E6] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar ao Hub</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#4A1C1A]/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-8 mb-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F0E6]">Metrônomo de Precisão</h1>
          <p className="text-sm text-[#797D62] mt-1">Sincronia perfeita baseada em Web Audio API</p>
        </div>

        {/* Display do BPM com pulso em Blood Red */}
        <div className={`relative flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 transition-all duration-75 ${
          isPlaying && isBeat ? 'border-[#8B0000] bg-[#8B0000]/20 scale-105 shadow-lg shadow-[#8B0000]/20' : 'border-[#262626] bg-[#0F0F0F]'
        }`}>
          <span className="text-5xl font-extrabold tracking-tighter text-[#F5F0E6]">{bpm}</span>
          <span className="text-xs uppercase tracking-widest text-[#797D62] mt-1">BPM</span>
        </div>

        <div className="flex items-center gap-4 w-full justify-center">
          <button 
            onClick={() => handleBpmChange(bpm - 1)}
            className="w-12 h-12 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-[#F5F0E6] border border-[#333333] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <Minus size={20} />
          </button>

          <input 
            type="range" 
            min="40" 
            max="240" 
            value={bpm} 
            onChange={(e) => handleBpmChange(Number(e.target.value))}
            className="w-full accent-[#8B0000] cursor-pointer bg-[#222222] h-2 rounded-lg"
          />

          <button 
            onClick={() => handleBpmChange(bpm + 1)}
            className="w-12 h-12 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-[#F5F0E6] border border-[#333333] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>

        <button
          onClick={toggleMetronome}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
            isPlaying 
              ? 'bg-[#4A1C1A] hover:bg-[#5C2320] text-[#F5F0E6] border border-[#8B0000]/50 shadow-[#4A1C1A]/30' 
              : 'bg-[#8B0000] hover:bg-[#A30000] text-[#F5F0E6] shadow-[#8B0000]/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={22} fill="currentColor" />
              <p>Pausar Metrônomo</p>
            </>
          ) : (
            <>
              <Play size={22} fill="currentColor" />
              <p>Iniciar Metrônomo</p>
            </>
          )}
        </button>
      </div>
    </main>
  );
}