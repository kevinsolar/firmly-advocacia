(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-nav");

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
    mobileMenu.hidden = !willOpen;
    document.body.classList.toggle("menu-open", willOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const teamCards = [...document.querySelectorAll(".team-card")];
  const activateTeamCard = (card) => {
    teamCards.forEach((item) => {
      const active = item === card;
      item.classList.toggle("active", active);
      item.setAttribute("aria-expanded", String(active));
    });
    if (window.innerWidth <= 680) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  teamCards.forEach((card, index) => {
    card.addEventListener("click", () => activateTeamCard(card));
    card.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % teamCards.length;
      if (event.key === "ArrowLeft") next = (index - 1 + teamCards.length) % teamCards.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = teamCards.length - 1;
      activateTeamCard(teamCards[next]);
      teamCards[next].focus();
    });
  });

  const testimonials = [...document.querySelectorAll(".testimonial-card")];
  let testimonialStart = 0;
  const renderTestimonials = () => {
    const visibleCount = window.innerWidth <= 680 ? testimonials.length : Math.min(2, testimonials.length);
    testimonials.forEach((card, index) => {
      const relative = (index - testimonialStart + testimonials.length) % testimonials.length;
      card.classList.toggle("active", relative < visibleCount);
    });
  };

  document.querySelectorAll(".testimonial-controls button").forEach((button) => {
    button.addEventListener("click", () => {
      testimonialStart = button.dataset.direction === "next"
        ? (testimonialStart + 1) % testimonials.length
        : (testimonialStart - 1 + testimonials.length) % testimonials.length;
      renderTestimonials();
    });
  });

  const form = document.querySelector(".contact-form");
  const email = document.querySelector("#email");
  const emailError = document.querySelector("#email-error");
  const status = document.querySelector(".form-status");

  const validateEmail = () => {
    const valid = email.validity.valid;
    email.setAttribute("aria-invalid", String(!valid));
    emailError.textContent = valid ? "" : "Informe um e-mail válido para continuar.";
    return valid;
  };

  email?.addEventListener("blur", validateEmail);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateEmail()) {
      status.textContent = "Revise o campo indicado.";
      email.focus();
      return;
    }
    status.textContent = "Demonstração: e-mail validado. Nenhum dado foi enviado.";
    form.reset();
    email.removeAttribute("aria-invalid");
  });

  renderTestimonials();
})();
