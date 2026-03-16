document.addEventListener("DOMContentLoaded", () => {
  /* ================================================= */
  /* 1. CONFIG & SELECTORS                             */
  /* ================================================= */
  const weddingDate = new Date("Mar 29, 2026 10:00:00").getTime();
  const body = document.body;
  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");
  const overlay = document.getElementById("opening-overlay");
  const btnOpen = document.getElementById("btn-open-invitation");
  const navbar = document.querySelector(".navbar");
  const scrollBtn = document.getElementById("scrollTop");
  const glow = document.querySelector(".cursor-glow");
  const contentSections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");

  // RSVP & QR Selectors
  const rsvpNamaInput = document.getElementById("nama");
  const guestElem = document.getElementById("guest-name");
  const qrTrigger = document.getElementById("qr-trigger");
  const qrModal = document.getElementById("qr-modal");
  const closeModal = document.querySelector(".close-modal");
  const qrInput = document.getElementById("qr-guest-name");
  const qrCanvas = document.getElementById("qrcode-canvas");
  const qrLinkText = document.getElementById("qr-link-text");
  const downloadBtn = document.getElementById("download-qr");
  const rsvpForm = document.getElementById("rsvpForm");
  const commentsContainer = document.getElementById("commentsContainer");
  const commentCount = document.getElementById("count");

  // URL Logic
  const urlParams = new URLSearchParams(window.location.search);
  const guestFromQR = urlParams.get("to");

  let isPlaying = false;
  let lastScrollY = window.scrollY;

  // Lock scroll awal
  body.classList.add("no-scroll");

  /* ================================================= */
  /* 2. AUTO-FILL DATA (Deteksi Scan QR)               */
  /* ================================================= */
  if (guestFromQR) {
    const decodedName = decodeURIComponent(guestFromQR.replace(/\+/g, " "));
    if (rsvpNamaInput) rsvpNamaInput.value = decodedName;
    if (guestElem) guestElem.innerText = decodedName;
  } else if (guestElem) {
    guestElem.innerText = "Tamu Undangan";
  } /* 3. OPENING LOGIC (Tanpa Auto-Scroll QR)           */ /* ================================================= */

  /* ================================================= */
  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      overlay.classList.add("fade-out");
      body.classList.remove("no-scroll"); // Play Music

      if (music) {
        music
          .play()
          .then(() => {
            isPlaying = true;
            if (musicBtn) musicBtn.innerHTML = "🎵";
          })
          .catch(() => console.log("Autoplay blocked"));
      } // --- LOGIKA AUTO-SCROLL DIHAPUS DARI SINI ---

      // User akan tetap berada di bagian atas (Home/Hero)
      // meskipun mereka datang dari scan QR.

      setTimeout(() => {
        overlay.style.display = "none";
      }, 1400);
    });
  }

  /* ================================================= */
  /* 4. DYNAMIC QR GENERATOR                           */
  /* ================================================= */
  if (qrCanvas && typeof QRCode !== "undefined") {
    let qrcodeInstance = new QRCode(qrCanvas, {
      width: 180,
      height: 180,
      colorDark: "#333333",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    qrInput.addEventListener("input", (e) => {
      const name = e.target.value.trim();
      if (name !== "") {
        const fullUrl = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(name)}`;
        qrcodeInstance.makeCode(fullUrl);
        if (qrLinkText) qrLinkText.innerText = fullUrl;
        if (downloadBtn) downloadBtn.style.display = "block";
      } else {
        if (downloadBtn) downloadBtn.style.display = "none";
      }
    });

    downloadBtn.addEventListener("click", () => {
      const img = qrCanvas.querySelector("img");
      if (img) {
        const link = document.createElement("a");
        link.href = img.src;
        link.download = `QR_Undangan_${qrInput.value}.png`;
        link.click();
      }
    });
  }

  // Modal Control
  if (qrTrigger)
    qrTrigger.addEventListener("click", () => {
      qrModal.style.display = "flex";
      body.style.overflow = "hidden";
    });

  const closeQRModal = () => {
    qrModal.style.display = "none";
    body.style.overflow = "auto";
  };

  if (closeModal) closeModal.addEventListener("click", closeQRModal);
  window.addEventListener("click", (e) => {
    if (e.target === qrModal) closeQRModal();
  });

  /* ================================================= */
  /* 5. SCROLL EFFECTS                                 */
  /* ================================================= */
  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;

    if (navbar) {
      navbar.style.transform =
        scrollY > lastScrollY && scrollY > 200
          ? "translateX(-50%) translateY(120px)"
          : "translateX(-50%) translateY(0)";
      navbar.style.opacity = scrollY > lastScrollY && scrollY > 200 ? "0" : "1";
    }
    lastScrollY = scrollY;

    if (scrollBtn) {
      scrollBtn.style.display = scrollY > 500 ? "flex" : "none";
    }

    contentSections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 300;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        const id = section.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      }
    });
  });

  if (scrollBtn)
    scrollBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );

  /* ================================================= */
  /* 6. COUNTDOWN & DECORATIONS                        */
  /* ================================================= */
  if (typeof AOS !== "undefined") AOS.init({ duration: 1000, once: true });

  const updateCountdown = () => {
    const daysEl = document.getElementById("days");
    if (!daysEl) return;
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance < 0) return;

    document.getElementById("days").innerText = Math.floor(
      distance / (1000 * 60 * 60 * 24),
    )
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").innerText = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").innerText = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60),
    )
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").innerText = Math.floor(
      (distance % (1000 * 60)) / 1000,
    )
      .toString()
      .padStart(2, "0");
  };
  setInterval(updateCountdown, 1000);

  // Glow effect
  if (glow) {
    let lastX = 0,
      lastY = 0;
    document.addEventListener("mousemove", (e) => {
      requestAnimationFrame(() => {
        glow.style.opacity = "1";
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });

      if (Math.hypot(e.clientX - lastX, e.clientY - lastY) > 25) {
        createFlower(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });
    document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
  }

  function createFlower(x, y) {
    const flower = document.createElement("div");
    flower.className = "cursor-flower";
    const size = Math.random() * 10 + 12;
    flower.style.width = flower.style.height = size + "px";
    flower.style.left = x + "px";
    flower.style.top = y + "px";
    document.body.appendChild(flower);
    setTimeout(() => flower.remove(), 1700);
  }

  /* ================================================= */
  /* 7. MAGNETIC CRYSTAL PARTICLES                     */
  /* ================================================= */
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const particles = [];
    const particleCount = 25;
    const canvasHeight = canvas.clientHeight || 600;

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement("div");
      el.className = "crystal";
      const size = Math.random() * 8 + 4;
      el.style.width = el.style.height = `${size}px`;

      let posX = Math.random() * window.innerWidth;
      let posY = Math.random() * canvasHeight;

      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;

      particles.push({
        el,
        x: posX,
        y: posY,
        baseX: posX,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * 360,
      });
      canvas.appendChild(el);
    }

    document.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      particles.forEach((p) => {
        const dx = mouseX - p.baseX;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const moveX = (dx / distance) * force * 60;
          const moveY = (dy / distance) * force * 60;
          p.el.style.transform = `translate(${-moveX}px, ${-moveY}px) rotate(${p.angle}deg) scale(1.5)`;
          p.el.style.opacity = "1";
          p.el.style.boxShadow = "0 0 15px rgba(248, 165, 194, 0.8)";
        } else {
          p.el.style.transform = `translate(0, 0) rotate(${p.angle}deg) scale(1)`;
          p.el.style.opacity = "0.4";
          p.el.style.boxShadow = "none";
        }
      });
    });

    function animateParticles() {
      const currentHeight = canvas.clientHeight || 600;
      particles.forEach((p) => {
        p.y -= p.speed;
        p.angle += 0.5;
        if (p.y < -20) p.y = currentHeight + 20;
        p.el.style.top = `${p.y}px`;
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
}); // Penutup DOMContentLoaded

/* ================================================= */
/* GLOBAL UTILS (Di Luar agar bisa diakses HTML)    */
/* ================================================= */
window.copyRek = function (id) {
  const el = document.getElementById(id);
  if (!el) return;
  const num = el.innerText.replace(/\D/g, "");
  navigator.clipboard
    .writeText(num)
    .then(() => alert("Nomor Rekening Disalin: " + num));
};
