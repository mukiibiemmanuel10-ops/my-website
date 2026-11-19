/* ============================================
   AUNT TINA RESTAURANT — MAIN SCRIPT
   ============================================ */

(function () {
  "use strict";

  /* ---------- 1. STICKY HEADER SHADOW ---------- */
  const header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. MOBILE NAV TOGGLE ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3. BOOKING DATE ---------- */
  const bookingDate = document.querySelector("#b-date");

  if (bookingDate) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    bookingDate.min = `${today.getFullYear()}-${month}-${day}`;
  }

  /* ---------- 4. WHATSAPP FORMS ---------- */
  const recordsEndpoint = "";
  const whatsappNumber = "256744321693";

  document.querySelectorAll("form[data-whatsapp-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const details = Array.from(form.elements)
        .filter((field) => field.name && typeof field.value === "string" && field.value.trim())
        .map((field) => {
          const label = field.labels && field.labels[0]
            ? field.labels[0].textContent.trim()
            : field.name;
          return `${label}: ${field.value.trim()}`;
        });
      const message = [
        `Hello Aunt Tina Restaurant, here are my ${form.dataset.whatsappForm} details:`,
        "",
        ...details,
      ].join("\n");
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      if (recordsEndpoint) {
        const submission = document.createElement("form");
        submission.method = "post";
        submission.action = recordsEndpoint;
        submission.target = "_blank";
        submission.rel = "noopener";

        const fields = Array.from(form.elements)
          .filter((field) => field.name && typeof field.value === "string");
        fields.push({ name: "requestType", value: form.dataset.whatsappForm });
        fields.push({ name: "website", value: "" });

        fields.forEach((field) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = field.name;
          input.value = field.value;
          submission.appendChild(input);
        });

        document.body.appendChild(submission);
        submission.submit();
        submission.remove();
        return;
      }

      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  /* ---------- 5. SCROLL-TRIGGERED REVEALS ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 6. SMOOTH ANCHOR SCROLL (fallback) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ---------- 7. YEAR AUTO-FILL ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();