const root = document.documentElement;
const themeBtn = document.querySelector("[data-theme-toggle]");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function themeColor() {
  return root.dataset.theme === "dark" ? "#0C0A09" : "#F5F5F4";
}

function setTheme(next) {
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
  if (themeMeta) themeMeta.setAttribute("content", themeColor());
  if (themeBtn) {
    themeBtn.setAttribute(
      "aria-label",
      next === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    themeBtn.innerHTML =
      next === "dark"
        ? '<i data-feather="sun"></i>'
        : '<i data-feather="moon"></i>';
    if (window.feather) {
      window.feather.replace({ width: 17, height: 17, "stroke-width": 1.7 });
    }
  }
}

if (window.feather) {
  window.feather.replace({ width: 17, height: 17, "stroke-width": 1.7 });
}

if (themeMeta) themeMeta.setAttribute("content", themeColor());
if (themeBtn) {
  setTheme(root.dataset.theme === "light" ? "light" : "dark");
  themeBtn.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

const greetEl = document.querySelector("[data-greet]");

function greetingFor(hour) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

function syncGreeting() {
  if (greetEl) greetEl.textContent = greetingFor(new Date().getHours());
}

if (greetEl) {
  syncGreeting();
  window.setInterval(syncGreeting, 60000);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (finePointer.matches && !reduceMotion.matches) {
  const glyphs = [
    "0",
    "1",
    "{",
    "}",
    "/",
    "=",
    "=>",
    "fn",
    "const",
    "let",
    "[]",
    "::",
    "#",
  ];

  const canvas = document.createElement("canvas");
  canvas.className = "code-field";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let mx = -400;
  let my = -400;
  let cx = mx;
  let cy = my;
  let active = false;
  const radius = 68;
  const count = 11;

  function spawn() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 16 + Math.random() * (radius - 16);
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.07,
      vy: (Math.random() - 0.5) * 0.07,
      text: glyphs[(Math.random() * glyphs.length) | 0],
      life: 0.7 + Math.random() * 0.3,
      size: 9 + Math.random() * 2,
    };
  }

  const particles = Array.from({ length: count }, spawn);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ink() {
    return root.dataset.theme === "light" ? "28, 25, 23" : "245, 245, 244";
  }

  function draw() {
    if (!active) {
      requestAnimationFrame(draw);
      return;
    }

    cx += (mx - cx) * 0.07;
    cy += (my - cy) * 0.07;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const rgb = ink();

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.0024;

      const away = Math.hypot(particle.x - cx, particle.y - cy);
      if (particle.life <= 0 || away > radius) {
        Object.assign(particle, spawn());
      } else if (Math.random() < 0.004) {
        particle.text = glyphs[(Math.random() * glyphs.length) | 0];
      }

      const alpha = Math.max(0, 1 - away / radius) * particle.life * 0.16;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${rgb})`;
      ctx.font = `${particle.size}px "Geist Mono", ui-monospace, monospace`;
      ctx.fillText(particle.text, particle.x, particle.y);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("pointermove", (event) => {
    mx = event.clientX;
    my = event.clientY;
    if (!active) {
      cx = mx;
      cy = my;
      active = true;
    }
  });
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}
