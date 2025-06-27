// INVERTAX - Service Worker para funcionalidad PWA
const CACHE_NAME = 'invertax-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './FiscalEngine.js',
  './manifest.json',
  './monteCarlo-worker.js',
  './offline.html',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Evento de instalación: precarga de assets críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto correctamente');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch((error) => {
        console.error('Error en cache precarga:', error);
      })
  );
});

// Estrategia Cache-First con fallback a network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el recurso está en cache, lo devolvemos
        if (response) {
          return response;
        }
        
        // Si no está en cache, lo buscamos en la red
        return fetch(event.request)
          .then((networkResponse) => {
            // Si la red responde correctamente, guardamos en cache
            if (networkResponse && networkResponse.status === 200) {
              // Importante: clonar la respuesta porque solo se puede usar una vez
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch(() => {
            // Si la red falla y es una solicitud de documento HTML, servimos la página offline
            if (event.request.headers.get('Accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Evento de activación: limpieza de caches antiguas
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              // Eliminamos caches antiguas
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

// Gestión de sincronización en segundo plano (para guardar simulaciones offline)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-simulaciones') {
    event.waitUntil(syncSimulaciones());
  }
});

// Función para sincronizar simulaciones guardadas offline
async function syncSimulaciones() {
  try {
    // Recuperar simulaciones pendientes del IndexedDB
    const db = await openDatabase();
    const pendingSimulations = await getPendingSimulations(db);
    
    if (pendingSimulations.length === 0) {
      return;
    }
    
    // Enviar simulaciones al servidor cuando hay conexión
    for (const simulation of pendingSimulations) {
      try {
        // Aquí iría la lógica para enviar al backend
        // const response = await fetch('/api/simulaciones', {...});
        
        // Si se envió correctamente, marcar como sincronizada
        await markAsSynced(db, simulation.id);
      } catch (error) {
        console.error('Error sincronizando simulación:', error);
      }
    }
  } catch (error) {
    console.error('Error general en sincronización:', error);
  }
}

// Funciones auxiliares para la base de datos IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('invertaxDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('simulaciones')) {
        db.createObjectStore('simulaciones', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function getPendingSimulations(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('simulaciones', 'readonly');
    const store = transaction.objectStore('simulaciones');
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result.filter(sim => !sim.synced));
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

function markAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('simulaciones', 'readwrite');
    const store = transaction.objectStore('simulaciones');
    const request = store.get(id);
    
    request.onsuccess = () => {
      const simulation = request.result;
      simulation.synced = true;
      const updateRequest = store.put(simulation);
      
      updateRequest.onsuccess = () => {
        resolve();
      };
      
      updateRequest.onerror = () => {
        reject(updateRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}