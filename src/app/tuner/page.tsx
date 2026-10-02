"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TunerPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F0E6] flex flex-col items-center justify-center p-6 selection:bg-[#8B0000] selection:text-[#F5F0E6]">
      <h1 className="text-2xl font-bold tracking-tight text-[#F5F0E6]">O que você ta fazendo aqui???</h1>
      <Image
        src="/batman-emoji.png"
        alt="batman"
        width={100}
        height={100}
      />
    </div>
  )
}
