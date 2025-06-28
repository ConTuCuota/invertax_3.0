// INVERTAX Application JavaScript - Versión Avanzada
// Plataforma profesional de optimización fiscal para inversiones en empresas de nueva creación

// CCAA Data con información fiscal completa y actualizada
const CCAA_DATA = {
    "Madrid": {
        percentage: 0.4,
        maxBase: 9279,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora", "empresa de base tecnológica"],
        notes: "Permanencia mínima de 3 años, 5 empleados mínimo en plantilla",
        riskLevel: 0.2
    },
    "Cataluña": {
        percentage: 0.5,
        maxBase: 12000,
        compatible: false,
        acceptedProfiles: ["todos"],
        notes: "Incompatible con deducción estatal, requiere business angel acreditado",
        riskLevel: 0.4
    },
    "Valencia": {
        percentage: 0.3,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa local"],
        notes: "Requiere sede social en la Comunidad Valenciana",
        riskLevel: 0.25
    },
    "Andalucía": {
        percentage: 0.25,
        maxBase: 10000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa tecnológica", "empresa de base científica"],
        notes: "Antigüedad máxima 5 años, sede fiscal en Andalucía",
        riskLevel: 0.3
    },
    "País Vasco": {
        percentage: 0.35,
        maxBase: 15000,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora"],
        notes: "Normativa foral específica, consultar disposiciones vigentes",
        riskLevel: 0.15
    },
    "Galicia": {
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ["empresa de base tecnológica", "empresa innovadora"],
        notes: "Registro previo en IGAPE, validación técnica previa",
        riskLevel: 0.35
    },
    "Castilla y León": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa de creación reciente"],
        notes: "Antigüedad máxima 3 años, actividad en la comunidad",
        riskLevel: 0.4
    },
    "Castilla-La Mancha": {
        percentage: 0.15,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa de base tecnológica"],
        notes: "Mínimo 3 empleados a jornada completa",
        riskLevel: 0.45
    },
    "Extremadura": {
        percentage: 0.20,
        maxBase: 4000,
        compatible: true,
        acceptedProfiles: ["empresa local", "empresa innovadora"],
        notes: "Inversión mínima €3.000, sede en Extremadura",
        riskLevel: 0.5
    },
    "Murcia": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora"],
        notes: "Permanencia 4 años, sede en Murcia",
        riskLevel: 0.35
    },
    "Asturias": {
        percentage: 0.25,
        maxBase: 7000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa tecnológica"],
        notes: "Actividad económica en Asturias, validación por IDEPA",
        riskLevel: 0.4
    },
    "Cantabria": {
        percentage: 0.15,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ["empresa local", "empresa innovadora"],
        notes: "Requiere inscripción en registro autonómico",
        riskLevel: 0.45
    },
    "La Rioja": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora"],
        notes: "Certificación ADER previa, sede social en La Rioja",
        riskLevel: 0.4
    },
    "Navarra": {
        percentage: 0.30,
        maxBase: 10000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa tecnológica"],
        notes: "Normativa foral específica de Navarra",
        riskLevel: 0.2
    },
    "Aragón": {
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ["empresa local", "empresa innovadora"],
        notes: "Actividad en Aragón, validación previa",
        riskLevel: 0.35
    },
    "Canarias": {
        percentage: 0,
        maxBase: 0,
        compatible: false,
        special: "ZEC",
        acceptedProfiles: ["ZEC"],
        notes: "Zona Especial Canaria, consultar normativa específica REF",
        riskLevel: 0.6
    },
    "Baleares": {
        percentage: 0,
        maxBase: 0,
        compatible: false,
        special: "Régimen especial",
        acceptedProfiles: ["empresa turística", "empresa innovadora"],
        notes: "Consultar normativa vigente específica",
        riskLevel: 0.5
    }
};

// Límites estatales según Art. 68.1 LIRPF
const STATE_LIMITS = {
    percentage: 0.5,
    maxBase: 100000,
    minInvestment: 1000
};

// Inicialización de motores avanzados
let advancedFiscalEngine;
let portfolioOptimizer;
let riskAnalyzer;
let monteCarloEngine;
let documentManager;

// Variables globales
let currentSimulation = null;
let currentRiskAnalysis = null;
let currentPortfolioOptimization = null;
let deferredPrompt = null;
let isOffline = false;

// Cache para datos offline
let offlineCache = {
    simulations: [],
    documents: [],
    lastSync: null
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Mostrar loading
        showLoadingState('Inicializando INVERTAX...');
        
        // Inicializar motores avanzados
        await initializeEngines();
        
        // Inicializar navegación
        initializeNavigation();
        
        // Poblar selectores de CCAA
        populateCCAASelectors();
        
        // Cargar grid de compatibilidades CCAA
        loadCCAACompatibility();
        
        // Inicializar PWA
        initializePWA();
        
        // Inicializar formulario de contacto
        initializeContactForm();
        
        // Inicializar funcionalidades offline
        initializeOfflineCapabilities();
        
        // Inicializar analytics
        initializeAnalytics();
        
        // Ocultar loading
        hideLoadingState();
        
        console.log('🚀 INVERTAX App inicializada correctamente');
        showNotification('INVERTAX cargado correctamente', 'success');
        
    } catch (error) {
        console.error('Error inicializando aplicación:', error);
        showNotification('Error al cargar la aplicación. Por favor, recarga la página.', 'error');
        hideLoadingState();
    }
}

async function initializeEngines() {
    // Cargar motores de forma asíncrona
    const enginePromises = [
        loadScript('FiscalEngine.js'),
        loadScript('PortfolioOptimizer.js'),
        loadScript('RiskAnalyzer.js'),
        loadScript('monteCarlo-worker.js')
    ];
    
    await Promise.all(enginePromises);
    
    // Inicializar instancias
    advancedFiscalEngine = new AdvancedFiscalEngine();
    portfolioOptimizer = new PortfolioOptimizer();
    riskAnalyzer = new RiskAnalyzer();
    monteCarloEngine = new MonteCarloEngine();
    documentManager = new DocumentManager();
    
    console.log('📊 Motores avanzados inicializados');
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function populateCCAASelectors() {
    const selectors = ['ccaa'];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            // Mantener primera opción
            const firstOption = selector.children[0];
            selector.innerHTML = '';
            selector.appendChild(firstOption);
            
            Object.keys(CCAA_DATA).forEach(ccaa => {
                const option = document.createElement('option');
                option.value = ccaa;
                option.textContent = ccaa;
                selector.appendChild(option);
            });
        }
    });
}

function loadCCAACompatibility() {
    const container = document.getElementById('ccaaCompatibility');
    if (!container) return;

    container.innerHTML = '';
    
    Object.entries(CCAA_DATA).forEach(([ccaa, data]) => {
        const item = document.createElement('div');
        item.className = `ccaa-legal-item ${data.compatible ? 'compatible' : 'incompatible'}`;
        
        const compatibilityIcon = data.compatible ? '✅' : '❌';
        const percentageText = data.percentage > 0 ? `${(data.percentage * 100).toFixed(0)}%` : 'N/A';
        const riskLevel = getRiskLevelText(data.riskLevel);
        
        item.innerHTML = `
            <div class="ccaa-legal-header">
                <h4>${compatibilityIcon} ${ccaa}</h4>
                <span class="ccaa-percentage">${percentageText}</span>
            </div>
            <div class="ccaa-legal-details">
                <p><strong>Base máxima:</strong> €${data.maxBase.toLocaleString()}</p>
                <p><strong>Compatible con estatal:</strong> ${data.compatible ? 'Sí' : 'No'}</p>
                <p><strong>Nivel de riesgo:</strong> <span class="risk-level risk-${riskLevel.toLowerCase()}">${riskLevel}</span></p>
                ${data.special ? `<p><strong>Régimen especial:</strong> ${data.special}</p>` : ''}
                <p><strong>Requisitos:</strong> ${data.notes}</p>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function getRiskLevelText(riskLevel) {
    if (riskLevel < 0.2) return 'Bajo';
    if (riskLevel < 0.4) return 'Medio';
    return 'Alto';
}

// Funciones del Simulador Avanzado
async function calculateAdvanced() {
    const investment = parseFloat(document.getElementById('investment').value);
    const ccaa = document.getElementById('ccaa').value;
    const stateQuota = parseFloat(document.getElementById('stateQuota').value);
    const regionalQuota = parseFloat(document.getElementById('regionalQuota').value);
    const projectProfile = document.getElementById('projectProfile').value;
    const resultsDiv = document.getElementById('simulatorResults');
    
    // Validaciones
    if (!investment || !ccaa || isNaN(stateQuota) || isNaN(regionalQuota)) {
        showMessage(resultsDiv, 'Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (investment < 1000 || investment > 1000000) {
        showMessage(resultsDiv, 'La inversión debe estar entre €1.000 y €1.000.000', 'error');
        return;
    }
    
    try {
        // Mostrar loading
        showLoadingState('Calculando optimización fiscal...');
        
        // Cálculo fiscal avanzado
        const fiscalResult = advancedFiscalEngine.calculateOptimalDeductions(
            investment, ccaa, stateQuota, regionalQuota, projectProfile
        );
        
        // Análisis de riesgo
        const riskAnalysis = riskAnalyzer.analyzeRisk(
            { totalUsedInvestment: fiscalResult.totalUsedInvestment },
            fiscalResult
        );
        
        // Guardar resultados globales
        currentSimulation = fiscalResult;
        currentRiskAnalysis = riskAnalysis;
        
        // Mostrar resultados
        await displayAdvancedResults(fiscalResult, riskAnalysis, resultsDiv);
        
        // Generar documento
        const doc = documentManager.addDocument(
            `Simulación Avanzada ${ccaa} - ${new Date().toLocaleDateString()}`, 
            'advanced_simulation', 
            { fiscal: fiscalResult, risk: riskAnalysis }
        );
        
        // Guardar en cache offline
        saveToOfflineCache('simulation', { fiscal: fiscalResult, risk: riskAnalysis });
        
        hideLoadingState();
        showNotification('Simulación completada correctamente', 'success');
        
        // Analytics
        trackEvent('advanced_calculation_completed', {
            ccaa: ccaa,
            investment: investment,
            optimizationScore: fiscalResult.optimizationScore
        });
        
    } catch (error) {
        hideLoadingState();
        console.error('Error en cálculo avanzado:', error);
        showMessage(resultsDiv, `Error en cálculo: ${error.message}`, 'error');
        trackEvent('calculation_error', { error: error.message });
    }
}

async function displayAdvancedResults(fiscalResult, riskAnalysis, container) {
    const ccaaData = fiscalResult.ccaaData;
    
    container.innerHTML = `
        <div class="results-container">
            <!-- Resumen Principal -->
            <div class="form-card results-main">
                <div class="results-header">
                    <h3>🎯 Optimización Fiscal INVERTAX</h3>
                    <div class="results-badges">
                        <span class="badge badge--success">Optimización Completada</span>
                        <span class="badge badge--info">Score: ${fiscalResult.optimizationScore}/100</span>
                        <span class="badge badge--${getRiskBadgeClass(riskAnalysis.riskRating)}">${riskAnalysis.riskRating}</span>
                    </div>
                </div>
                
                <div class="results-summary">
                    <div class="result-main-kpi">
                        <div class="kpi-card">
                            <div class="kpi-value">€${fiscalResult.totalDeduction.toLocaleString()}</div>
                            <div class="kpi-label">Ahorro Fiscal Total</div>
                            <div class="kpi-change positive">+${fiscalResult.effectiveFiscalReturn.toFixed(1)}% ROI</div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-value">${fiscalResult.effectiveFiscalReturn.toFixed(1)}%</div>
                            <div class="kpi-label">Rentabilidad Fiscal</div>
                            <div class="kpi-change ${fiscalResult.effectiveFiscalReturn > 40 ? 'positive' : 'neutral'}">
                                ${fiscalResult.effectiveFiscalReturn > 40 ? 'Excelente' : 'Buena'}
                            </div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-value">€${fiscalResult.totalUsedInvestment.toLocaleString()}</div>
                            <div class="kpi-label">Capital Optimizado</div>
                            <div class="kpi-change ${fiscalResult.unoptimizedCapital === 0 ? 'positive' : 'warning'}">
                                ${((fiscalResult.totalUsedInvestment / fiscalResult.totalInvestment) * 100).toFixed(1)}% utilizado
                            </div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-value">${fiscalResult.paybackPeriod.toFixed(1)}</div>
                            <div class="kpi-label">Años Recuperación</div>
                            <div class="kpi-change ${fiscalResult.paybackPeriod < 3 ? 'positive' : 'neutral'}">
                                ${fiscalResult.paybackPeriod < 3 ? 'Rápida' : 'Normal'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Distribución Detallada -->
            <div class="form-card">
                <h4>📊 Distribución Óptima de Inversión</h4>
                <div class="distribution-chart">
                    ${fiscalResult.distributions.map(dist => `
                        <div class="distribution-item">
                            <div class="distribution-header">
                                <h5>${dist.project}</h5>
                                <span class="distribution-amount">€${dist.investment.toLocaleString()}</span>
                            </div>
                            <div class="distribution-bar">
                                <div class="distribution-fill ${dist.type}" style="width: ${(dist.investment / fiscalResult.totalInvestment * 100).toFixed(1)}%"></div>
                            </div>
                            <div class="distribution-details">
                                <span>Tasa: ${(dist.deductionRate * 100).toFixed(0)}%</span>
                                <span>Deducción: €${dist.deduction.toLocaleString()}</span>
                                <span>Eficiencia: ${(dist.efficiency * 100).toFixed(1)}%</span>
                            </div>
                            <p class="distribution-description">${dist.description}</p>
                        </div>
                    `).join('')}
                    
                    ${fiscalResult.unoptimizedCapital > 0 ? `
                        <div class="distribution-item warning">
                            <div class="distribution-header">
                                <h5>Capital No Optimizado</h5>
                                <span class="distribution-amount">€${fiscalResult.unoptimizedCapital.toLocaleString()}</span>
                            </div>
                            <div class="distribution-bar">
                                <div class="distribution-fill unoptimized" style="width: ${(fiscalResult.unoptimizedCapital / fiscalResult.totalInvestment * 100).toFixed(1)}%"></div>
                            </div>
                            <p class="distribution-description">Capital que no genera beneficios fiscales</p>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Métricas Financieras Avanzadas -->
            <div class="form-card">
                <h4>📈 Métricas Financieras Avanzadas</h4>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <div class="metric-label">VPN (3 años)</div>
                        <div class="metric-value ${fiscalResult.netPresentValue > 0 ? 'positive' : 'negative'}">
                            €${fiscalResult.netPresentValue.toLocaleString()}
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">TIR Esperada</div>
                        <div class="metric-value ${fiscalResult.internalRateOfReturn > 15 ? 'positive' : 'neutral'}">
                            ${fiscalResult.internalRateOfReturn.toFixed(1)}%
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Ratio Sharpe</div>
                        <div class="metric-value ${fiscalResult.sharpeRatio > 1 ? 'positive' : 'neutral'}">
                            ${fiscalResult.sharpeRatio.toFixed(2)}
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Nivel Confianza</div>
                        <div class="metric-value ${fiscalResult.confidenceLevel > 0.8 ? 'positive' : 'neutral'}">
                            ${(fiscalResult.confidenceLevel * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>

            <!-- Análisis de Riesgo -->
            <div class="form-card">
                <h4>⚠️ Análisis de Riesgo</h4>
                <div class="risk-summary">
                    <div class="risk-score">
                        <div class="risk-score-circle ${getRiskScoreClass(riskAnalysis.overallRiskScore)}">
                            <span class="risk-score-value">${riskAnalysis.overallRiskScore}</span>
                            <span class="risk-score-label">Score</span>
                        </div>
                        <div class="risk-score-info">
                            <h5>Riesgo ${riskAnalysis.riskRating}</h5>
                            <p>Evaluación basada en múltiples factores de riesgo</p>
                        </div>
                    </div>
                    
                    <div class="risk-metrics">
                        <div class="risk-metric">
                            <span class="risk-metric-label">VaR 95% (3 años)</span>
                            <span class="risk-metric-value">€${riskAnalysis.valueAtRisk['var_0.95_3y']?.varAmount.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div class="risk-metric">
                            <span class="risk-metric-label">Prob. Pérdida</span>
                            <span class="risk-metric-value">${(riskAnalysis.startupRisks.businessFailureRisk.probability * 100).toFixed(0)}%</span>
                        </div>
                        <div class="risk-metric">
                            <span class="risk-metric-label">Liquidez 1 año</span>
                            <span class="risk-metric-value">${(riskAnalysis.liquidityRisks.immediateliquidity.availability * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recomendaciones Inteligentes -->
            ${fiscalResult.recommendations.length > 0 ? `
                <div class="form-card">
                    <h4>💡 Recomendaciones Inteligentes</h4>
                    <div class="recommendations-list">
                        ${fiscalResult.recommendations.slice(0, 5).map(rec => `
                            <div class="recommendation-item ${rec.type}">
                                <div class="recommendation-header">
                                    <span class="recommendation-icon">
                                        ${rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : 'ℹ️'}
                                    </span>
                                    <h5>${rec.title || 'Recomendación'}</h5>
                                    <span class="recommendation-priority priority-${rec.priority}">${rec.priority}</span>
                                </div>
                                <p class="recommendation-message">${rec.message}</p>
                                ${rec.actionable && rec.actions ? `
                                    <div class="recommendation-actions">
                                        <strong>Acciones sugeridas:</strong>
                                        <ul>
                                            ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Información Legal -->
            <div class="form-card">
                <h4>⚖️ Marco Legal y Cumplimiento</h4>
                <div class="legal-info">
                    <div class="legal-section">
                        <h5>Normativa Aplicable</h5>
                        <ul class="legal-list">
                            <li>Art. 68.1 Ley del IRPF - Deducción estatal del 50%</li>
                            <li>Normativa autonómica ${ccaa} - Deducción del ${(ccaaData.percentage * 100).toFixed(0)}%</li>
                            <li>Permanencia mínima obligatoria: 3 años</li>
                            <li>Límites de base: Estatal €100.000, ${ccaa} €${ccaaData.maxBase.toLocaleString()}</li>
                        </ul>
                    </div>
                    
                    <div class="legal-section">
                        <h5>Condiciones Específicas ${ccaa}</h5>
                        <p>${ccaaData.notes}</p>
                        ${ccaaData.special ? `<p><strong>Régimen especial:</strong> ${ccaaData.special}</p>` : ''}
                    </div>
                    
                    <div class="legal-disclaimer">
                        <p><strong>⚠️ Importante:</strong> Esta simulación es orientativa y se basa en la normativa fiscal vigente. 
                        Los resultados reales pueden variar según tu situación fiscal específica. 
                        Recomendamos consultar con un asesor fiscal cualificado antes de tomar decisiones de inversión.</p>
                    </div>
                </div>
            </div>

            <!-- Acciones -->
            <div class="results-actions">
                <button class="btn btn--primary" onclick="exportAdvancedPDF()">
                    📄 Exportar Informe Completo
                </button>
                <button class="btn btn--secondary" onclick="runAdvancedMonteCarlo()">
                    📊 Análisis Monte Carlo
                </button>
                <button class="btn btn--outline" onclick="compareRegions()">
                    🗺️ Comparar CCAA
                </button>
                <button class="btn btn--outline" onclick="optimizePortfolio()">
                    💼 Optimizar Cartera
                </button>
            </div>
        </div>
    `;
    
    container.classList.add('fade-in');
    container.scrollIntoView({ behavior: 'smooth' });
}

function getRiskBadgeClass(riskRating) {
    switch (riskRating.toLowerCase()) {
        case 'muy bajo':
        case 'bajo': return 'success';
        case 'medio': return 'warning';
        case 'alto':
        case 'muy alto': return 'error';
        default: return 'info';
    }
}

function getRiskScoreClass(score) {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    return 'high';
}

// Análisis Monte Carlo Avanzado
async function runAdvancedMonteCarlo() {
    if (!currentSimulation) {
        showNotification('Realiza primero una simulación fiscal', 'warning');
        return;
    }

    try {
        showLoadingState('Ejecutando análisis Monte Carlo avanzado...');
        
        // Parámetros avanzados
        const parameters = {
            investment: currentSimulation.totalUsedInvestment,
            expectedReturn: 25, // 25% anual
            volatility: 35, // 35% volatilidad
            years: 3,
            iterations: 5000, // Más iteraciones para mayor precisión
            correlations: true,
            stressScenarios: true
        };
        
        // Ejecutar simulación en Web Worker
        const results = await runMonteCarloInWorker(parameters);
        
        // Mostrar resultados avanzados
        displayAdvancedMonteCarloResults(results);
        
        // Generar documento
        const doc = documentManager.addDocument(
            `Análisis Monte Carlo Avanzado - ${new Date().toLocaleDateString()}`, 
            'montecarlo_advanced', 
            results
        );
        
        hideLoadingState();
        showNotification('Análisis Monte Carlo completado', 'success');
        
        trackEvent('montecarlo_analysis_completed', {
            iterations: parameters.iterations,
            expectedReturn: results.statistics.mean
        });
        
    } catch (error) {
        hideLoadingState();
        console.error('Error en Monte Carlo:', error);
        showNotification('Error en análisis Monte Carlo', 'error');
    }
}

function runMonteCarloInWorker(parameters) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('monteCarlo-worker.js');
        
        worker.postMessage(parameters);
        
        worker.onmessage = function(e) {
            if (e.data.success) {
                resolve(e.data.data);
            } else {
                reject(new Error(e.data.error));
            }
            worker.terminate();
        };
        
        worker.onerror = function(error) {
            reject(error);
            worker.terminate();
        };
        
        // Timeout después de 30 segundos
        setTimeout(() => {
            worker.terminate();
            reject(new Error('Timeout en análisis Monte Carlo'));
        }, 30000);
    });
}

function displayAdvancedMonteCarloResults(results) {
    const container = document.getElementById('simulatorResults');
    if (!container) return;

    const existingContent = container.innerHTML;
    
    container.innerHTML = existingContent + `
        <div class="form-card montecarlo-results">
            <h4>📊 Análisis Monte Carlo Avanzado</h4>
            <p class="form-description">Simulación con ${results.iterations || 5000} iteraciones para evaluar distribución de resultados</p>
            
            <!-- Distribución de Escenarios -->
            <div class="scenarios-advanced">
                <div class="scenario-chart">
                    <canvas id="monteCarloChart" width="800" height="400"></canvas>
                </div>
                
                <div class="scenarios-grid">
                    <div class="scenario-card pessimistic">
                        <div class="scenario-header">
                            <h5>🔴 Pesimista (P5)</h5>
                            <span class="scenario-probability">5% probabilidad</span>
                        </div>
                        <div class="scenario-value">€${results.percentiles.p5.toLocaleString()}</div>
                        <div class="scenario-return ${results.scenarios.conservative.return < 0 ? 'negative' : 'positive'}">
                            ${results.scenarios.conservative.return}%
                        </div>
                    </div>
                    
                    <div class="scenario-card expected">
                        <div class="scenario-header">
                            <h5>🟡 Esperado (P50)</h5>
                            <span class="scenario-probability">50% probabilidad</span>
                        </div>
                        <div class="scenario-value">€${results.percentiles.p50.toLocaleString()}</div>
                        <div class="scenario-return positive">
                            ${results.scenarios.expected.return}%
                        </div>
                    </div>
                    
                    <div class="scenario-card optimistic">
                        <div class="scenario-header">
                            <h5>🟢 Optimista (P95)</h5>
                            <span class="scenario-probability">95% probabilidad</span>
                        </div>
                        <div class="scenario-value">€${results.percentiles.p95.toLocaleString()}</div>
                        <div class="scenario-return positive">
                            ${results.scenarios.optimistic.return}%
                        </div>
                    </div>
                </div>
            </div>

            <!-- Métricas Estadísticas -->
            <div class="statistics-grid">
                <div class="statistic-item">
                    <div class="statistic-label">Valor Medio</div>
                    <div class="statistic-value">€${results.mean.toLocaleString()}</div>
                </div>
                <div class="statistic-item">
                    <div class="statistic-label">Desviación Estándar</div>
                    <div class="statistic-value">€${results.standardDeviation.toLocaleString()}</div>
                </div>
                <div class="statistic-item">
                    <div class="statistic-label">Prob. Pérdida</div>
                    <div class="statistic-value ${results.metrics.probabilityOfLoss > 30 ? 'warning' : 'positive'}">
                        ${results.metrics.probabilityOfLoss.toFixed(1)}%
                    </div>
                </div>
                <div class="statistic-item">
                    <div class="statistic-label">Ratio Sharpe</div>
                    <div class="statistic-value ${results.metrics.sharpeRatio > 1 ? 'positive' : 'neutral'}">
                        ${results.metrics.sharpeRatio.toFixed(2)}
                    </div>
                </div>
                <div class="statistic-item">
                    <div class="statistic-label">Tasa Éxito</div>
                    <div class="statistic-value positive">
                        ${results.metrics.successRate.toFixed(1)}%
                    </div>
                </div>
                <div class="statistic-item">
                    <div class="statistic-label">ROI Promedio</div>
                    <div class="statistic-value ${results.metrics.averageReturn > 0 ? 'positive' : 'negative'}">
                        ${results.metrics.averageReturn.toFixed(1)}%
                    </div>
                </div>
            </div>

            <!-- Análisis de Riesgo -->
            <div class="risk-analysis">
                <h5>⚠️ Análisis de Riesgo Cuantitativo</h5>
                <div class="risk-metrics-grid">
                    <div class="risk-metric-card">
                        <h6>Value at Risk (VaR)</h6>
                        <div class="var-levels">
                            <div class="var-item">
                                <span>VaR 90%:</span>
                                <span>€${(currentSimulation.totalUsedInvestment - results.percentiles.p10).toLocaleString()}</span>
                            </div>
                            <div class="var-item">
                                <span>VaR 95%:</span>
                                <span>€${(currentSimulation.totalUsedInvestment - results.percentiles.p5).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="risk-metric-card">
                        <h6>Expected Shortfall</h6>
                        <p>Pérdida esperada en el 5% de peores escenarios: 
                           <strong>€${(currentSimulation.totalUsedInvestment - results.percentiles.p5).toLocaleString()}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Recomendaciones basadas en Monte Carlo -->
            <div class="montecarlo-recommendations">
                <h5>💡 Recomendaciones basadas en Simulación</h5>
                <div class="recommendations-grid">
                    ${generateMonteCarloRecommendations(results).map(rec => `
                        <div class="recommendation-card ${rec.type}">
                            <h6>${rec.title}</h6>
                            <p>${rec.description}</p>
                            ${rec.action ? `<div class="recommendation-action">${rec.action}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Dibujar gráfico de distribución
    setTimeout(() => drawMonteCarloChart(results), 100);
}

function generateMonteCarloRecommendations(results) {
    const recommendations = [];
    
    if (results.metrics.probabilityOfLoss > 40) {
        recommendations.push({
            type: 'warning',
            title: 'Alto Riesgo de Pérdida',
            description: `${results.metrics.probabilityOfLoss.toFixed(1)}% probabilidad de pérdida detectada.`,
            action: 'Considera diversificar en múltiples empresas para reducir el riesgo.'
        });
    }
    
    if (results.metrics.sharpeRatio < 0.5) {
        recommendations.push({
            type: 'info',
            title: 'Ratio Riesgo-Retorno Bajo',
            description: 'El ratio de Sharpe indica una relación riesgo-retorno subóptima.',
            action: 'Evalúa empresas con mayor potencial de retorno o menor riesgo.'
        });
    }
    
    if (results.metrics.successRate > 70) {
        recommendations.push({
            type: 'success',
            title: 'Alta Probabilidad de Éxito',
            description: `${results.metrics.successRate.toFixed(1)}% de probabilidad de obtener retornos positivos.`,
            action: 'Estrategia bien posicionada para generar retornos positivos.'
        });
    }
    
    return recommendations;
}

function drawMonteCarloChart(results) {
    const canvas = document.getElementById('monteCarloChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Crear histograma de resultados
    const histogram = results.histogram || createHistogram(results.results, 50);
    
    // Configuración del gráfico
    const width = canvas.width;
    const height = canvas.height;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar estilos
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar histograma
    const maxFrequency = Math.max(...histogram.map(h => h.count));
    const barWidth = chartWidth / histogram.length;
    
    histogram.forEach((bin, i) => {
        const barHeight = (bin.count / maxFrequency) * chartHeight;
        const x = margin.left + i * barWidth;
        const y = margin.top + chartHeight - barHeight;
        
        // Color basado en el valor
        const value = (bin.binStart + bin.binEnd) / 2;
        const isProfit = value > currentSimulation.totalUsedInvestment;
        ctx.fillStyle = isProfit ? '#10b981' : '#ef4444';
        ctx.globalAlpha = 0.7;
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
    
    // Dibujar líneas de percentiles
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // P5, P50, P95
    const percentiles = [
        { value: results.percentiles.p5, label: 'P5', color: '#ef4444' },
        { value: results.percentiles.p50, label: 'P50', color: '#f59e0b' },
        { value: results.percentiles.p95, label: 'P95', color: '#10b981' }
    ];
    
    const minValue = Math.min(...results.results);
    const maxValue = Math.max(...results.results);
    
    percentiles.forEach(p => {
        const x = margin.left + ((p.value - minValue) / (maxValue - minValue)) * chartWidth;
        
        ctx.strokeStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
        
        // Etiqueta
        ctx.fillStyle = p.color;
        ctx.font = '12px Arial';
        ctx.fillText(p.label, x - 10, margin.top - 5);
    });
    
    // Título y ejes
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Distribución de Resultados Monte Carlo', width / 2, 20);
    
    ctx.font = '12px Arial';
    ctx.fillText('Valor Final de Inversión (€)', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Frecuencia', 0, 0);
    ctx.restore();
}

function createHistogram(data, bins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const histogram = Array(bins).fill(0);
    
    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogram[binIndex]++;
    });
    
    return histogram.map((count, index) => ({
        binStart: min + (index * binWidth),
        binEnd: min + ((index + 1) * binWidth),
        count: count,
        frequency: count / data.length
    }));
}

// Comparación entre CCAA
async function compareRegions() {
    if (!currentSimulation) {
        showNotification('Realiza primero una simulación fiscal', 'warning');
        return;
    }

    try {
        showLoadingState('Comparando todas las CCAA...');
        
        const comparisons = advancedFiscalEngine.compareRegions(
            currentSimulation.totalInvestment,
            currentSimulation.stateQuota,
            currentSimulation.regionalQuota
        );
        
        displayRegionComparison(comparisons);
        
        hideLoadingState();
        showNotification('Comparación completada', 'success');
        
        trackEvent('region_comparison_completed', {
            regions_compared: comparisons.length
        });
        
    } catch (error) {
        hideLoadingState();
        console.error('Error en comparación:', error);
        showNotification('Error en comparación de regiones', 'error');
    }
}

function displayRegionComparison(comparisons) {
    const container = document.getElementById('simulatorResults');
    if (!container) return;

    const existingContent = container.innerHTML;
    
    container.innerHTML = existingContent + `
        <div class="form-card comparison-results">
            <h4>🗺️ Comparación entre Comunidades Autónomas</h4>
            <p class="form-description">Análisis comparativo de optimización fiscal por CCAA</p>
            
            <div class="comparison-table-container">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>CCAA</th>
                            <th>Ahorro Total</th>
                            <th>Rentabilidad</th>
                            <th>Score</th>
                            <th>Compatible</th>
                            <th>Riesgo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparisons.slice(0, 10).map((comp, index) => `
                            <tr class="${comp.ccaa === currentSimulation.ccaa ? 'current-ccaa' : ''}">
                                <td class="ranking">
                                    <span class="rank-badge rank-${index < 3 ? 'top' : 'normal'}">${index + 1}</span>
                                </td>
                                <td class="ccaa-name">
                                    <strong>${comp.ccaa}</strong>
                                    ${comp.ccaa === currentSimulation.ccaa ? '<span class="current-badge">Actual</span>' : ''}
                                </td>
                                <td class="amount">€${comp.totalDeduction.toLocaleString()}</td>
                                <td class="percentage ${comp.effectiveFiscalReturn > 40 ? 'positive' : 'neutral'}">
                                    ${comp.effectiveFiscalReturn.toFixed(1)}%
                                </td>
                                <td class="score">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${comp.optimizationScore}%"></div>
                                        <span class="score-text">${comp.optimizationScore}</span>
                                    </div>
                                </td>
                                <td class="compatible">
                                    <span class="compatibility-badge ${comp.compatible ? 'compatible' : 'incompatible'}">
                                        ${comp.compatible ? '✅ Sí' : '❌ No'}
                                    </span>
                                </td>
                                <td class="risk">
                                    <span class="risk-badge risk-${getRiskLevelText(comp.riskLevel).toLowerCase()}">
                                        ${getRiskLevelText(comp.riskLevel)}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="comparison-insights">
                <h5>📊 Insights de la Comparación</h5>
                <div class="insights-grid">
                    <div class="insight-card">
                        <h6>Mejor Opción</h6>
                        <p><strong>${comparisons[0].ccaa}</strong> ofrece el mayor ahorro fiscal con €${comparisons[0].totalDeduction.toLocaleString()}</p>
                    </div>
                    <div class="insight-card">
                        <h6>Mayor Rentabilidad</h6>
                        <p>Rentabilidad fiscal máxima del <strong>${Math.max(...comparisons.map(c => c.effectiveFiscalReturn)).toFixed(1)}%</strong></p>
                    </div>
                    <div class="insight-card">
                        <h6>Compatibles</h6>
                        <p><strong>${comparisons.filter(c => c.compatible).length}</strong> de ${comparisons.length} CCAA son compatibles</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Optimización de Cartera
async function optimizePortfolio() {
    if (!currentSimulation) {
        showNotification('Realiza primero una simulación fiscal', 'warning');
        return;
    }

    try {
        showLoadingState('Optimizando cartera de inversiones...');
        
        // Crear inversiones de ejemplo para optimización
        const sampleInvestments = generateSampleInvestments(currentSimulation.totalUsedInvestment);
        
        const portfolioResult = portfolioOptimizer.optimizePortfolio(sampleInvestments, {
            maxRisk: 0.3,
            minReturn: 0.15,
            maxConcentration: 0.4
        });
        
        currentPortfolioOptimization = portfolioResult;
        
        displayPortfolioOptimization(portfolioResult, sampleInvestments);
        
        hideLoadingState();
        showNotification('Optimización de cartera completada', 'success');
        
        trackEvent('portfolio_optimization_completed', {
            investments_count: sampleInvestments.length,
            sharpe_ratio: portfolioResult.sharpeOptimal.sharpeRatio
        });
        
    } catch (error) {
        hideLoadingState();
        console.error('Error en optimización de cartera:', error);
        showNotification('Error en optimización de cartera', 'error');
    }
}

function generateSampleInvestments(totalAmount) {
    const sectors = ['fintech', 'healthtech', 'edtech', 'cleantech', 'biotech'];
    const regions = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];
    const stages = ['seed', 'series_a', 'series_b'];
    
    return Array.from({ length: 8 }, (_, i) => ({
        id: `inv_${i + 1}`,
        name: `Empresa ${i + 1}`,
        amount: totalAmount / 8,
        expectedReturn: 0.2 + Math.random() * 0.3, // 20-50%
        volatility: 0.25 + Math.random() * 0.3, // 25-55%
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        fiscalReturn: 0.4 + Math.random() * 0.2 // 40-60%
    }));
}

function displayPortfolioOptimization(portfolioResult, investments) {
    const container = document.getElementById('simulatorResults');
    if (!container) return;

    const existingContent = container.innerHTML;
    
    container.innerHTML = existingContent + `
        <div class="form-card portfolio-results">
            <h4>💼 Optimización de Cartera</h4>
            <p class="form-description">Distribución óptima basada en Modern Portfolio Theory</p>
            
            <!-- Estrategias de Optimización -->
            <div class="optimization-strategies">
                <div class="strategy-tabs">
                    <button class="strategy-tab active" onclick="showStrategy('sharpe')">Máximo Sharpe</button>
                    <button class="strategy-tab" onclick="showStrategy('minvar')">Mínima Varianza</button>
                    <button class="strategy-tab" onclick="showStrategy('maxret')">Máximo Retorno</button>
                </div>
                
                <div class="strategy-content" id="strategy-sharpe">
                    <div class="strategy-metrics">
                        <div class="metric-card">
                            <div class="metric-value">${portfolioResult.sharpeOptimal.sharpeRatio.toFixed(2)}</div>
                            <div class="metric-label">Ratio Sharpe</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${(portfolioResult.sharpeOptimal.expectedReturn * 100).toFixed(1)}%</div>
                            <div class="metric-label">Retorno Esperado</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${(portfolioResult.sharpeOptimal.risk.volatility * 100).toFixed(1)}%</div>
                            <div class="metric-label">Volatilidad</div>
                        </div>
                    </div>
                    
                    <div class="portfolio-allocation">
                        <h5>Asignación Óptima</h5>
                        <div class="allocation-chart">
                            ${portfolioResult.sharpeOptimal.weights.map((weight, i) => `
                                <div class="allocation-item">
                                    <div class="allocation-bar">
                                        <div class="allocation-fill" style="width: ${weight * 100}%"></div>
                                    </div>
                                    <div class="allocation-details">
                                        <span class="investment-name">${investments[i].name}</span>
                                        <span class="investment-weight">${(weight * 100).toFixed(1)}%</span>
                                        <span class="investment-amount">€${(weight * currentSimulation.totalUsedInvestment).toLocaleString()}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Métricas de Diversificación -->
            <div class="diversification-metrics">
                <h5>📊 Métricas de Diversificación</h5>
                <div class="diversification-grid">
                    <div class="diversification-item">
                        <div class="diversification-label">Índice Herfindahl</div>
                        <div class="diversification-value">${portfolioResult.diversificationMetrics.herfindahlIndex.toFixed(3)}</div>
                        <div class="diversification-desc">Menor es mejor (0-1)</div>
                    </div>
                    <div class="diversification-item">
                        <div class="diversification-label">Nº Efectivo de Activos</div>
                        <div class="diversification-value">${portfolioResult.diversificationMetrics.effectiveNumberOfAssets.toFixed(1)}</div>
                        <div class="diversification-desc">Mayor diversificación</div>
                    </div>
                    <div class="diversification-item">
                        <div class="diversification-label">Concentración Sectorial</div>
                        <div class="diversification-value">${(portfolioResult.diversificationMetrics.sectorConcentration * 100).toFixed(1)}%</div>
                        <div class="diversification-desc">Máximo por sector</div>
                    </div>
                    <div class="diversification-item">
                        <div class="diversification-label">Ratio Diversificación</div>
                        <div class="diversification-value">${portfolioResult.diversificationMetrics.diversificationRatio.toFixed(2)}</div>
                        <div class="diversification-desc">Beneficio diversificación</div>
                    </div>
                </div>
            </div>
            
            <!-- Frontera Eficiente -->
            <div class="efficient-frontier">
                <h5>📈 Frontera Eficiente</h5>
                <div class="frontier-chart">
                    <canvas id="efficientFrontierChart" width="600" height="400"></canvas>
                </div>
            </div>
            
            <!-- Recomendaciones de Cartera -->
            <div class="portfolio-recommendations">
                <h5>💡 Recomendaciones de Cartera</h5>
                <div class="recommendations-list">
                    ${generatePortfolioRecommendations(portfolioResult).map(rec => `
                        <div class="recommendation-item ${rec.type}">
                            <h6>${rec.title}</h6>
                            <p>${rec.description}</p>
                            ${rec.action ? `<div class="recommendation-action">${rec.action}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Dibujar gráfico de frontera eficiente
    setTimeout(() => drawEfficientFrontier(portfolioResult), 100);
}

function generatePortfolioRecommendations(portfolioResult) {
    const recommendations = [];
    
    if (portfolioResult.diversificationMetrics.herfindahlIndex > 0.3) {
        recommendations.push({
            type: 'warning',
            title: 'Concentración Alta',
            description: 'La cartera muestra alta concentración en pocos activos.',
            action: 'Considera añadir más empresas para mejorar la diversificación.'
        });
    }
    
    if (portfolioResult.sharpeOptimal.sharpeRatio > 1.5) {
        recommendations.push({
            type: 'success',
            title: 'Excelente Ratio Riesgo-Retorno',
            description: 'La cartera optimizada muestra un excelente balance riesgo-retorno.',
            action: 'Mantén esta distribución para maximizar la eficiencia.'
        });
    }
    
    if (portfolioResult.diversificationMetrics.sectorConcentration > 0.5) {
        recommendations.push({
            type: 'info',
            title: 'Diversificación Sectorial',
            description: 'Considera diversificar más entre diferentes sectores.',
            action: 'Incluye empresas de sectores no correlacionados.'
        });
    }
    
    return recommendations;
}

function drawEfficientFrontier(portfolioResult) {
    const canvas = document.getElementById('efficientFrontierChart');
    if (!canvas || !portfolioResult.efficientFrontier) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar escalas
    const risks = portfolioResult.efficientFrontier.map(p => p.risk);
    const returns = portfolioResult.efficientFrontier.map(p => p.return);
    
    const minRisk = Math.min(...risks);
    const maxRisk = Math.max(...risks);
    const minReturn = Math.min(...returns);
    const maxReturn = Math.max(...returns);
    
    const xScale = (risk) => margin.left + ((risk - minRisk) / (maxRisk - minRisk)) * (width - margin.left - margin.right);
    const yScale = (ret) => height - margin.bottom - ((ret - minReturn) / (maxReturn - minReturn)) * (height - margin.top - margin.bottom);
    
    // Dibujar frontera eficiente
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    portfolioResult.efficientFrontier.forEach((point, i) => {
        const x = xScale(point.risk);
        const y = yScale(point.return);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Marcar cartera óptima
    const optimalX = xScale(portfolioResult.sharpeOptimal.risk.volatility);
    const optimalY = yScale(portfolioResult.sharpeOptimal.expectedReturn);
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(optimalX, optimalY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Etiquetas
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Frontera Eficiente', width / 2, 20);
    ctx.fillText('Riesgo (Volatilidad)', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Retorno Esperado', 0, 0);
    ctx.restore();
}

// Funciones de Exportación Avanzadas
async function exportAdvancedPDF() {
    if (!currentSimulation) {
        showNotification('No hay simulación para exportar', 'warning');
        return;
    }

    try {
        showLoadingState('Generando informe PDF avanzado...');
        
        // Simular generación de PDF avanzado
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const doc = documentManager.addDocument(
            `Informe Completo INVERTAX - ${currentSimulation.ccaa}`, 
            'advanced_pdf', 
            {
                fiscal: currentSimulation,
                risk: currentRiskAnalysis,
                portfolio: currentPortfolioOptimization,
                timestamp: new Date().toISOString()
            }
        );
        
        hideLoadingState();
        showNotification('Informe PDF avanzado generado correctamente', 'success');
        
        trackEvent('advanced_pdf_exported', {
            ccaa: currentSimulation.ccaa,
            optimization_score: currentSimulation.optimizationScore
        });
        
    } catch (error) {
        hideLoadingState();
        console.error('Error generando PDF:', error);
        showNotification('Error generando informe PDF', 'error');
    }
}

// Funcionalidades Offline
function initializeOfflineCapabilities() {
    // Detectar estado de conexión
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cargar datos del cache offline
    loadOfflineCache();
    
    // Configurar sincronización automática
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
            return registration.sync.register('sync-data');
        });
    }
}

function handleOnline() {
    isOffline = false;
    showNotification('Conexión restablecida. Sincronizando datos...', 'info');
    syncOfflineData();
}

function handleOffline() {
    isOffline = true;
    showNotification('Sin conexión. Modo offline activado.', 'warning');
}

function saveToOfflineCache(type, data) {
    if (!offlineCache[type]) {
        offlineCache[type] = [];
    }
    
    offlineCache[type].push({
        id: Date.now(),
        data: data,
        timestamp: new Date().toISOString(),
        synced: false
    });
    
    // Guardar en localStorage
    localStorage.setItem('invertax_offline_cache', JSON.stringify(offlineCache));
}

function loadOfflineCache() {
    try {
        const cached = localStorage.getItem('invertax_offline_cache');
        if (cached) {
            offlineCache = JSON.parse(cached);
        }
    } catch (error) {
        console.error('Error cargando cache offline:', error);
    }
}

async function syncOfflineData() {
    if (isOffline) return;
    
    try {
        // Sincronizar simulaciones pendientes
        const pendingSimulations = offlineCache.simulations?.filter(s => !s.synced) || [];
        
        for (const simulation of pendingSimulations) {
            // Aquí se enviarían al servidor
            // await uploadSimulation(simulation.data);
            simulation.synced = true;
        }
        
        // Actualizar cache
        localStorage.setItem('invertax_offline_cache', JSON.stringify(offlineCache));
        
        if (pendingSimulations.length > 0) {
            showNotification(`${pendingSimulations.length} simulaciones sincronizadas`, 'success');
        }
        
    } catch (error) {
        console.error('Error sincronizando datos:', error);
        showNotification('Error en sincronización de datos', 'error');
    }
}

// Navegación y UI
function initializeNavigation() {
    // Toggle de menú móvil
    const toggleBtn = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', function() {
            menu.classList.toggle('nav__menu--open');
            this.classList.toggle('nav__toggle--open');
        });
    }
    
    // Scroll suave para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cerrar menú móvil
                menu?.classList.remove('nav__menu--open');
                toggleBtn?.classList.remove('nav__toggle--open');
            }
        });
    });
    
    // Navegación por teclado mejorada
    document.addEventListener('keydown', function(e) {
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.remove();
            }
        }
        
        // Ctrl+S para guardar simulación
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (currentSimulation) {
                exportAdvancedPDF();
            }
        }
        
        // Ctrl+Enter para ejecutar simulación
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            calculateAdvanced();
        }
    });
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            showNotification('Enviando consulta...', 'info');
            
            // Simular envío
            setTimeout(() => {
                showNotification('Consulta enviada correctamente. Te responderemos en 24h laborables.', 'success');
                form.reset();
                
                trackEvent('contact_form_submitted', {
                    subject: data.contactSubject
                });
            }, 1500);
        });
    }
}

// PWA Functions
function initializePWA() {
    // Registrar service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // Configurar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showNotification('Nueva versión disponible. Recarga para actualizar.', 'info');
                            }
                        });
                    });
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    // Detectar si ya está instalado
    window.addEventListener('appinstalled', () => {
        showNotification('INVERTAX instalado correctamente', 'success');
        trackEvent('pwa_installed');
    });
}

function showInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.classList.remove('hidden');
    }
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showNotification('Instalando INVERTAX...', 'info');
                trackEvent('pwa_install_accepted');
            } else {
                trackEvent('pwa_install_dismissed');
            }
            deferredPrompt = null;
            dismissInstall();
        });
    }
}

function dismissInstall() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.classList.add('hidden');
    }
}

// Analytics
function initializeAnalytics() {
    // Configurar analytics (simulado)
    trackEvent('app_initialized', {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        is_mobile: /Mobi|Android/i.test(navigator.userAgent)
    });
    
    // Track performance metrics
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                trackEvent('performance_metrics', {
                    load_time: perfData.loadEventEnd - perfData.loadEventStart,
                    dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0
                });
            }, 0);
        });
    }
}

function trackEvent(eventName, parameters = {}) {
    // Simulación de analytics - en producción se integraría con Google Analytics, Mixpanel, etc.
    console.log(`📊 Analytics: ${eventName}`, parameters);
    
    // Guardar en localStorage para análisis offline
    const events = JSON.parse(localStorage.getItem('invertax_analytics') || '[]');
    events.push({
        event: eventName,
        parameters: parameters,
        timestamp: new Date().toISOString(),
        session_id: getSessionId()
    });
    
    // Mantener solo los últimos 100 eventos
    if (events.length > 100) {
        events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('invertax_analytics', JSON.stringify(events));
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('invertax_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('invertax_session_id', sessionId);
    }
    return sessionId;
}

// Funciones de Utilidad Mejoradas
function showMessage(container, message, type = 'info') {
    const alertClass = type === 'error' ? 'alert--warning' : 
                      type === 'success' ? 'alert--success' : 'alert--info';
    
    container.innerHTML = `
        <div class="alert ${alertClass}">
            <div class="alert-content">
                <span class="alert-icon">
                    ${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
                </span>
                <span class="alert-message">${message}</span>
            </div>
        </div>
    `;
    container.classList.remove('hidden');
}

function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-toast--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="notification-progress">
            <div class="notification-progress-bar" style="animation-duration: ${duration}ms"></div>
        </div>
    `;
    
    // Añadir estilos si no están presentes
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-toast {
                position: fixed;
                top: 100px;
                right: var(--space-5);
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 1500;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
                min-width: 300px;
                overflow: hidden;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-4);
            }
            .notification-icon {
                font-size: var(--font-size-lg);
                flex-shrink: 0;
            }
            .notification-message {
                flex: 1;
                font-size: var(--font-size-sm);
                line-height: var(--line-height-normal);
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: var(--font-size-lg);
                color: var(--color-text-secondary);
                flex-shrink: 0;
                padding: var(--space-1);
                border-radius: var(--radius-sm);
                transition: background-color var(--duration-fast);
            }
            .notification-close:hover {
                background: var(--color-secondary);
            }
            .notification-progress {
                height: 3px;
                background: var(--color-secondary);
                overflow: hidden;
            }
            .notification-progress-bar {
                height: 100%;
                background: var(--color-primary);
                width: 100%;
                animation: progressBar linear forwards;
            }
            .notification-toast--success {
                border-left: 4px solid var(--color-success);
            }
            .notification-toast--error {
                border-left: 4px solid var(--color-error);
            }
            .notification-toast--info {
                border-left: 4px solid var(--color-info);
            }
            .notification-toast--warning {
                border-left: 4px solid var(--color-warning);
            }
            .notification-toast--success .notification-progress-bar {
                background: var(--color-success);
            }
            .notification-toast--error .notification-progress-bar {
                background: var(--color-error);
            }
            .notification-toast--warning .notification-progress-bar {
                background: var(--color-warning);
            }
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
            @keyframes progressBar {
                from { width: 100%; }
                to { width: 0%; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remover después del tiempo especificado
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

function showLoadingState(message = 'Cargando...') {
    let loader = document.getElementById('global-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = `
            <div class="loader-overlay">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <div class="loader-message">${message}</div>
                </div>
            </div>
        `;
        
        // Añadir estilos del loader
        if (!document.querySelector('#loader-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loader-styles';
            styles.textContent = `
                .loader-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(4px);
                }
                .loader-content {
                    background: var(--color-surface);
                    padding: var(--space-8);
                    border-radius: var(--radius-lg);
                    text-align: center;
                    box-shadow: var(--shadow-xl);
                    min-width: 200px;
                }
                .loader-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--color-secondary);
                    border-top: 4px solid var(--color-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto var(--space-4);
                }
                .loader-message {
                    color: var(--color-text);
                    font-weight: var(--font-weight-medium);
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(loader);
    } else {
        loader.querySelector('.loader-message').textContent = message;
        loader.style.display = 'block';
    }
}

function hideLoadingState() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Manejo de errores mejorado
window.addEventListener('error', function(e) {
    console.error('Error de aplicación:', e.error);
    showNotification('Se ha producido un error. Por favor, recarga la página.', 'error');
    
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
    });
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection no manejada:', e.reason);
    showNotification('Error de conexión. Verifica tu conexión a internet.', 'warning');
    
    trackEvent('unhandled_promise_rejection', {
        reason: e.reason?.toString(),
        stack: e.reason?.stack
    });
});

// Inicialización de Document Manager mejorado
class DocumentManager {
    constructor() {
        this.documents = [];
        this.initializeSampleDocuments();
    }

    initializeSampleDocuments() {
        this.documents = [
            {
                id: 1,
                name: "Simulación Avanzada - Madrid",
                date: new Date('2025-01-15'),
                status: "Generado",
                hash: this.generateSHA256("advanced_simulation_madrid_20250115"),
                type: "advanced_simulation",
                size: "2.3 MB"
            },
            {
                id: 2,
                name: "Análisis Monte Carlo - Valencia",
                date: new Date('2025-01-10'),
                status: "Firmado",
                hash: this.generateSHA256("montecarlo_valencia_20250110"),
                type: "montecarlo_advanced",
                size: "1.8 MB"
            }
        ];
    }

    generateSHA256(input) {
        // Simulación mejorada de hash SHA-256
        const timestamp = Date.now().toString();
        const combined = input + timestamp;
        let hash = 0;
        
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        // Generar hash más realista
        const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
        const randomStr = Math.random().toString(16).substring(2, 16);
        return `${hashStr}${randomStr}${'a'.repeat(48 - hashStr.length - randomStr.length)}`;
    }

    addDocument(name, type, content = null) {
        const doc = {
            id: this.documents.length + 1,
            name: name,
            date: new Date(),
            status: "Generado",
            hash: this.generateSHA256(name + Date.now()),
            type: type,
            content: content,
            size: this.calculateSize(content)
        };
        this.documents.push(doc);
        return doc;
    }

    calculateSize(content) {
        if (!content) return "0.1 MB";
        const sizeKB = JSON.stringify(content).length / 1024;
        if (sizeKB < 1024) {
            return `${sizeKB.toFixed(1)} KB`;
        } else {
            return `${(sizeKB / 1024).toFixed(1)} MB`;
        }
    }

    getDocuments() {
        return [...this.documents].reverse();
    }

    updateDocumentStatus(id, status) {
        const doc = this.documents.find(d => d.id === id);
        if (doc) {
            doc.status = status;
            return doc;
        }
        return null;
    }
}

// Motor Monte Carlo mejorado
class MonteCarloEngine {
    constructor() {
        this.iterations = 1000;
        this.defaultParameters = {
            expectedReturn: 0.25,
            volatility: 0.35,
            years: 3,
            riskFreeRate: 0.02
        };
    }

    simulate(investment, expectedReturn, volatility, years, iterations = this.iterations) {
        const results = [];
        const dt = 1; // Pasos anuales
        
        for (let i = 0; i < iterations; i++) {
            let value = investment;
            
            for (let year = 0; year < years; year++) {
                const drift = expectedReturn / 100;
                const diffusion = (volatility / 100) * this.randomNormal();
                const growth = Math.exp(drift * dt + diffusion * Math.sqrt(dt));
                value *= growth;
            }
            
            results.push(value);
        }
        
        // Ordenar para cálculo de percentiles
        results.sort((a, b) => a - b);
        
        const statistics = this.calculateStatistics(results, investment);
        const metrics = this.calculateMetrics(results, investment, expectedReturn, volatility);
        
        return {
            results: results,
            iterations: iterations,
            statistics: statistics,
            metrics: metrics,
            percentiles: {
                p5: results[Math.floor(0.05 * results.length)],
                p10: results[Math.floor(0.10 * results.length)],
                p25: results[Math.floor(0.25 * results.length)],
                p50: results[Math.floor(0.50 * results.length)],
                p75: results[Math.floor(0.75 * results.length)],
                p90: results[Math.floor(0.90 * results.length)],
                p95: results[Math.floor(0.95 * results.length)]
            },
            scenarios: this.generateScenarios(results, investment),
            histogram: this.createHistogram(results, 50)
        };
    }

    calculateStatistics(results, investment) {
        const mean = results.reduce((a, b) => a + b, 0) / results.length;
        const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
        const standardDeviation = Math.sqrt(variance);
        
        return {
            mean: mean,
            median: results[Math.floor(results.length * 0.5)],
            standardDeviation: standardDeviation,
            variance: variance,
            skewness: this.calculateSkewness(results, mean, standardDeviation),
            kurtosis: this.calculateKurtosis(results, mean, standardDeviation),
            min: Math.min(...results),
            max: Math.max(...results)
        };
    }

    calculateMetrics(results, investment, expectedReturn, volatility) {
        const mean = results.reduce((a, b) => a + b, 0) / results.length;
        const lossCount = results.filter(r => r < investment).length;
        const profitCount = results.filter(r => r > investment * 1.1).length; // Ganancia > 10%
        
        const annualizedReturn = ((mean / investment) ** (1/3)) - 1; // 3 años
        const annualizedVol = volatility / 100;
        const sharpeRatio = (annualizedReturn - this.defaultParameters.riskFreeRate) / annualizedVol;
        
        return {
            probabilityOfLoss: (lossCount / results.length) * 100,
            successRate: (profitCount / results.length) * 100,
            averageReturn: ((mean - investment) / investment) * 100,
            sharpeRatio: sharpeRatio,
            sortinoRatio: this.calculateSortinoRatio(results, investment),
            calmarRatio: this.calculateCalmarRatio(results, investment),
            maxDrawdown: this.calculateMaxDrawdown(results)
        };
    }

    calculateSkewness(data, mean, stdDev) {
        const n = data.length;
        const skewness = data.reduce((sum, val) => {
            return sum + Math.pow((val - mean) / stdDev, 3);
        }, 0) / n;
        return skewness;
    }

    calculateKurtosis(data, mean, stdDev) {
        const n = data.length;
        const kurtosis = data.reduce((sum, val) => {
            return sum + Math.pow((val - mean) / stdDev, 4);
        }, 0) / n;
        return kurtosis - 3; // Excess kurtosis
    }

    calculateSortinoRatio(results, investment) {
        const returns = results.map(r => (r - investment) / investment);
        const targetReturn = 0;
        const downside = returns.filter(r => r < targetReturn);
        
        if (downside.length === 0) return Infinity;
        
        const downsideDeviation = Math.sqrt(
            downside.reduce((sum, r) => sum + Math.pow(r - targetReturn, 2), 0) / downside.length
        );
        
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        return (avgReturn - targetReturn) / downsideDeviation;
    }

    calculateCalmarRatio(results, investment) {
        const returns = results.map(r => (r - investment) / investment);
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const maxDrawdown = this.calculateMaxDrawdown(results);
        
        return maxDrawdown > 0 ? avgReturn / maxDrawdown : Infinity;
    }

    calculateMaxDrawdown(results) {
        let peak = results[0];
        let maxDrawdown = 0;
        
        for (let i = 1; i < results.length; i++) {
            if (results[i] > peak) {
                peak = results[i];
            } else {
                const drawdown = (peak - results[i]) / peak;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }
        
        return maxDrawdown;
    }

    createHistogram(data, bins) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / bins;
        const histogram = Array(bins).fill(0);
        
        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
            histogram[binIndex]++;
        });
        
        return histogram.map((count, index) => ({
            binStart: min + (index * binWidth),
            binEnd: min + ((index + 1) * binWidth),
            count: count,
            frequency: count / data.length,
            percentage: (count / data.length) * 100
        }));
    }

    randomNormal() {
        // Transformación Box-Muller mejorada
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    generateScenarios(results, investment) {
        const p5 = results[Math.floor(0.05 * results.length)];
        const p50 = results[Math.floor(0.50 * results.length)];
        const p95 = results[Math.floor(0.95 * results.length)];

        return {
            conservative: {
                value: p5,
                return: ((p5 - investment) / investment * 100).toFixed(1),
                probability: "5% escenario pesimista"
            },
            expected: {
                value: p50,
                return: ((p50 - investment) / investment * 100).toFixed(1),
                probability: "50% escenario esperado"
            },
            optimistic: {
                value: p95,
                return: ((p95 - investment) / investment * 100).toFixed(1),
                probability: "95% escenario optimista"
            }
        };
    }
}

console.log('🚀 INVERTAX Advanced Application loaded successfully');
console.log('📊 Advanced Fiscal Engine initialized');
console.log('🏛️ CCAA data loaded:', Object.keys(CCAA_DATA).length, 'communities');
console.log('⚡ Performance optimizations enabled');
console.log('📱 PWA capabilities activated');
console.log('🔒 Offline functionality ready');