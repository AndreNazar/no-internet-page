"use strict";

const CACHE_NAME = 'v1';
self.addEventListener('install', (e) => {
    self.skipWaiting()
    e.waitUntil(
        fetch('./manifest.json')
            .then(r => r.json())
            .then(manifest => {
                const assets = [
                    "./index.html",
                    "./icon.png",
                    "./droid_sans_mono_regular.typeface.json",
                    `./${manifest['index.html'].file}`,
                    ...manifest['index.html'].css.map(f => `./${f}`)
                ]
                return caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(assets))
            })
    )
})

self.addEventListener("activate", (e) => {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(keys => {
                Promise.all(keys
                    .filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k)))
            })
        ])
    )
})
self.addEventListener('fetch', (event) => {
    
  if (event.request.method !== 'GET') return
  
    
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached

      return fetch(event.request).then(response => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy)
        })
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html')
        }
      })
    })
  )
})