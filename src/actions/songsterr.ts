'use server'

export async function searchSongsAction(query: string) {
  try {
    const res = await fetch(
      `https://www.songsterr.com/api/songs?pattern=${encodeURIComponent(query)}`
    );
    
    if (!res.ok) {
      throw new Error(`Erro na API: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("DADOS RETORNADOS DO SONGSTERR:", JSON.stringify(data, null, 2)); // <--- Adicione isso
    
    return data;
  } catch (error) {
    console.error("Erro no servidor:", error);
    return [];
  }
}