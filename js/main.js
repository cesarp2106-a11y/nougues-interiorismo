/* ============================================================
   Configuración — completá estos datos antes de publicar.
   WHATSAPP: número con código de país y sin "+" ni espacios.
             Ejemplo Tucumán: "5493815551234"
   INSTAGRAM: URL completa del perfil. Ejemplo: "https://instagram.com/usuario"
   ============================================================ */
const CONFIG = {
  WHATSAPP: "5493816588767",
  INSTAGRAM: "https://instagram.com/nouguesinteriorismo"
};

(function () {
  "use strict";

  /* Año del pie */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Header con sombra al hacer scroll */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menú móvil */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const closeNav = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

  /* Revelado al hacer scroll */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  /* Carrusel de ejemplo */
  const carousel = document.getElementById("carousel");
  if (carousel) {
    const slides = carousel.querySelectorAll(".slide");
    const dots = document.getElementById("carDots");
    const prev = document.getElementById("carPrev");
    const next = document.getElementById("carNext");
    let current = 0;

    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "dot";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Ir a la diapositiva " + (i + 1));
      d.addEventListener("click", () => goTo(i));
      dots.appendChild(d);
    });

    const paint = () => {
      dots.querySelectorAll(".dot").forEach((d, i) => d.setAttribute("aria-selected", String(i === current)));
    };
    const goTo = (i) => {
      current = (i + slides.length) % slides.length;
      carousel.scrollTo({ left: carousel.clientWidth * current, behavior: "smooth" });
      paint();
    };
    carousel.addEventListener("scroll", () => {
      const i = Math.round(carousel.scrollLeft / carousel.clientWidth);
      if (i !== current) { current = i; paint(); }
    }, { passive: true });
    prev.addEventListener("click", () => goTo(current - 1));
    next.addEventListener("click", () => goTo(current + 1));
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    });
    paint();
  }

  /* Instagram (solo si está configurado) */
  if (CONFIG.INSTAGRAM) {
    const handle = "@" + CONFIG.INSTAGRAM.replace(/\/+$/, "").split("/").pop();
    document.querySelectorAll("[data-ig]").forEach((el) => {
      if (el.tagName === "A") el.href = CONFIG.INSTAGRAM;
      if (el.hasAttribute("data-ig-handle")) el.textContent = handle;
      el.hidden = false;
    });
  }

  /* Formulario → WhatsApp */
  const form = document.getElementById("contactForm");
  const nombre = document.getElementById("nombre");
  const nombreError = document.getElementById("nombreError");
  const hint = document.getElementById("formHint");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nombre.value.trim();
    if (!name) {
      nombre.setAttribute("aria-invalid", "true");
      nombreError.textContent = "Contanos tu nombre para poder responderte.";
      nombre.focus();
      return;
    }
    nombre.removeAttribute("aria-invalid");
    nombreError.textContent = "";

    const espacio = form.espacio.value;
    const modalidad = form.modalidad.value;
    const extra = form.mensaje.value.trim();

    let text = "Hola! Soy " + name + " y quiero consultar por la Asesoría Express Alquileres.\n" +
      "Espacio a renovar: " + espacio + "\n" +
      "Modalidad: " + modalidad;
    if (extra) text += "\n\n" + extra;

    const base = CONFIG.WHATSAPP ? "https://wa.me/" + CONFIG.WHATSAPP : "https://wa.me/";
    window.open(base + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    hint.textContent = "Listo, se abrió WhatsApp con tu mensaje. ¡Gracias por escribirnos!";
  });
  nombre.addEventListener("input", () => {
    if (nombre.value.trim()) {
      nombre.removeAttribute("aria-invalid");
      nombreError.textContent = "";
    }
  });
})();
