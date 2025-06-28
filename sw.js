// INVERTAX - Service Worker Avanzado para PWA
const CACHE_NAME = 'invertax-cache-v2.0';
const STATIC_CACHE = 'invertax-static-v2.0';
const DYNAMIC_CACHE = 'invertax-dynamic-v2.0';

// URLs críticas para precarga
const CRITICAL_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './FiscalEngine.js',
  './PortfolioOptimizer.js',
  './RiskAnalyzer.js',
  './manifest.json',
  './offline.html'
];

// URLs de recursos externos
const EXTERNAL_URLS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js'
];

// Configuración de cache
const CACHE_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  maxEntries: 100,
  networkTimeoutSeconds: 3
};

// Evento de instalación mejorado
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando versión 2.0');
  
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Precargando recursos críticos');
        return cache.addAll(CRITICAL_URLS);
      }),
      
      // Cache dinámico para recursos externos
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('🌐 Precargando recursos externos');
        return Promise.allSettled(
          EXTERNAL_URLS.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(err => console.warn(`No se pudo precargar: ${url}`, err))
          )
        );
      })
    ]).then(() => {
      console.log('✅ Service Worker instalado correctamente');
      // Forzar activación inmediata
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Error en instalación:', error);
    })
  );
});

// Evento de activación mejorado
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activando versión 2.0');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      cleanupOldCaches(),
      
      // Tomar control inmediato
      self.clients.claim(),
      
      // Configurar sincronización en segundo plano
      setupBackgroundSync()
    ]).then(() => {
      console.log('✅ Service Worker activado y listo');
      
      // Notificar a todos los clientes sobre la actualización
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: '2.0'
          });
        });
      });
    })
  );
});

// Estrategia de fetch avanzada
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requests no HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Estrategia basada en el tipo de recurso
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Manejo de requests de navegación
async function handleNavigationRequest(request) {
  try {
    // Intentar red primero con timeout
    const networkResponse = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutSeconds * 1000);
    
    // Actualizar cache si la respuesta es válida
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔄 Red no disponible, sirviendo desde cache');
    
    // Buscar en cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback a página offline
    return caches.match('./offline.html');
  }
}

// Manejo de assets estáticos
async function handleStaticAsset(request) {
  try {
    // Cache first para assets estáticos
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Actualizar en segundo plano si es necesario
      updateCacheInBackground(request);
      return cachedResponse;
    }
    
    // Si no está en cache, buscar en red
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('❌ Error cargando asset estático:', request.url);
    
    // Fallback para assets críticos
    if (request.url.includes('.css')) {
      return new Response('/* Fallback CSS */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    if (request.url.includes('.js')) {
      return new Response('console.log("Fallback JS");', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    throw error;
  }
}

// Manejo de requests de API
async function handleAPIRequest(request) {
  try {
    // Network first para APIs
    const networkResponse = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutSeconds * 1000);
    
    // Cache respuestas GET exitosas
    if (request.method === 'GET' && networkResponse && networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback a cache para requests GET
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Para otros métodos, devolver error offline
    return new Response(JSON.stringify({
      error: 'Sin conexión',
      message: 'Esta operación requiere conexión a internet',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manejo genérico de requests
async function handleGenericRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache respuestas exitosas
    if (networkResponse && networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'sync-simulations') {
    event.waitUntil(syncSimulations());
  } else if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Sincronizar simulaciones offline
async function syncSimulations() {
  try {
    console.log('📊 Sincronizando simulaciones...');
    
    // Obtener simulaciones pendientes del IndexedDB
    const db = await openIndexedDB();
    const pendingSimulations = await getPendingData(db, 'simulations');
    
    if (pendingSimulations.length === 0) {
      console.log('✅ No hay simulaciones pendientes');
      return;
    }
    
    // Enviar simulaciones al servidor
    for (const simulation of pendingSimulations) {
      try {
        const response = await fetch('/api/simulations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(simulation.data)
        });
        
        if (response.ok) {
          await markAsSynced(db, 'simulations', simulation.id);
          console.log(`✅ Simulación ${simulation.id} sincronizada`);
        }
      } catch (error) {
        console.error(`❌ Error sincronizando simulación ${simulation.id}:`, error);
      }
    }
    
    // Notificar a los clientes
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        data: { simulations: pendingSimulations.length }
      });
    });
    
  } catch (error) {
    console.error('❌ Error en sincronización de simulaciones:', error);
  }
}

// Sincronizar analytics
async function syncAnalytics() {
  try {
    console.log('📈 Sincronizando analytics...');
    
    const db = await openIndexedDB();
    const pendingEvents = await getPendingData(db, 'analytics');
    
    if (pendingEvents.length === 0) {
      return;
    }
    
    // Enviar eventos en lotes
    const batchSize = 10;
    for (let i = 0; i < pendingEvents.length; i += batchSize) {
      const batch = pendingEvents.slice(i, i + batchSize);
      
      try {
        const response = await fetch('/api/analytics/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batch.map(event => event.data))
        });
        
        if (response.ok) {
          for (const event of batch) {
            await markAsSynced(db, 'analytics', event.id);
          }
        }
      } catch (error) {
        console.error('❌ Error sincronizando lote de analytics:', error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en sincronización de analytics:', error);
  }
}

// Manejo de mensajes desde la aplicación
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: '2.0' });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_SIMULATION':
      cacheSimulation(data).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.warn('Mensaje no reconocido:', type);
  }
});

// Funciones auxiliares

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/i.test(url.pathname);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.hostname !== self.location.hostname;
}

function fetchWithTimeout(request, timeout) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    )
  ]);
}

async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response);
    }
  } catch (error) {
    // Silenciar errores de actualización en segundo plano
  }
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('invertax-') && 
    !name.includes('v2.0')
  );
  
  return Promise.all(
    oldCaches.map(cacheName => {
      console.log('🗑️ Eliminando cache antiguo:', cacheName);
      return caches.delete(cacheName);
    })
  );
}

async function setupBackgroundSync() {
  // Configurar sincronización periódica si está disponible
  if ('periodicSync' in self.registration) {
    try {
      await self.registration.periodicSync.register('sync-data', {
        minInterval: 24 * 60 * 60 * 1000 // 24 horas
      });
      console.log('⏰ Sincronización periódica configurada');
    } catch (error) {
      console.log('⚠️ Sincronización periódica no disponible');
    }
  }
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

async function cacheSimulation(simulationData) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const response = new Response(JSON.stringify(simulationData), {
    headers: { 'Content-Type': 'application/json' }
  });
  
  const url = `./simulations/${Date.now()}.json`;
  return cache.put(url, response);
}

// IndexedDB helpers
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('invertaxDB', 2);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Store para simulaciones
      if (!db.objectStoreNames.contains('simulations')) {
        const simulationsStore = db.createObjectStore('simulations', { keyPath: 'id' });
        simulationsStore.createIndex('synced', 'synced', { unique: false });
        simulationsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Store para analytics
      if (!db.objectStoreNames.contains('analytics')) {
        const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' });
        analyticsStore.createIndex('synced', 'synced', { unique: false });
        analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
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

function getPendingData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('synced');
    const request = index.getAll(false); // synced = false
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

function markAsSynced(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => {
      const data = request.result;
      if (data) {
        data.synced = true;
        data.syncedAt = new Date().toISOString();
        
        const updateRequest = store.put(data);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve();
      }
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: './icon-192.png',
    badge: './badge-72.png',
    tag: data.tag || 'invertax-notification',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event;
  let url = './';
  
  if (action === 'open_simulator') {
    url = './#simulador';
  } else if (action === 'view_results') {
    url = './#resultados';
  } else if (data && data.url) {
    url = data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Buscar ventana existente
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      
      // Abrir nueva ventana
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('🚀 INVERTAX Service Worker v2.0 cargado');