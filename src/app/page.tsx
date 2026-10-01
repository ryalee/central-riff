import Link from "next/link";
import { Timer, Mic, Music, ArrowRight, Wrench } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const tools = [
    {
      title: "Metrônomo de Precisão",
      description: "Controle de BPM sem atrasos usando Web Audio API.",
      icon: <Timer size={24} className="text-[#8B0000]" />,
      href: "/metronome",
      status: "Disponível",
      active: true,
    },
    {
      title: "Afinador Cromático",
      description: "Afinador em tempo real captando o som via microfone.",
      icon: <Mic size={24} className="text-[#797D62]" />,
      href: "/tuner",
      status: "Em breve",
      active: false,
    },
    {
      title: "Busca de Tablaturas",
      description: "Integração com API para encontrar tablaturas rapidamente.",
      icon: <Music size={24} className="text-[#797D62]" />,
      href: "/tabs",
      status: "Em breve",
      active: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F5F0E6] flex flex-col items-center justify-between p-6 md:p-12 selection:bg-[#8B0000] selection:text-[#F5F0E6]">
      {/* Header do Hub */}
      <div className="w-full max-w-full flex items-center justify-between border-b border-[#4A1C1A]/40 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Guitar Hub</h1>
            <p className="text-xs text-[#797D62]">
              Kit de Ferramentas All-in-One para Guitarristas
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Ferramentas */}
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
                <div className="w-12 h-12 rounded-2xl bg-[#0F0F0F] border border-[#262626] flex items-center justify-center">
                  {tool.icon}
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    tool.active
                      ? "bg-[#8B0000]/20 text-[#F5F0E6] border border-[#8B0000]/40"
                      : "bg-[#222222] text-[#797D62]"
                  }`}
                >
                  {tool.status}
                </span>
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
                    <span>Acessar ferramenta</span>
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
    </main>
  );
}
