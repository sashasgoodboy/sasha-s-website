// --------------------
// Simple single-page screen router
// --------------------
const screens = {
  ask: document.getElementById("screen-ask"),
  no: document.getElementById("screen-no"),
  yes: document.getElementById("screen-yes"),
  g1: document.getElementById("screen-gift-1"),
  g2: document.getElementById("screen-gift-2"),
  g3: document.getElementById("screen-gift-3"),
};

function show(key){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[key].classList.add("active");

  // Render artistic QR when Gift 3 opens
  if (key === "g3") {
    ensureArtQR();
  }
}

// Buttons
document.getElementById("btn-yes").addEventListener("click", () => {
  heartExplosion();

  // delay screen change so hearts play
  setTimeout(() => {
    show("yes");
  }, 2000);
});

document.getElementById("btn-no").addEventListener("click", () => show("no"));
document.getElementById("btn-try-again").addEventListener("click", () => show("ask"));
document.getElementById("btn-back-ask").addEventListener("click", () => show("ask"));

document.querySelectorAll(".gift-card").forEach(btn => {
  btn.addEventListener("click", () => {
    const gift = btn.getAttribute("data-gift");
    show(gift === "1" ? "g1" : gift === "2" ? "g2" : "g3");
  });
});

document.querySelectorAll("[data-back='yes']").forEach(btn => {
  btn.addEventListener("click", () => show("yes"));
});

// Gift “next” buttons
document.getElementById("btn-gift1-next").addEventListener("click", () => show("g2"));
document.getElementById("btn-gift2-next").addEventListener("click", () => show("g3"));
document.getElementById("btn-restart").addEventListener("click", () => show("ask"));


// --------------------
// ONE SINGLE ARTISTIC, SCANNABLE QR (Instagram gradient style)
// --------------------
const DESTINATION_URL = "https://www.instagram.com/p/DTa9J-7EvbB/?igsh=MWMzY2x6MjE3ZzZk";

// Instagram logo as a data URI (no extra files)
const instagramLogoSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#FEDA75"/>
      <stop offset="0.25" stop-color="#FA7E1E"/>
      <stop offset="0.5" stop-color="#D62976"/>
      <stop offset="0.75" stop-color="#962FBF"/>
      <stop offset="1" stop-color="#4F5BD5"/>
    </linearGradient>
  </defs>
  <rect x="26" y="26" width="204" height="204" rx="54" fill="url(#ig)"/>
  <rect x="62" y="62" width="132" height="132" rx="42" fill="none" stroke="#fff" stroke-width="18"/>
  <circle cx="128" cy="128" r="34" fill="none" stroke="#fff" stroke-width="18"/>
  <circle cx="182" cy="74" r="10" fill="#fff"/>
</svg>
`.trim();

function svgToDataUri(svgText) {
  const encoded = encodeURIComponent(svgText)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}

let artQRMounted = false;

function ensureArtQR(){
  if (artQRMounted) return;

  const target = document.getElementById("art-qr");
  if (!target) return;

  target.innerHTML = "";
  const size = Math.min(target.clientWidth || 280, target.clientHeight || 280, 280);

  const artQR = new QRCodeStyling({
    width: size,
    height: size,
    type: "svg",
    data: DESTINATION_URL,
    margin: 6,
    qrOptions: { errorCorrectionLevel: "H" },

    dotsOptions: {
      type: "rounded",
      gradient: {
        type: "linear",
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: "#FEDA75" },
          { offset: 0.25, color: "#FA7E1E" },
          { offset: 0.50, color: "#D62976" },
          { offset: 0.75, color: "#962FBF" },
          { offset: 1, color: "#4F5BD5" }
        ]
      }
    },

    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#D62976"
    },
    cornersDotOptions: {
      type: "dot",
      color: "#FA7E1E"
    },

    backgroundOptions: { color: "transparent" },

    image: svgToDataUri(instagramLogoSVG),
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.28,
      margin: 6,
      crossOrigin: "anonymous"
    }
  });

  artQR.append(target);
  artQRMounted = true;

  // Clickable QR too
  const frame = target.closest(".art-qr-frame");
  if (frame) {
    frame.style.cursor = "pointer";
    frame.addEventListener("click", () => {
      window.open(DESTINATION_URL, "_blank", "noopener,noreferrer");
    }, { once: true });
  }
}
function heartExplosion(){
  const container = document.getElementById("heart-burst");
  if (!container) return;

  container.innerHTML = "";

  const HEART_COUNT = 40; // "hella" but not laggy

  for(let i = 0; i < HEART_COUNT; i++){
    const heart = document.createElement("div");
    heart.className = "burst-heart";

    // random start near center
    heart.style.left = "50%";
    heart.style.top = "50%";

    // random flight direction
    const x = (Math.random() - 0.5) * 800 + "px";
    const y = (Math.random() - 0.5) * 600 + "px";

    heart.style.setProperty("--x", x);
    heart.style.setProperty("--y", y);

    // slight random delay
    heart.style.animationDelay = (Math.random() * 0.2) + "s";

    container.appendChild(heart);
  }

  // cleanup after animation
  setTimeout(() => {
    container.innerHTML = "";
  }, 2200);
}

// If user refreshes while on gift 3
ensureArtQR();
