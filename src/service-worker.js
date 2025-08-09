/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
