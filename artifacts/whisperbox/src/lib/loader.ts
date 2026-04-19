let removed = false;

export function removeLoader() {
  if (removed) return;
  removed = true;
  const loader = document.getElementById("app-loader");
  if (!loader) return;
  loader.classList.add("fade-out");
  setTimeout(() => loader.remove(), 450);
}
