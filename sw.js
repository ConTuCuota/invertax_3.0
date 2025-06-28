// INVERTAX - Service Worker Avanzado v3.0 para PWA
const CACHE_NAME = 'invertax-cache-v3.0';
const STATIC_CACHE = 'invertax-static-v3.0';
const DYNAMIC_CACHE = 'invertax-dynamic-v3.0';
const API_CACHE = 'invertax-api-v3.0';

// URLs críticas para precarga
const CRITICAL_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './FiscalEngine.js',
  './PortfolioOptimizer.js',
  './RiskAnalyzer.js',
  './monteCarlo-worker.js',
  './manifest.json',
  './offline.html'
];

// URLs de recursos externos
const EXTERNAL_URLS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Configuración de cache avanzada
const CACHE_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  maxEntries: 200,
  networkTimeoutSeconds: 5,
  staleWhileRevalidate: true,
  backgroundSync: true
};

// Estrategias de cache por tipo de recurso
const CACHE_STRATEGIES = {
  documents: 'cache-first',
  api: 'network-first',
  static: 'cache-first',
  images: 'cache-first',
  fonts: 'cache-first'
};

// Evento de instalación mejorado
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker v3.0: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cache estático crítico
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Precargando recursos críticos');
        return cache.addAll(CRITICAL_URLS);
      }),
      
      // Cache dinámico para recursos externos
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('🌐 Precargando recursos externos');
        return Promise.allSettled(
          EXTERNAL_URLS.map(url => 
            fetch(url, { mode: 'cors' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(err => console.warn(`No se pudo precargar: ${url}`, err))
          )
        );
      }),
      
      // Inicializar cache de API
      caches.open(API_CACHE)
    ]).then(() => {
      console.log('✅ Service Worker v3.0 instalado correctamente');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Error en instalación:', error);
    })
  );
});

// Evento de activación mejorado
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker v3.0: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      cleanupOldCaches(),
      
      // Tomar control inmediato
      self.clients.claim(),
      
      // Configurar sincronización en segundo plano
      setupBackgroundSync(),
      
      // Inicializar IndexedDB para datos offline
      initializeOfflineStorage()
    ]).then(() => {
      console.log('✅ Service Worker v3.0 activado y listo');
      
      // Notificar a todos los clientes sobre la actualización
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: '3.0',
            features: ['advanced-caching', 'background-sync', 'offline-storage']
          });
        });
      });
    })
  );
});

// Estrategia de fetch avanzada con routing inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requests no HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Routing inteligente basado en el tipo de recurso
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isFontRequest(request)) {
    event.respondWith(handleFontRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Manejo de requests de navegación con estrategia avanzada
async function handleNavigationRequest(request) {
  try {
    // Intentar red primero con timeout
    const networkResponse = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutSeconds * 1000);
    
    if (networkResponse && networkResponse.ok) {
      // Actualizar cache en segundo plano
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('🔄 Red no disponible para navegación, sirviendo desde cache');
    
    // Buscar en cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback a página offline
    return caches.match('./offline.html');
  }
}

// Manejo de assets estáticos con cache-first
async function handleStaticAsset(request) {
  try {
    // Cache first para assets estáticos
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Stale-while-revalidate: actualizar en segundo plano
      if (CACHE_CONFIG.staleWhileRevalidate) {
        updateCacheInBackground(request);
      }
      return cachedResponse;
    }
    
    // Si no está en cache, buscar en red
    const networkResponse = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutSeconds * 1000);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.warn('❌ Error cargando asset estático:', request.url);
    
    // Fallback para assets críticos
    return generateFallbackResponse(request);
  }
}

// Manejo de requests de API con network-first
async function handleAPIRequest(request) {
  try {
    // Network first para APIs
    const networkResponse = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutSeconds * 1000);
    
    // Cache respuestas GET exitosas
    if (request.method === 'GET' && networkResponse && networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      // Solo cachear respuestas JSON
      const contentType = networkResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback a cache para requests GET
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Añadir header para indicar que viene del cache
        const response = cachedResponse.clone();
        response.headers.set('X-Served-By', 'ServiceWorker-Cache');
        return response;
      }
    }
    
    // Para otros métodos, devolver error offline estructurado
    return new Response(JSON.stringify({
      error: 'OFFLINE_ERROR',
      message: 'Esta operación requiere conexión a internet',
      offline: true,
      timestamp: new Date().toISOString(),
      retryAfter: 30
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 
        'Content-Type': 'application/json',
        'X-Offline-Response': 'true'
      }
    });
  }
}

// Manejo de fuentes con cache permanente
async function handleFontRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Font fetch failed');
  } catch (error) {
    // Fallback font
    return new Response('', {
      status: 200,
      headers: { 'Content-Type': 'font/woff2' }
    });
  }
}

// Manejo de imágenes con cache optimizado
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Image fetch failed');
  } catch (error) {
    // Fallback image (placeholder SVG)
    const fallbackSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f3f4f6"/>
      <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">📷</text>
    </svg>`;
    
    return new Response(fallbackSVG, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}

// Manejo genérico con estrategia adaptativa
async function handleGenericRequest(request) {
  try {
    const networkResponse = await fetchWithTimeout(request, CACHE_CONFIG.networkTimeoutSeconds * 1000);
    
    // Cache respuestas exitosas GET
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

// Sincronización en segundo plano mejorada
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync:', event.tag);
  
  switch (event.tag) {
    case 'sync-simulations':
      event.waitUntil(syncSimulations());
      break;
    case 'sync-analytics':
      event.waitUntil(syncAnalytics());
      break;
    case 'sync-documents':
      event.waitUntil(syncDocuments());
      break;
    case 'cleanup-cache':
      event.waitUntil(performCacheCleanup());
      break;
    default:
      console.log('Sync tag no reconocido:', event.tag);
  }
});

// Sincronizar simulaciones offline
async function syncSimulations() {
  try {
    console.log('📊 Sincronizando simulaciones...');
    
    const db = await openIndexedDB();
    const pendingSimulations = await getPendingData(db, 'simulations');
    
    if (pendingSimulations.length === 0) {
      console.log('✅ No hay simulaciones pendientes');
      return;
    }
    
    let syncedCount = 0;
    for (const simulation of pendingSimulations) {
      try {
        const response = await fetch('/api/simulations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Sync-Request': 'true'
          },
          body: JSON.stringify(simulation.data)
        });
        
        if (response.ok) {
          await markAsSynced(db, 'simulations', simulation.id);
          syncedCount++;
          console.log(`✅ Simulación ${simulation.id} sincronizada`);
        }
      } catch (error) {
        console.error(`❌ Error sincronizando simulación ${simulation.id}:`, error);
      }
    }
    
    // Notificar a los clientes
    notifyClients({
      type: 'SYNC_COMPLETE',
      category: 'simulations',
      syncedCount: syncedCount,
      totalCount: pendingSimulations.length
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
    const batchSize = 20;
    let syncedCount = 0;
    
    for (let i = 0; i < pendingEvents.length; i += batchSize) {
      const batch = pendingEvents.slice(i, i + batchSize);
      
      try {
        const response = await fetch('/api/analytics/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Sync-Request': 'true'
          },
          body: JSON.stringify({
            events: batch.map(event => event.data),
            batchId: generateBatchId(),
            timestamp: Date.now()
          })
        });
        
        if (response.ok) {
          for (const event of batch) {
            await markAsSynced(db, 'analytics', event.id);
            syncedCount++;
          }
        }
      } catch (error) {
        console.error('❌ Error sincronizando lote de analytics:', error);
      }
    }
    
    console.log(`✅ ${syncedCount} eventos de analytics sincronizados`);
    
  } catch (error) {
    console.error('❌ Error en sincronización de analytics:', error);
  }
}

// Sincronizar documentos
async function syncDocuments() {
  try {
    console.log('📄 Sincronizando documentos...');
    
    const db = await openIndexedDB();
    const pendingDocuments = await getPendingData(db, 'documents');
    
    for (const doc of pendingDocuments) {
      try {
        // Solo sincronizar metadatos, no el contenido completo
        const response = await fetch('/api/documents/metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Sync-Request': 'true'
          },
          body: JSON.stringify({
            documentId: doc.id,
            metadata: doc.data.metadata,
            timestamp: doc.timestamp
          })
        });
        
        if (response.ok) {
          await markAsSynced(db, 'documents', doc.id);
        }
      } catch (error) {
        console.error(`❌ Error sincronizando documento ${doc.id}:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en sincronización de documentos:', error);
  }
}

// Limpieza de cache programada
async function performCacheCleanup() {
  try {
    console.log('🧹 Realizando limpieza de cache...');
    
    const cacheNames = await caches.keys();
    const maxAge = CACHE_CONFIG.maxAge;
    const now = Date.now();
    
    for (const cacheName of cacheNames) {
      if (cacheName.startsWith('invertax-')) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
              const responseDate = new Date(dateHeader).getTime();
              if (now - responseDate > maxAge) {
                await cache.delete(request);
                console.log(`🗑️ Eliminado del cache: ${request.url}`);
              }
            }
          }
        }
      }
    }
    
    // Limpiar IndexedDB también
    const db = await openIndexedDB();
    await cleanupIndexedDB(db, maxAge);
    
    console.log('✅ Limpieza de cache completada');
    
  } catch (error) {
    console.error('❌ Error en limpieza de cache:', error);
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
      event.ports[0].postMessage({ version: '3.0', features: getFeatures() });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'CACHE_SIMULATION':
      cacheSimulation(data).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'FORCE_SYNC':
      forceSyncAll().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'GET_CACHE_STATS':
      getCacheStatistics().then(stats => {
        event.ports[0].postMessage({ success: true, data: stats });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    default:
      console.warn('Mensaje no reconocido:', type);
  }
});

// Funciones auxiliares mejoradas

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(css|js|json|ico)$/i.test(url.pathname);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.hostname !== self.location.hostname;
}

function isFontRequest(request) {
  const url = new URL(request.url);
  return /\.(woff|woff2|ttf|eot|otf)$/i.test(url.pathname) ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return /\.(png|jpg|jpeg|gif|svg|webp|avif)$/i.test(url.pathname);
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

function generateFallbackResponse(request) {
  const url = new URL(request.url);
  
  if (url.pathname.endsWith('.css')) {
    return new Response('/* Fallback CSS - Sin conexión */', {
      headers: { 'Content-Type': 'text/css' }
    });
  }
  
  if (url.pathname.endsWith('.js')) {
    return new Response('console.log("Fallback JS - Sin conexión");', {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
  
  return new Response('Recurso no disponible offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('invertax-') && 
    !name.includes('v3.0')
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
      await self.registration.periodicSync.register('cleanup-cache', {
        minInterval: 24 * 60 * 60 * 1000 // 24 horas
      });
      console.log('⏰ Sincronización periódica configurada');
    } catch (error) {
      console.log('⚠️ Sincronización periódica no disponible');
    }
  }
}

async function initializeOfflineStorage() {
  try {
    const db = await openIndexedDB();
    console.log('💾 Almacenamiento offline inicializado');
    return db;
  } catch (error) {
    console.error('❌ Error inicializando almacenamiento offline:', error);
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
    headers: { 
      'Content-Type': 'application/json',
      'X-Cached-At': new Date().toISOString()
    }
  });
  
  const url = `./simulations/${Date.now()}.json`;
  return cache.put(url, response);
}

async function forceSyncAll() {
  const registration = await self.registration;
  
  const syncTags = ['sync-simulations', 'sync-analytics', 'sync-documents'];
  
  for (const tag of syncTags) {
    try {
      await registration.sync.register(tag);
    } catch (error) {
      console.warn(`No se pudo registrar sync: ${tag}`, error);
    }
  }
}

async function getCacheStatistics() {
  const stats = {
    caches: {},
    totalSize: 0,
    totalEntries: 0
  };
  
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    stats.caches[cacheName] = {
      entries: requests.length,
      urls: requests.map(req => req.url)
    };
    
    stats.totalEntries += requests.length;
  }
  
  // Estimar tamaño total si está disponible
  if ('estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    stats.totalSize = estimate.usage || 0;
    stats.quota = estimate.quota || 0;
  }
  
  return stats;
}

function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

function getFeatures() {
  return [
    'advanced-caching',
    'background-sync',
    'offline-storage',
    'stale-while-revalidate',
    'intelligent-routing',
    'cache-cleanup',
    'performance-monitoring'
  ];
}

function generateBatchId() {
  return 'batch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// IndexedDB helpers mejorados
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InvertaxDB', 3);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Store para simulaciones
      if (!db.objectStoreNames.contains('simulations')) {
        const simulationsStore = db.createObjectStore('simulations', { keyPath: 'id' });
        simulationsStore.createIndex('synced', 'synced', { unique: false });
        simulationsStore.createIndex('timestamp', 'timestamp', { unique: false });
        simulationsStore.createIndex('version', 'version', { unique: false });
      }
      
      // Store para analytics
      if (!db.objectStoreNames.contains('analytics')) {
        const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' });
        analyticsStore.createIndex('synced', 'synced', { unique: false });
        analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
        analyticsStore.createIndex('eventType', 'eventType', { unique: false });
      }
      
      // Store para documentos
      if (!db.objectStoreNames.contains('documents')) {
        const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
        documentsStore.createIndex('synced', 'synced', { unique: false });
        documentsStore.createIndex('timestamp', 'timestamp', { unique: false });
        documentsStore.createIndex('type', 'type', { unique: false });
      }
      
      // Store para configuración
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      
      // Store para cache metadata
      if (!db.objectStoreNames.contains('cache_metadata')) {
        const cacheStore = db.createObjectStore('cache_metadata', { keyPath: 'url' });
        cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        cacheStore.createIndex('type', 'type', { unique: false });
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

async function cleanupIndexedDB(db, maxAge) {
  const stores = ['simulations', 'analytics', 'documents', 'cache_metadata'];
  const cutoffTime = Date.now() - maxAge;
  
  for (const storeName of stores) {
    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn(`Error limpiando store ${storeName}:`, error);
    }
  }
}

// Manejo de notificaciones push mejorado
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './icon-192.png',
      badge: './badge-72.png',
      tag: data.tag || 'invertax-notification',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      timestamp: Date.now(),
      vibrate: data.vibrate || [200, 100, 200]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error procesando notificación push:', error);
  }
});

// Manejo de clicks en notificaciones mejorado
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event;
  let url = './';
  
  // Routing basado en acciones
  switch (action) {
    case 'open_simulator':
      url = './#simulador';
      break;
    case 'view_results':
      url = './#resultados';
      break;
    case 'open_documents':
      url = './#documentos';
      break;
    case 'view_analytics':
      url = './#analytics';
      break;
    default:
      if (data && data.url) {
        url = data.url;
      }
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
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

// Manejo de cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada:', event.notification.tag);
  
  // Tracking de notificaciones cerradas
  if (event.notification.data && event.notification.data.trackClose) {
    // Enviar evento de analytics
    fetch('/api/analytics/notification-close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag: event.notification.tag,
        timestamp: Date.now()
      })
    }).catch(() => {
      // Silenciar errores de tracking
    });
  }
});

console.log('🚀 INVERTAX Service Worker v3.0 cargado con funcionalidades avanzadas');