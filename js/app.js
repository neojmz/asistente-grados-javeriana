(() => {
  const C = window.AGENT_CONFIG;
  const $ = (id) => document.getElementById(id);
  const chat = $("chat"), form = $("form"), input = $("input"), send = $("send");
  const history = [];          // {role: "user"|"model", text}
  let systemText = "";

  // ---------- Utilidades ----------
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Markdown mínimo y seguro: negrita, listas, enlaces https, párrafos
  function md(text) {
    const lines = esc(text).split("\n");
    let html = "", list = null;
    const inline = (t) => t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    const close = () => { if (list) { html += `</${list}>`; list = null; } };
    for (const raw of lines) {
      const l = raw.trim();
      let m;
      if ((m = l.match(/^[-*]\s+(.*)/))) { if (list !== "ul") { close(); html += "<ul>"; list = "ul"; } html += `<li>${inline(m[1])}</li>`; }
      else if ((m = l.match(/^\d+[.)]\s+(.*)/))) { if (list !== "ol") { close(); html += "<ol>"; list = "ol"; } html += `<li>${inline(m[1])}</li>`; }
      else if (l === "") close();
      else { close(); html += `<p>${inline(l)}</p>`; }
    }
    close();
    return html;
  }

  function addMsg(kind, html) {
    const d = document.createElement("div");
    d.className = "msg " + kind;
    d.innerHTML = html;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
    return d;
  }

  function mailto() {
    return `mailto:${C.CONTACT_EMAIL}?subject=${encodeURIComponent(C.CONTACT_SUBJECT)}`;
  }

  // ---------- Carga de contexto ----------
  async function loadText(path) {
    const r = await fetch(path, { cache: "no-cache" });
    if (!r.ok) throw new Error("No se pudo cargar " + path);
    return r.text();
  }

  async function init() {
    $("contact").href = mailto();
    try {
      const [prompt, ...kb] = await Promise.all([C.PROMPT_FILE, ...C.KNOWLEDGE_FILES].map(loadText));
      systemText = prompt + "\n\n# BASE DE CONOCIMIENTO OFICIAL\n\n" + kb.join("\n\n---\n\n");
    } catch (e) {
      addMsg("error", "No pude cargar la información del asistente. Si abriste el archivo directamente, usa un servidor local (ver README).");
      send.disabled = true;
      return;
    }
    addMsg("bot", md("Hola, soy el asistente de la Oficina de Protocolo. ¿Qué quieres saber sobre tu ceremonia de grado?"));
    const box = $("suggestions");
    C.SUGGESTIONS.forEach((q) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = q;
      b.onclick = () => ask(q);
      box.appendChild(b);
    });
  }

  // ---------- Llamada a Gemini ----------
  async function callGemini() {
    const turns = history.slice(-C.MAX_HISTORY_TURNS * 2);
    const body = {
      systemInstruction: { parts: [{ text: systemText + "\n\nFECHA DE HOY: " + new Date().toLocaleDateString("es-CO", { dateStyle: "full" }) + ". Usa esta fecha para decir si un evento ya ocurrió o aún no." }] },
      contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      generationConfig: { temperature: C.TEMPERATURE, maxOutputTokens: C.MAX_OUTPUT_TOKENS }
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${C.MODEL}:generateContent`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": C.API_KEY },
      body: JSON.stringify(body)
    });
    if (r.status === 429) throw new Error("rate");
    if (!r.ok) throw new Error("http " + r.status);
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
    if (!text) throw new Error("empty");
    return text;
  }

  // ---------- Flujo de pregunta ----------
  async function ask(q) {
    q = q.trim();
    if (!q || send.disabled) return;
    $("suggestions").hidden = true;
    addMsg("user", `<p>${esc(q)}</p>`);
    history.push({ role: "user", text: q });
    input.value = ""; input.style.height = "auto";
    send.disabled = true;
    const typing = addMsg("typing", "Buscando la información oficial…");
    try {
      let answer = await callGemini();
      const escalate = answer.includes("[ESCALAR]");
      answer = answer.replace("[ESCALAR]", "").trim();
      history.push({ role: "model", text: answer });
      typing.remove();
      const m = addMsg("bot", md(answer));
      if (escalate) m.insertAdjacentHTML("beforeend", `<br><a class="escalate" href="${mailto()}">Escribir a la Oficina de Protocolo</a>`);
    } catch (e) {
      history.pop();
      typing.remove();
      const msg = e.message === "rate"
        ? "Hay muchas consultas en este momento. Intenta de nuevo en un minuto."
        : "No pude responder ahora. Intenta de nuevo o escribe a la Oficina de Protocolo.";
      addMsg("error", `<p>${msg}</p><a class="escalate" href="${mailto()}">Escribir a la Oficina de Protocolo</a>`);
    } finally {
      send.disabled = false; input.focus();
    }
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = input.scrollHeight + "px"; });
  init();
})();
