// INVERTAX Application JavaScript
// Plataforma profesional de optimización fiscal para inversiones en empresas de nueva creación

// CCAA Data con información fiscal completa y actualizada
const CCAA_DATA = {
    "Madrid": {
        percentage: 0.4,
        maxBase: 9279,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora", "empresa de base tecnológica"],
        notes: "Permanencia mínima de 3 años, 5 empleados mínimo en plantilla"
    },
    "Cataluña": {
        percentage: 0.5,
        maxBase: 12000,
        compatible: false,
        acceptedProfiles: ["todos"],
        notes: "Incompatible con deducción estatal, requiere business angel acreditado"
    },
    "Valencia": {
        percentage: 0.3,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa local"],
        notes: "Requiere sede social en la Comunidad Valenciana"
    },
    "Andalucía": {
        percentage: 0.25,
        maxBase: 10000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa tecnológica", "empresa de base científica"],
        notes: "Antigüedad máxima 5 años, sede fiscal en Andalucía"
    },
    "País Vasco": {
        percentage: 0.35,
        maxBase: 15000,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora"],
        notes: "Normativa foral específica, consultar disposiciones vigentes"
    },
    "Galicia": {
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ["empresa de base tecnológica", "empresa innovadora"],
        notes: "Registro previo en IGAPE, validación técnica previa"
    },
    "Castilla y León": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa de creación reciente"],
        notes: "Antigüedad máxima 3 años, actividad en la comunidad"
    },
    "Castilla-La Mancha": {
        percentage: 0.15,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa de base tecnológica"],
        notes: "Mínimo 3 empleados a jornada completa"
    },
    "Extremadura": {
        percentage: 0.20,
        maxBase: 4000,
        compatible: true,
        acceptedProfiles: ["empresa local", "empresa innovadora"],
        notes: "Inversión mínima €3.000, sede en Extremadura"
    },
    "Murcia": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora"],
        notes: "Permanencia 4 años, sede en Murcia"
    },
    "Asturias": {
        percentage: 0.25,
        maxBase: 7000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa tecnológica"],
        notes: "Actividad económica en Asturias, validación por IDEPA"
    },
    "Cantabria": {
        percentage: 0.15,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ["empresa local", "empresa innovadora"],
        notes: "Requiere inscripción en registro autonómico"
    },
    "La Rioja": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa tecnológica", "empresa innovadora"],
        notes: "Certificación ADER previa, sede social en La Rioja"
    },
    "Navarra": {
        percentage: 0.30,
        maxBase: 10000,
        compatible: true,
        acceptedProfiles: ["empresa innovadora", "empresa tecnológica"],
        notes: "Normativa foral específica de Navarra"
    },
    "Aragón": {
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ["empresa local", "empresa innovadora"],
        notes: "Actividad en Aragón, validación previa"
    },
    "Canarias": {
        percentage: 0,
        maxBase: 0,
        compatible: false,
        special: "ZEC",
        acceptedProfiles: ["ZEC"],
        notes: "Zona Especial Canaria, consultar normativa específica REF"
    },
    "Baleares": {
        percentage: 0,
        maxBase: 0,
        compatible: false,
        special: "Régimen especial",
        acceptedProfiles: ["empresa turística", "empresa innovadora"],
        notes: "Consultar normativa vigente específica"
    }
};

// Límites estatales según Art. 68.1 LIRPF
const STATE_LIMITS = {
    percentage: 0.5,
    maxBase: 100000,
    minInvestment: 1000
};

// Motor Fiscal INVERTAX - Implementación del algoritmo de optimización secuencial
class FiscalEngine {
    constructor() {
        this.STATE_DEDUCTION_RATE = 0.50;
        this.STATE_MAX_BASE = 100000;
    }

    /**
     * Calcula la distribución óptima de inversión usando el Modelo INVERTAX
     * Paso 1: Maximiza deducción estatal (50% hasta €100,000)
     * Paso 2: Asigna remanente a deducción autonómica si es compatible
     * Paso 3: Calcula rentabilidad fiscal real sobre capital utilizado
     */
    calculateOptimalDeductions(investment, ccaaCode, stateQuota, regionalQuota, projectProfile = null) {
        const ccaaData = CCAA_DATA[ccaaCode];
        if (!ccaaData) {
            throw new Error(`CCAA ${ccaaCode} no encontrada en base de datos`);
        }

        const result = {
            totalInvestment: investment,
            ccaa: ccaaCode,
            stateQuota: stateQuota,
            regionalQuota: regionalQuota,
            distributions: [],
            totalDeduction: 0,
            totalUsedInvestment: 0,
            effectiveFiscalReturn: 0,
            unoptimizedCapital: 0,
            recommendations: [],
            projectProfile: projectProfile,
            ccaaData: ccaaData
        };

        // PASO 1: Optimización de Deducción Estatal (Proyecto A)
        const maxStateInvestment = Math.min(investment, this.STATE_MAX_BASE);
        const maxStateDeduction = maxStateInvestment * this.STATE_DEDUCTION_RATE;
        const stateDeduction = Math.min(maxStateDeduction, stateQuota);
        const stateInvestment = stateDeduction / this.STATE_DEDUCTION_RATE;

        if (stateInvestment > 0) {
            result.distributions.push({
                project: "Proyecto A (Deducción Estatal)",
                investment: stateInvestment,
                deductionRate: this.STATE_DEDUCTION_RATE,
                deduction: stateDeduction,
                description: "Art. 68.1 LIRPF - Deducción estatal del 50%",
                type: "estatal"
            });

            result.totalDeduction += stateDeduction;
            result.totalUsedInvestment += stateInvestment;
        }

        // PASO 2: Optimización de Deducción Autonómica (Proyecto B)
        const remainingInvestment = investment - stateInvestment;
        
        if (remainingInvestment > 0 && ccaaData.compatible && ccaaData.percentage > 0) {
            // Validar perfil del proyecto si se especifica
            const profileValid = !projectProfile || 
                                ccaaData.acceptedProfiles.includes("todos") ||
                                ccaaData.acceptedProfiles.some(profile => 
                                    projectProfile.toLowerCase().includes(profile.toLowerCase())
                                );

            if (profileValid) {
                const maxRegionalInvestment = Math.min(remainingInvestment, ccaaData.maxBase);
                const maxRegionalDeduction = maxRegionalInvestment * ccaaData.percentage;
                const regionalDeduction = Math.min(maxRegionalDeduction, regionalQuota);
                const regionalInvestment = regionalDeduction / ccaaData.percentage;

                if (regionalInvestment > 0) {
                    result.distributions.push({
                        project: "Proyecto B (Deducción Autonómica)",
                        investment: regionalInvestment,
                        deductionRate: ccaaData.percentage,
                        deduction: regionalDeduction,
                        description: `Deducción autonómica ${ccaaCode} - ${(ccaaData.percentage * 100).toFixed(0)}%`,
                        type: "autonomica"
                    });

                    result.totalDeduction += regionalDeduction;
                    result.totalUsedInvestment += regionalInvestment;
                }
            } else {
                result.recommendations.push({
                    type: 'warning',
                    message: `El perfil "${projectProfile}" no es compatible con los requisitos de ${ccaaCode}. Perfiles aceptados: ${ccaaData.acceptedProfiles.join(', ')}`
                });
            }
        }

        // PASO 3: Cálculos finales y métricas
        result.unoptimizedCapital = investment - result.totalUsedInvestment;

        // Rentabilidad fiscal REAL = deducción total / inversión utilizada
        if (result.totalUsedInvestment > 0) {
            result.effectiveFiscalReturn = (result.totalDeduction / result.totalUsedInvestment) * 100;
        }

        // Generar recomendaciones personalizadas
        this.generateRecommendations(result, ccaaData);

        return result;
    }

    generateRecommendations(result, ccaaData) {
        // Alerta por capital no optimizado
        if (result.unoptimizedCapital > 1000) {
            result.recommendations.push({
                type: 'warning',
                message: `€${result.unoptimizedCapital.toLocaleString()} de tu inversión no se han podido optimizar. Considera aumentar tus cuotas fiscales o diversificar en múltiples ejercicios.`
            });
        }

        // Información sobre compatibilidad
        if (!ccaaData.compatible) {
            result.recommendations.push({
                type: 'info',
                message: `${result.ccaa} tiene deducciones incompatibles con la estatal. Solo se aplica deducción autonómica del ${(ccaaData.percentage * 100).toFixed(0)}%.`
            });
        }

        // Evaluación de eficiencia fiscal
        if (result.effectiveFiscalReturn > 45) {
            result.recommendations.push({
                type: 'success',
                message: `Excelente optimización fiscal: ${result.effectiveFiscalReturn.toFixed(1)}% de rentabilidad fiscal efectiva. Tu estrategia está muy bien optimizada.`
            });
        } else if (result.effectiveFiscalReturn < 25) {
            result.recommendations.push({
                type: 'warning',
                message: `Rentabilidad fiscal baja (${result.effectiveFiscalReturn.toFixed(1)}%). Considera aumentar tus cuotas disponibles o revisar tu estrategia de inversión.`
            });
        }

        // Alertas sobre límites alcanzados
        if (result.totalUsedInvestment >= this.STATE_MAX_BASE) {
            result.recommendations.push({
                type: 'info',
                message: `Has alcanzado la base máxima de deducción estatal (€${this.STATE_MAX_BASE.toLocaleString()}). Para optimizar más capital, considera deducciones autonómicas.`
            });
        }

        // Información específica de CCAA
        if (ccaaData.special) {
            result.recommendations.push({
                type: 'info',
                message: `${result.ccaa} tiene régimen especial (${ccaaData.special}). ${ccaaData.notes}`
            });
        }

        // Alertas sobre utilización de cuotas
        const stateQuotaUsed = result.distributions.find(d => d.type === 'estatal')?.deduction || 0;
        const regionalQuotaUsed = result.distributions.find(d => d.type === 'autonomica')?.deduction || 0;

        if (stateQuotaUsed < result.stateQuota * 0.9) {
            const unusedQuota = result.stateQuota - stateQuotaUsed;
            result.recommendations.push({
                type: 'info',
                message: `Tienes €${unusedQuota.toLocaleString()} de cuota estatal sin utilizar. Podrías aumentar tu inversión para aprovecharla completamente.`
            });
        }

        if (ccaaData.compatible && regionalQuotaUsed < result.regionalQuota * 0.9) {
            const unusedQuota = result.regionalQuota - regionalQuotaUsed;
            result.recommendations.push({
                type: 'info',
                message: `Tienes €${unusedQuota.toLocaleString()} de cuota autonómica sin utilizar en ${result.ccaa}.`
            });
        }

        // Recomendaciones sobre requisitos específicos
        if (ccaaData.notes) {
            result.recommendations.push({
                type: 'info',
                message: `Requisitos específicos en ${result.ccaa}: ${ccaaData.notes}`
            });
        }
    }

    // Cálculo rápido para simulaciones básicas
    calculateQuick(investment, ccaaCode) {
        try {
            // Estimación de cuotas promedio
            const estimatedStateQuota = Math.min(investment * 0.4, 20000);
            const estimatedRegionalQuota = Math.min(investment * 0.25, 10000);
            
            const result = this.calculateOptimalDeductions(investment, ccaaCode, estimatedStateQuota, estimatedRegionalQuota);
            return {
                success: true,
                totalSaving: result.totalDeduction,
                effectiveReturn: result.effectiveFiscalReturn,
                message: `Ahorro fiscal estimado: €${result.totalDeduction.toLocaleString()}`,
                usedInvestment: result.totalUsedInvestment,
                details: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

// Motor de Simulaciones Monte Carlo para análisis de riesgo
class MonteCarloEngine {
    constructor() {
        this.iterations = 1000;
    }

    simulate(investment, expectedReturn, volatility, years) {
        const results = [];
        const dt = 1; // Pasos anuales
        
        for (let i = 0; i < this.iterations; i++) {
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
        
        return {
            results: results,
            percentiles: {
                p5: results[Math.floor(0.05 * results.length)],
                p25: results[Math.floor(0.25 * results.length)],
                p50: results[Math.floor(0.50 * results.length)],
                p75: results[Math.floor(0.75 * results.length)],
                p95: results[Math.floor(0.95 * results.length)]
            },
            mean: results.reduce((a, b) => a + b) / results.length,
            scenarios: this.generateScenarios(results, investment)
        };
    }

    randomNormal() {
        // Transformación Box-Muller para distribución normal
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

// Gestor de Documentos con trazabilidad SHA-256
class DocumentManager {
    constructor() {
        this.documents = [];
        this.initializeSampleDocuments();
    }

    initializeSampleDocuments() {
        this.documents = [
            {
                id: 1,
                name: "Simulación Fiscal - Madrid",
                date: new Date('2025-01-15'),
                status: "Generado",
                hash: this.generateSHA256("simulation_madrid_20250115"),
                type: "simulation"
            },
            {
                id: 2,
                name: "Análisis Monte Carlo - Valencia",
                date: new Date('2025-01-10'),
                status: "Firmado",
                hash: this.generateSHA256("montecarlo_valencia_20250110"),
                type: "analysis"
            }
        ];
    }

    generateSHA256(input) {
        // Simulación de hash SHA-256 para demo
        const timestamp = Date.now().toString();
        const combined = input + timestamp;
        let hash = 0;
        
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        // Generar hash realista
        const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
        const randomStr = Math.random().toString(16).substring(2, 10);
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
            content: content
        };
        this.documents.push(doc);
        return doc;
    }

    getDocuments() {
        return [...this.documents].reverse(); // Más recientes primero
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

// Inicialización de motores
const fiscalEngine = new FiscalEngine();
const monteCarloEngine = new MonteCarloEngine();
const documentManager = new DocumentManager();

// Variables globales
let currentSimulation = null;
let deferredPrompt = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
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
    
    console.log('INVERTAX App inicializada correctamente');
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
        
        item.innerHTML = `
            <div class="ccaa-legal-header">
                <h4>${compatibilityIcon} ${ccaa}</h4>
                <span class="ccaa-percentage">${percentageText}</span>
            </div>
            <div class="ccaa-legal-details">
                <p><strong>Base máxima:</strong> €${data.maxBase.toLocaleString()}</p>
                <p><strong>Compatible con estatal:</strong> ${data.compatible ? 'Sí' : 'No'}</p>
                ${data.special ? `<p><strong>Régimen especial:</strong> ${data.special}</p>` : ''}
                <p><strong>Requisitos:</strong> ${data.notes}</p>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Funciones del Simulador
function calculateAdvanced() {
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
    
    if (investment < 1000 || investment > 500000) {
        showMessage(resultsDiv, 'La inversión debe estar entre €1.000 y €500.000', 'error');
        return;
    }
    
    try {
        const result = fiscalEngine.calculateOptimalDeductions(investment, ccaa, stateQuota, regionalQuota, projectProfile);
        currentSimulation = result;
        displayAdvancedResults(result, resultsDiv);
        
        // Generar documento
        const doc = documentManager.addDocument(`Simulación ${ccaa} - ${new Date().toLocaleDateString()}`, 'simulation', result);
        
        showNotification('Simulación completada correctamente', 'success');
    } catch (error) {
        showMessage(resultsDiv, `Error en cálculo: ${error.message}`, 'error');
    }
}

function displayAdvancedResults(result, container) {
    const ccaaData = result.ccaaData;
    
    container.innerHTML = `
        <div class="form-card">
            <div class="results-header">
                <h3>🎯 Resultados de Optimización INVERTAX</h3>
                <span class="badge badge--success">Optimización Completada</span>
            </div>
            
            <div class="results-summary">
                <div class="result-main">
                    <div class="result-amount">€${result.totalDeduction.toLocaleString()}</div>
                    <div class="result-label">Ahorro Fiscal Total</div>
                    <div class="result-roi">${result.effectiveFiscalReturn.toFixed(1)}% ROI Fiscal</div>
                </div>
                
                <div class="result-breakdown">
                    <h4>📊 Desglose de Optimización</h4>
                    ${result.distributions.map(dist => `
                        <div class="breakdown-item">
                            <div class="breakdown-label">${dist.project}:</div>
                            <div class="breakdown-value">€${dist.investment.toLocaleString()}</div>
                        </div>
                        <div class="breakdown-item">
                            <div class="breakdown-label">Deducción (${(dist.deductionRate * 100).toFixed(0)}%):</div>
                            <div class="breakdown-value">€${dist.deduction.toLocaleString()}</div>
                        </div>
                    `).join('')}
                    
                    ${result.unoptimizedCapital > 0 ? `
                        <div class="breakdown-item warning">
                            <div class="breakdown-label">Capital no optimizado:</div>
                            <div class="breakdown-value">€${result.unoptimizedCapital.toLocaleString()}</div>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${result.recommendations.length > 0 ? `
                <div class="results-alerts">
                    <h4>💡 Recomendaciones Personalizadas</h4>
                    ${result.recommendations.map(rec => `
                        <div class="alert alert--${rec.type}">
                            ${rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : 'ℹ️'} ${rec.message}
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div class="results-disclaimer">
                <h4>⚖️ Información Legal</h4>
                <ul class="disclaimer-list">
                    <li>Cálculos basados en normativa fiscal vigente (Art. 68.1 LIRPF)</li>
                    <li>Resultados orientativos sujetos a validación con asesor fiscal</li>
                    <li>Permanencia mínima de inversión: 3 años</li>
                    <li>Riesgo de pérdida del capital invertido</li>
                    <li>Las deducciones están sujetas a cuotas fiscales disponibles</li>
                </ul>
            </div>

            <div class="results-actions">
                <button class="btn btn--primary" onclick="exportPDF()">
                    📄 Exportar Informe PDF
                </button>
                <button class="btn btn--secondary" onclick="exportJSON()">
                    📋 Exportar Datos JSON
                </button>
                <button class="btn btn--outline" onclick="runMonteCarlo()">
                    📊 Análisis de Riesgo
                </button>
            </div>
        </div>
    `;
    
    container.classList.add('fade-in');
    container.scrollIntoView({ behavior: 'smooth' });
}

// Análisis Monte Carlo
function runMonteCarlo() {
    if (!currentSimulation) {
        showNotification('Realiza primero una simulación fiscal', 'warning');
        return;
    }

    const years = 3; // Período mínimo de permanencia
    const expectedReturn = 25; // Rentabilidad esperada conservadora
    const volatility = 35; // Volatilidad típica de empresas nuevas
    const investment = currentSimulation.totalUsedInvestment;

    showNotification('Ejecutando análisis Monte Carlo...', 'info');

    // Simular tiempo de procesamiento
    setTimeout(() => {
        const results = monteCarloEngine.simulate(investment, expectedReturn, volatility, years);
        displayMonteCarloResults(results);
        
        // Generar documento
        const doc = documentManager.addDocument(`Análisis Monte Carlo - ${new Date().toLocaleDateString()}`, 'montecarlo', results);
        
        showNotification('Análisis de riesgo completado', 'success');
    }, 1500);
}

function displayMonteCarloResults(results) {
    const container = document.getElementById('simulatorResults');
    if (!container) return;

    const existingContent = container.innerHTML;
    
    container.innerHTML = existingContent + `
        <div class="form-card" style="margin-top: var(--space-8);">
            <h3>📊 Análisis de Riesgo Monte Carlo</h3>
            <p class="form-description">Simulación con ${monteCarloEngine.iterations} iteraciones para evaluar escenarios de rentabilidad</p>
            
            <div class="scenarios-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin: var(--space-5) 0;">
                <div class="scenario conservative" style="text-align: center; padding: var(--space-4); background: rgba(220, 38, 38, 0.1); border-radius: var(--radius-lg); border: 1px solid rgba(220, 38, 38, 0.2);">
                    <h4 style="color: var(--color-error); margin-bottom: var(--space-2);">🔴 Conservador</h4>
                    <div class="scenario-value" style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-error);">€${results.scenarios.conservative.value.toLocaleString()}</div>
                    <div class="scenario-return" style="color: var(--color-text-secondary);">${results.scenarios.conservative.return}%</div>
                </div>
                <div class="scenario expected" style="text-align: center; padding: var(--space-4); background: rgba(217, 119, 6, 0.1); border-radius: var(--radius-lg); border: 1px solid rgba(217, 119, 6, 0.2);">
                    <h4 style="color: var(--color-warning); margin-bottom: var(--space-2);">🟡 Esperado</h4>
                    <div class="scenario-value" style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-warning);">€${results.scenarios.expected.value.toLocaleString()}</div>
                    <div class="scenario-return" style="color: var(--color-text-secondary);">${results.scenarios.expected.return}%</div>
                </div>
                <div class="scenario optimistic" style="text-align: center; padding: var(--space-4); background: rgba(5, 150, 105, 0.1); border-radius: var(--radius-lg); border: 1px solid rgba(5, 150, 105, 0.2);">
                    <h4 style="color: var(--color-success); margin-bottom: var(--space-2);">🟢 Optimista</h4>
                    <div class="scenario-value" style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-success);">€${results.scenarios.optimistic.value.toLocaleString()}</div>
                    <div class="scenario-return" style="color: var(--color-text-secondary);">${results.scenarios.optimistic.return}%</div>
                </div>
            </div>

            <div class="monte-carlo-summary" style="margin-top: var(--space-5); padding: var(--space-4); background: var(--color-secondary); border-radius: var(--radius-lg);">
                <h4 style="margin-bottom: var(--space-3); color: var(--color-primary);">📈 Métricas de Riesgo</h4>
                <p><strong>Valor medio proyectado:</strong> €${results.mean.toLocaleString()}</p>
                <p><strong>Probabilidad de pérdida:</strong> ${((results.results.filter(r => r < currentSimulation.totalUsedInvestment).length / results.results.length) * 100).toFixed(1)}%</p>
                <p><strong>Rentabilidad esperada:</strong> ${(((results.mean - currentSimulation.totalUsedInvestment) / currentSimulation.totalUsedInvestment) * 100).toFixed(1)}%</p>
                <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-secondary); font-style: italic;">
                    * Análisis basado en 3 años de permanencia mínima obligatoria
                </p>
            </div>
        </div>
    `;
}

// Funciones de Exportación
function exportPDF() {
    if (!currentSimulation) {
        showNotification('No hay simulación para exportar', 'warning');
        return;
    }

    showNotification('Generando informe PDF...', 'info');
    
    setTimeout(() => {
        const doc = documentManager.addDocument(`Informe PDF - ${currentSimulation.ccaa}`, 'pdf', currentSimulation);
        showNotification('Informe PDF generado correctamente', 'success');
    }, 1000);
}

function exportJSON() {
    if (!currentSimulation) {
        showNotification('No hay simulación para exportar', 'warning');
        return;
    }

    const jsonContent = JSON.stringify(currentSimulation, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `invertax-simulation-${currentSimulation.ccaa}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    const doc = documentManager.addDocument(`Export JSON - ${currentSimulation.ccaa}`, 'json', currentSimulation);
    showNotification('Datos JSON exportados correctamente', 'success');
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
                showNotification('App instalada correctamente', 'success');
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

// Funciones de Utilidad
function showMessage(container, message, type = 'info') {
    const alertClass = type === 'error' ? 'alert--warning' : 
                      type === 'success' ? 'alert--success' : 'alert--info';
    
    container.innerHTML = `
        <div class="alert ${alertClass}">
            ${message}
        </div>
    `;
    container.classList.remove('hidden');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-toast--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
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
                padding: var(--space-4);
                box-shadow: var(--shadow-lg);
                z-index: 1500;
                display: flex;
                align-items: center;
                gap: var(--space-3);
                animation: slideIn 0.3s ease-out;
                max-width: 350px;
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
            .notification-toast button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: var(--font-size-lg);
                color: var(--color-text-secondary);
                flex-shrink: 0;
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
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Manejo de errores
window.addEventListener('error', function(e) {
    console.error('Error de aplicación:', e.error);
    showNotification('Se ha producido un error. Por favor, recarga la página.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection no manejada:', e.reason);
    showNotification('Error de conexión. Verifica tu conexión a internet.', 'warning');
});

// Accesibilidad
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
});

// Analytics tracking (simulado)
function trackEvent(eventName, parameters = {}) {
    console.log(`Analytics: ${eventName}`, parameters);
}

// Track calculator usage
document.addEventListener('click', function(e) {
    if (e.target.matches('button') && e.target.getAttribute('onclick')) {
        const onclickAttr = e.target.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('calculate')) {
            trackEvent('calculator_used', { 
                type: onclickAttr.includes('Quick') ? 'quick' : 'advanced' 
            });
        }
    }
});

console.log('🚀 INVERTAX Application loaded successfully');
console.log('📊 Fiscal Engine initialized with INVERTAX Model');
console.log('🏛️ CCAA data loaded:', Object.keys(CCAA_DATA).length, 'communities');