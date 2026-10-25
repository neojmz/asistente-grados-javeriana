// Configuración del agente. Edita solo este archivo.
window.AGENT_CONFIG = {
  // PUBLICADO EN GITHUB: deja API_KEY con el texto de ejemplo y escribe la dirección de tu Worker.
  // El Worker (carpeta worker/) guarda la clave real; así no queda expuesta en el repositorio.
  PROXY_URL: "https://asistente-grados.alexjimenez5.workers.dev",   // ej.: "https://asistente-grados.TU-SUBDOMINIO.workers.dev"

  // SOLO PARA PROBAR EN TU COMPUTADOR (sin Worker): pega aquí tu clave de https://aistudio.google.com/apikey
  // NUNCA subas este archivo a GitHub con la clave pegada.
  API_KEY: "PEGA_AQUI_TU_API_KEY",

  // Los modelos cambian: si ves error 404, copia el nombre vigente desde Google AI Studio (Get code).
  MODEL: "gemini-3.1-flash-lite",

  TEMPERATURE: 0.2,        // baja = respuestas más fieles a la base de conocimiento
  MAX_HISTORY_TURNS: 6,    // turnos previos enviados al modelo
  MAX_OUTPUT_TOKENS: 800,

  // Escalamiento a la Oficina de Protocolo (reemplaza por el correo oficial)
  CONTACT_EMAIL: "protocolo@javeriana.edu.co",
  CONTACT_SUBJECT: "Consulta sobre ceremonia de grado",

  // Archivos de contexto (orden de carga)
  PROMPT_FILE: "prompts/system-prompt.md",
  KNOWLEDGE_FILES: [
    "knowledge/ceremonias-grado.md",
    "knowledge/requisitos-grado.md",
    "knowledge/faq.md"
  ],

  SUGGESTIONS: [
    "¿Cuándo es mi ceremonia de grado?",
    "¿Cuántos invitados puedo llevar?",
    "¿Qué requisitos debo cumplir para graduarme?",
    "¿Cómo recibo mis invitaciones?"
  ]
};
