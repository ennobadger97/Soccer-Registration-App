/* =========================================================
   SETTINGS: the only two things you need to edit
   ========================================================= */
const CONFIG = {
  // Paste your Google Form link here. Use the full link that ends in /viewform
  // Example: "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform"
  FORM_URL: "https://forms.gle/kmSxVEYKpt35qyTw9",

  // Last day players can register (placeholder, change it)
  CLOSING_DATE: "2026-11-30T23:59:00+02:00",
};

/* =========================================================
   1. Mobile menu
   ========================================================= */
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after a link is tapped
nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

/* =========================================================
   2. Tournament filter (uses data-age on each card)
   ========================================================= */
const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".t-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.dataset.filter; // "all", "u15", "u17" or "u19"

    filterButtons.forEach((b) => b.classList.remove("is-active"));
    button.classList.add("is-active");

    cards.forEach((card) => {
      card.hidden = !(choice === "all" || card.dataset.age === choice);
    });
  });
});

/* =========================================================
   3. Days left until registration closes
   ========================================================= */
const daysLeftEl = document.getElementById("days-left");
const msPerDay = 1000 * 60 * 60 * 24;
const daysLeft = Math.ceil((new Date(CONFIG.CLOSING_DATE) - new Date()) / msPerDay);

if (daysLeft > 1) {
  daysLeftEl.textContent = `· ${daysLeft} days left`;
} else if (daysLeft === 1) {
  daysLeftEl.textContent = "· closes tomorrow";
} else if (daysLeft === 0) {
  daysLeftEl.textContent = "· closes today";
} else {
  daysLeftEl.textContent = "· check back for the next round";
}

/* =========================================================
   4. Player registration pop-up with the Google Form
   ========================================================= */
const dialog = document.getElementById("register-dialog");
const dialogBody = document.getElementById("dialog-body");
const newTabLink = document.getElementById("open-new-tab");

function openRegistration() {
  dialogBody.innerHTML = "";

  if (CONFIG.FORM_URL) {
    // "embedded=true" makes Google remove its page margins so it fits the pop-up
    const joiner = CONFIG.FORM_URL.includes("?") ? "&" : "?";
    const iframe = document.createElement("iframe");
    iframe.src = CONFIG.FORM_URL + joiner + "embedded=true";
    iframe.title = "Player registration form";
    iframe.loading = "lazy";
    dialogBody.appendChild(iframe);

    newTabLink.href = CONFIG.FORM_URL;
    newTabLink.hidden = false;
  } else {
    // Form not connected yet: show a short setup note instead of a blank box
    dialogBody.innerHTML = `
      <div class="setup-note">
        <p>The registration form is not connected yet.</p>
        <p>Open <code>script.js</code> and paste your Google Form link into <code>FORM_URL</code>.</p>
      </div>`;
    newTabLink.hidden = true;
  }

  dialog.showModal();
}

// Every button with the class "js-register" opens the pop-up
document.querySelectorAll(".js-register").forEach((btn) => {
  btn.addEventListener("click", openRegistration);
});

document.getElementById("close-dialog").addEventListener("click", () => dialog.close());

// Clicking the dark area outside the pop-up also closes it
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

// Remove the form when closed so it reloads fresh next time
dialog.addEventListener("close", () => { dialogBody.innerHTML = ""; });

/* =========================================================
   5. Footer year
   ========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();
