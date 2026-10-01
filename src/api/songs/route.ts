import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Pega o parâmetro 'query' da URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    // O Next.js (servidor) faz a requisição pro Songsterr (sem problema de CORS)
    const res = await fetch(
      `https://www.songsterr.com/api/songs?pattern=${encodeURIComponent(query)}`,
    );
    const data = await res.json();

    // Retorna os dados para o seu frontend
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
