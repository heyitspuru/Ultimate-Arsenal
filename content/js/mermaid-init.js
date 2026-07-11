/* Render Mermaid diagrams reliably, including from a static file:// build.
   MkDocs Material emits <pre class="mermaid"><code>...</code></pre>; we convert
   each into a <div class="mermaid"> that Mermaid can process, then run it.
   Themed to match the glossy grey-black + red site palette. */
(function () {
  function render() {
    if (typeof window.mermaid === "undefined") {   // CDN still loading
      return setTimeout(render, 60);
    }
    window.mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        background: "#0e0e11",
        primaryColor: "#1b1b22",
        primaryTextColor: "#e8e8ec",
        primaryBorderColor: "#ff4d4d",
        lineColor: "#ff6b6b",
        secondaryColor: "#17171c",
        tertiaryColor: "#141419",
        tertiaryTextColor: "#e8e8ec",
        fontFamily: "IBM Plex Sans, sans-serif"
      },
      securityLevel: "loose",          // allow <br/> labels in our diagrams
      flowchart: { htmlLabels: true, curve: "basis" }
    });

    document.querySelectorAll("pre.mermaid").forEach(function (pre) {
      var code = pre.querySelector("code");
      var def = (code ? code.textContent : pre.textContent);
      var div = document.createElement("div");
      div.className = "mermaid";
      div.textContent = def;
      pre.replaceWith(div);
    });

    try {
      if (window.mermaid.run) { window.mermaid.run(); }
      else if (window.mermaid.init) { window.mermaid.init(); }
    } catch (e) { /* leave source visible if a diagram fails to parse */ }
  }

  window.addEventListener("load", render);
})();
