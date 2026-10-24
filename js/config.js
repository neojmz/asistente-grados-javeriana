// Configuración del agente. Edita solo este archivo.
window.AGENT_CONFIG = {
  // Clave gratuita de Google AI Studio (https://aistudio.google.com/apikey).
  // IMPORTANTE: al ir en el front-end, queda visible. En Google Cloud Console
  // restríngela por "referrer HTTP" a tu dominio de GitHub Pages
  // (https://TU-USUARIO.github.io/*) y limita la API a "Generative Language API".
  API_KEY: "PEGA_AQUI_TU_API_KEY",

  // Verifica en la documentación de Gemini que el modelo siga disponible en el plan gratuito.
  MODEL: "gemini-2.5-flash",

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
