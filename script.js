function scrollToForm() {
  const formSection = document.getElementById("form-section");
  if (formSection) {
    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.6s ease-in";
    document.body.style.opacity = "1";
  }, 50);

  const form = document.getElementById("tennis-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      experience: formData.get("experience"),
      hours: formData.get("hours"),
      endurance: formData.get("endurance"),
      reflex: formData.get("reflex"),
      focus: formData.get("focus"),
      discipline: formData.get("discipline"),
      goal: formData.get("goal"),
    };

    document.getElementById("form-card").style.display = "none";
    const resultCard = document.getElementById("result-card");
    resultCard.style.display = "block";
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });

    document.getElementById("result-loading").style.display = "flex";
    document.getElementById("result-content").style.display = "none";

    try {
      const response = await fetch("/.netlify/functions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const formatted = formatAnalysis(result.result);

      document.getElementById("result-loading").style.display = "none";
      const resultContent = document.getElementById("result-content");
      resultContent.innerHTML = formatted;
      resultContent.style.display = "block";

    } catch (error) {
      document.getElementById("result-loading").style.display = "none";
      const resultContent = document.getElementById("result-content");
      resultContent.innerHTML = `<p class="error-msg">Something went wrong. Please try again.</p>`;
      resultContent.style.display = "block";
    }
  });
});

function formatAnalysis(text) {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(\d+\.\s+<strong>.*?<\/strong>)/gm, '<h3>$1</h3>')
    .split('\n')
    .map(line => {
      line = line.trim();
      if (!line) return '';
      if (line.startsWith('<h3>')) return line;
      if (line.startsWith('-')) return `<li>${line.substring(1).trim()}</li>`;
      return `<p>${line}</p>`;
    })
    .join('');
  html = html.replace(/(<li>.*?<\/li>)+/gs, match => `<ul>${match}</ul>`);
  return html;
}

function resetForm() {
  document.getElementById("result-card").style.display = "none";
  document.getElementById("form-card").style.display = "block";
  document.getElementById("tennis-form").reset();
  document.getElementById("form-section").scrollIntoView({ behavior: "smooth", block: "start" });
}