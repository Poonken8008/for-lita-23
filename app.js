/* Love page for Lita. All paths are relative so this works from any subpath. */

const PASSCODE = "23";

const SPOTIFY_TRACK_ID = "6jgkEbmQ2F2onEqsEhiliL";

// Add more photos here later (files go in the photos/ folder).
const PHOTOS = [
  "photos/01.jpg",
  "photos/02.jpg",
  "photos/03.jpg",
  "photos/04.jpg",
  "photos/05.jpg",
  "photos/06.jpg",
  "photos/07.jpg",
  "photos/08.jpg",
  "photos/09.jpg",
  "photos/10.jpg",
  "photos/11.jpg",
  "photos/12.jpg",
  "photos/13.jpg",
  "photos/14.jpg",
  "photos/15.jpg",
  "photos/16.jpg",
  "photos/17.jpg",
  "photos/18.jpg",
  "photos/19.jpg",
  "photos/20.jpg",
  "photos/21.jpg",
  "photos/22.jpg",
  "photos/23.jpg",
  "photos/24.jpg",
  "photos/25.jpg",
  "photos/26.jpg",
  "photos/27.jpg",
  "photos/28.jpg",
  "photos/29.jpg",
  "photos/30.jpg",
  "photos/31.jpg",
  "photos/32.jpg",
  "photos/33.jpg",
];

const TITLE_COLORS = ["#ff6b8a", "#ff9f43", "#f6d04a", "#8fd9a8", "#8ec6f0", "#d7a8e8", "#ff8fab"];

/* ---------- screens ---------- */
function showScreen(name) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.toggle("active", el.dataset.screen === name);
  });
  if (name === "letter") openLetter();
  if (name !== "letter") resetLetter();
  closeLightbox();
  window.scrollTo(0, 0);
  const active = document.querySelector(".screen.active");
  if (active) active.scrollTop = 0;
}

document.querySelectorAll("[data-go]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    showScreen(btn.dataset.go);
  });
});

/* ---------- colorful titles ---------- */
function paintLetters(container, text) {
  if (!container) return;
  container.innerHTML = "";
  let colorI = 0;
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "chr";
    span.textContent = ch === " " ? "\u00a0" : ch;
    if (ch.trim()) {
      span.style.color = TITLE_COLORS[colorI % TITLE_COLORS.length];
      span.style.transform = `rotate(${((i % 5) - 2) * 3}deg)`;
      colorI += 1;
    }
    container.appendChild(span);
  });
}

paintLetters(document.getElementById("title-line-1"), "Just because,");
paintLetters(document.getElementById("title-line-2"), "baby ♡");
paintLetters(document.getElementById("mem-title"), "Memories");

/* ---------- passcode ---------- */
let entered = "";
const boxes = [document.getElementById("digit-0"), document.getElementById("digit-1")];
const passBoxes = document.getElementById("pass-boxes");

function renderCode() {
  boxes.forEach((box, i) => {
    box.textContent = entered[i] ? entered[i] : "";
  });
}

function checkCode() {
  if (entered === PASSCODE) {
    entered = "";
    renderCode();
    showScreen("psst");
    return;
  }
  passBoxes.classList.remove("shake");
  void passBoxes.offsetWidth;
  passBoxes.classList.add("shake");
  setTimeout(() => {
    entered = "";
    renderCode();
    passBoxes.classList.remove("shake");
  }, 420);
}

document.getElementById("keypad").addEventListener("click", (e) => {
  const key = e.target.closest("[data-key]");
  if (!key) return;
  const k = key.dataset.key;
  if (k === "back") {
    entered = entered.slice(0, -1);
    renderCode();
    return;
  }
  if (k === "ok") {
    if (entered.length) checkCode();
    return;
  }
  if (entered.length >= PASSCODE.length) return;
  entered += k;
  renderCode();
  if (entered.length === PASSCODE.length) {
    setTimeout(checkCode, 180);
  }
});

/* ---------- runaway No button ---------- */
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
let fleeCount = 0;
let noIsYes = false;

function goYes() {
  showScreen("title");
}

btnYes.addEventListener("click", goYes);

function flee(ev) {
  if (noIsYes) return;
  ev.preventDefault();
  ev.stopPropagation();
  const app = document.getElementById("app");
  const appRect = app.getBoundingClientRect();
  const btnW = btnNo.offsetWidth || 108;
  const btnH = btnNo.offsetHeight || 48;
  const pad = 16;
  const minX = appRect.left + pad;
  const maxX = appRect.right - btnW - pad;
  const minY = appRect.top + 80;
  const maxY = appRect.bottom - btnH - 70;
  const pointerX = ev.clientX ?? (ev.touches && ev.touches[0].clientX) ?? 0;
  const pointerY = ev.clientY ?? (ev.touches && ev.touches[0].clientY) ?? 0;

  let x, y, tries = 0;
  do {
    x = minX + Math.random() * Math.max(8, maxX - minX);
    y = minY + Math.random() * Math.max(8, maxY - minY);
    tries += 1;
  } while (Math.hypot(x - pointerX, y - pointerY) < 120 && tries < 16);

  btnNo.style.position = "fixed";
  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;
  btnNo.style.zIndex = "30";

  fleeCount += 1;
  if (fleeCount >= 5) {
    becomeYes();
  }
}

function becomeYes() {
  noIsYes = true;
  btnNo.textContent = "Yes ♡";
  btnNo.classList.add("is-yes");
  btnNo.style.position = "";
  btnNo.style.left = "";
  btnNo.style.top = "";
  btnNo.removeEventListener("pointerdown", flee);
  btnNo.removeEventListener("pointerenter", flee);
  btnNo.addEventListener("click", goYes);
}

btnNo.addEventListener("pointerdown", flee);
btnNo.addEventListener("pointerenter", flee);
btnNo.addEventListener("click", (e) => {
  if (!noIsYes) {
    e.preventDefault();
    e.stopPropagation();
  }
});

/* ---------- title tap ---------- */
document.getElementById("screen-title").addEventListener("click", (e) => {
  if (e.target.closest(".back-btn")) return;
  showScreen("items");
});

/* ---------- memories gallery ---------- */
const grid = document.getElementById("polaroid-grid");
PHOTOS.forEach((src, i) => {
  const fig = document.createElement("figure");
  fig.className = "polaroid";
  fig.dataset.index = String(i);
  const img = document.createElement("img");
  img.src = src;
  img.alt = `Memory ${i + 1}`;
  img.loading = "lazy";
  fig.appendChild(img);
  fig.addEventListener("click", () => openLightbox(i));
  grid.appendChild(fig);
});

/* ---------- lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCount = document.getElementById("lb-count");
let lbIndex = 0;
let touchStartX = 0;

function openLightbox(i) {
  lbIndex = i;
  updateLightbox();
  lightbox.hidden = false;
  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.hidden = true;
}

function updateLightbox() {
  lbImg.src = PHOTOS[lbIndex];
  lbImg.alt = `Memory ${lbIndex + 1} of ${PHOTOS.length}`;
  lbCount.textContent = `${lbIndex + 1} / ${PHOTOS.length}`;
}

function lbStep(dir) {
  lbIndex = (lbIndex + dir + PHOTOS.length) % PHOTOS.length;
  updateLightbox();
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", () => lbStep(-1));
document.getElementById("lb-next").addEventListener("click", () => lbStep(1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lbStep(-1);
  if (e.key === "ArrowRight") lbStep(1);
});

lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) lbStep(dx < 0 ? 1 : -1);
}, { passive: true });

/* ---------- letter animation ---------- */
function openLetter() {
  const env = document.getElementById("envelope");
  const paper = document.getElementById("letter-paper");
  env.classList.remove("open", "tucked");
  paper.classList.remove("show");
  requestAnimationFrame(() => {
    setTimeout(() => env.classList.add("open"), 250);
    setTimeout(() => {
      paper.classList.add("show");
      env.classList.add("tucked");
    }, 900);
  });
}

function resetLetter() {
  const env = document.getElementById("envelope");
  const paper = document.getElementById("letter-paper");
  if (env) env.classList.remove("open", "tucked");
  if (paper) paper.classList.remove("show");
}

/* ---------- floating hearts ---------- */
(function spawnHearts() {
  const layer = document.querySelector(".heart-layer");
  const glyphs = ["♡", "♥", "♡", "♥"];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement("span");
    el.className = "float-heart";
    el.textContent = glyphs[i % glyphs.length];
    el.style.left = `${Math.random() * 92}%`;
    el.style.fontSize = `${12 + Math.random() * 16}px`;
    el.style.animationDuration = `${9 + Math.random() * 11}s`;
    el.style.animationDelay = `${-Math.random() * 12}s`;
    el.style.color = i % 2 === 0 ? "#e89ad4" : "#f2a0c4";
    layer.appendChild(el);
  }
})();
