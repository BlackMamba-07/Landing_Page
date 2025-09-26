(function () {
  const pad2 = (n) => String(n).padStart(2, "0");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const yearEl = document.getElementById("year");
  yearEl.textContent = new Date().getFullYear();

  // Configuration de la date (YYYY, M-1, D, h, m) Mois/ Jours/ Heures/ Minutes/ Secondes
  const launchDate = new Date(new Date().getFullYear(), 9, 11, 12, 0, 0); // 27 sept à 12:00

  function updateTimer() {
    const now = new Date();
    let diff = launchDate.getTime() - now.getTime();

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    daysEl.textContent = pad2(days);
    hoursEl.textContent = pad2(hours);
    minutesEl.textContent = pad2(minutes);
    secondsEl.textContent = pad2(secs);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();
