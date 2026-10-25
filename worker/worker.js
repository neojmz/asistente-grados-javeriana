// Cloudflare Worker: guarda la API key de Gemini fuera de GitHub.
// La página le envía la conversación; el Worker agrega la clave y llama a Gemini.

const ALLOWED_ORIGINS = ["https://neojmz.github.io"]; // dominio de tu GitHub Pages (sin la ruta del repo)
const MODEL = "gemini-3.1-flash-lite";                // si Google cambia el modelo, edítalo aquí
const MAX_BODY_CHARS = 150000;                         // tope de tamaño de cada solicitud
const MAX_OUTPUT_TOKENS = 800;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    const reply = (msg, status) => new Response(msg, { status, headers: cors });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return reply("Método no permitido", 405);
    if (!ALLOWED_ORIGINS.includes(origin)) return reply("Origen no permitido", 403);
    if (!env.GEMINI_API_KEY) return reply("Falta configurar GEMINI_API_KEY", 500);

    const text = await request.text();
    if (text.length > MAX_BODY_CHARS) return reply("Solicitud demasiado grande", 413);

    let body;
    try { body = JSON.parse(text); } catch { return reply("JSON inválido", 400); }

    // Solo reenviamos los campos necesarios y limitamos la salida
    const safe = {
      systemInstruction: body.systemInstruction,
      contents: body.contents,
      generationConfig: {
        temperature: Math.min(Number(body.generationConfig?.temperature ?? 0.2), 1),
        maxOutputTokens: Math.min(Number(body.generationConfig?.maxOutputTokens ?? MAX_OUTPUT_TOKENS), MAX_OUTPUT_TOKENS)
      }
    };

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
        body: JSON.stringify(safe)
      }
    );
    return new Response(await r.text(), {
      status: r.status,
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }
};
