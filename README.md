# INVERTAX v2.0 – Optimización Fiscal para Inversiones en Startups

![INVERTAX Logo](https://img.shields.io/badge/INVERTAX-v2.0-blue?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 🚀 Descripción

INVERTAX es una plataforma web avanzada para la optimización fiscal de inversiones en startups. Combina deducciones IRPF estatales (50%) con autonómicas (hasta 50% adicional) de forma 100% legal y transparente.

### ✨ Características Principales

- **Simulador Fiscal Avanzado**: Motor de optimización secuencial según el Modelo INVERTAX
- **Análisis Monte Carlo**: Simulaciones de rentabilidad con 1000 iteraciones
- **Compatibilidad CCAA**: Soporte para todas las Comunidades Autónomas españolas
- **Exportación de Documentos**: PDF, JSON y trazabilidad con hash SHA-256
- **PWA Ready**: Aplicación web progresiva con soporte offline
- **Responsive Design**: Optimizado para desktop y móvil

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Arquitectura**: SPA (Single Page Application) estática
- **PWA**: Service Worker, Web App Manifest
- **Charts**: Chart.js para visualizaciones
- **Deployment**: GitHub Pages compatible

## 📦 Despliegue en GitHub Pages

### Opción 1: Despliegue Directo (Recomendado)

1. **Sube el contenido al repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/invertax-v2.git
   cd invertax-v2
   # Copia todos los archivos de esta carpeta al repositorio
   git add .
   git commit -m "Deploy INVERTAX v2.0"
   git push origin main
   ```

2. **Configura GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / Folder: `/ (root)`
   - Guarda los cambios

3. **Accede a tu aplicación**:
   - Espera 2-5 minutos para el despliegue
   - Visita: `https://tu-usuario.github.io/invertax-v2`

### Opción 2: Con GitHub Actions (Opcional)

Si prefieres usar GitHub Actions para automatizar el despliegue:

1. Crea el archivo `.github/workflows/pages.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
     workflow_dispatch:
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   concurrency:
     group: "pages"
     cancel-in-progress: false
   
   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Setup Pages
           uses: actions/configure-pages@v4
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: '.'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. Configura Pages para usar GitHub Actions:
   - Settings → Pages
   - Source: GitHub Actions

## 🏗️ Estructura del Proyecto

```
invertax-v2/
├── index.html              # Página principal
├── app.js                  # Lógica principal de la aplicación
├── FiscalEngine.js         # Motor de cálculos fiscales
├── style.css               # Estilos CSS
├── manifest.json           # Web App Manifest (PWA)
├── sw.js                   # Service Worker
├── monteCarlo-worker.js    # Web Worker para simulaciones
├── offline.html            # Página offline
├── README.md               # Este archivo
├── DOCUMENTACION-FINAL.md  # Documentación técnica
└── deployment-guide.md     # Guía de despliegue detallada
```

## 🚀 Desarrollo Local

Para probar la aplicación localmente:

```bash
# Opción 1: Servidor HTTP simple con Python
python3 -m http.server 8000

# Opción 2: Servidor HTTP simple con Node.js
npx http-server -p 8000

# Opción 3: Live Server (VS Code extension)
# Instala "Live Server" y haz clic derecho en index.html → "Open with Live Server"
```

Luego visita: `http://localhost:8000`

## 📊 Funcionalidades

### Simulador Fiscal
- Cálculo de deducciones estatales (Art. 68.1 LIRPF)
- Optimización autonómica por CCAA
- Validación de perfiles de proyecto
- Recomendaciones personalizadas

### Análisis Monte Carlo
- Simulaciones de rentabilidad a 3, 5 y 7 años
- Distribución de escenarios (P5, P25, P50, P75, P95)
- Visualización gráfica de resultados

### Centro de Documentos
- Exportación PDF de simulaciones
- Exportación JSON para integración
- Trazabilidad con hash SHA-256
- Historial de documentos generados

## 🔧 Configuración

La aplicación no requiere configuración adicional. Todos los parámetros fiscales están incluidos en el código:

- **Deducciones estatales**: 50% hasta €100.000
- **Deducciones autonómicas**: Variables por CCAA
- **Compatibilidades**: Definidas por normativa vigente

## 📱 PWA (Progressive Web App)

La aplicación incluye soporte PWA completo:

- **Instalable**: Se puede instalar como app nativa
- **Offline**: Funciona sin conexión a internet
- **Responsive**: Adaptada a todos los dispositivos
- **Fast**: Carga rápida con Service Worker

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa la [documentación técnica](DOCUMENTACION-FINAL.md)
2. Consulta la [guía de despliegue](deployment-guide.md)
3. Abre un issue en GitHub

## 🔗 Enlaces Útiles

- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [Guía de PWA](https://web.dev/progressive-web-apps/)
- [Normativa IRPF](https://www.agenciatributaria.es/)

---

**INVERTAX v2.0** - Optimización fiscal inteligente para el ecosistema startup español.

