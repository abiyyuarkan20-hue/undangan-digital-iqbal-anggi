/* ================================================= */
/* CORE SYSTEM & CONFIGURATION                       */
/* ================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }

  /* --- 2. CONFIG & SELECTORS --- */
  const weddingDate = new Date("Mar 29, 2026 10:00:00").getTime();
  const body = document.body;
  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");
  const overlay = document.getElementById("opening-overlay");
  const btnOpen = document.getElementById("btn-open-invitation");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".navbar a");
  const contentSections = document.querySelectorAll("section[id]");
  const scrollBtn = document.getElementById("scrollTop");
  const glow = document.querySelector(".cursor-glow"); // Perbaikan: Ambil selector glow di sini

  let isPlaying = false;
  let lastScrollY = window.scrollY;

  // Lock scroll pada awal load
  body.classList.add("no-scroll");

  /* ================================================= */
  /* 1. OPENING & MUSIC LOGIC                          */
  /* ================================================= */

  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      overlay.classList.add("fade-out");
      body.classList.remove("no-scroll");

      if (music) {
        music
          .play()
          .then(() => {
            isPlaying = true;
            if (musicBtn) musicBtn.innerHTML = "🎵";
          })
          .catch((err) => console.log("Autoplay diblokir: ", err));
      }

      setTimeout(() => {
        overlay.style.display = "none";
      }, 1400);
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (isPlaying) {
        music.pause();
        musicBtn.innerHTML = "🔇";
      } else {
        music.play();
        musicBtn.innerHTML = "🎵";
      }
      isPlaying = !isPlaying;
    });
  }

  /* ================================================= */
  /* 2. CURSOR GLOW & FLOWER PARTICLES                 */
  /* ================================================= */

  if (glow) {
    let lastX = 0;
    let lastY = 0;
    let distanceThreshold = 20; // Bunga hanya muncul jika kursor gerak sejauh 20px

    document.addEventListener("mousemove", (e) => {
      // 1. Logika Glow (Kode lama Anda)
      requestAnimationFrame(() => {
        glow.style.opacity = "1";
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });

      // 2. Logika Efek Bunga (Baru)
      let distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);

      if (distance > distanceThreshold) {
        createFlower(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    document.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });
  }

  // Fungsi untuk membuat elemen bunga dengan durasi lebih puitis
  function createFlower(x, y) {
    const flower = document.createElement("div");
    flower.className = "cursor-flower";

    // Ukuran acak agar terlihat alami (organic look)
    const sizeValue = Math.random() * 10 + 12;
    flower.style.width = sizeValue + "px";
    flower.style.height = sizeValue + "px";

    // Posisi awal tepat di kursor (titik akar)
    flower.style.left = x + "px";
    flower.style.top = y + "px";

    document.body.appendChild(flower);

    // Waktu penghapusan disesuaikan menjadi 1.5 detik
    // agar sinkron dengan animasi CSS yang lebih lambat
    setTimeout(() => {
      flower.remove();
    }, 1700);
  }

  /* ================================================= */
  /* 3. MAGNETIC CRYSTAL PARTICLES (FIXED MAGNET)      */
  /* ================================================= */
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const particles = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement("div");
      el.className = "crystal";
      const size = Math.random() * 12 + 4;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      let posX = Math.random() * window.innerWidth;
      let posY = Math.random() * (canvas.offsetHeight || 800);

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
          const moveX = (dx / distance) * force * 50;
          const moveY = (dy / distance) * force * 50;

          p.el.style.transform = `translate(${-moveX}px, ${-moveY}px) rotate(${p.angle}deg) scale(1.3)`;
          p.el.style.boxShadow = "0 0 20px rgba(248, 165, 194, 0.6)";
          p.el.style.opacity = "1";
        } else {
          p.el.style.transform = `translate(0, 0) rotate(${p.angle}deg) scale(1)`;
          p.el.style.boxShadow = "none";
          p.el.style.opacity = "0.4";
        }
      });
    });

    function animateParticles() {
      particles.forEach((p) => {
        p.y -= p.speed;
        p.angle += 0.3;
        if (p.y < -20) {
          p.y = canvas.offsetHeight + 20;
        }
        p.el.style.top = `${p.y}px`;
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ================================================= */
  /* 4. NAVBAR & ACTIVE STATE & SCROLL LOGIC           */
  /* ================================================= */
  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;

    // Show/Hide Navbar
    if (navbar) {
      if (scrollY > lastScrollY && scrollY > 200) {
        navbar.style.transform = "translateX(-50%) translateY(120px)";
        navbar.style.opacity = "0";
      } else {
        navbar.style.transform = "translateX(-50%) translateY(0)";
        navbar.style.opacity = "1";
      }
    }
    lastScrollY = scrollY;

    // Scroll Top Button
    if (scrollBtn) {
      if (scrollY > 500) {
        scrollBtn.classList.add("show");
        scrollBtn.style.display = "flex";
      } else {
        scrollBtn.classList.remove("show");
        scrollBtn.style.display = "none";
      }
    }

    // Nav Active State
    contentSections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 300;
      const id = section.getAttribute("id");
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`)
            link.classList.add("active");
        });
      }
    });
  });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ================================================= */
  /* 5. COUNTDOWN SYSTEM                               */
  /* ================================================= */
  const updateCountdown = () => {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");

    if (!daysEl) return;

    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      const timer = document.getElementById("countdown-timer");
      if (timer) timer.innerHTML = "<h3>Acara Sedang Berlangsung!</h3>";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = d.toString().padStart(2, "0");
    hoursEl.innerText = h.toString().padStart(2, "0");
    minsEl.innerText = m.toString().padStart(2, "0");
    secsEl.innerText = s.toString().padStart(2, "0");
  };

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ================================================= */
  /* 6. FUNGSI GUEST NAME (URL PARAMETER)              */
  /* ================================================= */
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");
  const guestElem = document.getElementById("guest-name");

  if (guestElem) {
    if (guestName) {
      guestElem.innerText = decodeURIComponent(guestName.replace(/\+/g, " "));
    } else {
      guestElem.innerText = "Tamu Undangan";
    }
  }

  /* ================================================= */
  /* 7. FLOATING ACTIONS & MODAL LOGIC                 */
  /* ================================================= */
  const qrTrigger = document.getElementById("qr-trigger");
  const qrModal = document.getElementById("qr-modal");
  const closeModal = document.querySelector(".close-modal");

  const openQR = () => {
    if (qrModal) {
      qrModal.style.display = "flex";
      body.style.overflow = "hidden";
    }
  };

  const closeQR = () => {
    if (qrModal) {
      qrModal.style.display = "none";
      body.style.overflow = "auto";
    }
  };

  if (qrTrigger) qrTrigger.addEventListener("click", openQR);
  if (closeModal) closeModal.addEventListener("click", closeQR);

  window.addEventListener("click", (e) => {
    if (e.target === qrModal) closeQR();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && qrModal && qrModal.style.display === "flex")
      closeQR();
  });

  // Animasi Klik Tombol (Feedback)
  const allButtons = document.querySelectorAll(".btn-float");
  allButtons.forEach((btn) => {
    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.9)";
    });
    btn.addEventListener("mouseup", () => {
      btn.style.transform = "";
    });
  });
});

/* ================================================= */
/* GLOBAL FUNCTIONS (Dapat diakses via HTML)         */
/* ================================================= */

window.copyRek = function (id) {
  const el = document.getElementById(id);
  if (!el) return;
  const num = el.innerText.replace(/\D/g, "");
  navigator.clipboard.writeText(num).then(() => {
    alert("Nomor Rekening Disalin: " + num);
  });
};

window.copyText = function (text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Berhasil disalin: " + text);
    })
    .catch((err) => {
      console.error("Gagal menyalin: ", err);
    });
};

/* --- FLOWERS EFFECT --- */
const flowerContainer = document.querySelector(".flower-container");
if (flowerContainer) {
  function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    petal.style.left = Math.random() * 100 + "vw";
    const duration = Math.random() * 6 + 6;
    petal.style.animationDuration = duration + "s";
    const size = Math.random() * 10 + 10 + "px";
    petal.style.width = size;
    petal.style.height = size;
    flowerContainer.appendChild(petal);
    setTimeout(() => {
      petal.remove();
    }, duration * 1000);
  }
  setInterval(createPetal, 500);
}
