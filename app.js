// INVERTAX - Aplicación Principal v4.0 con Simulador Plurianual Avanzado
// Incluye funcionalidades completas de Monte Carlo, timing acumulativo y optimización plurianual

// Configuración global de la aplicación
const APP_CONFIG = {
    version: '4.0',
    features: {
        multiYear: true,
        monteCarlo: true,
        timingOptimization: true,
        advancedAnalytics: true,
        exportFunctionality: true
    },
    limits: {
        maxInvestment: 500000,
        minInvestment: 1000,
        maxYears: 10,
        minYears: 1,
        maxIterations: 10000
    }
};

// Base de datos de CCAA con información fiscal completa
const CCAA_DATA = {
    madrid: {
        name: "Madrid",
        percentage: 0.40,
        maxBase: 9279,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora", "empresa joven", "todos"],
        requirements: "Permanencia 3 años, 5 empleados mínimo",
        riskLevel: "bajo"
    },
    cataluna: {
        name: "Cataluña",
        percentage: 0.50,
        maxBase: 12000,
        compatible: false,
        special: true,
        acceptedProfiles: ["empresa base tecnológica", "empresa innovadora"],
        requirements: "Business angel acreditado",
        riskLevel: "alto"
    },
    valencia: {
        name: "Valencia",
        percentage: 0.30,
        maxBase: 6000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "empresa tecnológica", "todos"],
        requirements: "Sede en la Comunidad Valenciana",
        riskLevel: "bajo"
    },
    andalucia: {
        name: "Andalucía",
        percentage: 0.25,
        maxBase: 10000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa joven", "empresa innovadora", "todos"],
        requirements: "Antigüedad máxima 5 años",
        riskLevel: "medio"
    },
    pais_vasco: {
        name: "País Vasco",
        percentage: 0.35,
        maxBase: 15000,
        compatible: true,
        special: true,
        acceptedProfiles: ["empresa base tecnológica", "empresa innovadora", "todos"],
        requirements: "Normativa foral específica",
        riskLevel: "medio"
    },
    galicia: {
        name: "Galicia",
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "empresa innovadora", "todos"],
        requirements: "Registro previo en IGAPE",
        riskLevel: "bajo"
    },
    castilla_leon: {
        name: "Castilla y León",
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "todos"],
        requirements: "Sede social en la comunidad",
        riskLevel: "bajo"
    },
    aragon: {
        name: "Aragón",
        percentage: 0.25,
        maxBase: 9000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa innovadora", "todos"],
        requirements: "Actividad en Aragón",
        riskLevel: "medio"
    },
    canarias: {
        name: "Canarias",
        percentage: 0.30,
        maxBase: 7500,
        compatible: true,
        special: true,
        acceptedProfiles: ["empresa local", "empresa tecnológica", "todos"],
        requirements: "Régimen Económico y Fiscal especial",
        riskLevel: "medio"
    },
    cantabria: {
        name: "Cantabria",
        percentage: 0.20,
        maxBase: 5000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "todos"],
        requirements: "Domicilio fiscal en Cantabria",
        riskLevel: "bajo"
    },
    castilla_mancha: {
        name: "Castilla-La Mancha",
        percentage: 0.15,
        maxBase: 4000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "todos"],
        requirements: "Actividad en la región",
        riskLevel: "bajo"
    },
    extremadura: {
        name: "Extremadura",
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "empresa joven", "todos"],
        requirements: "Sede en Extremadura",
        riskLevel: "bajo"
    },
    baleares: {
        name: "Islas Baleares",
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "empresa innovadora", "todos"],
        requirements: "Domicilio en las islas",
        riskLevel: "medio"
    },
    rioja: {
        name: "La Rioja",
        percentage: 0.20,
        maxBase: 5000,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "todos"],
        requirements: "Actividad en La Rioja",
        riskLevel: "bajo"
    },
    murcia: {
        name: "Murcia",
        percentage: 0.20,
        maxBase: 5500,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "empresa joven", "todos"],
        requirements: "Sede en la Región de Murcia",
        riskLevel: "bajo"
    },
    navarra: {
        name: "Navarra",
        percentage: 0.30,
        maxBase: 10000,
        compatible: true,
        special: true,
        acceptedProfiles: ["empresa innovadora", "empresa base tecnológica", "todos"],
        requirements: "Normativa foral específica",
        riskLevel: "medio"
    },
    asturias: {
        name: "Asturias",
        percentage: 0.25,
        maxBase: 6500,
        compatible: true,
        special: false,
        acceptedProfiles: ["empresa local", "empresa innovadora", "todos"],
        requirements: "Domicilio en Asturias",
        riskLevel: "medio"
    }
};

// Variables globales de la aplicación
let currentSimulation = null;
let multiYearStrategy = null;
let monteCarloResults = null;
let fiscalEngine = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando INVERTAX v4.0...');
    initializeApp();
});

async function initializeApp() {
    try {
        console.log('📊 Inicializando componentes...');
        
        // Inicializar motor fiscal
        fiscalEngine = new AdvancedFiscalEngine();
        
        // Inicializar componentes de la UI
        initializeNavigation();
        initializeCCAASelectors();
        initializeFormTabs();
        initializeQuickCalculator();
        initializeCCAACompatibilityGrid();
        
        // Registrar Service Worker para PWA
        registerServiceWorker();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('✅ INVERTAX v4.0 inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        showToast('Error al inicializar la aplicación', 'error');
    }
}

function initializeNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('nav__menu--open');
            
            navMenu.classList.toggle('nav__menu--open');
            navToggle.classList.toggle('nav__toggle--open');
            navToggle.setAttribute('aria-expanded', !isOpen);
        });
        
        setupResponsiveNavigation();
    } else {
        console.warn('⚠️ Elementos de navegación no encontrados');
    }
}

function setupResponsiveNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    const navMenu = document.querySelector('.nav__menu');
    const navToggle = document.querySelector('.nav__toggle');
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav__menu--open');
            navToggle.classList.remove('nav__toggle--open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('nav__menu--open');
            navToggle.classList.remove('nav__toggle--open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
            navMenu.classList.remove('nav__menu--open');
            navToggle.classList.remove('nav__toggle--open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function initializeCCAASelectors() {
    const selectors = ['#ccaa', '#multiyearCCAA', '#quickCCAA'];
    
    selectors.forEach(selectorId => {
        const selector = document.querySelector(selectorId);
        if (selector) {
            // Limpiar opciones existentes excepto la primera
            while (selector.children.length > 1) {
                selector.removeChild(selector.lastChild);
            }
            
            // Añadir opciones de CCAA
            Object.entries(CCAA_DATA).forEach(([key, ccaa]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${ccaa.name} (${(ccaa.percentage * 100).toFixed(0)}%)`;
                selector.appendChild(option);
            });
        }
    });
}

function initializeFormTabs() {
    const tabs = document.querySelectorAll('.form-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remover clase active de todos los tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar tab seleccionado
            this.classList.add('active');
            
            // Mostrar contenido correspondiente
            const targetContent = document.getElementById(`${targetTab}Form`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function initializeQuickCalculator() {
    const inputs = ['#quickInvestment', '#quickYears', '#quickCCAA'];
    
    inputs.forEach(inputId => {
        const input = document.querySelector(inputId);
        if (input) {
            input.addEventListener('input', updateQuickCalculator);
            input.addEventListener('change', updateQuickCalculator);
        }
    });
    
    // Cálculo inicial
    updateQuickCalculator();
}

function updateQuickCalculator() {
    const investment = parseFloat(document.getElementById('quickInvestment')?.value) || 50000;
    const years = parseInt(document.getElementById('quickYears')?.value) || 5;
    const ccaaCode = document.getElementById('quickCCAA')?.value || 'madrid';
    
    const ccaaData = CCAA_DATA[ccaaCode];
    if (!ccaaData) return;
    
    // Cálculo simplificado para la calculadora rápida
    const annualStateDeduction = Math.min(investment * 0.5, 25000); // Asumiendo cuota suficiente
    const annualRegionalDeduction = Math.min(investment * ccaaData.percentage, ccaaData.maxBase * ccaaData.percentage);
    const annualTotalDeduction = annualStateDeduction + (ccaaData.compatible ? annualRegionalDeduction : 0);
    
    const totalInvestment = investment * years;
    const totalDeduction = annualTotalDeduction * years;
    const fiscalReturn = (totalDeduction / totalInvestment) * 100;
    const netInvestment = totalInvestment - totalDeduction;
    
    // Actualizar resultados
    const resultsContainer = document.getElementById('quickResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="roi-result-card">
                <div class="roi-result-value">€${totalInvestment.toLocaleString()}</div>
                <div class="roi-result-label">Inversión Total</div>
            </div>
            <div class="roi-result-card">
                <div class="roi-result-value">€${totalDeduction.toLocaleString()}</div>
                <div class="roi-result-label">Ahorro Fiscal</div>
            </div>
            <div class="roi-result-card">
                <div class="roi-result-value">${fiscalReturn.toFixed(1)}%</div>
                <div class="roi-result-label">Rentabilidad Fiscal</div>
            </div>
            <div class="roi-result-card">
                <div class="roi-result-value">€${netInvestment.toLocaleString()}</div>
                <div class="roi-result-label">Inversión Neta</div>
            </div>
        `;
    }
}

function initializeCCAACompatibilityGrid() {
    const container = document.getElementById('ccaaCompatibility');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(CCAA_DATA).forEach(([key, ccaa]) => {
        const ccaaCard = document.createElement('div');
        ccaaCard.className = `ccaa-legal-item ${ccaa.compatible ? 'compatible' : 'incompatible'}`;
        
        ccaaCard.innerHTML = `
            <div class="ccaa-legal-header">
                <h4>${ccaa.name}</h4>
                <span class="ccaa-percentage">${(ccaa.percentage * 100).toFixed(0)}%</span>
            </div>
            <div class="ccaa-legal-details">
                <p><strong>Base máxima:</strong> €${ccaa.maxBase.toLocaleString()}</p>
                <p><strong>Compatibilidad:</strong> 
                    <span class="compatibility-badge ${ccaa.compatible ? 'compatible' : 'incompatible'}">
                        ${ccaa.compatible ? 'Compatible' : 'No Compatible'}
                    </span>
                </p>
                <p><strong>Riesgo:</strong> 
                    <span class="risk-badge risk-${ccaa.riskLevel}">
                        ${ccaa.riskLevel.charAt(0).toUpperCase() + ccaa.riskLevel.slice(1)}
                    </span>
                </p>
                <p><strong>Requisitos:</strong> ${ccaa.requirements}</p>
            </div>
        `;
        
        container.appendChild(ccaaCard);
    });
}

function setupEventListeners() {
    // Event listeners para formularios
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Event listeners para navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Funciones de cálculo principales

async function calculateSingleYear() {
    try {
        showLoadingIndicator('Calculando optimización fiscal...');
        
        const investment = parseFloat(document.getElementById('investment').value);
        const ccaaCode = document.getElementById('ccaa').value;
        const stateQuota = parseFloat(document.getElementById('stateQuota').value);
        const regionalQuota = parseFloat(document.getElementById('regionalQuota').value);
        
        // Validaciones
        if (!investment || !ccaaCode || stateQuota === undefined || regionalQuota === undefined) {
            throw new Error('Por favor, completa todos los campos obligatorios');
        }
        
        if (investment < APP_CONFIG.limits.minInvestment || investment > APP_CONFIG.limits.maxInvestment) {
            throw new Error(`La inversión debe estar entre €${APP_CONFIG.limits.minInvestment.toLocaleString()} y €${APP_CONFIG.limits.maxInvestment.toLocaleString()}`);
        }
        
        // Realizar cálculo con el motor fiscal avanzado
        const result = fiscalEngine.calculateOptimalDeductions(
            investment,
            ccaaCode,
            stateQuota,
            regionalQuota
        );
        
        currentSimulation = result;
        
        // Mostrar resultados
        displaySingleYearResults(result);
        
        hideLoadingIndicator();
        showToast('Cálculo completado exitosamente', 'success');
        
    } catch (error) {
        hideLoadingIndicator();
        console.error('Error en cálculo:', error);
        showToast(error.message, 'error');
    }
}

async function calculateMultiYear() {
    try {
        showLoadingIndicator('Calculando estrategia plurianual...');
        
        const annualInvestment = parseFloat(document.getElementById('annualInvestment').value);
        const years = parseInt(document.getElementById('investmentYears').value);
        const ccaaCode = document.getElementById('multiyearCCAA').value;
        const growthRate = parseFloat(document.getElementById('growthRate').value) / 100 || 0.03;
        const annualStateQuota = parseFloat(document.getElementById('annualStateQuota').value);
        const annualRegionalQuota = parseFloat(document.getElementById('annualRegionalQuota').value);
        const strategy = document.getElementById('reinvestmentStrategy').value;
        
        // Validaciones
        if (!annualInvestment || !years || !ccaaCode || !annualStateQuota || !annualRegionalQuota) {
            throw new Error('Por favor, completa todos los campos obligatorios');
        }
        
        if (years < APP_CONFIG.limits.minYears || years > APP_CONFIG.limits.maxYears) {
            throw new Error(`El número de años debe estar entre ${APP_CONFIG.limits.minYears} y ${APP_CONFIG.limits.maxYears}`);
        }
        
        // Calcular estrategia plurianual
        const multiYearResult = calculateMultiYearStrategy({
            annualInvestment,
            years,
            ccaaCode,
            growthRate,
            annualStateQuota,
            annualRegionalQuota,
            strategy
        });
        
        multiYearStrategy = multiYearResult;
        
        // Mostrar resultados
        displayMultiYearResults(multiYearResult);
        
        hideLoadingIndicator();
        showToast('Estrategia plurianual calculada exitosamente', 'success');
        
    } catch (error) {
        hideLoadingIndicator();
        console.error('Error en cálculo plurianual:', error);
        showToast(error.message, 'error');
    }
}

async function calculateMonteCarlo() {
    try {
        showLoadingIndicator('Ejecutando simulación Monte Carlo...');
        
        const investment = parseFloat(document.getElementById('mcInvestment').value);
        const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) / 100 || 0.25;
        const volatility = parseFloat(document.getElementById('volatility').value) / 100 || 0.35;
        const timeHorizon = parseInt(document.getElementById('timeHorizon').value) || 5;
        const iterations = parseInt(document.getElementById('iterations').value) || 1000;
        
        // Validaciones
        if (!investment) {
            throw new Error('Por favor, introduce la inversión base');
        }
        
        if (iterations > APP_CONFIG.limits.maxIterations) {
            throw new Error(`El número máximo de iteraciones es ${APP_CONFIG.limits.maxIterations.toLocaleString()}`);
        }
        
        // Ejecutar simulación Monte Carlo usando Web Worker
        const monteCarloResult = await runMonteCarloSimulation({
            investment,
            expectedReturn,
            volatility,
            timeHorizon,
            iterations
        });
        
        monteCarloResults = monteCarloResult;
        
        // Mostrar resultados
        displayMonteCarloResults(monteCarloResult);
        
        hideLoadingIndicator();
        showToast('Simulación Monte Carlo completada', 'success');
        
    } catch (error) {
        hideLoadingIndicator();
        console.error('Error en Monte Carlo:', error);
        showToast(error.message, 'error');
    }
}

function calculateMultiYearStrategy(params) {
    const { annualInvestment, years, ccaaCode, growthRate, annualStateQuota, annualRegionalQuota, strategy } = params;
    const ccaaData = CCAA_DATA[ccaaCode];
    
    const yearlyResults = [];
    let cumulativeInvestment = 0;
    let cumulativeDeduction = 0;
    let cumulativeNetInvestment = 0;
    
    for (let year = 1; year <= years; year++) {
        // Calcular inversión del año según estrategia
        let yearInvestment = annualInvestment;
        if (strategy === 'increasing') {
            yearInvestment = annualInvestment * Math.pow(1 + growthRate, year - 1);
        } else if (strategy === 'optimized') {
            // Optimización automática basada en cuotas disponibles
            const availableQuota = annualStateQuota * Math.pow(1 + growthRate, year - 1);
            yearInvestment = Math.min(annualInvestment * Math.pow(1 + growthRate, year - 1), availableQuota * 2);
        }
        
        // Calcular cuotas del año
        const yearStateQuota = annualStateQuota * Math.pow(1 + growthRate, year - 1);
        const yearRegionalQuota = annualRegionalQuota * Math.pow(1 + growthRate, year - 1);
        
        // Calcular deducciones del año
        const stateDeduction = Math.min(yearInvestment * 0.5, yearStateQuota, 50000);
        const regionalDeduction = ccaaData.compatible ? 
            Math.min(yearInvestment * ccaaData.percentage, yearRegionalQuota, ccaaData.maxBase * ccaaData.percentage) : 0;
        
        const totalYearDeduction = stateDeduction + regionalDeduction;
        const netYearInvestment = yearInvestment - totalYearDeduction;
        
        // Acumular totales
        cumulativeInvestment += yearInvestment;
        cumulativeDeduction += totalYearDeduction;
        cumulativeNetInvestment += netYearInvestment;
        
        yearlyResults.push({
            year,
            investment: yearInvestment,
            stateDeduction,
            regionalDeduction,
            totalDeduction: totalYearDeduction,
            netInvestment: netYearInvestment,
            cumulativeInvestment,
            cumulativeDeduction,
            cumulativeNetInvestment,
            fiscalReturn: (totalYearDeduction / yearInvestment) * 100,
            cumulativeFiscalReturn: (cumulativeDeduction / cumulativeInvestment) * 100
        });
    }
    
    return {
        strategy: params,
        yearlyResults,
        summary: {
            totalInvestment: cumulativeInvestment,
            totalDeduction: cumulativeDeduction,
            totalNetInvestment: cumulativeNetInvestment,
            averageFiscalReturn: (cumulativeDeduction / cumulativeInvestment) * 100,
            totalSavings: cumulativeDeduction,
            effectiveInvestment: cumulativeNetInvestment
        },
        ccaaData
    };
}

function runMonteCarloSimulation(params) {
    return new Promise((resolve, reject) => {
        // Verificar si Web Workers están disponibles
        if (typeof Worker === 'undefined') {
            // Fallback: ejecutar simulación en el hilo principal
            resolve(runMonteCarloFallback(params));
            return;
        }
        
        try {
            const worker = new Worker('monteCarlo-worker.js');
            
            worker.postMessage(params);
            
            worker.onmessage = function(event) {
                const { success, data, error } = event.data;
                
                if (success) {
                    resolve(data);
                } else {
                    reject(new Error(error));
                }
                
                worker.terminate();
            };
            
            worker.onerror = function(error) {
                console.error('Error en Web Worker:', error);
                reject(error);
                worker.terminate();
            };
            
        } catch (error) {
            console.warn('Web Worker no disponible, usando fallback');
            resolve(runMonteCarloFallback(params));
        }
    });
}

function runMonteCarloFallback(params) {
    const { investment, expectedReturn, volatility, timeHorizon, iterations } = params;
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
        let value = investment;
        
        for (let year = 0; year < timeHorizon; year++) {
            const randomShock = normalRandom();
            const drift = (expectedReturn - 0.5 * Math.pow(volatility, 2));
            const diffusion = volatility * randomShock;
            
            value *= Math.exp(drift + diffusion);
        }
        
        results.push(value);
    }
    
    results.sort((a, b) => a - b);
    
    return {
        scenarios: results,
        statistics: {
            mean: results.reduce((sum, val) => sum + val, 0) / iterations,
            median: results[Math.floor(iterations * 0.5)],
            p5: results[Math.floor(iterations * 0.05)],
            p25: results[Math.floor(iterations * 0.25)],
            p75: results[Math.floor(iterations * 0.75)],
            p95: results[Math.floor(iterations * 0.95)],
            min: results[0],
            max: results[iterations - 1]
        },
        calculations: params
    };
}

function normalRandom() {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Funciones de visualización de resultados

function displaySingleYearResults(result) {
    const container = document.getElementById('simulatorResults');
    if (!container) return;
    
    container.innerHTML = `
        <div class="results-container">
            <div class="results-main">
                <div class="results-header">
                    <h3>📊 Resultados de Optimización Fiscal</h3>
                    <div class="results-badges">
                        <span class="badge badge--success">Cálculo Completado</span>
                        <span class="badge badge--info">${result.ccaaData.name}</span>
                    </div>
                </div>
                
                <div class="result-main-kpi">
                    <div class="kpi-card">
                        <div class="kpi-value">€${result.totalDeduction.toLocaleString()}</div>
                        <div class="kpi-label">Ahorro Fiscal Total</div>
                        <div class="kpi-change positive">+${result.effectiveFiscalReturn.toFixed(1)}%</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">€${result.totalUsedInvestment.toLocaleString()}</div>
                        <div class="kpi-label">Inversión Utilizada</div>
                        <div class="kpi-change neutral">${((result.totalUsedInvestment / result.totalInvestment) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${result.effectiveFiscalReturn.toFixed(1)}%</div>
                        <div class="kpi-label">Rentabilidad Fiscal</div>
                        <div class="kpi-change positive">Efectiva</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">€${result.unoptimizedCapital.toLocaleString()}</div>
                        <div class="kpi-label">Capital No Optimizado</div>
                        <div class="kpi-change ${result.unoptimizedCapital > 0 ? 'warning' : 'positive'}">
                            ${result.unoptimizedCapital > 0 ? 'Mejorable' : 'Óptimo'}
                        </div>
                    </div>
                </div>
                
                ${generateDistributionChart(result)}
                ${generateRecommendations(result)}
                ${generateLegalInfo(result)}
                
                <div class="results-actions">
                    <button class="btn btn--primary" onclick="exportToPDF('single')">
                        📄 Exportar PDF
                    </button>
                    <button class="btn btn--secondary" onclick="exportToJSON('single')">
                        💾 Exportar JSON
                    </button>
                    <button class="btn btn--outline" onclick="shareResults('single')">
                        📤 Compartir
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth' });
}

function displayMultiYearResults(result) {
    const container = document.getElementById('simulatorResults');
    const multiyearSection = document.getElementById('multiyearResults');
    
    if (!container || !multiyearSection) return;
    
    // Mostrar resumen principal
    container.innerHTML = `
        <div class="results-container">
            <div class="results-main">
                <div class="results-header">
                    <h3>📊 Estrategia Plurianual - ${result.strategy.years} Años</h3>
                    <div class="results-badges">
                        <span class="badge badge--success">Estrategia Calculada</span>
                        <span class="badge badge--info">${result.ccaaData.name}</span>
                        <span class="badge badge--warning">${result.strategy.strategy}</span>
                    </div>
                </div>
                
                <div class="result-main-kpi">
                    <div class="kpi-card">
                        <div class="kpi-value">€${result.summary.totalDeduction.toLocaleString()}</div>
                        <div class="kpi-label">Ahorro Fiscal Total</div>
                        <div class="kpi-change positive">+${result.summary.averageFiscalReturn.toFixed(1)}%</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">€${result.summary.totalInvestment.toLocaleString()}</div>
                        <div class="kpi-label">Inversión Total</div>
                        <div class="kpi-change neutral">${result.strategy.years} años</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">€${result.summary.totalNetInvestment.toLocaleString()}</div>
                        <div class="kpi-label">Inversión Neta</div>
                        <div class="kpi-change positive">Después de deducciones</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${result.yearlyResults.length}</div>
                        <div class="kpi-label">Empresas Diferentes</div>
                        <div class="kpi-change positive">Diversificación</div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn--primary" onclick="exportToPDF('multiyear')">
                        📄 Exportar Estrategia PDF
                    </button>
                    <button class="btn btn--secondary" onclick="exportToJSON('multiyear')">
                        💾 Exportar JSON
                    </button>
                    <button class="btn btn--outline" onclick="shareResults('multiyear')">
                        📤 Compartir Estrategia
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Mostrar timeline detallado
    const timelineContainer = document.getElementById('yearlyBreakdown');
    if (timelineContainer) {
        timelineContainer.innerHTML = result.yearlyResults.map(year => `
            <div class="timeline-year">
                <div class="year-label">Año ${year.year}</div>
                <div class="year-investment">€${year.investment.toLocaleString()}</div>
                <div class="year-deduction">€${year.totalDeduction.toLocaleString()}</div>
                <div class="year-cumulative">€${year.cumulativeDeduction.toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    // Mostrar resumen plurianual
    const summaryContainer = document.getElementById('multiyearSummary');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="multiyear-summary-content">
                <h5>📈 Resumen de la Estrategia</h5>
                <div class="summary-grid">
                    <div class="summary-item">
                        <strong>Efecto Acumulativo:</strong>
                        <span>Cada año sumas €${(result.summary.totalDeduction / result.strategy.years).toLocaleString()} promedio en deducciones</span>
                    </div>
                    <div class="summary-item">
                        <strong>Diversificación:</strong>
                        <span>${result.strategy.years} empresas diferentes, reduciendo riesgo de concentración</span>
                    </div>
                    <div class="summary-item">
                        <strong>Optimización Fiscal:</strong>
                        <span>${result.summary.averageFiscalReturn.toFixed(1)}% de rentabilidad fiscal promedio anual</span>
                    </div>
                    <div class="summary-item">
                        <strong>Inversión Efectiva:</strong>
                        <span>Solo pagas €${result.summary.totalNetInvestment.toLocaleString()} de €${result.summary.totalInvestment.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    multiyearSection.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
}

function displayMonteCarloResults(result) {
    const container = document.getElementById('simulatorResults');
    if (!container) return;
    
    const stats = result.statistics;
    const roi = ((stats.median - result.calculations.investment) / result.calculations.investment) * 100;
    
    container.innerHTML = `
        <div class="results-container">
            <div class="results-main">
                <div class="results-header">
                    <h3>🎲 Simulación Monte Carlo</h3>
                    <div class="results-badges">
                        <span class="badge badge--success">${result.calculations.iterations.toLocaleString()} Iteraciones</span>
                        <span class="badge badge--info">${result.calculations.timeHorizon} Años</span>
                    </div>
                </div>
                
                <div class="result-main-kpi">
                    <div class="kpi-card">
                        <div class="kpi-value">€${stats.median.toLocaleString()}</div>
                        <div class="kpi-label">Valor Esperado (P50)</div>
                        <div class="kpi-change ${roi > 0 ? 'positive' : 'warning'}">+${roi.toFixed(1)}%</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">€${stats.p25.toLocaleString()}</div>
                        <div class="kpi-label">Escenario Conservador (P25)</div>
                        <div class="kpi-change neutral">25% probabilidad</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">€${stats.p75.toLocaleString()}</div>
                        <div class="kpi-label">Escenario Optimista (P75)</div>
                        <div class="kpi-change positive">75% probabilidad</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">€${stats.p5.toLocaleString()}</div>
                        <div class="kpi-label">Peor Caso (P5)</div>
                        <div class="kpi-change warning">5% probabilidad</div>
                    </div>
                </div>
                
                <div class="montecarlo-analysis">
                    <h4>📊 Análisis de Distribución</h4>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <strong>Rango de Resultados:</strong>
                            <span>€${stats.min.toLocaleString()} - €${stats.max.toLocaleString()}</span>
                        </div>
                        <div class="analysis-item">
                            <strong>Volatilidad:</strong>
                            <span>${(result.calculations.volatility * 100).toFixed(1)}% anual</span>
                        </div>
                        <div class="analysis-item">
                            <strong>Retorno Esperado:</strong>
                            <span>${(result.calculations.expectedReturn * 100).toFixed(1)}% anual</span>
                        </div>
                        <div class="analysis-item">
                            <strong>Probabilidad de Ganancia:</strong>
                            <span>${((result.scenarios.filter(s => s > result.calculations.investment).length / result.scenarios.length) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn--primary" onclick="exportToPDF('montecarlo')">
                        📄 Exportar Análisis PDF
                    </button>
                    <button class="btn btn--secondary" onclick="exportToJSON('montecarlo')">
                        💾 Exportar Datos JSON
                    </button>
                    <button class="btn btn--outline" onclick="shareResults('montecarlo')">
                        📤 Compartir Análisis
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth' });
}

function generateDistributionChart(result) {
    if (!result.distributions || result.distributions.length === 0) {
        return '<div class="no-distribution">No hay distribución de inversión disponible</div>';
    }
    
    return `
        <div class="distribution-section">
            <h4>💰 Distribución Óptima de la Inversión</h4>
            <div class="distribution-chart">
                ${result.distributions.map(dist => `
                    <div class="distribution-item">
                        <div class="distribution-header">
                            <h5>${dist.project}</h5>
                            <span class="distribution-amount">€${dist.investment.toLocaleString()}</span>
                        </div>
                        <div class="distribution-bar">
                            <div class="distribution-fill ${dist.type}" style="width: ${(dist.investment / result.totalInvestment) * 100}%"></div>
                        </div>
                        <div class="distribution-details">
                            <span>Deducción: €${dist.deduction.toLocaleString()}</span>
                            <span>Tipo: ${(dist.deductionRate * 100).toFixed(0)}%</span>
                            <span>Eficiencia: ${(dist.efficiency * 100).toFixed(1)}%</span>
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
                            <div class="distribution-fill unoptimized" style="width: ${(result.unoptimizedCapital / result.totalInvestment) * 100}%"></div>
                        </div>
                        <p class="distribution-description">Este capital no genera deducciones fiscales. Considera ajustar cuotas o distribución temporal.</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function generateRecommendations(result) {
    if (!result.recommendations || result.recommendations.length === 0) {
        return '';
    }
    
    return `
        <div class="recommendations-section">
            <h4>💡 Recomendaciones Personalizadas</h4>
            <div class="recommendations-list">
                ${result.recommendations.map(rec => `
                    <div class="recommendation-item ${rec.type}">
                        <div class="recommendation-header">
                            <span class="recommendation-icon">${getRecommendationIcon(rec.type)}</span>
                            <h5>${rec.title}</h5>
                            <span class="recommendation-priority priority-${rec.priority}">${rec.priority}</span>
                        </div>
                        <p class="recommendation-message">${rec.message}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateLegalInfo(result) {
    return `
        <div class="legal-info">
            <div class="legal-section">
                <h5>⚖️ Información Legal</h5>
                <ul class="legal-list">
                    <li>Cálculo basado en Art. 68.1 LIRPF vigente</li>
                    <li>Deducciones aplicables según normativa ${result.ccaaData.name}</li>
                    <li>Permanencia mínima requerida: 3 años</li>
                    <li>Empresas deben cumplir requisitos específicos</li>
                </ul>
            </div>
            <div class="legal-section">
                <h5>📋 Requisitos ${result.ccaaData.name}</h5>
                <ul class="legal-list">
                    <li>Porcentaje deducción: ${(result.ccaaData.percentage * 100).toFixed(0)}%</li>
                    <li>Base máxima: €${result.ccaaData.maxBase.toLocaleString()}</li>
                    <li>Compatible con estatal: ${result.ccaaData.compatible ? 'Sí' : 'No'}</li>
                    <li>Requisitos: ${result.ccaaData.requirements}</li>
                </ul>
            </div>
            <div class="legal-disclaimer">
                <p>
                    <strong>Importante:</strong> Esta simulación es orientativa. Los resultados reales pueden variar 
                    según tu situación fiscal específica. Recomendamos consultar con un asesor fiscal cualificado 
                    antes de realizar cualquier inversión.
                </p>
            </div>
        </div>
    `;
}

function getRecommendationIcon(type) {
    const icons = {
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️',
        error: '❌'
    };
    return icons[type] || 'ℹ️';
}

// Funciones de exportación y compartir

function exportToPDF(type) {
    try {
        let data, filename;
        
        switch (type) {
            case 'single':
                data = currentSimulation;
                filename = 'invertax-simulacion-fiscal.pdf';
                break;
            case 'multiyear':
                data = multiYearStrategy;
                filename = 'invertax-estrategia-plurianual.pdf';
                break;
            case 'montecarlo':
                data = monteCarloResults;
                filename = 'invertax-analisis-montecarlo.pdf';
                break;
            default:
                throw new Error('Tipo de exportación no válido');
        }
        
        if (!data) {
            throw new Error('No hay datos para exportar');
        }
        
        // Generar PDF (implementación simplificada)
        const pdfContent = generatePDFContent(data, type);
        downloadFile(pdfContent, filename, 'application/pdf');
        
        showToast('PDF exportado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error exportando PDF:', error);
        showToast(error.message, 'error');
    }
}

function exportToJSON(type) {
    try {
        let data, filename;
        
        switch (type) {
            case 'single':
                data = currentSimulation;
                filename = 'invertax-simulacion-fiscal.json';
                break;
            case 'multiyear':
                data = multiYearStrategy;
                filename = 'invertax-estrategia-plurianual.json';
                break;
            case 'montecarlo':
                data = monteCarloResults;
                filename = 'invertax-analisis-montecarlo.json';
                break;
            default:
                throw new Error('Tipo de exportación no válido');
        }
        
        if (!data) {
            throw new Error('No hay datos para exportar');
        }
        
        const jsonContent = JSON.stringify(data, null, 2);
        downloadFile(jsonContent, filename, 'application/json');
        
        showToast('JSON exportado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error exportando JSON:', error);
        showToast(error.message, 'error');
    }
}

function shareResults(type) {
    try {
        let data, title;
        
        switch (type) {
            case 'single':
                data = currentSimulation;
                title = 'Simulación Fiscal INVERTAX';
                break;
            case 'multiyear':
                data = multiYearStrategy;
                title = 'Estrategia Plurianual INVERTAX';
                break;
            case 'montecarlo':
                data = monteCarloResults;
                title = 'Análisis Monte Carlo INVERTAX';
                break;
            default:
                throw new Error('Tipo de compartir no válido');
        }
        
        if (!data) {
            throw new Error('No hay datos para compartir');
        }
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: generateShareText(data, type),
                url: window.location.href
            });
        } else {
            // Fallback: copiar al portapapeles
            const shareText = generateShareText(data, type);
            navigator.clipboard.writeText(shareText).then(() => {
                showToast('Enlace copiado al portapapeles', 'success');
            });
        }
        
    } catch (error) {
        console.error('Error compartiendo:', error);
        showToast(error.message, 'error');
    }
}

function generatePDFContent(data, type) {
    // Implementación simplificada de generación de PDF
    // En una implementación real, usarías una librería como jsPDF
    return `PDF Content for ${type}: ${JSON.stringify(data, null, 2)}`;
}

function generateShareText(data, type) {
    switch (type) {
        case 'single':
            return `He calculado mi optimización fiscal con INVERTAX: €${data.totalDeduction.toLocaleString()} de ahorro fiscal con ${data.effectiveFiscalReturn.toFixed(1)}% de rentabilidad. ¡Descubre tu potencial!`;
        case 'multiyear':
            return `Mi estrategia plurianual INVERTAX: €${data.summary.totalDeduction.toLocaleString()} de ahorro fiscal en ${data.strategy.years} años. ¡El efecto acumulativo es increíble!`;
        case 'montecarlo':
            return `Análisis Monte Carlo INVERTAX: Valor esperado €${data.statistics.median.toLocaleString()} con ${data.calculations.iterations.toLocaleString()} simulaciones. ¡Datos que respaldan la decisión!`;
        default:
            return 'Descubre tu potencial de optimización fiscal con INVERTAX';
    }
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Funciones de UI y utilidades

function showLoadingIndicator(message = 'Cargando...') {
    const existingIndicator = document.getElementById('loadingIndicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.id = 'loadingIndicator';
    indicator.className = 'loading-indicator loading-indicator--show';
    indicator.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-message">${message}</div>
        </div>
    `;
    
    document.body.appendChild(indicator);
}

function hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.classList.remove('loading-indicator--show');
        setTimeout(() => indicator.remove(), 300);
    }
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type} toast--show`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('toast--show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validaciones básicas
    if (!data.contactName || !data.contactEmail || !data.contactMessage) {
        showToast('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Simular envío (en producción, enviarías a tu backend)
    showLoadingIndicator('Enviando consulta...');
    
    setTimeout(() => {
        hideLoadingIndicator();
        showToast('Consulta enviada exitosamente. Te contactaremos pronto.', 'success');
        event.target.reset();
    }, 2000);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.warn('⚠️ Error registrando Service Worker:', error);
            });
    }
}

// Exportar funciones globales para uso en HTML
window.calculateSingleYear = calculateSingleYear;
window.calculateMultiYear = calculateMultiYear;
window.calculateMonteCarlo = calculateMonteCarlo;
window.exportToPDF = exportToPDF;
window.exportToJSON = exportToJSON;
window.shareResults = shareResults;

console.log('✅ INVERTAX v4.0 - Aplicación cargada correctamente');