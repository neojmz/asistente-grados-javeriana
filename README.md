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

## Seguridad de la clave: usar un Cloudflare Worker
GitHub bloquea las claves dentro de los archivos y Google puede desactivar una clave expuesta, así que la clave NO va en el repositorio.
1. Crea una cuenta gratis en https://dash.cloudflare.com y entra a **Workers & Pages** → **Create** → **Hello World** → **Deploy**.
2. Pulsa **Edit code**, borra el contenido y pega `worker/worker.js`. Verifica que `ALLOWED_ORIGINS` tenga tu dominio de GitHub Pages. **Deploy**.
3. En el Worker: **Settings** → **Variables and Secrets** → **Add** → tipo **Secret**, nombre `GEMINI_API_KEY`, valor tu clave. **Deploy**.
4. Copia la dirección del Worker (termina en `.workers.dev`) y pégala en `PROXY_URL` de `js/config.js`. Sube ese cambio a GitHub.
5. Para probar en tu computador sin Worker, deja `PROXY_URL` vacío y pega tu clave en `API_KEY`, sin subir ese archivo.

## Privacidad
- El repositorio público no debe incluir información interna ni datos personales de graduandos.
- Las preguntas se envían a Google (API de Gemini). En el plan gratuito, Google puede usar los datos para mejorar sus productos; avisa a los usuarios (ya hay un aviso en el pie de página) y revisa las condiciones vigentes.

## Mantenimiento
- Actualiza `knowledge/` cada semestre o cuando cambie una circular.
- Revisa que el modelo de `config.js` siga disponible en el plan gratuito.
- Fase 2 (KPIs): registrar preguntas sin respuesta y escalamientos para medir resolución autónoma y detectar vacíos de información.
