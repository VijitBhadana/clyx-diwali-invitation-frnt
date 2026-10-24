// This site has no service worker. Browsers that still have one registered on this origin
// (left over from another app on the same localhost port) fetch this file on update —
// it replaces the stale worker, clears its caches, unregisters itself and reloads open tabs.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const tabs = await self.clients.matchAll({ type: "window" });
      tabs.forEach((tab) => tab.navigate(tab.url));
    })(),
  );
});
