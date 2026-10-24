# Asistente de ceremonias de grado — Oficina de Protocolo, Pontificia Universidad Javeriana

Agente de IA (HTML + JavaScript + API gratuita de Gemini) que responde preguntas frecuentes de graduandos usando solo la información oficial que cargues en `knowledge/`.

## Estructura
```
index.html                  Interfaz del chat
css/styles.css              Estilos
js/config.js                API key, modelo, correo de contacto, sugerencias
js/app.js                   Lógica: carga contexto, llama a Gemini, escalamiento
prompts/system-prompt.md    Instrucciones del agente (rol, reglas, tono, escalamiento)
knowledge/                  Base de conocimiento oficial: ceremonias, requisitos y FAQ (editable)
```

## Puesta en marcha
1. Crea una clave en https://aistudio.google.com/apikey y pégala en `js/config.js`.
2. Completa `knowledge/ceremonias-grado.md` y `knowledge/faq.md` con información oficial. Reemplaza los `[PENDIENTE]`.
3. Cambia `CONTACT_EMAIL` en `js/config.js` por el correo oficial de la Oficina.
4. Prueba en local (necesita servidor por los `fetch`): `python -m http.server 8000` y abre http://localhost:8000.
5. Publica: sube el repo a GitHub → Settings → Pages → Deploy from branch → `main` / root.
6. Genera el código QR con la URL `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Seguridad de la clave (prototipo)
La clave queda visible en el navegador. Para el prototipo, en Google Cloud Console → Credenciales:
- Restringe la clave por **referrers HTTP** a `https://TU-USUARIO.github.io/*`.
- Limita la API a **Generative Language API**.
Para producción, mueve la llamada a un proxy (Cloudflare Workers, Cloud Functions) que guarde la clave.

## Privacidad
- El repositorio público no debe incluir información interna ni datos personales de graduandos.
- Las preguntas se envían a Google (API de Gemini). En el plan gratuito, Google puede usar los datos para mejorar sus productos; avisa a los usuarios (ya hay un aviso en el pie de página) y revisa las condiciones vigentes.

## Mantenimiento
- Actualiza `knowledge/` cada semestre o cuando cambie una circular.
- Revisa que el modelo de `config.js` siga disponible en el plan gratuito.
- Fase 2 (KPIs): registrar preguntas sin respuesta y escalamientos para medir resolución autónoma y detectar vacíos de información.
