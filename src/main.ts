import type { ContentConfig } from "./model/content-config";
import type { Trip } from "./model/trip";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/** Fetch JSON with relative path so subfolder hosting works. */
async function loadConfig(): Promise<ContentConfig> {
  const res = await fetch("./content.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load content.json: ${res.status}`);
  return res.json();
}

/** Helper to create a card element for a trip */
function createTripCard(trip: Trip): HTMLElement {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-lg-4";

  // Choose button style based on status
  const isReady = trip.status !== "wip";
  const btnClass = isReady ? "btn btn-accent" : "btn btn-outline-secondary";
  const btnText  = isReady ? "Los geht’s" : "Bald verfügbar";

  col.innerHTML = `
    <article class="card h-100 shadow-sm">
      <img class="card-img-top" src="${trip.thumb}" alt="${escapeHtml(trip.title)}" />
      <div class="card-body">
        <h3 class="h5 card-title mb-1">${escapeHtml(trip.title)}</h3>
        <p class="card-text text-muted mb-3">${escapeHtml(trip.description)}</p>
        <a href="${trip.path}" class="${btnClass}">${btnText}</a>
      </div>
    </article>
  `;
  return col;
}

/** Very small HTML escaper to keep things safe */
function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Wire the grid and CTA */
function renderTrips(config: ContentConfig) {
  // featured first, then the rest
  const trips = [...config.trips].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  // Header CTA "Zu Aki" and "Öffne Aki" use the first featured or slug "aki"
  const aki = trips.find(t => t.slug === "aki") ?? trips.find(t => t.featured) ?? trips[0];
  const toAkiBtn = document.getElementById("toAkiBtn");
  const openAki = document.getElementById("openAki");
  if (aki) {
    if (toAkiBtn) toAkiBtn.setAttribute("href", aki.path);
    if (openAki) openAki.setAttribute("href", aki.path);
  }

  // Now render cards if grid exists
  const grid = document.getElementById("tripGrid");
  if (!grid) return;

  for (const trip of trips) {
    grid.appendChild(createTripCard(trip));
  }
}

/** Main bootstrap */
(async () => {
  try {
    const config = await loadConfig();
    renderTrips(config);
  } catch (err) {
    // Minimal inline error notice
    const grid = document.getElementById("tripGrid");
    if (grid) {
      const alert = document.createElement("div");
      alert.className = "alert alert-warning";
      alert.textContent = `Konnte content.json nicht laden. ${String(err)}`;
      grid.appendChild(alert);
    }
    // In dev, also log to console
    console.error(err);
  }
})();