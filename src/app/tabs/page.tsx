"use client";

import { useState } from "react";
import { Search, Music, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { searchSongsAction } from "@/src/actions/songsterr";
import Link from "next/link";

interface Song {
  songId: number;
  artist: string;
  title: string;
  hasPlayer?: boolean;
  songUrl?: string;
}

export default function TabsPage() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // chama a server action que roda no servidor (sem erro de CORS)
      const data = await searchSongsAction(query);
      if (data) {
        setSongs(data.slice(0, 10)); // limita a 10 melhores resultados
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.error("Erro ao buscar tablaturas:", error);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F5F0E6] flex flex-col items-center justify-between p-6 selection:bg-[#8B0000] selection:text-[#F5F0E6]">
      <header className="w-full flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#797D62] hover:text-[#F5F0E6] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar ao Hub</span>
        </Link>
      </header>

      <div className="w-full max-w-2xl my-auto py-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F0E6]">
            Busca de Tablaturas
          </h1>
          <p className="text-sm text-[#797D62] mt-1">
            Encontre cifras e tablaturas oficiais instantaneamente
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#797D62]"
            />
            <input
              type="text"
              placeholder="Digite o nome da música ou artista (ex: Metallica, Pink Floyd)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#4A1C1A]/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#F5F0E6] placeholder-[#797D62] focus:outline-none focus:border-[#8B0000] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#8B0000] hover:bg-[#A30000] text-[#F5F0E6] font-medium px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span>Buscar</span>
            )}
          </button>
        </form>

        {/* Resultados */}
        <div className="flex flex-col gap-3 min-h-75">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-[#797D62] gap-2">
              <Loader2 size={32} className="animate-spin text-[#8B0000]" />
              <p className="text-sm">Buscando tablaturas no catálogo...</p>
            </div>
          )}

          {!loading && hasSearched && songs.length === 0 && (
            <div className="text-center py-16 text-[#797D62]">
              <p>Nenhuma tablatura encontrada para &quot;{query}&quot;.</p>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="text-center py-16 text-[#797D62] border border-dashed border-[#262626] rounded-3xl">
              <Music
                size={36}
                className="mx-auto mb-2 opacity-40 text-[#8B0000]"
              />
              <p className="text-sm">Digite acima para começar a pesquisar.</p>
            </div>
          )}

          {!loading &&
            songs.map((song) => {
              const songTitle = song.title || "Música desconhecida";
              const artistName = song.artist || "Artista desconhecido";

              // URL correta do Songsterr usando o songId retornado pela API
              const songsterrUrl = `https://www.songsterr.com/a/wsa/s${song.songId}`;

              return (
                <div
                  key={song.songId} // Usando songId como key única
                  className="bg-[#1A1A1A] border border-[#4A1C1A]/40 hover:border-[#8B0000] p-4 rounded-2xl flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0F0F0F] border border-[#262626] flex items-center justify-center text-[#8B0000]">
                      <Music size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[#F5F0E6] group-hover:text-emerald-400 transition-colors">
                        {songTitle}
                      </h3>
                      <p className="text-xs text-[#797D62]">{artistName}</p>
                    </div>
                  </div>

                  <a
                    href={songsterrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-[#F5F0E6] bg-[#0F0F0F] border border-[#262626] hover:border-[#8B0000] px-3.5 py-2 rounded-xl transition-all"
                  >
                    <span>Abrir Tab</span>
                    <ExternalLink size={14} className="text-[#797D62]" />
                  </a>
                </div>
              );
            })}
        </div>
      </div>

      <div className="w-full max-w-2xl text-center text-xs text-[#797D62] pt-4 border-t border-[#4A1C1A]/40">
        Integração direta com endpoints abertos
      </div>
    </main>
  );
}
