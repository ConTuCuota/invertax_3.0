// INVERTAX - Aplicación Principal v3.0
// Motor de optimización fiscal avanzado con funcionalidades completas

// Configuración global
const APP_CONFIG = {
    version: '3.0',
    debug: false,
    apiEndpoint: '/api',
    maxSimulations: 100,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
    animationDuration: 300,
    debounceDelay: 500
};

// Estado global de la aplicación
const AppState = {
    currentSimulation: null,
    simulationHistory: [],
    isCalculating: false,
    isOffline: !navigator.onLine,
    serviceWorkerReady: false,
    userPreferences: {
        theme: 'auto',
        language: 'es',
        currency: 'EUR'
    }
};

// Datos de CCAA actualizados y completos
const CCAA_DATA = {
    'madrid': {
        name: 'Madrid',
        percentage: 0.40,
        maxBase: 9279,
        compatible: true,
        acceptedProfiles: ['empresa tecnológica', 'empresa innovadora', 'empresa joven', 'todos'],
        requirements: ['Permanencia 3 años', 'Mínimo 5 empleados', 'Sede en Madrid'],
        riskLevel: 'bajo',
        special: false
    },
    'cataluna': {
        name: 'Cataluña',
        percentage: 0.50,
        maxBase: 12000,
        compatible: false,
        acceptedProfiles: ['empresa base tecnológica', 'empresa innovadora'],
        requirements: ['Business angel acreditado', 'Incompatible con deducción estatal'],
        riskLevel: 'alto',
        special: true
    },
    'valencia': {
        name: 'Valencia',
        percentage: 0.30,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ['empresa local', 'empresa joven', 'todos'],
        requirements: ['Sede en Comunidad Valenciana', 'Actividad económica real'],
        riskLevel: 'bajo',
        special: false
    },
    'andalucia': {
        name: 'Andalucía',
        percentage: 0.25,
        maxBase: 10000,
        compatible: true,
        acceptedProfiles: ['empresa joven', 'empresa innovadora', 'todos'],
        requirements: ['Antigüedad máxima 5 años', 'Sede en Andalucía'],
        riskLevel: 'medio',
        special: false
    },
    'pais_vasco': {
        name: 'País Vasco',
        percentage: 0.35,
        maxBase: 15000,
        compatible: true,
        acceptedProfiles: ['empresa tecnológica', 'empresa base tecnológica', 'todos'],
        requirements: ['Normativa foral específica', 'Registro en SPRI'],
        riskLevel: 'medio',
        special: true
    },
    'galicia': {
        name: 'Galicia',
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ['empresa local', 'empresa joven', 'todos'],
        requirements: ['Registro previo en IGAPE', 'Sede en Galicia'],
        riskLevel: 'bajo',
        special: false
    },
    'castilla_leon': {
        name: 'Castilla y León',
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ['empresa joven', 'empresa local', 'todos'],
        requirements: ['Sede en Castilla y León', 'Actividad económica'],
        riskLevel: 'bajo',
        special: false
    },
    'aragon': {
        name: 'Aragón',
        percentage: 0.25,
        maxBase: 7500,
        compatible: true,
        acceptedProfiles: ['empresa innovadora', 'empresa joven', 'todos'],
        requirements: ['Sede en Aragón', 'Permanencia 3 años'],
        riskLevel: 'bajo',
        special: false
    },
    'asturias': {
        name: 'Asturias',
        percentage: 0.20,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ['empresa local', 'empresa joven', 'todos'],
        requirements: ['Sede en Asturias', 'Actividad económica real'],
        riskLevel: 'bajo',
        special: false
    },
    'cantabria': {
        name: 'Cantabria',
        percentage: 0.20,
        maxBase: 4000,
        compatible: true,
        acceptedProfiles: ['empresa joven', 'empresa local', 'todos'],
        requirements: ['Sede en Cantabria', 'Permanencia mínima'],
        riskLevel: 'bajo',
        special: false
    },
    'extremadura': {
        name: 'Extremadura',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ['empresa local', 'empresa joven', 'todos'],
        requirements: ['Sede en Extremadura', 'Generación de empleo'],
        riskLevel: 'bajo',
        special: false
    },
    'murcia': {
        name: 'Murcia',
        percentage: 0.20,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ['empresa joven', 'empresa local', 'todos'],
        requirements: ['Sede en Murcia', 'Actividad económica'],
        riskLevel: 'bajo',
        special: false
    },
    'navarra': {
        name: 'Navarra',
        percentage: 0.30,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ['empresa tecnológica', 'empresa innovadora', 'todos'],
        requirements: ['Normativa foral', 'Sede en Navarra'],
        riskLevel: 'medio',
        special: true
    },
    'la_rioja': {
        name: 'La Rioja',
        percentage: 0.20,
        maxBase: 4000,
        compatible: true,
        acceptedProfiles: ['empresa joven', 'empresa local', 'todos'],
        requirements: ['Sede en La Rioja', 'Permanencia 3 años'],
        riskLevel: 'bajo',
        special: false
    },
    'castilla_mancha': {
        name: 'Castilla-La Mancha',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ['empresa joven', 'empresa local', 'todos'],
        requirements: ['Sede en Castilla-La Mancha', 'Actividad económica'],
        riskLevel: 'bajo',
        special: false
    },
    'baleares': {
        name: 'Baleares',
        percentage: 0.20,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ['empresa local', 'empresa joven', 'todos'],
        requirements: ['Sede en Baleares', 'Actividad económica real'],
        riskLevel: 'medio',
        special: false
    },
    'canarias': {
        name: 'Canarias',
        percentage: 0.25,
        maxBase: 7000,
        compatible: true,
        acceptedProfiles: ['empresa local', 'empresa joven', 'todos'],
        requirements: ['Sede en Canarias', 'Régimen especial'],
        riskLevel: 'medio',
        special: true
    }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando INVERTAX v3.0');
    
    try {
        initializeApp();
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        showErrorMessage('Error al inicializar la aplicación. Por favor, recarga la página.');
    }
});

// Función principal de inicialización
async function initializeApp() {
    // Mostrar indicador de carga
    showLoadingIndicator('Inicializando aplicación...');
    
    try {
        // Inicializar componentes en orden
        await initializeServiceWorker();
        initializeEventListeners();
        initializeFormElements();
        initializeNavigation();
        initializeTheme();
        loadUserPreferences();
        
        // Verificar estado de conexión
        updateConnectionStatus();
        
        // Cargar historial de simulaciones
        await loadSimulationHistory();
        
        console.log('✅ INVERTAX inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        showErrorMessage('Error al inicializar algunos componentes. La aplicación puede funcionar con limitaciones.');
    } finally {
        hideLoadingIndicator();
    }
}

// Inicialización del Service Worker
async function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('✅ Service Worker registrado:', registration.scope);
            
            // Escuchar mensajes del Service Worker
            navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
            
            // Verificar actualizaciones
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
            
            AppState.serviceWorkerReady = true;
            
        } catch (error) {
            console.warn('⚠️ Service Worker no disponible:', error);
        }
    }
}

// Manejo de mensajes del Service Worker
function handleServiceWorkerMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SW_UPDATED':
            console.log('🔄 Service Worker actualizado a versión:', data.version);
            break;
        case 'SYNC_COMPLETE':
            showSuccessMessage(`Sincronización completada: ${data.syncedCount} elementos`);
            break;
        case 'CACHE_UPDATED':
            console.log('📦 Cache actualizado');
            break;
    }
}

// Inicialización de event listeners
function initializeEventListeners() {
    // Navegación
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Menú móvil
    const navToggle = document.querySelector('.nav__toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Formulario de simulación
    const simulatorForm = document.getElementById('simulatorForm');
    if (simulatorForm) {
        simulatorForm.addEventListener('submit', handleSimulatorSubmit);
        
        // Inputs con validación en tiempo real
        const inputs = simulatorForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(validateInput, APP_CONFIG.debounceDelay));
            input.addEventListener('blur', validateInput);
        });
    }
    
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Eventos de conexión
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Eventos de teclado para accesibilidad
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Scroll suave para anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

// Inicialización de elementos del formulario
function initializeFormElements() {
    // Poblar select de CCAA
    const ccaaSelect = document.getElementById('ccaa');
    if (ccaaSelect) {
        populateCCAASelect(ccaaSelect);
    }
    
    // Inicializar tooltips
    initializeTooltips();
    
    // Configurar validación de formularios
    setupFormValidation();
}

// Poblar select de CCAA
function populateCCAASelect(select) {
    // Limpiar opciones existentes (excepto la primera)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // Añadir opciones ordenadas alfabéticamente
    const sortedCCAA = Object.entries(CCAA_DATA)
        .sort(([,a], [,b]) => a.name.localeCompare(b.name));
    
    sortedCCAA.forEach(([code, data]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${data.name} (${(data.percentage * 100).toFixed(0)}% hasta €${data.maxBase.toLocaleString()})`;
        option.dataset.compatible = data.compatible;
        option.dataset.riskLevel = data.riskLevel;
        select.appendChild(option);
    });
}

// Inicialización de tooltips
function initializeTooltips() {
    document.querySelectorAll('.help-icon').forEach(icon => {
        icon.addEventListener('mouseenter', showTooltip);
        icon.addEventListener('mouseleave', hideTooltip);
        icon.addEventListener('focus', showTooltip);
        icon.addEventListener('blur', hideTooltip);
    });
}

// Configuración de validación de formularios
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.noValidate = true; // Usar validación personalizada
    });
}

// Navegación suave
function handleNavigation(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    
    if (href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Actualizar URL sin recargar
            history.pushState(null, null, href);
            
            // Cerrar menú móvil si está abierto
            closeMobileMenu();
        }
    }
}

// Toggle menú móvil
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav__menu');
    const navToggle = document.querySelector('.nav__toggle');
    
    if (navMenu && navToggle) {
        const isOpen = navMenu.classList.contains('nav__menu--open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const navMenu = document.querySelector('.nav__menu');
    const navToggle = document.querySelector('.nav__toggle');
    
    navMenu.classList.add('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('nav__toggle--open');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav__menu');
    const navToggle = document.querySelector('.nav__toggle');
    
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('nav__toggle--open');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
}

// Manejo del formulario de simulación
async function handleSimulatorSubmit(event) {
    event.preventDefault();
    
    if (AppState.isCalculating) {
        return;
    }
    
    const formData = new FormData(event.target);
    const simulationData = {
        investment: parseFloat(formData.get('investment')),
        ccaa: formData.get('ccaa'),
        stateQuota: parseFloat(formData.get('stateQuota')),
        regionalQuota: parseFloat(formData.get('regionalQuota')),
        projectProfile: formData.get('projectProfile') || null
    };
    
    // Validar datos
    const validation = validateSimulationData(simulationData);
    if (!validation.isValid) {
        showErrorMessage(validation.errors.join(', '));
        return;
    }
    
    try {
        AppState.isCalculating = true;
        showLoadingIndicator('Calculando optimización fiscal...');
        
        // Realizar cálculo
        const result = await calculateOptimization(simulationData);
        
        // Mostrar resultados
        displayResults(result);
        
        // Guardar en historial
        saveSimulationToHistory(result);
        
        // Scroll a resultados
        scrollToResults();
        
        // Analytics
        trackSimulation(simulationData, result);
        
    } catch (error) {
        console.error('❌ Error en simulación:', error);
        showErrorMessage('Error al calcular la optimización. Por favor, inténtalo de nuevo.');
    } finally {
        AppState.isCalculating = false;
        hideLoadingIndicator();
    }
}

// Validación de datos de simulación
function validateSimulationData(data) {
    const errors = [];
    
    if (!data.investment || data.investment < 1000) {
        errors.push('La inversión mínima es €1.000');
    }
    
    if (data.investment > 1000000) {
        errors.push('La inversión máxima es €1.000.000');
    }
    
    if (!data.ccaa || !CCAA_DATA[data.ccaa]) {
        errors.push('Selecciona una Comunidad Autónoma válida');
    }
    
    if (data.stateQuota < 0 || data.stateQuota > 100000) {
        errors.push('La cuota estatal debe estar entre €0 y €100.000');
    }
    
    if (data.regionalQuota < 0 || data.regionalQuota > 50000) {
        errors.push('La cuota autonómica debe estar entre €0 y €50.000');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Cálculo de optimización fiscal
async function calculateOptimization(data) {
    // Simular delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ccaaData = CCAA_DATA[data.ccaa];
    const result = {
        input: data,
        ccaaData: ccaaData,
        distributions: [],
        totalDeduction: 0,
        totalUsedInvestment: 0,
        unoptimizedCapital: 0,
        effectiveFiscalReturn: 0,
        recommendations: [],
        riskAnalysis: {},
        timestamp: new Date().toISOString(),
        id: generateSimulationId()
    };
    
    // PASO 1: Optimización deducción estatal
    const stateOptimization = optimizeStateDeduction(data.investment, data.stateQuota);
    if (stateOptimization.investment > 0) {
        result.distributions.push({
            project: "Proyecto A (Deducción Estatal)",
            investment: stateOptimization.investment,
            deductionRate: 0.50,
            deduction: stateOptimization.deduction,
            description: "Art. 68.1 LIRPF - Deducción estatal del 50%",
            type: "estatal",
            efficiency: (stateOptimization.deduction / stateOptimization.investment) * 100
        });
        
        result.totalDeduction += stateOptimization.deduction;
        result.totalUsedInvestment += stateOptimization.investment;
    }
    
    // PASO 2: Optimización deducción autonómica
    const remainingInvestment = data.investment - stateOptimization.investment;
    const regionalOptimization = optimizeRegionalDeduction(
        remainingInvestment, 
        ccaaData, 
        data.regionalQuota, 
        data.projectProfile
    );
    
    if (regionalOptimization.investment > 0) {
        result.distributions.push({
            project: "Proyecto B (Deducción Autonómica)",
            investment: regionalOptimization.investment,
            deductionRate: ccaaData.percentage,
            deduction: regionalOptimization.deduction,
            description: `Deducción autonómica ${ccaaData.name} - ${(ccaaData.percentage * 100).toFixed(0)}%`,
            type: "autonomica",
            efficiency: (regionalOptimization.deduction / regionalOptimization.investment) * 100
        });
        
        result.totalDeduction += regionalOptimization.deduction;
        result.totalUsedInvestment += regionalOptimization.investment;
    }
    
    // PASO 3: Cálculos finales
    result.unoptimizedCapital = data.investment - result.totalUsedInvestment;
    
    if (result.totalUsedInvestment > 0) {
        result.effectiveFiscalReturn = (result.totalDeduction / result.totalUsedInvestment) * 100;
    }
    
    // PASO 4: Generar recomendaciones
    result.recommendations = generateRecommendations(result);
    
    // PASO 5: Análisis de riesgo básico
    result.riskAnalysis = performBasicRiskAnalysis(result);
    
    return result;
}

// Optimización deducción estatal
function optimizeStateDeduction(investment, stateQuota) {
    const maxInvestmentByBase = Math.min(investment, 100000); // Base máxima estatal
    const maxDeductionPossible = maxInvestmentByBase * 0.50;
    const actualDeduction = Math.min(maxDeductionPossible, stateQuota);
    const optimalInvestment = actualDeduction / 0.50;
    
    return {
        investment: optimalInvestment,
        deduction: actualDeduction
    };
}

// Optimización deducción autonómica
function optimizeRegionalDeduction(remainingInvestment, ccaaData, regionalQuota, projectProfile) {
    if (remainingInvestment <= 0 || !ccaaData.compatible) {
        return { investment: 0, deduction: 0 };
    }
    
    // Validar perfil de proyecto si se especifica
    if (projectProfile && !ccaaData.acceptedProfiles.includes('todos')) {
        const isCompatible = ccaaData.acceptedProfiles.some(profile => 
            projectProfile.toLowerCase().includes(profile.toLowerCase())
        );
        
        if (!isCompatible) {
            return { investment: 0, deduction: 0 };
        }
    }
    
    const maxInvestmentByBase = Math.min(remainingInvestment, ccaaData.maxBase);
    const maxDeductionPossible = maxInvestmentByBase * ccaaData.percentage;
    const actualDeduction = Math.min(maxDeductionPossible, regionalQuota);
    const optimalInvestment = actualDeduction / ccaaData.percentage;
    
    return {
        investment: optimalInvestment,
        deduction: actualDeduction
    };
}

// Generación de recomendaciones
function generateRecommendations(result) {
    const recommendations = [];
    
    // Recomendación por eficiencia
    if (result.effectiveFiscalReturn > 45) {
        recommendations.push({
            type: 'success',
            title: 'Optimización Excelente',
            message: `Tu estrategia fiscal es altamente eficiente con ${result.effectiveFiscalReturn.toFixed(1)}% de rentabilidad fiscal.`,
            priority: 'high'
        });
    } else if (result.effectiveFiscalReturn < 25) {
        recommendations.push({
            type: 'warning',
            title: 'Oportunidad de Mejora',
            message: `Rentabilidad fiscal baja (${result.effectiveFiscalReturn.toFixed(1)}%). Considera aumentar tus cuotas disponibles.`,
            priority: 'high'
        });
    }
    
    // Recomendación por capital no optimizado
    if (result.unoptimizedCapital > result.input.investment * 0.15) {
        const percentage = (result.unoptimizedCapital / result.input.investment * 100).toFixed(1);
        recommendations.push({
            type: 'info',
            title: 'Capital Sin Optimizar',
            message: `${percentage}% de tu capital (€${result.unoptimizedCapital.toLocaleString()}) no está optimizado fiscalmente.`,
            priority: 'medium'
        });
    }
    
    // Recomendación por incompatibilidad
    if (!result.ccaaData.compatible) {
        recommendations.push({
            type: 'warning',
            title: 'Incompatibilidad Autonómica',
            message: `${result.ccaaData.name} no permite combinar deducciones estatales y autonómicas.`,
            priority: 'high'
        });
    }
    
    return recommendations;
}

// Análisis de riesgo básico
function performBasicRiskAnalysis(result) {
    const analysis = {
        overallRisk: 'medio',
        factors: []
    };
    
    // Factor de riesgo por CCAA
    if (result.ccaaData.riskLevel === 'alto') {
        analysis.factors.push('Riesgo regulatorio alto en ' + result.ccaaData.name);
    }
    
    // Factor de riesgo por concentración
    if (result.unoptimizedCapital > result.input.investment * 0.3) {
        analysis.factors.push('Alta concentración de capital no optimizado');
    }
    
    // Factor de riesgo por incompatibilidad
    if (!result.ccaaData.compatible) {
        analysis.factors.push('Incompatibilidad entre deducciones');
    }
    
    // Determinar riesgo general
    if (analysis.factors.length === 0) {
        analysis.overallRisk = 'bajo';
    } else if (analysis.factors.length > 2) {
        analysis.overallRisk = 'alto';
    }
    
    return analysis;
}

// Mostrar resultados
function displayResults(result) {
    const resultsContainer = document.getElementById('simulatorResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = generateResultsHTML(result);
    resultsContainer.classList.remove('hidden');
    
    // Inicializar gráficos si es necesario
    initializeResultCharts(result);
    
    // Configurar botones de acción
    setupResultActions(result);
    
    AppState.currentSimulation = result;
}

// Generar HTML de resultados
function generateResultsHTML(result) {
    return `
        <div class="results-container">
            <div class="results-main">
                <div class="results-header">
                    <h3>🎯 Resultados de Optimización Fiscal</h3>
                    <div class="results-badges">
                        <span class="badge badge--success">Cálculo Completado</span>
                        <span class="badge badge--info">${result.ccaaData.name}</span>
                        ${result.ccaaData.compatible ? 
                            '<span class="badge badge--success">Compatible</span>' : 
                            '<span class="badge badge--warning">No Compatible</span>'
                        }
                    </div>
                </div>
                
                <div class="results-summary">
                    <div class="result-main-kpi">
                        <div class="kpi-card">
                            <div class="kpi-value">€${result.totalDeduction.toLocaleString()}</div>
                            <div class="kpi-label">Ahorro Fiscal Total</div>
                            <div class="kpi-change positive">+${result.effectiveFiscalReturn.toFixed(1)}% rentabilidad</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-value">€${result.totalUsedInvestment.toLocaleString()}</div>
                            <div class="kpi-label">Inversión Utilizada</div>
                            <div class="kpi-change ${result.unoptimizedCapital > 0 ? 'warning' : 'positive'}">
                                ${((result.totalUsedInvestment / result.input.investment) * 100).toFixed(1)}% del total
                            </div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-value">${result.effectiveFiscalReturn.toFixed(1)}%</div>
                            <div class="kpi-label">Rentabilidad Fiscal</div>
                            <div class="kpi-change ${result.effectiveFiscalReturn > 40 ? 'positive' : 'warning'}">
                                ${result.effectiveFiscalReturn > 40 ? 'Excelente' : 'Mejorable'}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="distribution-section">
                    <h4>📊 Distribución Óptima de la Inversión</h4>
                    <div class="distribution-chart">
                        ${result.distributions.map(dist => `
                            <div class="distribution-item">
                                <div class="distribution-header">
                                    <h5>${dist.project}</h5>
                                    <span class="distribution-amount">€${dist.investment.toLocaleString()}</span>
                                </div>
                                <div class="distribution-bar">
                                    <div class="distribution-fill ${dist.type}" 
                                         style="width: ${(dist.investment / result.input.investment) * 100}%"></div>
                                </div>
                                <div class="distribution-details">
                                    <span>Deducción: €${dist.deduction.toLocaleString()}</span>
                                    <span>Tipo: ${(dist.deductionRate * 100).toFixed(0)}%</span>
                                    <span>Eficiencia: ${dist.efficiency.toFixed(1)}%</span>
                                </div>
                                <p class="distribution-description">${dist.description}</p>
                            </div>
                        `).join('')}
                        
                        ${result.unoptimizedCapital > 0 ? `
                            <div class="distribution-item warning">
                                <div class="distribution-header">
                                    <h5>⚠️ Capital No Optimizado</h5>
                                    <span class="distribution-amount">€${result.unoptimizedCapital.toLocaleString()}</span>
                                </div>
                                <div class="distribution-bar">
                                    <div class="distribution-fill unoptimized" 
                                         style="width: ${(result.unoptimizedCapital / result.input.investment) * 100}%"></div>
                                </div>
                                <p class="distribution-description">
                                    Este capital no genera deducciones fiscales. Considera aumentar tus cuotas disponibles 
                                    o distribuir la inversión en múltiples años.
                                </p>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${result.recommendations.length > 0 ? `
                    <div class="recommendations-section">
                        <h4>💡 Recomendaciones Personalizadas</h4>
                        <div class="recommendations-list">
                            ${result.recommendations.map(rec => `
                                <div class="recommendation-item ${rec.type}">
                                    <div class="recommendation-header">
                                        <span class="recommendation-icon">
                                            ${rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : 'ℹ️'}
                                        </span>
                                        <h5>${rec.title}</h5>
                                        <span class="recommendation-priority priority-${rec.priority}">${rec.priority}</span>
                                    </div>
                                    <p class="recommendation-message">${rec.message}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="legal-info">
                    <div class="legal-section">
                        <h5>⚖️ Marco Legal Aplicable</h5>
                        <ul class="legal-list">
                            <li>Art. 68.1 LIRPF - Deducción estatal del 50%</li>
                            <li>Normativa autonómica ${result.ccaaData.name}</li>
                            <li>Permanencia mínima: 3 años</li>
                            <li>Base máxima estatal: €100.000</li>
                        </ul>
                    </div>
                    <div class="legal-section">
                        <h5>📋 Requisitos Específicos</h5>
                        <ul class="legal-list">
                            ${result.ccaaData.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="legal-disclaimer">
                        <p><strong>⚠️ Importante:</strong> Esta simulación es orientativa y se basa en la normativa fiscal vigente. 
                        Los resultados reales pueden variar según tu situación fiscal específica. 
                        Recomendamos consultar con un asesor fiscal cualificado antes de tomar decisiones de inversión.</p>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn--primary" onclick="exportToPDF()">
                        📄 Exportar PDF
                    </button>
                    <button class="btn btn--secondary" onclick="exportToJSON()">
                        💾 Exportar JSON
                    </button>
                    <button class="btn btn--outline" onclick="shareResults()">
                        📤 Compartir
                    </button>
                    <button class="btn btn--outline" onclick="compareWithOtherCCAA()">
                        🔍 Comparar CCAA
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Configurar acciones de resultados
function setupResultActions(result) {
    // Los botones ya tienen onclick handlers en el HTML
    // Aquí podríamos añadir listeners adicionales si fuera necesario
}

// Scroll a resultados
function scrollToResults() {
    const resultsContainer = document.getElementById('simulatorResults');
    if (resultsContainer) {
        resultsContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Exportar a PDF
function exportToPDF() {
    if (!AppState.currentSimulation) return;
    
    showLoadingIndicator('Generando PDF...');
    
    // Simular generación de PDF
    setTimeout(() => {
        const pdfContent = generatePDFContent(AppState.currentSimulation);
        downloadFile(pdfContent, `invertax-simulacion-${Date.now()}.pdf`, 'application/pdf');
        hideLoadingIndicator();
        showSuccessMessage('PDF generado correctamente');
    }, 1500);
}

// Exportar a JSON
function exportToJSON() {
    if (!AppState.currentSimulation) return;
    
    const jsonContent = JSON.stringify(AppState.currentSimulation, null, 2);
    downloadFile(jsonContent, `invertax-simulacion-${Date.now()}.json`, 'application/json');
    showSuccessMessage('JSON exportado correctamente');
}

// Compartir resultados
function shareResults() {
    if (!AppState.currentSimulation) return;
    
    const shareData = {
        title: 'INVERTAX - Simulación Fiscal',
        text: `He optimizado mi inversión fiscal con INVERTAX: ${AppState.currentSimulation.effectiveFiscalReturn.toFixed(1)}% de rentabilidad fiscal`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`)
            .then(() => showSuccessMessage('Enlace copiado al portapapeles'))
            .catch(() => showErrorMessage('Error al copiar enlace'));
    }
}

// Comparar con otras CCAA
function compareWithOtherCCAA() {
    if (!AppState.currentSimulation) return;
    
    showLoadingIndicator('Comparando con otras CCAA...');
    
    setTimeout(() => {
        const comparison = generateCCAAComparison(AppState.currentSimulation);
        displayCCAAComparison(comparison);
        hideLoadingIndicator();
    }, 1000);
}

// Generar comparación entre CCAA
function generateCCAAComparison(baseSimulation) {
    const comparisons = [];
    
    Object.entries(CCAA_DATA).forEach(([code, ccaaData]) => {
        if (code === baseSimulation.input.ccaa) return;
        
        // Simular cálculo para esta CCAA
        const simulationData = {
            ...baseSimulation.input,
            ccaa: code
        };
        
        const stateOpt = optimizeStateDeduction(simulationData.investment, simulationData.stateQuota);
        const regionalOpt = optimizeRegionalDeduction(
            simulationData.investment - stateOpt.investment,
            ccaaData,
            simulationData.regionalQuota,
            simulationData.projectProfile
        );
        
        const totalDeduction = stateOpt.deduction + regionalOpt.deduction;
        const totalUsed = stateOpt.investment + regionalOpt.investment;
        const fiscalReturn = totalUsed > 0 ? (totalDeduction / totalUsed) * 100 : 0;
        
        comparisons.push({
            ccaa: code,
            name: ccaaData.name,
            totalDeduction: totalDeduction,
            fiscalReturn: fiscalReturn,
            compatible: ccaaData.compatible,
            riskLevel: ccaaData.riskLevel,
            improvement: totalDeduction - baseSimulation.totalDeduction
        });
    });
    
    return comparisons.sort((a, b) => b.totalDeduction - a.totalDeduction);
}

// Mostrar comparación de CCAA
function displayCCAAComparison(comparisons) {
    const modal = createModal('Comparación entre Comunidades Autónomas', generateComparisonHTML(comparisons));
    document.body.appendChild(modal);
    modal.classList.add('modal--show');
}

// Generar HTML de comparación
function generateComparisonHTML(comparisons) {
    return `
        <div class="comparison-container">
            <p class="comparison-intro">
                Comparación de tu simulación con otras Comunidades Autónomas. 
                Los resultados se basan en los mismos parámetros de inversión y cuotas.
            </p>
            
            <div class="comparison-table-container">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>Comunidad Autónoma</th>
                            <th>Ahorro Total</th>
                            <th>Rentabilidad</th>
                            <th>Compatible</th>
                            <th>Riesgo</th>
                            <th>Diferencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparisons.map((comp, index) => `
                            <tr ${comp.ccaa === AppState.currentSimulation.input.ccaa ? 'class="current-ccaa"' : ''}>
                                <td class="ranking">
                                    <span class="rank-badge ${index < 3 ? 'rank-top' : 'rank-normal'}">
                                        ${index + 1}
                                    </span>
                                    ${comp.ccaa === AppState.currentSimulation.input.ccaa ? 
                                        '<span class="current-badge">Actual</span>' : ''
                                    }
                                </td>
                                <td><strong>${comp.name}</strong></td>
                                <td>€${comp.totalDeduction.toLocaleString()}</td>
                                <td>
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${Math.min(comp.fiscalReturn, 100)}%"></div>
                                        <span class="score-text">${comp.fiscalReturn.toFixed(1)}%</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="compatibility-badge ${comp.compatible ? 'compatible' : 'incompatible'}">
                                        ${comp.compatible ? '✓ Sí' : '✗ No'}
                                    </span>
                                </td>
                                <td>
                                    <span class="risk-badge risk-${comp.riskLevel}">
                                        ${comp.riskLevel}
                                    </span>
                                </td>
                                <td class="${comp.improvement > 0 ? 'positive' : comp.improvement < 0 ? 'negative' : 'neutral'}">
                                    ${comp.improvement > 0 ? '+' : ''}€${comp.improvement.toLocaleString()}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="comparison-insights">
                <h4>💡 Insights de la Comparación</h4>
                <div class="insights-grid">
                    <div class="insight-card">
                        <h6>Mejor Opción</h6>
                        <p>${comparisons[0].name} ofrece el mayor ahorro fiscal con €${comparisons[0].totalDeduction.toLocaleString()}</p>
                    </div>
                    <div class="insight-card">
                        <h6>Compatibilidad</h6>
                        <p>${comparisons.filter(c => c.compatible).length} de ${comparisons.length} CCAA son compatibles con deducción estatal</p>
                    </div>
                    <div class="insight-card">
                        <h6>Riesgo Promedio</h6>
                        <p>La mayoría de CCAA presentan riesgo bajo a medio para este tipo de inversiones</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Crear modal
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal__backdrop" onclick="closeModal(this.parentElement)"></div>
        <div class="modal__content">
            <div class="modal__header">
                <h3>${title}</h3>
                <button class="modal__close" onclick="closeModal(this.closest('.modal'))" aria-label="Cerrar">×</button>
            </div>
            <div class="modal__body">
                ${content}
            </div>
        </div>
    `;
    return modal;
}

// Cerrar modal
function closeModal(modal) {
    modal.classList.remove('modal--show');
    setTimeout(() => {
        if (modal.parentElement) {
            modal.parentElement.removeChild(modal);
        }
    }, 300);
}

// Validación de input en tiempo real
function validateInput(event) {
    const input = event.target;
    const value = input.value;
    const type = input.type;
    const name = input.name;
    
    clearInputError(input);
    
    // Validaciones específicas por campo
    switch (name) {
        case 'investment':
            if (value && (parseFloat(value) < 1000 || parseFloat(value) > 1000000)) {
                showInputError(input, 'La inversión debe estar entre €1.000 y €1.000.000');
            }
            break;
            
        case 'stateQuota':
            if (value && (parseFloat(value) < 0 || parseFloat(value) > 100000)) {
                showInputError(input, 'La cuota estatal debe estar entre €0 y €100.000');
            }
            break;
            
        case 'regionalQuota':
            if (value && (parseFloat(value) < 0 || parseFloat(value) > 50000)) {
                showInputError(input, 'La cuota autonómica debe estar entre €0 y €50.000');
            }
            break;
    }
}

// Mostrar error en input
function showInputError(input, message) {
    input.classList.add('form-control--error');
    
    let errorElement = input.parentElement.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        input.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// Limpiar error en input
function clearInputError(input) {
    input.classList.remove('form-control--error');
    
    const errorElement = input.parentElement.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Manejo del formulario de contacto
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage')
    };
    
    // Validar datos
    if (!contactData.name || !contactData.email || !contactData.message) {
        showErrorMessage('Por favor, completa todos los campos obligatorios');
        return;
    }
    
    try {
        showLoadingIndicator('Enviando mensaje...');
        
        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showSuccessMessage('Mensaje enviado correctamente. Te contactaremos pronto.');
        event.target.reset();
        
    } catch (error) {
        console.error('❌ Error enviando mensaje:', error);
        showErrorMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
        hideLoadingIndicator();
    }
}

// Manejo de eventos de conexión
function handleOnline() {
    AppState.isOffline = false;
    updateConnectionStatus();
    showSuccessMessage('Conexión restablecida');
    
    // Intentar sincronizar datos pendientes
    if (AppState.serviceWorkerReady) {
        syncPendingData();
    }
}

function handleOffline() {
    AppState.isOffline = true;
    updateConnectionStatus();
    showInfoMessage('Modo offline activado. Algunas funciones pueden estar limitadas.');
}

// Actualizar estado de conexión
function updateConnectionStatus() {
    const statusIndicator = document.querySelector('.connection-status');
    if (statusIndicator) {
        statusIndicator.textContent = AppState.isOffline ? 'Sin conexión' : 'Conectado';
        statusIndicator.className = `connection-status ${AppState.isOffline ? 'offline' : 'online'}`;
    }
}

// Navegación por teclado
function handleKeyboardNavigation(event) {
    // Escape para cerrar modales
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal--show');
        if (openModal) {
            closeModal(openModal);
        }
    }
    
    // Enter en botones
    if (event.key === 'Enter' && event.target.classList.contains('btn')) {
        event.target.click();
    }
}

// Scroll suave para anclas
function handleSmoothScroll(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Actualizar URL
        history.pushState(null, null, href);
    }
}

// Inicialización de tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('invertax-theme');
    if (savedTheme) {
        AppState.userPreferences.theme = savedTheme;
        applyTheme(savedTheme);
    } else {
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
    
    // Escuchar cambios en preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (AppState.userPreferences.theme === 'auto') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Aplicar tema
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Cargar preferencias de usuario
function loadUserPreferences() {
    try {
        const saved = localStorage.getItem('invertax-preferences');
        if (saved) {
            AppState.userPreferences = { ...AppState.userPreferences, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.warn('Error cargando preferencias:', error);
    }
}

// Guardar preferencias de usuario
function saveUserPreferences() {
    try {
        localStorage.setItem('invertax-preferences', JSON.stringify(AppState.userPreferences));
    } catch (error) {
        console.warn('Error guardando preferencias:', error);
    }
}

// Cargar historial de simulaciones
async function loadSimulationHistory() {
    try {
        const saved = localStorage.getItem('invertax-simulations');
        if (saved) {
            AppState.simulationHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Error cargando historial:', error);
    }
}

// Guardar simulación en historial
function saveSimulationToHistory(simulation) {
    try {
        AppState.simulationHistory.unshift(simulation);
        
        // Mantener solo las últimas 50 simulaciones
        if (AppState.simulationHistory.length > 50) {
            AppState.simulationHistory = AppState.simulationHistory.slice(0, 50);
        }
        
        localStorage.setItem('invertax-simulations', JSON.stringify(AppState.simulationHistory));
    } catch (error) {
        console.warn('Error guardando simulación:', error);
    }
}

// Tracking de analytics
function trackSimulation(input, result) {
    if (AppState.isOffline) return;
    
    try {
        // Enviar evento de analytics
        const eventData = {
            event: 'simulation_completed',
            ccaa: input.ccaa,
            investment_range: getInvestmentRange(input.investment),
            fiscal_return: Math.round(result.effectiveFiscalReturn),
            timestamp: Date.now()
        };
        
        // En una implementación real, esto se enviaría a un servicio de analytics
        console.log('📊 Analytics:', eventData);
        
    } catch (error) {
        console.warn('Error en tracking:', error);
    }
}

// Obtener rango de inversión para analytics
function getInvestmentRange(investment) {
    if (investment < 10000) return '1k-10k';
    if (investment < 50000) return '10k-50k';
    if (investment < 100000) return '50k-100k';
    if (investment < 500000) return '100k-500k';
    return '500k+';
}

// Sincronizar datos pendientes
async function syncPendingData() {
    if (!navigator.serviceWorker.controller) return;
    
    try {
        navigator.serviceWorker.controller.postMessage({
            type: 'FORCE_SYNC'
        });
    } catch (error) {
        console.warn('Error sincronizando datos:', error);
    }
}

// Mostrar notificación de actualización
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <span>🔄 Nueva versión disponible</span>
            <button onclick="reloadApp()" class="btn btn--sm btn--primary">Actualizar</button>
            <button onclick="dismissUpdate(this.parentElement.parentElement)" class="btn btn--sm btn--outline">Después</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('update-notification--show');
    }, 100);
}

// Recargar aplicación
function reloadApp() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
}

// Descartar actualización
function dismissUpdate(notification) {
    notification.classList.remove('update-notification--show');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Utilidades de UI

// Mostrar indicador de carga
function showLoadingIndicator(message = 'Cargando...') {
    let indicator = document.getElementById('loadingIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'loadingIndicator';
        indicator.className = 'loading-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <span class="loading-message">${message}</span>
        </div>
    `;
    
    indicator.classList.add('loading-indicator--show');
}

// Ocultar indicador de carga
function hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.classList.remove('loading-indicator--show');
    }
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    showToast(message, 'success');
}

// Mostrar mensaje de error
function showErrorMessage(message) {
    showToast(message, 'error');
}

// Mostrar mensaje de información
function showInfoMessage(message) {
    showToast(message, 'info');
}

// Mostrar toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="closeToast(this.parentElement.parentElement)">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast--show');
    }, 100);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        closeToast(toast);
    }, 5000);
}

// Cerrar toast
function closeToast(toast) {
    toast.classList.remove('toast--show');
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// Mostrar tooltip
function showTooltip(event) {
    const element = event.target;
    const title = element.getAttribute('title');
    
    if (!title) return;
    
    // Crear tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = title;
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    // Mostrar tooltip
    setTimeout(() => {
        tooltip.classList.add('tooltip--show');
    }, 100);
    
    // Guardar referencia para poder ocultarlo
    element._tooltip = tooltip;
    
    // Remover title para evitar tooltip nativo
    element.removeAttribute('title');
    element._originalTitle = title;
}

// Ocultar tooltip
function hideTooltip(event) {
    const element = event.target;
    const tooltip = element._tooltip;
    
    if (tooltip) {
        tooltip.classList.remove('tooltip--show');
        setTimeout(() => {
            if (tooltip.parentElement) {
                tooltip.parentElement.removeChild(tooltip);
            }
        }, 300);
        
        delete element._tooltip;
    }
    
    // Restaurar title original
    if (element._originalTitle) {
        element.setAttribute('title', element._originalTitle);
        delete element._originalTitle;
    }
}

// Utilidades generales

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generar ID único para simulación
function generateSimulationId() {
    return 'sim_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Descargar archivo
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

// Generar contenido PDF (simulado)
function generatePDFContent(simulation) {
    return `
        INVERTAX - Simulación Fiscal
        ============================
        
        Fecha: ${new Date(simulation.timestamp).toLocaleDateString()}
        ID: ${simulation.id}
        
        DATOS DE ENTRADA:
        - Inversión Total: €${simulation.input.investment.toLocaleString()}
        - CCAA: ${simulation.ccaaData.name}
        - Cuota Estatal: €${simulation.input.stateQuota.toLocaleString()}
        - Cuota Autonómica: €${simulation.input.regionalQuota.toLocaleString()}
        
        RESULTADOS:
        - Ahorro Fiscal Total: €${simulation.totalDeduction.toLocaleString()}
        - Inversión Utilizada: €${simulation.totalUsedInvestment.toLocaleString()}
        - Rentabilidad Fiscal: ${simulation.effectiveFiscalReturn.toFixed(2)}%
        - Capital No Optimizado: €${simulation.unoptimizedCapital.toLocaleString()}
        
        DISTRIBUCIÓN:
        ${simulation.distributions.map(dist => 
            `- ${dist.project}: €${dist.investment.toLocaleString()} (Deducción: €${dist.deduction.toLocaleString()})`
        ).join('\n')}
        
        RECOMENDACIONES:
        ${simulation.recommendations.map(rec => `- ${rec.title}: ${rec.message}`).join('\n')}
        
        ---
        Generado por INVERTAX v${APP_CONFIG.version}
        Este documento es una simulación orientativa.
    `;
}

// Función global para cálculo rápido (llamada desde botones)
window.calculateAdvanced = function() {
    const form = document.getElementById('simulatorForm');
    if (form) {
        form.dispatchEvent(new Event('submit'));
    }
};

// Funciones globales para exportación (llamadas desde botones)
window.exportToPDF = exportToPDF;
window.exportToJSON = exportToJSON;
window.shareResults = shareResults;
window.compareWithOtherCCAA = compareWithOtherCCAA;
window.closeModal = closeModal;
window.closeToast = closeToast;
window.reloadApp = reloadApp;
window.dismissUpdate = dismissUpdate;

console.log('✅ INVERTAX v3.0 cargado correctamente');