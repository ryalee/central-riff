import Link from "next/link";
import { Timer, Mic, Music, ArrowRight, Wrench } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const tools = [
    {
      title: "Metrônomo de Precisão",
      description: "Controle de BPM sem atrasos usando Web Audio API.",
      icon: "/metronome.png",
      href: "/metronome",
      active: true,
    },
    {
      title: "Afinador Cromático",
      description: "Afinador em tempo real captando o som via microfone.",
      icon: "/tuner.png",
      href: "/tuner",
      active: false,
    },
    {
      title: "Busca de Tablaturas",
      description: "Integração com API para encontrar tablaturas rapidamente.",
      icon: "/tabs.png",
      href: "/tabs",
      active: true,
    },
  ];

  return (
    <section className="min-h-screen bg-[#0F0F0F] text-[#F5F0E6] flex flex-col items-center justify-between p-6 md:p-12 selection:bg-[#8B0000] selection:text-[#F5F0E6]">
      {/* header */}
      <header className="w-full max-w-full flex items-center justify-between border-b border-[#4A1C1A]/40 pb-6">
        <div className="flex items-center">
          <Image src="/logo-icon.png" alt="logo" width={50} height={50} />

          <div>
            <h1 className="font-bold text-lg tracking-tight">Guitar Hub</h1>
            <p className="text-xs text-[#797D62]">
              Kit de Ferramentas All-in-One para Guitarristas
            </p>
          </div>
        </div>
      </header>

      {/* ferramentas */}
      <div className="w-full max-w-4xl my-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => {
          const content = (
            <div
              className={`relative flex flex-col justify-between p-6 rounded-3xl border transition-all duration-300 h-64 ${
                tool.active
                  ? "bg-[#1A1A1A] border-[#4A1C1A]/60 hover:border-[#8B0000] hover:shadow-2xl hover:shadow-[#8B0000]/10 cursor-pointer group"
                  : "bg-[#141414]/40 border-[#222222] opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <Image
                  src={tool.icon}
                  alt={tool.title}
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight mb-1 text-[#F5F0E6]">
                  {tool.title}
                </h2>
                <p className="text-xs text-[#797D62] leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#F5F0E6]">
                {tool.active && (
                  <>
                    <span>Acessar</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1 text-[#8B0000]"
                    />
                  </>
                )}
              </div>
            </div>
          );

          return tool.active ? (
            <Link key={index} href={tool.href}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
