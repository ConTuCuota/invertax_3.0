// INVERTAX - Aplicación Principal v3.0
// Sistema de optimización fiscal avanzado con cálculos corregidos

// Configuración global de la aplicación
const APP_CONFIG = {
    version: '3.0.0',
    name: 'INVERTAX',
    debug: false,
    features: {
        monteCarlo: true,
        multiyear: true,
        export: true,
        offline: true
    }
};

// Base de datos de CCAA con datos fiscales reales y corregidos
const CCAA_DATA = {
    madrid: {
        name: 'Madrid',
        percentage: 0.40,
        maxBase: 9279,
        compatible: true,
        requirements: ['Permanencia 3 años', 'Mínimo 5 empleados'],
        acceptedProfiles: ['tecnologia', 'innovacion', 'i+d', 'todos']
    },
    cataluna: {
        name: 'Cataluña',
        percentage: 0.50,
        maxBase: 12000,
        compatible: false, // No compatible con deducción estatal
        requirements: ['Business angel acreditado', 'Empresa catalana'],
        acceptedProfiles: ['tecnologia', 'innovacion', 'sostenibilidad']
    },
    valencia: {
        name: 'Valencia',
        percentage: 0.30,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Comunidad Valenciana'],
        acceptedProfiles: ['todos']
    },
    andalucia: {
        name: 'Andalucía',
        percentage: 0.25,
        maxBase: 10000,
        compatible: true,
        requirements: ['Antigüedad máxima 5 años'],
        acceptedProfiles: ['todos']
    },
    pais_vasco: {
        name: 'País Vasco',
        percentage: 0.35,
        maxBase: 15000,
        compatible: true,
        requirements: ['Normativa foral específica'],
        acceptedProfiles: ['tecnologia', 'industrial', 'innovacion']
    },
    galicia: {
        name: 'Galicia',
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        requirements: ['Registro previo en IGAPE'],
        acceptedProfiles: ['todos']
    },
    aragon: {
        name: 'Aragón',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Aragón'],
        acceptedProfiles: ['todos']
    },
    asturias: {
        name: 'Asturias',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Asturias'],
        acceptedProfiles: ['todos']
    },
    baleares: {
        name: 'Baleares',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Baleares'],
        acceptedProfiles: ['todos']
    },
    canarias: {
        name: 'Canarias',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Canarias'],
        acceptedProfiles: ['todos']
    },
    cantabria: {
        name: 'Cantabria',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Cantabria'],
        acceptedProfiles: ['todos']
    },
    castilla_leon: {
        name: 'Castilla y León',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Castilla y León'],
        acceptedProfiles: ['todos']
    },
    castilla_mancha: {
        name: 'Castilla-La Mancha',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Castilla-La Mancha'],
        acceptedProfiles: ['todos']
    },
    extremadura: {
        name: 'Extremadura',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Extremadura'],
        acceptedProfiles: ['todos']
    },
    murcia: {
        name: 'Murcia',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Murcia'],
        acceptedProfiles: ['todos']
    },
    navarra: {
        name: 'Navarra',
        percentage: 0.30,
        maxBase: 6000,
        compatible: true,
        requirements: ['Normativa foral específica'],
        acceptedProfiles: ['todos']
    },
    rioja: {
        name: 'La Rioja',
        percentage: 0.25,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en La Rioja'],
        acceptedProfiles: ['todos']
    }
};

// Motor de cálculo fiscal corregido
class FiscalCalculator {
    constructor() {
        this.STATE_DEDUCTION_RATE = 0.50;
        this.STATE_MAX_BASE = 100000;
        this.MIN_INVESTMENT = 1000;
    }

    /**
     * Cálculo principal corregido - Modelo INVERTAX real
     * La clave: empresas independientes para evitar solapamiento de bases
     */
    calculateOptimalStrategy(stateQuota, regionalQuota, ccaaCode) {
        const ccaaData = CCAA_DATA[ccaaCode];
        if (!ccaaData) {
            throw new Error('CCAA no válida');
        }

        const result = {
            stateQuota,
            regionalQuota,
            ccaa: ccaaCode,
            ccaaData,
            distributions: [],
            totals: {
                totalInvestment: 0,
                totalDeduction: 0,
                effectiveFiscalReturn: 0,
                unoptimizedCapital: 0
            },
            warnings: [],
            recommendations: []
        };

        // PASO 1: Optimizar deducción estatal (Empresa A)
        const stateOptimization = this.optimizeStateDeduction(stateQuota);
        if (stateOptimization.investment > 0) {
            result.distributions.push({
                company: 'Empresa A',
                type: 'Deducción Estatal',
                investment: stateOptimization.investment,
                deductionRate: this.STATE_DEDUCTION_RATE,
                deduction: stateOptimization.deduction,
                efficiency: (stateOptimization.deduction / stateOptimization.investment) * 100,
                description: 'Art. 68.1 LIRPF - Deducción estatal del 50%'
            });
            
            result.totals.totalInvestment += stateOptimization.investment;
            result.totals.totalDeduction += stateOptimization.deduction;
        }

        // PASO 2: Optimizar deducción autonómica (Empresa B independiente)
        if (ccaaData.compatible && regionalQuota > 0) {
            const regionalOptimization = this.optimizeRegionalDeduction(regionalQuota, ccaaData);
            if (regionalOptimization.investment > 0) {
                result.distributions.push({
                    company: 'Empresa B',
                    type: 'Deducción Autonómica',
                    investment: regionalOptimization.investment,
                    deductionRate: ccaaData.percentage,
                    deduction: regionalOptimization.deduction,
                    efficiency: (regionalOptimization.deduction / regionalOptimization.investment) * 100,
                    description: `Deducción ${ccaaData.name} - ${(ccaaData.percentage * 100).toFixed(0)}%`
                });
                
                result.totals.totalInvestment += regionalOptimization.investment;
                result.totals.totalDeduction += regionalOptimization.deduction;
            }
        } else if (!ccaaData.compatible) {
            result.warnings.push({
                type: 'incompatibility',
                message: `${ccaaData.name} no permite combinar deducciones estatales y autonómicas en la misma declaración`,
                impact: 'high'
            });
        }

        // PASO 3: Calcular rentabilidad fiscal real
        if (result.totals.totalInvestment > 0) {
            result.totals.effectiveFiscalReturn = 
                (result.totals.totalDeduction / result.totals.totalInvestment) * 100;
        }

        // PASO 4: Detectar capital no optimizado
        const potentialStateInvestment = Math.min(stateQuota / this.STATE_DEDUCTION_RATE, this.STATE_MAX_BASE);
        const potentialRegionalInvestment = ccaaData.compatible ? 
            Math.min(regionalQuota / ccaaData.percentage, ccaaData.maxBase) : 0;
        
        const maxPossibleInvestment = potentialStateInvestment + potentialRegionalInvestment;
        result.totals.unoptimizedCapital = Math.max(0, maxPossibleInvestment - result.totals.totalInvestment);

        // PASO 5: Generar recomendaciones
        this.generateRecommendations(result);

        return result;
    }

    /**
     * Optimización de deducción estatal
     */
    optimizeStateDeduction(stateQuota) {
        if (stateQuota <= 0) {
            return { investment: 0, deduction: 0 };
        }

        // Inversión necesaria para agotar la cuota estatal
        const investmentNeeded = stateQuota / this.STATE_DEDUCTION_RATE;
        
        // Limitada por el máximo legal
        const optimalInvestment = Math.min(investmentNeeded, this.STATE_MAX_BASE);
        
        // Deducción real obtenida
        const actualDeduction = Math.min(optimalInvestment * this.STATE_DEDUCTION_RATE, stateQuota);

        return {
            investment: optimalInvestment,
            deduction: actualDeduction
        };
    }

    /**
     * Optimización de deducción autonómica
     */
    optimizeRegionalDeduction(regionalQuota, ccaaData) {
        if (regionalQuota <= 0 || !ccaaData.compatible) {
            return { investment: 0, deduction: 0 };
        }

        // Inversión necesaria para agotar la cuota autonómica
        const investmentNeeded = regionalQuota / ccaaData.percentage;
        
        // Limitada por el máximo autonómico
        const optimalInvestment = Math.min(investmentNeeded, ccaaData.maxBase);
        
        // Deducción real obtenida
        const actualDeduction = Math.min(optimalInvestment * ccaaData.percentage, regionalQuota);

        return {
            investment: optimalInvestment,
            deduction: actualDeduction
        };
    }

    /**
     * Cálculo plurianual con efecto acumulativo
     */
    calculateMultiyearStrategy(yearlyQuota, timeHorizon, ccaaCode, options = {}) {
        const {
            growthStrategy = 'inflation',
            reinvestment = 'partial'
        } = options;

        const ccaaData = CCAA_DATA[ccaaCode];
        const results = {
            years: [],
            totals: {
                totalInvestment: 0,
                totalDeduction: 0,
                averageFiscalReturn: 0,
                companiesFinanced: 0
            },
            strategy: {
                growthStrategy,
                reinvestment,
                timeHorizon
            }
        };

        let currentQuota = yearlyQuota;
        let reinvestmentPool = 0;

        for (let year = 1; year <= timeHorizon; year++) {
            // Aplicar estrategia de crecimiento
            if (year > 1) {
                switch (growthStrategy) {
                    case 'inflation':
                        currentQuota *= 1.025; // 2.5% inflación
                        break;
                    case 'income_growth':
                        currentQuota *= 1.05; // 5% crecimiento ingresos
                        break;
                    case 'aggressive':
                        currentQuota *= 1.10; // 10% crecimiento agresivo
                        break;
                    // 'fixed' no cambia
                }
            }

            // Calcular cuota autonómica proporcional
            const regionalQuota = currentQuota * 0.25; // Estimación 25% de la estatal

            // Añadir reinversión si aplica
            let adjustedStateQuota = currentQuota;
            if (reinvestmentPool > 0) {
                switch (reinvestment) {
                    case 'partial':
                        adjustedStateQuota += reinvestmentPool * 0.25;
                        break;
                    case 'full':
                        adjustedStateQuota += reinvestmentPool * 0.50;
                        break;
                }
            }

            // Calcular optimización para este año
            const yearResult = this.calculateOptimalStrategy(
                adjustedStateQuota, 
                regionalQuota, 
                ccaaCode
            );

            // Simular retorno de inversiones anteriores para reinversión
            if (year > 1) {
                const previousInvestment = results.years[year - 2].totals.totalInvestment;
                reinvestmentPool += previousInvestment * 0.15; // 15% retorno anual estimado
            }

            const yearData = {
                year,
                quota: {
                    state: Math.round(adjustedStateQuota),
                    regional: Math.round(regionalQuota)
                },
                ...yearResult,
                reinvestmentUsed: reinvestmentPool > 0 ? Math.round(adjustedStateQuota - currentQuota) : 0,
                companiesThisYear: yearResult.distributions.length
            };

            results.years.push(yearData);

            // Acumular totales
            results.totals.totalInvestment += yearResult.totals.totalInvestment;
            results.totals.totalDeduction += yearResult.totals.totalDeduction;
            results.totals.companiesFinanced += yearResult.distributions.length;
        }

        // Calcular rentabilidad media
        if (results.totals.totalInvestment > 0) {
            results.totals.averageFiscalReturn = 
                (results.totals.totalDeduction / results.totals.totalInvestment) * 100;
        }

        return results;
    }

    /**
     * Generar recomendaciones inteligentes
     */
    generateRecommendations(result) {
        const { totals, ccaaData, distributions } = result;

        // Recomendación de eficiencia
        if (totals.effectiveFiscalReturn > 45) {
            result.recommendations.push({
                type: 'success',
                title: 'Estrategia Altamente Eficiente',
                message: `Tu rentabilidad fiscal del ${totals.effectiveFiscalReturn.toFixed(1)}% está por encima de la media del mercado.`,
                priority: 'low'
            });
        } else if (totals.effectiveFiscalReturn < 30) {
            result.recommendations.push({
                type: 'warning',
                title: 'Oportunidad de Mejora',
                message: `Rentabilidad fiscal del ${totals.effectiveFiscalReturn.toFixed(1)}% es mejorable. Considera aumentar tus cuotas disponibles.`,
                priority: 'medium'
            });
        }

        // Recomendación de capital no optimizado
        if (totals.unoptimizedCapital > totals.totalInvestment * 0.1) {
            result.recommendations.push({
                type: 'info',
                title: 'Capital Sin Optimizar',
                message: `Tienes €${totals.unoptimizedCapital.toLocaleString()} de potencial adicional. Considera estrategias plurianuales.`,
                priority: 'medium'
            });
        }

        // Recomendación de diversificación
        if (distributions.length === 1) {
            result.recommendations.push({
                type: 'info',
                title: 'Diversificación de Riesgo',
                message: 'Considera invertir en múltiples empresas para reducir el riesgo de concentración.',
                priority: 'low'
            });
        }

        // Recomendación específica por CCAA
        if (!ccaaData.compatible) {
            result.recommendations.push({
                type: 'warning',
                title: 'Incompatibilidad Autonómica',
                message: `En ${ccaaData.name} debes elegir entre deducción estatal o autonómica. Evalúa cuál es más beneficiosa.`,
                priority: 'high'
            });
        }
    }
}

// Simulador Monte Carlo mejorado
class MonteCarloSimulator {
    constructor() {
        this.worker = null;
        this.isRunning = false;
    }

    async runSimulation(params) {
        return new Promise((resolve, reject) => {
            if (this.isRunning) {
                reject(new Error('Simulación ya en curso'));
                return;
            }

            this.isRunning = true;

            // Crear Web Worker si está disponible
            if (typeof Worker !== 'undefined') {
                try {
                    this.worker = new Worker('./monteCarlo-worker.js');
                    
                    this.worker.onmessage = (event) => {
                        this.isRunning = false;
                        if (event.data.success) {
                            resolve(event.data.data);
                        } else {
                            reject(new Error(event.data.error));
                        }
                        this.worker.terminate();
                    };

                    this.worker.onerror = (error) => {
                        this.isRunning = false;
                        reject(error);
                        this.worker.terminate();
                    };

                    this.worker.postMessage(params);
                } catch (error) {
                    // Fallback a simulación síncrona
                    this.isRunning = false;
                    resolve(this.runSyncSimulation(params));
                }
            } else {
                // Fallback a simulación síncrona
                this.isRunning = false;
                resolve(this.runSyncSimulation(params));
            }
        });
    }

    runSyncSimulation(params) {
        const { investment, expectedReturn, volatility, years, iterations } = params;
        const results = [];

        for (let i = 0; i < iterations; i++) {
            let value = investment;
            
            for (let year = 0; year < years; year++) {
                const randomShock = this.normalRandom();
                const drift = (expectedReturn / 100 - 0.5 * Math.pow(volatility / 100, 2));
                const diffusion = (volatility / 100) * randomShock;
                
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
            metrics: {
                roi: ((results[Math.floor(iterations * 0.5)] - investment) / investment) * 100,
                probabilityOfLoss: (results.filter(r => r < investment).length / iterations) * 100,
                successRate: (results.filter(r => r > investment * 1.1).length / iterations) * 100
            }
        };
    }

    normalRandom() {
        const u1 = Math.random();
        const u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }
}

// Gestor de exportación de resultados
class ExportManager {
    constructor() {
        this.supportedFormats = ['pdf', 'json', 'csv'];
    }

    async exportResults(results, format, filename = null) {
        if (!this.supportedFormats.includes(format)) {
            throw new Error(`Formato ${format} no soportado`);
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const defaultFilename = `invertax-results-${timestamp}`;

        switch (format) {
            case 'json':
                return this.exportJSON(results, filename || `${defaultFilename}.json`);
            case 'csv':
                return this.exportCSV(results, filename || `${defaultFilename}.csv`);
            case 'pdf':
                return this.exportPDF(results, filename || `${defaultFilename}.pdf`);
            default:
                throw new Error(`Formato ${format} no implementado`);
        }
    }

    exportJSON(results, filename) {
        const data = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: APP_CONFIG.version,
                type: 'fiscal_optimization_results'
            },
            results: results,
            hash: this.generateHash(JSON.stringify(results))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        this.downloadBlob(blob, filename);
        return true;
    }

    exportCSV(results, filename) {
        let csv = 'Concepto,Valor,Unidad\n';
        
        if (results.totals) {
            csv += `Inversión Total,${results.totals.totalInvestment},EUR\n`;
            csv += `Deducción Total,${results.totals.totalDeduction},EUR\n`;
            csv += `Rentabilidad Fiscal,${results.totals.effectiveFiscalReturn.toFixed(2)},%\n`;
        }

        if (results.distributions) {
            csv += '\nEmpresa,Tipo,Inversión,Deducción,Eficiencia\n';
            results.distributions.forEach(dist => {
                csv += `${dist.company},${dist.type},${dist.investment},${dist.deduction},${dist.efficiency.toFixed(2)}%\n`;
            });
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadBlob(blob, filename);
        return true;
    }

    exportPDF(results, filename) {
        // Simulación de exportación PDF
        // En una implementación real, usaríamos una librería como jsPDF
        const htmlContent = this.generatePDFContent(results);
        
        // Por ahora, abrimos en nueva ventana para imprimir
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        
        return true;
    }

    generatePDFContent(results) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>INVERTAX - Resultados de Optimización Fiscal</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .kpi { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>INVERTAX</h1>
                <h2>Resultados de Optimización Fiscal</h2>
                <p>Generado el: ${new Date().toLocaleString('es-ES')}</p>
            </div>
            
            <div class="section">
                <h3>Resumen Ejecutivo</h3>
                <div class="kpi">
                    <strong>Inversión Total:</strong><br>
                    €${results.totals?.totalInvestment?.toLocaleString() || 'N/A'}
                </div>
                <div class="kpi">
                    <strong>Deducción Total:</strong><br>
                    €${results.totals?.totalDeduction?.toLocaleString() || 'N/A'}
                </div>
                <div class="kpi">
                    <strong>Rentabilidad Fiscal:</strong><br>
                    ${results.totals?.effectiveFiscalReturn?.toFixed(2) || 'N/A'}%
                </div>
            </div>
            
            ${results.distributions ? `
            <div class="section">
                <h3>Distribución de Inversiones</h3>
                <table>
                    <tr>
                        <th>Empresa</th>
                        <th>Tipo</th>
                        <th>Inversión</th>
                        <th>Deducción</th>
                        <th>Eficiencia</th>
                    </tr>
                    ${results.distributions.map(dist => `
                    <tr>
                        <td>${dist.company}</td>
                        <td>${dist.type}</td>
                        <td>€${dist.investment.toLocaleString()}</td>
                        <td>€${dist.deduction.toLocaleString()}</td>
                        <td>${dist.efficiency.toFixed(2)}%</td>
                    </tr>
                    `).join('')}
                </table>
            </div>
            ` : ''}
            
            <div class="section">
                <h3>Aviso Legal</h3>
                <p><small>
                    Los resultados son orientativos y no constituyen asesoramiento fiscal personalizado. 
                    Recomendamos consultar con un asesor fiscal cualificado antes de tomar decisiones de inversión.
                </small></p>
            </div>
        </body>
        </html>
        `;
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateHash(data) {
        // Hash simple para verificación de integridad
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32-bit integer
        }
        return hash.toString(16);
    }
}

// Instancias globales
const fiscalCalculator = new FiscalCalculator();
const monteCarloSimulator = new MonteCarloSimulator();
const exportManager = new ExportManager();

// Estado global de la aplicación
let currentResults = null;
let currentTab = 'single';

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log(`🚀 INVERTAX v${APP_CONFIG.version} iniciado`);
    
    try {
        initializeNavigation();
        initializeTabs();
        initializeQuickCalculator();
        initializeFormValidation();
        initializeTooltips();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        showNotification('Error al inicializar la aplicación', 'error');
    }
});

// Navegación suave
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle menú móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav__menu--open');
            navToggle.classList.toggle('nav__toggle--open');
        });
    }

    // Navegación suave
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil
                navMenu.classList.remove('nav__menu--open');
                navToggle.classList.remove('nav__toggle--open');
            }
        });
    });

    // Highlight activo en navegación
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Sistema de tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.form-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Actualizar botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Actualizar contenido
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                }
            });
            
            currentTab = targetTab;
        });
    });
}

// Calculadora rápida del hero
function initializeQuickCalculator() {
    const quotaInput = document.getElementById('quickQuota');
    const ccaaSelect = document.getElementById('quickCCAA');
    const resultsDiv = document.getElementById('quickResults');

    if (quotaInput && ccaaSelect && resultsDiv) {
        const updateQuickResults = () => {
            try {
                const stateQuota = parseFloat(quotaInput.value) || 0;
                const ccaaCode = ccaaSelect.value;
                
                if (stateQuota > 0 && ccaaCode) {
                    const regionalQuota = stateQuota * 0.25; // Estimación 25%
                    const results = fiscalCalculator.calculateOptimalStrategy(
                        stateQuota, 
                        regionalQuota, 
                        ccaaCode
                    );
                    
                    updateQuickResultsDisplay(results, resultsDiv);
                }
            } catch (error) {
                console.error('Error en calculadora rápida:', error);
            }
        };

        quotaInput.addEventListener('input', updateQuickResults);
        ccaaSelect.addEventListener('change', updateQuickResults);
        
        // Cálculo inicial
        updateQuickResults();
    }
}

function updateQuickResultsDisplay(results, container) {
    const stateDistribution = results.distributions.find(d => d.type === 'Deducción Estatal');
    const regionalDistribution = results.distributions.find(d => d.type === 'Deducción Autonómica');

    container.innerHTML = `
        <div class="result-row">
            <span class="result-label">Inversión Empresa A (Estatal)</span>
            <span class="result-value">€${(stateDistribution?.investment || 0).toLocaleString()}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Deducción Estatal (50%)</span>
            <span class="result-value">€${(stateDistribution?.deduction || 0).toLocaleString()}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Inversión Empresa B (Autonómica)</span>
            <span class="result-value">€${(regionalDistribution?.investment || 0).toLocaleString()}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Deducción Autonómica (${(results.ccaaData.percentage * 100).toFixed(0)}%)</span>
            <span class="result-value">€${(regionalDistribution?.deduction || 0).toLocaleString()}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Total Invertido</span>
            <span class="result-value highlight">€${results.totals.totalInvestment.toLocaleString()}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Total Deducido</span>
            <span class="result-value highlight">€${results.totals.totalDeduction.toLocaleString()}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Rentabilidad Fiscal Real</span>
            <span class="result-value highlight">${results.totals.effectiveFiscalReturn.toFixed(1)}%</span>
        </div>
    `;
}

// Validación de formularios
function initializeFormValidation() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidationError);
    });
}

function validateInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);
    const min = parseFloat(input.getAttribute('min')) || 0;
    const max = parseFloat(input.getAttribute('max')) || Infinity;

    clearValidationError(event);

    if (input.hasAttribute('required') && !input.value) {
        showInputError(input, 'Este campo es obligatorio');
        return false;
    }

    if (input.type === 'number' && (isNaN(value) || value < min || value > max)) {
        showInputError(input, `Valor debe estar entre ${min} y ${max}`);
        return false;
    }

    return true;
}

function clearValidationError(event) {
    const input = event.target;
    input.classList.remove('form-control--error');
    
    const existingError = input.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

function showInputError(input, message) {
    input.classList.add('form-control--error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

// Tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    // Implementación básica - en producción usaríamos una librería
    const tooltip = event.target;
    const text = tooltip.getAttribute('data-tooltip');
    
    if (text) {
        tooltip.setAttribute('title', text);
    }
}

function hideTooltip(event) {
    const tooltip = event.target;
    tooltip.removeAttribute('title');
}

// Funciones de cálculo principales
async function calculateSingle() {
    try {
        showLoading('Calculando estrategia óptima...');
        
        const stateQuota = parseFloat(document.getElementById('stateQuota').value);
        const regionalQuota = parseFloat(document.getElementById('regionalQuota').value);
        const ccaaCode = document.getElementById('ccaaSelect').value;

        // Validaciones
        if (!stateQuota || stateQuota < 0) {
            throw new Error('Cuota estatal debe ser mayor que 0');
        }
        
        if (!ccaaCode) {
            throw new Error('Debe seleccionar una Comunidad Autónoma');
        }

        // Simular delay para mostrar loading
        await new Promise(resolve => setTimeout(resolve, 500));

        const results = fiscalCalculator.calculateOptimalStrategy(
            stateQuota, 
            regionalQuota || 0, 
            ccaaCode
        );

        currentResults = results;
        displayResults(results, 'single');
        
        hideLoading();
        showNotification('Cálculo completado exitosamente', 'success');
        
    } catch (error) {
        hideLoading();
        showNotification(error.message, 'error');
        console.error('Error en cálculo único:', error);
    }
}

async function calculateMultiyear() {
    try {
        showLoading('Calculando estrategia plurianual...');
        
        const yearlyQuota = parseFloat(document.getElementById('yearlyQuota').value);
        const timeHorizon = parseInt(document.getElementById('timeHorizon').value);
        const ccaaCode = document.getElementById('ccaaSelect').value;
        const growthStrategy = document.getElementById('growthStrategy').value;
        const reinvestment = document.getElementById('reinvestment').value;

        if (!yearlyQuota || yearlyQuota < 1000) {
            throw new Error('Cuota anual debe ser al menos €1.000');
        }

        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const results = fiscalCalculator.calculateMultiyearStrategy(
            yearlyQuota,
            timeHorizon,
            ccaaCode,
            { growthStrategy, reinvestment }
        );

        currentResults = results;
        displayResults(results, 'multiyear');
        
        hideLoading();
        showNotification(`Estrategia ${timeHorizon} años calculada`, 'success');
        
    } catch (error) {
        hideLoading();
        showNotification(error.message, 'error');
        console.error('Error en cálculo plurianual:', error);
    }
}

async function calculateMonteCarlo() {
    try {
        showLoading('Ejecutando simulación Monte Carlo...');
        
        const investment = parseFloat(document.getElementById('mcInvestment').value);
        const iterations = parseInt(document.getElementById('mcIterations').value);
        const expectedReturn = parseFloat(document.getElementById('expectedReturn').value);
        const volatility = parseFloat(document.getElementById('volatility').value);

        if (!investment || investment < 1000) {
            throw new Error('Inversión debe ser al menos €1.000');
        }

        const params = {
            investment,
            expectedReturn,
            volatility,
            years: 3,
            iterations
        };

        const results = await monteCarloSimulator.runSimulation(params);
        
        currentResults = results;
        displayResults(results, 'montecarlo');
        
        hideLoading();
        showNotification(`Simulación ${iterations.toLocaleString()} iteraciones completada`, 'success');
        
    } catch (error) {
        hideLoading();
        showNotification(error.message, 'error');
        console.error('Error en Monte Carlo:', error);
    }
}

// Mostrar resultados
function displayResults(results, type) {
    const container = document.getElementById('resultsContainer');
    const kpisContainer = document.getElementById('resultsKPIs');
    const detailsContainer = document.getElementById('resultsDetails');

    if (!container || !kpisContainer || !detailsContainer) {
        console.error('Contenedores de resultados no encontrados');
        return;
    }

    // Mostrar contenedor
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Generar KPIs según el tipo
    switch (type) {
        case 'single':
            displaySingleResults(results, kpisContainer, detailsContainer);
            break;
        case 'multiyear':
            displayMultiyearResults(results, kpisContainer, detailsContainer);
            break;
        case 'montecarlo':
            displayMonteCarloResults(results, kpisContainer, detailsContainer);
            break;
    }
}

function displaySingleResults(results, kpisContainer, detailsContainer) {
    // KPIs principales
    kpisContainer.innerHTML = `
        <div class="kpi-card">
            <div class="kpi-value">€${results.totals.totalInvestment.toLocaleString()}</div>
            <div class="kpi-label">Inversión Total</div>
            <div class="kpi-change positive">Optimizada</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">€${results.totals.totalDeduction.toLocaleString()}</div>
            <div class="kpi-label">Deducción Total</div>
            <div class="kpi-change positive">Garantizada</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${results.totals.effectiveFiscalReturn.toFixed(1)}%</div>
            <div class="kpi-label">Rentabilidad Fiscal Real</div>
            <div class="kpi-change ${results.totals.effectiveFiscalReturn > 40 ? 'positive' : 'warning'}">
                ${results.totals.effectiveFiscalReturn > 40 ? 'Excelente' : 'Mejorable'}
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${results.distributions.length}</div>
            <div class="kpi-label">Empresas Financiadas</div>
            <div class="kpi-change positive">Diversificación</div>
        </div>
    `;

    // Detalles
    detailsContainer.innerHTML = `
        <div class="card" style="margin-top: 2rem;">
            <div class="card-header">
                <h4 class="card-title">Distribución Detallada de Inversiones</h4>
                <p class="card-description">
                    Estrategia optimizada para ${results.ccaaData.name} con empresas independientes
                </p>
            </div>
            
            <div style="display: grid; gap: 1.5rem;">
                ${results.distributions.map((dist, index) => `
                    <div style="background: ${index === 0 ? '#dbeafe' : '#d1fae5'}; padding: 1.5rem; border-radius: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h5 style="margin: 0; color: ${index === 0 ? '#1e40af' : '#059669'};">
                                ${dist.company} - ${dist.type}
                            </h5>
                            <span style="background: ${index === 0 ? '#1e40af' : '#059669'}; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem;">
                                ${(dist.deductionRate * 100).toFixed(0)}% deducción
                            </span>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.875rem;">
                            <div>
                                <span style="color: #64748b;">Inversión:</span><br>
                                <strong style="color: ${index === 0 ? '#1e40af' : '#059669'};">€${dist.investment.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b;">Deducción:</span><br>
                                <strong style="color: ${index === 0 ? '#1e40af' : '#059669'};">€${dist.deduction.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b;">Eficiencia:</span><br>
                                <strong style="color: ${index === 0 ? '#1e40af' : '#059669'};">${dist.efficiency.toFixed(1)}%</strong>
                            </div>
                        </div>
                        
                        <p style="margin-top: 1rem; margin-bottom: 0; font-size: 0.875rem; color: #64748b;">
                            ${dist.description}
                        </p>
                    </div>
                `).join('')}
            </div>
            
            ${results.warnings.length > 0 ? `
                <div style="margin-top: 2rem; padding: 1rem; background: #fef3c7; border-radius: 0.75rem; border-left: 4px solid #d97706;">
                    <h5 style="color: #d97706; margin-bottom: 0.5rem;">⚠️ Advertencias</h5>
                    ${results.warnings.map(warning => `
                        <p style="margin: 0.5rem 0; color: #92400e; font-size: 0.875rem;">
                            ${warning.message}
                        </p>
                    `).join('')}
                </div>
            ` : ''}
            
            ${results.recommendations.length > 0 ? `
                <div style="margin-top: 1.5rem; padding: 1rem; background: #e0f2fe; border-radius: 0.75rem; border-left: 4px solid #0284c7;">
                    <h5 style="color: #0284c7; margin-bottom: 0.5rem;">💡 Recomendaciones</h5>
                    ${results.recommendations.map(rec => `
                        <p style="margin: 0.5rem 0; color: #0c4a6e; font-size: 0.875rem;">
                            <strong>${rec.title}:</strong> ${rec.message}
                        </p>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function displayMultiyearResults(results, kpisContainer, detailsContainer) {
    kpisContainer.innerHTML = `
        <div class="kpi-card">
            <div class="kpi-value">€${results.totals.totalInvestment.toLocaleString()}</div>
            <div class="kpi-label">Inversión Acumulada</div>
            <div class="kpi-change positive">${results.strategy.timeHorizon} años</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">€${results.totals.totalDeduction.toLocaleString()}</div>
            <div class="kpi-label">Deducción Acumulada</div>
            <div class="kpi-change positive">Total ahorro</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${results.totals.averageFiscalReturn.toFixed(1)}%</div>
            <div class="kpi-label">Rentabilidad Media</div>
            <div class="kpi-change positive">Promedio ${results.strategy.timeHorizon} años</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${results.totals.companiesFinanced}</div>
            <div class="kpi-label">Empresas Financiadas</div>
            <div class="kpi-change positive">Diversificación total</div>
        </div>
    `;

    detailsContainer.innerHTML = `
        <div class="card" style="margin-top: 2rem;">
            <div class="card-header">
                <h4 class="card-title">Evolución Plurianual Detallada</h4>
                <p class="card-description">
                    Estrategia ${results.strategy.growthStrategy} con reinversión ${results.strategy.reinvestment}
                </p>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: #f8fafc;">
                            <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left;">Año</th>
                            <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">Cuota Estatal</th>
                            <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">Inversión Total</th>
                            <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">Deducción</th>
                            <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">Rentabilidad</th>
                            <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: center;">Empresas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.years.map(year => `
                            <tr>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; font-weight: 600;">
                                    Año ${year.year}
                                </td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">
                                    €${year.quota.state.toLocaleString()}
                                </td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">
                                    €${year.totals.totalInvestment.toLocaleString()}
                                </td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right; color: #059669; font-weight: 600;">
                                    €${year.totals.totalDeduction.toLocaleString()}
                                </td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right; color: #1e40af; font-weight: 600;">
                                    ${year.totals.effectiveFiscalReturn.toFixed(1)}%
                                </td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: center;">
                                    ${year.companiesThisYear}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f0fdf4; font-weight: 600;">
                            <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">TOTAL</td>
                            <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">-</td>
                            <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right;">
                                €${results.totals.totalInvestment.toLocaleString()}
                            </td>
                            <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right; color: #059669;">
                                €${results.totals.totalDeduction.toLocaleString()}
                            </td>
                            <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: right; color: #1e40af;">
                                ${results.totals.averageFiscalReturn.toFixed(1)}%
                            </td>
                            <td style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: center;">
                                ${results.totals.companiesFinanced}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
}

function displayMonteCarloResults(results, kpisContainer, detailsContainer) {
    kpisContainer.innerHTML = `
        <div class="kpi-card">
            <div class="kpi-value">€${results.statistics.median.toLocaleString()}</div>
            <div class="kpi-label">Valor Esperado (P50)</div>
            <div class="kpi-change positive">Mediana</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${results.metrics.roi.toFixed(1)}%</div>
            <div class="kpi-label">ROI Esperado</div>
            <div class="kpi-change ${results.metrics.roi > 0 ? 'positive' : 'warning'}">3 años</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${results.metrics.probabilityOfLoss.toFixed(1)}%</div>
            <div class="kpi-label">Probabilidad Pérdida</div>
            <div class="kpi-change ${results.metrics.probabilityOfLoss < 20 ? 'positive' : 'warning'}">Riesgo</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${results.metrics.successRate.toFixed(1)}%</div>
            <div class="kpi-label">Tasa de Éxito</div>
            <div class="kpi-change positive">ROI > 10%</div>
        </div>
    `;

    detailsContainer.innerHTML = `
        <div class="card" style="margin-top: 2rem;">
            <div class="card-header">
                <h4 class="card-title">Análisis Estadístico Monte Carlo</h4>
                <p class="card-description">
                    Distribución de resultados basada en ${results.scenarios.length.toLocaleString()} simulaciones
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h5 style="color: #1e40af; margin-bottom: 1rem;">📊 Percentiles de Valor</h5>
                    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>P5 (Pesimista):</span>
                            <strong style="color: #dc2626;">€${results.statistics.p5.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>P25 (Conservador):</span>
                            <strong style="color: #d97706;">€${results.statistics.p25.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>P50 (Esperado):</span>
                            <strong style="color: #1e40af;">€${results.statistics.p50.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>P75 (Optimista):</span>
                            <strong style="color: #059669;">€${results.statistics.p75.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>P95 (Muy Optimista):</span>
                            <strong style="color: #059669;">€${results.statistics.p95.toLocaleString()}</strong>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h5 style="color: #059669; margin-bottom: 1rem;">🎯 Métricas de Riesgo</h5>
                    <div style="background: #f0fdf4; padding: 1.5rem; border-radius: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Valor Mínimo:</span>
                            <strong>€${results.statistics.min.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Valor Máximo:</span>
                            <strong>€${results.statistics.max.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Valor Medio:</span>
                            <strong>€${results.statistics.mean.toLocaleString()}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Prob. Ganancia:</span>
                            <strong style="color: #059669;">${(100 - results.metrics.probabilityOfLoss).toFixed(1)}%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Tasa Éxito (+10%):</span>
                            <strong style="color: #059669;">${results.metrics.successRate.toFixed(1)}%</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: #fef7f0; padding: 1.5rem; border-radius: 0.75rem; border-left: 4px solid #d97706;">
                <h5 style="color: #d97706; margin-bottom: 1rem;">📈 Interpretación de Resultados</h5>
                <div style="display: grid; gap: 0.75rem; font-size: 0.875rem; color: #92400e;">
                    <p style="margin: 0;">
                        <strong>Escenario Conservador (P25):</strong> Hay un 75% de probabilidad de que el resultado sea mejor que €${results.statistics.p25.toLocaleString()}.
                    </p>
                    <p style="margin: 0;">
                        <strong>Escenario Esperado (P50):</strong> El valor más probable es €${results.statistics.p50.toLocaleString()}, con ROI del ${results.metrics.roi.toFixed(1)}%.
                    </p>
                    <p style="margin: 0;">
                        <strong>Gestión de Riesgo:</strong> ${results.metrics.probabilityOfLoss.toFixed(1)}% probabilidad de pérdida. Diversificación recomendada.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Funciones de exportación
async function exportResults(format) {
    if (!currentResults) {
        showNotification('No hay resultados para exportar', 'warning');
        return;
    }

    try {
        showLoading(`Exportando en formato ${format.toUpperCase()}...`);
        
        await exportManager.exportResults(currentResults, format);
        
        hideLoading();
        showNotification(`Resultados exportados en ${format.toUpperCase()}`, 'success');
        
    } catch (error) {
        hideLoading();
        showNotification(`Error al exportar: ${error.message}`, 'error');
        console.error('Error en exportación:', error);
    }
}

async function shareResults() {
    if (!currentResults) {
        showNotification('No hay resultados para compartir', 'warning');
        return;
    }

    try {
        if (navigator.share) {
            await navigator.share({
                title: 'INVERTAX - Resultados de Optimización Fiscal',
                text: `Rentabilidad fiscal: ${currentResults.totals?.effectiveFiscalReturn?.toFixed(1) || 'N/A'}%`,
                url: window.location.href
            });
        } else {
            // Fallback: copiar al portapapeles
            const shareText = `INVERTAX - Optimización Fiscal
Inversión: €${currentResults.totals?.totalInvestment?.toLocaleString() || 'N/A'}
Deducción: €${currentResults.totals?.totalDeduction?.toLocaleString() || 'N/A'}
Rentabilidad: ${currentResults.totals?.effectiveFiscalReturn?.toFixed(1) || 'N/A'}%

Calcula tu estrategia en: ${window.location.href}`;

            await navigator.clipboard.writeText(shareText);
            showNotification('Resultados copiados al portapapeles', 'success');
        }
    } catch (error) {
        showNotification('Error al compartir resultados', 'error');
        console.error('Error compartiendo:', error);
    }
}

// Utilidades de UI
function showLoading(message = 'Cargando...') {
    // Crear overlay si no existe
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        `;
        
        overlay.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 1rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
                <div style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top: 4px solid #1e40af; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="margin: 0; color: #334155; font-weight: 500;" id="loadingMessage">${message}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Añadir animación CSS si no existe
        if (!document.getElementById('spinAnimation')) {
            const style = document.createElement('style');
            style.id = 'spinAnimation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        document.getElementById('loadingMessage').textContent = message;
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Crear contenedor de notificaciones si no existe
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    const colors = {
        success: { bg: '#d1fae5', border: '#059669', text: '#065f46' },
        error: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' },
        warning: { bg: '#fef3c7', border: '#d97706', text: '#92400e' },
        info: { bg: '#dbeafe', border: '#2563eb', text: '#1e40af' }
    };

    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        background: ${color.bg};
        border: 1px solid ${color.border};
        border-left: 4px solid ${color.border};
        color: ${color.text};
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        font-size: 0.875rem;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        cursor: pointer;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>${message}</span>
        </div>
    `;

    // Añadir animación CSS si no existe
    if (!document.getElementById('slideInAnimation')) {
        const style = document.createElement('style');
        style.id = 'slideInAnimation';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Cerrar al hacer clic
    notification.addEventListener('click', () => {
        notification.remove();
    });

    container.appendChild(notification);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    showNotification('Ha ocurrido un error inesperado', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada:', event.reason);
    showNotification('Error en operación asíncrona', 'error');
});

// Registro de Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('✅ Service Worker registrado:', registration.scope);
            
            // Escuchar actualizaciones
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showNotification('Nueva versión disponible. Recarga la página.', 'info');
                    }
                });
            });
        } catch (error) {
            console.log('❌ Error registrando Service Worker:', error);
        }
    });
}

console.log('✅ INVERTAX v3.0 - Aplicación cargada correctamente');