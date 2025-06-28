// INVERTAX Application JavaScript
// Complete fiscal optimization platform for startup investments

// CCAA Data with comprehensive fiscal information
const CCAA_DATA = {
    "Madrid": {
        percentage: 0.4,
        maxBase: 9279,
        compatible: true,
        acceptedProfiles: ["startup tecnológica", "innovadora"],
        notes: "Permanencia mínima de 3 años, 5 empleados mínimo"
    },
    "Cataluña": {
        percentage: 0.5,
        maxBase: 12000,
        compatible: false,
        acceptedProfiles: ["business angel acreditado"],
        notes: "No compatible con deducción estatal"
    },
    "Valencia": {
        percentage: 0.3,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["startup local"],
        notes: "Sede en la Comunidad Valenciana"
    },
    "Andalucía": {
        percentage: 0.25,
        maxBase: 10000,
        compatible: true,
        acceptedProfiles: ["startup joven"],
        notes: "Antigüedad máxima 5 años"
    },
    "País Vasco": {
        percentage: 0.35,
        maxBase: 15000,
        compatible: true,
        acceptedProfiles: ["empresa vasca"],
        notes: "Normativa foral específica"
    },
    "Galicia": {
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ["startup gallega"],
        notes: "Sede en Galicia"
    },
    "Castilla y León": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa regional"],
        notes: "Actividad en la comunidad"
    },
    "Castilla-La Mancha": {
        percentage: 0.15,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ["startup local"],
        notes: "Domicilio fiscal en la región"
    },
    "Extremadura": {
        percentage: 0.20,
        maxBase: 4000,
        compatible: true,
        acceptedProfiles: ["empresa extremeña"],
        notes: "Inversión mínima €3.000"
    },
    "Murcia": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["startup murciana"],
        notes: "Permanencia 4 años"
    },
    "Asturias": {
        percentage: 0.25,
        maxBase: 7000,
        compatible: true,
        acceptedProfiles: ["empresa asturiana"],
        notes: "Actividad económica en Asturias"
    },
    "Cantabria": {
        percentage: 0.15,
        maxBase: 5000,
        compatible: true,
        acceptedProfiles: ["startup cántabra"],
        notes: "Domicilio en Cantabria"
    },
    "La Rioja": {
        percentage: 0.20,
        maxBase: 6000,
        compatible: true,
        acceptedProfiles: ["empresa riojana"],
        notes: "Sede social en La Rioja"
    },
    "Navarra": {
        percentage: 0.30,
        maxBase: 10000,
        compatible: true,
        acceptedProfiles: ["empresa navarra"],
        notes: "Régimen foral navarro"
    },
    "Aragón": {
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        acceptedProfiles: ["startup aragonesa"],
        notes: "Actividad en Aragón"
    },
    "Canarias": {
        percentage: 0,
        maxBase: 0,
        compatible: false,
        special: "REF",
        notes: "Régimen Económico y Fiscal especial"
    },
    "Baleares": {
        percentage: 0,
        maxBase: 0,
        compatible: false,
        special: "ZEC",
        notes: "Zona Especial Canaria aplicable"
    }
};

// Projects data
const PROJECTS_DATA = {
    estatales: [
        {
            nombre: "TechStartup Madrid",
            sector: "Tecnología",
            tir: "25%",
            ubicacion: "Madrid",
            empleados: 8,
            descripcion: "Startup de inteligencia artificial aplicada a fintech"
        },
        {
            nombre: "BioInnovation",
            sector: "Biotecnología",
            tir: "30%",
            ubicacion: "Barcelona",
            empleados: 12,
            descripcion: "Desarrollo de terapias personalizadas"
        },
        {
            nombre: "CleanEnergy Solutions",
            sector: "Energías Renovables",
            tir: "22%",
            ubicacion: "Valencia",
            empleados: 15,
            descripcion: "Soluciones energéticas sostenibles"
        },
        {
            nombre: "AI Healthcare",
            sector: "Salud Digital",
            tir: "28%",
            ubicacion: "Sevilla",
            empleados: 10,
            descripcion: "Diagnósticos médicos con inteligencia artificial"
        }
    ],
    autonomicos: [
        {
            nombre: "CleanTech Valencia",
            sector: "Energías Renovables",
            tir: "22%",
            ubicacion: "Valencia",
            empleados: 6,
            descripcion: "Soluciones de energía solar para empresas"
        },
        {
            nombre: "AgriTech Andalucía",
            sector: "AgTech",
            tir: "28%",
            ubicacion: "Sevilla",
            empleados: 10,
            descripcion: "Agricultura de precisión con IoT"
        },
        {
            nombre: "FinTech Madrid",
            sector: "Tecnología Financiera",
            tir: "32%",
            ubicacion: "Madrid",
            empleados: 8,
            descripcion: "Pagos digitales para PYMES"
        },
        {
            nombre: "EduTech Euskadi",
            sector: "Educación",
            tir: "24%",
            ubicacion: "Bilbao",
            empleados: 12,
            descripcion: "Plataforma educativa con IA"
        }
    ]
};

// State limits
const STATE_LIMITS = {
    percentage: 0.5,
    maxBase: 100000,
    minInvestment: 1000
};

// FiscalEngine Class - Implementation of INVERTAX Model
class FiscalEngine {
    constructor() {
        this.STATE_DEDUCTION_RATE = 0.50;
        this.STATE_MAX_BASE = 100000;
    }

    /**
     * Calculate optimal deductions using sequential optimization
     * Step 1: State deduction (50% up to €100,000)
     * Step 2: Regional deduction on remainder if compatible
     * Step 3: Calculate real fiscal profitability
     */
    calculateOptimalDeductions(investment, ccaaCode, stateQuota, regionalQuota, projectProfile = null) {
        const ccaaData = CCAA_DATA[ccaaCode];
        if (!ccaaData) {
            throw new Error(`CCAA ${ccaaCode} no encontrada`);
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
            projectProfile: projectProfile
        };

        // Step 1: State Deduction (Proyecto A)
        const maxStateInvestment = Math.min(investment, this.STATE_MAX_BASE);
        const maxStateDeduction = maxStateInvestment * this.STATE_DEDUCTION_RATE;
        const stateDeduction = Math.min(maxStateDeduction, stateQuota);
        const stateInvestment = stateDeduction / this.STATE_DEDUCTION_RATE;

        if (stateInvestment > 0) {
            result.distributions.push({
                project: "Proyecto A (Estatal)",
                investment: stateInvestment,
                deductionRate: this.STATE_DEDUCTION_RATE,
                deduction: stateDeduction,
                description: "Deducción estatal Art. 68.1 LIRPF"
            });

            result.totalDeduction += stateDeduction;
            result.totalUsedInvestment += stateInvestment;
        }

        // Step 2: Regional Deduction (Proyecto B)
        const remainingInvestment = investment - stateInvestment;
        
        if (remainingInvestment > 0 && ccaaData.compatible && ccaaData.percentage > 0) {
            // Validate project profile
            const profileValid = !projectProfile || 
                                ccaaData.acceptedProfiles.includes(projectProfile) ||
                                ccaaData.acceptedProfiles.includes("startup local");

            if (profileValid) {
                const maxRegionalInvestment = Math.min(remainingInvestment, ccaaData.maxBase);
                const maxRegionalDeduction = maxRegionalInvestment * ccaaData.percentage;
                const regionalDeduction = Math.min(maxRegionalDeduction, regionalQuota);
                const regionalInvestment = regionalDeduction / ccaaData.percentage;

                if (regionalInvestment > 0) {
                    result.distributions.push({
                        project: "Proyecto B (Autonómico)",
                        investment: regionalInvestment,
                        deductionRate: ccaaData.percentage,
                        deduction: regionalDeduction,
                        description: `Deducción autonómica ${ccaaCode}`
                    });

                    result.totalDeduction += regionalDeduction;
                    result.totalUsedInvestment += regionalInvestment;
                }
            } else {
                result.recommendations.push({
                    type: 'warning',
                    message: `El perfil "${projectProfile}" no es compatible con ${ccaaCode}. Perfiles aceptados: ${ccaaData.acceptedProfiles.join(', ')}`
                });
            }
        }

        // Calculate unoptimized capital
        result.unoptimizedCapital = investment - result.totalUsedInvestment;

        // Calculate effective fiscal return
        if (result.totalUsedInvestment > 0) {
            result.effectiveFiscalReturn = (result.totalDeduction / result.totalUsedInvestment) * 100;
        }

        // Generate recommendations
        this.generateRecommendations(result, ccaaData);

        return result;
    }

    generateRecommendations(result, ccaaData) {
        // Alert for unoptimized capital
        if (result.unoptimizedCapital > 1000) {
            result.recommendations.push({
                type: 'warning',
                message: `Capital no optimizado: €${result.unoptimizedCapital.toLocaleString()}. Considera aumentar tus cuotas o diversificar en múltiples proyectos.`
            });
        }

        // Compatibility recommendations
        if (!ccaaData.compatible) {
            result.recommendations.push({
                type: 'info',
                message: `${result.ccaa} no es compatible con deducciones estatales. Solo se aplica deducción autonómica.`
            });
        }

        // Efficiency recommendations
        if (result.effectiveFiscalReturn > 40) {
            result.recommendations.push({
                type: 'success',
                message: `Excelente optimización fiscal: ${result.effectiveFiscalReturn.toFixed(1)}% de rentabilidad fiscal efectiva.`
            });
        } else if (result.effectiveFiscalReturn < 20) {
            result.recommendations.push({
                type: 'warning',
                message: `Rentabilidad fiscal baja (${result.effectiveFiscalReturn.toFixed(1)}%). Considera aumentar tus cuotas disponibles.`
            });
        }

        // Special cases
        if (ccaaData.special) {
            result.recommendations.push({
                type: 'info',
                message: `${result.ccaa} tiene régimen especial (${ccaaData.special}). ${ccaaData.notes}`
            });
        }

        // Quota utilization warnings
        const stateQuotaUsed = result.distributions.find(d => d.project.includes('Estatal'))?.deduction || 0;
        const regionalQuotaUsed = result.distributions.find(d => d.project.includes('Autonómico'))?.deduction || 0;

        if (stateQuotaUsed < result.stateQuota * 0.8) {
            result.recommendations.push({
                type: 'info',
                message: `Tienes €${(result.stateQuota - stateQuotaUsed).toLocaleString()} de cuota estatal sin utilizar. Considera aumentar la inversión.`
            });
        }

        if (ccaaData.compatible && regionalQuotaUsed < result.regionalQuota * 0.8) {
            result.recommendations.push({
                type: 'info',
                message: `Tienes €${(result.regionalQuota - regionalQuotaUsed).toLocaleString()} de cuota autonómica sin utilizar.`
            });
        }
    }

    // Quick calculation for mini-simulator
    calculateQuick(investment, ccaaCode) {
        try {
            // Assume average quotas
            const stateQuota = Math.min(investment * 0.5, 15000);
            const regionalQuota = Math.min(investment * 0.3, 8000);
            
            const result = this.calculateOptimalDeductions(investment, ccaaCode, stateQuota, regionalQuota);
            return {
                success: true,
                totalSaving: result.totalDeduction,
                effectiveReturn: result.effectiveFiscalReturn,
                message: `Ahorro fiscal: €${result.totalDeduction.toLocaleString()}`,
                usedInvestment: result.totalUsedInvestment
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

// Monte Carlo Simulation Engine
class MonteCarloEngine {
    constructor() {
        this.iterations = 1000;
    }

    simulate(investment, expectedReturn, volatility, years) {
        const results = [];
        const dt = 1; // Annual steps
        
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
        
        // Sort results for percentile calculation
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
        // Box-Muller transformation for normal distribution
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
                probability: "5% peor caso"
            },
            expected: {
                value: p50,
                return: ((p50 - investment) / investment * 100).toFixed(1),
                probability: "50% mediana"
            },
            optimistic: {
                value: p95,
                return: ((p95 - investment) / investment * 100).toFixed(1),
                probability: "95% mejor caso"
            }
        };
    }
}

// Document Manager with SHA-256 hashing
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
                date: new Date('2025-06-15'),
                status: "Generado",
                hash: this.generateSHA256("simulation_madrid_20250615"),
                type: "simulation"
            },
            {
                id: 2,
                name: "Análisis Monte Carlo - Valencia",
                date: new Date('2025-06-10'),
                status: "Firmado",
                hash: this.generateSHA256("montecarlo_valencia_20250610"),
                type: "analysis"
            }
        ];
    }

    generateSHA256(input) {
        // Simplified SHA-256 simulation for demo
        const timestamp = Date.now().toString();
        const combined = input + timestamp;
        let hash = 0;
        
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        // Generate a realistic-looking hash
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
        return [...this.documents].reverse(); // Most recent first
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

// Initialize engines and managers
const fiscalEngine = new FiscalEngine();
const monteCarloEngine = new MonteCarloEngine();
const documentManager = new DocumentManager();

// Global variables
let currentSimulation = null;
let deferredPrompt = null;

// Application initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Populate selectors
    populateCCAASelectors();
    
    // Load projects
    loadProjects();
    
    // Load documents table
    loadDocumentsTable();
    
    // Load CCAA compatibility grid
    loadCCAACompatibility();
    
    // Initialize PWA
    initializePWA();
    
    // Initialize contact form
    initializeContactForm();
    
    console.log('INVERTAX App initialized successfully');
}

function populateCCAASelectors() {
    const selectors = ['ccaa', 'quickCCAA'];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            // Clear existing options except first
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

function loadProjects() {
    loadProjectsType('estatales');
    loadProjectsType('autonomicos');
}

function loadProjectsType(type) {
    const container = document.getElementById(`proyectos${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!container) return;

    container.innerHTML = '';
    
    PROJECTS_DATA[type].forEach(project => {
        const card = createProjectCard(project, type);
        container.appendChild(card);
    });
}

function createProjectCard(project, type) {
    const card = document.createElement('div');
    card.className = 'project-card card';
    
    card.innerHTML = `
        <div class="card__body">
            <div class="project-card__header">
                <div>
                    <h3 class="project-card__name">${project.nombre}</h3>
                    <p class="project-card__sector">${project.sector}</p>
                </div>
                <span class="project-card__tir">${project.tir} TIR</span>
            </div>
            <p class="project-card__description">${project.descripcion}</p>
            <div class="project-card__footer">
                <span class="project-card__location">📍 ${project.ubicacion}</span>
                <button class="btn btn--outline btn--sm" onclick="selectProject('${project.nombre}', '${type}')">
                    Seleccionar
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function loadDocumentsTable() {
    const tbody = document.getElementById('documentsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    const documents = documentManager.getDocuments();
    documents.forEach(doc => {
        const row = createDocumentRow(doc);
        tbody.appendChild(row);
    });
}

function createDocumentRow(doc) {
    const row = document.createElement('tr');
    
    const statusClass = doc.status === 'Firmado' ? 'status--success' : 
                       doc.status === 'Pendiente' ? 'status--warning' : 'status--info';
    
    row.innerHTML = `
        <td>${doc.name}</td>
        <td>${doc.date.toLocaleDateString()}</td>
        <td><code class="hash-display">${doc.hash.substring(0, 16)}...</code></td>
        <td><span class="status ${statusClass}">${doc.status}</span></td>
        <td class="table-actions">
            <button class="btn btn--sm btn--outline" onclick="downloadDocument(${doc.id})">⬇️</button>
            <button class="btn btn--sm btn--secondary" onclick="viewHash('${doc.hash}')">🔗</button>
        </td>
    `;
    
    return row;
}

function loadCCAACompatibility() {
    const container = document.getElementById('ccaaCompatibility');
    if (!container) return;

    container.innerHTML = '';
    
    Object.entries(CCAA_DATA).forEach(([ccaa, data]) => {
        const item = document.createElement('div');
        item.className = `ccaa-item ${data.compatible ? 'compatible' : 'incompatible'}`;
        
        const compatibilityIcon = data.compatible ? '✅' : '❌';
        const percentageText = data.percentage > 0 ? `${(data.percentage * 100).toFixed(0)}%` : 'N/A';
        
        item.innerHTML = `
            <div class="ccaa-item__name">${compatibilityIcon} ${ccaa}</div>
            <div class="ccaa-item__details">
                <div>Deducción: ${percentageText}</div>
                <div>Base máxima: €${data.maxBase.toLocaleString()}</div>
                <div>Compatible: ${data.compatible ? 'Sí' : 'No'}</div>
                ${data.special ? `<div>Especial: ${data.special}</div>` : ''}
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Calculator Functions
function calculateQuick() {
    const amount = document.getElementById('quickAmount').value;
    const ccaa = document.getElementById('quickCCAA').value;
    const resultDiv = document.getElementById('quickResult');
    
    if (!amount || !ccaa) {
        showMessage(resultDiv, 'Por favor, completa todos los campos', 'error');
        return;
    }
    
    const investment = parseFloat(amount);
    if (investment < 1000 || investment > 200000) {
        showMessage(resultDiv, 'Inversión debe estar entre €1.000 y €200.000', 'error');
        return;
    }
    
    const result = fiscalEngine.calculateQuick(investment, ccaa);
    
    if (result.success) {
        resultDiv.innerHTML = `
            <div class="mini-simulator__success">
                <h4>💰 ${result.message}</h4>
                <p>Rentabilidad fiscal: <strong>${result.effectiveReturn.toFixed(1)}%</strong></p>
                <p>Inversión optimizada: <strong>€${result.usedInvestment.toLocaleString()}</strong></p>
                <button class="btn btn--outline btn--sm" onclick="document.getElementById('simulator').scrollIntoView()">
                    Ver simulación avanzada
                </button>
            </div>
        `;
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('fade-in');
    } else {
        showMessage(resultDiv, result.message, 'error');
    }
}

function calculateAdvanced() {
    const investment = parseFloat(document.getElementById('investment').value);
    const ccaa = document.getElementById('ccaa').value;
    const stateQuota = parseFloat(document.getElementById('stateQuota').value);
    const regionalQuota = parseFloat(document.getElementById('regionalQuota').value);
    const projectProfile = document.getElementById('projectProfile').value;
    const resultsDiv = document.getElementById('simulatorResults');
    
    if (!investment || !ccaa || stateQuota === undefined || regionalQuota === undefined) {
        showMessage(resultsDiv, 'Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (investment < 1000 || investment > 500000) {
        showMessage(resultsDiv, 'Inversión debe estar entre €1.000 y €500.000', 'error');
        return;
    }
    
    try {
        const result = fiscalEngine.calculateOptimalDeductions(investment, ccaa, stateQuota, regionalQuota, projectProfile);
        currentSimulation = result;
        displayAdvancedResults(result, resultsDiv);
        
        // Generate document
        const doc = documentManager.addDocument(`Simulación ${ccaa} - ${new Date().toLocaleDateString()}`, 'simulation', result);
        loadDocumentsTable();
        
        showNotification('Simulación completada correctamente', 'success');
    } catch (error) {
        showMessage(resultsDiv, `Error en cálculo: ${error.message}`, 'error');
    }
}

function displayAdvancedResults(result, container) {
    const ccaaData = CCAA_DATA[result.ccaa];
    
    container.innerHTML = `
        <div class="card simulator__results-card">
            <div class="card__body">
                <h3>🎯 Optimización Fiscal INVERTAX</h3>
                
                <div class="results-summary">
                    <div class="result-kpi">
                        <span class="result-kpi__value">€${result.totalDeduction.toLocaleString()}</span>
                        <span class="result-kpi__label">Ahorro Fiscal Total</span>
                    </div>
                    <div class="result-kpi">
                        <span class="result-kpi__value">${result.effectiveFiscalReturn.toFixed(1)}%</span>
                        <span class="result-kpi__label">Rentabilidad Fiscal Real</span>
                    </div>
                    <div class="result-kpi">
                        <span class="result-kpi__value">€${result.totalUsedInvestment.toLocaleString()}</span>
                        <span class="result-kpi__label">Capital Optimizado</span>
                    </div>
                    ${result.unoptimizedCapital > 0 ? `
                    <div class="result-kpi">
                        <span class="result-kpi__value">€${result.unoptimizedCapital.toLocaleString()}</span>
                        <span class="result-kpi__label">Capital No Optimizado</span>
                    </div>
                    ` : ''}
                </div>

                <div class="distributions-section">
                    <h4>📊 Distribución Óptima (Modelo INVERTAX)</h4>
                    ${result.distributions.map(dist => `
                        <div class="distribution-item">
                            <div class="distribution-header">
                                <strong>${dist.project}</strong>
                                <span class="distribution-amount">€${dist.investment.toLocaleString()}</span>
                            </div>
                            <div class="distribution-details">
                                <span>Tasa deducción: ${(dist.deductionRate * 100).toFixed(0)}%</span>
                                <span>Deducción: €${dist.deduction.toLocaleString()}</span>
                            </div>
                            <p class="distribution-description">${dist.description}</p>
                        </div>
                    `).join('')}
                </div>

                ${result.recommendations.length > 0 ? `
                    <div class="recommendations-section">
                        <h4>💡 Recomendaciones INVERTAX</h4>
                        ${result.recommendations.map(rec => `
                            <div class="recommendation ${rec.type}">
                                <span class="recommendation-icon">
                                    ${rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : 'ℹ️'}
                                </span>
                                <span>${rec.message}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="ccaa-info">
                    <h4>📋 Información Fiscal ${result.ccaa}</h4>
                    <div class="ccaa-details">
                        <p><strong>Deducción autonómica:</strong> ${(ccaaData.percentage * 100).toFixed(0)}% hasta €${ccaaData.maxBase.toLocaleString()}</p>
                        <p><strong>Compatibilidad:</strong> ${ccaaData.compatible ? '✅ Compatible con deducción estatal' : '❌ No compatible con deducción estatal'}</p>
                        ${ccaaData.special ? `<p><strong>Régimen especial:</strong> ${ccaaData.special}</p>` : ''}
                        <p><strong>Condiciones:</strong> ${ccaaData.notes}</p>
                        ${result.projectProfile ? `<p><strong>Perfil proyecto:</strong> ${result.projectProfile}</p>` : ''}
                    </div>
                </div>

                <div class="results-actions">
                    <button class="btn btn--primary" onclick="exportPDF()">
                        📄 Exportar PDF
                    </button>
                    <button class="btn btn--secondary" onclick="exportJSON()">
                        📋 Exportar JSON
                    </button>
                    <button class="btn btn--outline" onclick="runMonteCarlo()">
                        📊 Análisis Monte Carlo
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.classList.add('fade-in');
}

// Monte Carlo Analysis
function runMonteCarlo() {
    if (!currentSimulation) {
        showNotification('Realiza primero una simulación fiscal', 'warning');
        return;
    }

    const years = parseInt(document.getElementById('monteCarloYears')?.value || 3);
    const expectedReturn = parseFloat(document.getElementById('expectedReturn')?.value || 25);
    const volatility = parseFloat(document.getElementById('volatility')?.value || 35);
    const investment = currentSimulation.totalUsedInvestment;

    showNotification('Ejecutando simulación Monte Carlo...', 'info');

    // Simulate processing time
    setTimeout(() => {
        const results = monteCarloEngine.simulate(investment, expectedReturn, volatility, years);
        displayMonteCarloResults(results);
        
        // Generate document
        const doc = documentManager.addDocument(`Análisis Monte Carlo - ${new Date().toLocaleDateString()}`, 'montecarlo', results);
        loadDocumentsTable();
        
        showNotification('Análisis Monte Carlo completado', 'success');
    }, 1500);
}

function displayMonteCarloResults(results) {
    const container = document.getElementById('monteCarloResults');
    if (!container) return;

    container.innerHTML = `
        <div class="card">
            <div class="card__body">
                <h3>📊 Resultados Monte Carlo (${monteCarloEngine.iterations} iteraciones)</h3>
                
                <div class="scenarios-grid">
                    <div class="scenario conservative">
                        <h4>🔴 Conservador (P5)</h4>
                        <div class="scenario-value">€${results.scenarios.conservative.value.toLocaleString()}</div>
                        <div class="scenario-return">${results.scenarios.conservative.return}%</div>
                    </div>
                    <div class="scenario expected">
                        <h4>🟡 Esperado (P50)</h4>
                        <div class="scenario-value">€${results.scenarios.expected.value.toLocaleString()}</div>
                        <div class="scenario-return">${results.scenarios.expected.return}%</div>
                    </div>
                    <div class="scenario optimistic">
                        <h4>🟢 Optimista (P95)</h4>
                        <div class="scenario-value">€${results.scenarios.optimistic.value.toLocaleString()}</div>
                        <div class="scenario-return">${results.scenarios.optimistic.return}%</div>
                    </div>
                </div>

                <div class="percentiles">
                    <div class="percentile">
                        <span class="percentile__value">€${results.percentiles.p25.toLocaleString()}</span>
                        <span class="percentile__label">P25</span>
                    </div>
                    <div class="percentile">
                        <span class="percentile__value">€${results.percentiles.p50.toLocaleString()}</span>
                        <span class="percentile__label">Mediana</span>
                    </div>
                    <div class="percentile">
                        <span class="percentile__value">€${results.percentiles.p75.toLocaleString()}</span>
                        <span class="percentile__label">P75</span>
                    </div>
                </div>

                <div class="monte-carlo-summary">
                    <p><strong>Valor medio proyectado:</strong> €${results.mean.toLocaleString()}</p>
                    <p><strong>Probabilidad de pérdida:</strong> ${((results.results.filter(r => r < currentSimulation.totalUsedInvestment).length / results.results.length) * 100).toFixed(1)}%</p>
                    <p><strong>Rentabilidad esperada:</strong> ${(((results.mean - currentSimulation.totalUsedInvestment) / currentSimulation.totalUsedInvestment) * 100).toFixed(1)}%</p>
                </div>
            </div>
        </div>
    `;

    container.classList.add('fade-in');
}

// Document Export Functions
function exportPDF() {
    if (!currentSimulation) {
        showNotification('No hay simulación para exportar', 'warning');
        return;
    }

    showNotification('Generando PDF...', 'info');
    
    setTimeout(() => {
        const doc = documentManager.addDocument(`Reporte PDF - ${currentSimulation.ccaa}`, 'pdf', currentSimulation);
        loadDocumentsTable();
        showNotification('PDF generado correctamente', 'success');
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
    loadDocumentsTable();
    showNotification('JSON exportado correctamente', 'success');
}

function generateHash() {
    const timestamp = new Date().toISOString();
    const data = currentSimulation ? JSON.stringify(currentSimulation) : timestamp;
    const hash = documentManager.generateSHA256(data);
    
    showNotification(`Hash generado: ${hash.substring(0, 16)}...`, 'success');
}

// Project and Document Management
function showProjects(type) {
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide projects
    document.getElementById('proyectosEstatales').classList.toggle('hidden', type !== 'estatales');
    document.getElementById('proyectosAutonomicos').classList.toggle('hidden', type !== 'autonomicos');
}

function selectProject(projectName, type) {
    showNotification(`Proyecto "${projectName}" seleccionado para ${type === 'estatales' ? 'Proyecto A' : 'Proyecto B'}`, 'success');
    
    // Scroll to simulator
    document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
}

function downloadDocument(docId) {
    const doc = documentManager.getDocuments().find(d => d.id === docId);
    if (doc) {
        showNotification(`Descargando ${doc.name}...`, 'info');
        
        setTimeout(() => {
            showNotification('Descarga completada', 'success');
        }, 1000);
    }
}

function viewHash(hash) {
    const modal = createHashModal(hash);
    document.body.appendChild(modal);
}

function createHashModal(hash) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🔗 Verificación de Integridad SHA-256</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="hash-verification">
                    <h4>Hash SHA-256 Completo:</h4>
                    <code class="full-hash">${hash}</code>
                    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                    <p><strong>Algoritmo:</strong> SHA-256</p>
                    <p><strong>Estado:</strong> <span class="status status--success">Verificado</span></p>
                </div>
                <div class="verification-info">
                    <h4>ℹ️ Información de Verificación</h4>
                    <p>Este hash garantiza la integridad del documento. Cualquier modificación alteraría el hash completamente.</p>
                    <p>Puedes usar este hash para verificar la autenticidad del documento en cualquier momento.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn--outline" onclick="copyHash('${hash}')">📋 Copiar Hash</button>
                <button class="btn btn--primary" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
            </div>
        </div>
    `;
    
    return modal;
}

function copyHash(hash) {
    navigator.clipboard.writeText(hash).then(() => {
        showNotification('Hash copiado al portapapeles', 'success');
    });
}

// Navigation and UI Functions
function initializeNavigation() {
    // Mobile menu toggle
    const toggleBtn = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', function() {
            menu.classList.toggle('nav__menu--open');
            this.classList.toggle('nav__toggle--open');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu
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
            
            showNotification('Enviando mensaje...', 'info');
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Mensaje enviado correctamente. Te responderemos pronto.', 'success');
                form.reset();
            }, 1500);
        });
    }
}

// PWA Functions
function initializePWA() {
    // Register service worker
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

// Utility Functions
function showMessage(container, message, type = 'info') {
    const alertClass = type === 'error' ? 'status--error' : 
                      type === 'success' ? 'status--success' : 'status--info';
    
    container.innerHTML = `
        <div class="status ${alertClass}">
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
    
    // Add notification styles if not present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-toast {
                position: fixed;
                top: 100px;
                right: var(--space-20);
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                padding: var(--space-16);
                box-shadow: var(--shadow-lg);
                z-index: 1500;
                display: flex;
                align-items: center;
                gap: var(--space-12);
                animation: slideIn 0.3s ease-out;
                max-width: 300px;
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
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-20);
                border-bottom: 1px solid var(--color-border);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--color-text-secondary);
            }
            .modal-body {
                padding: var(--space-20);
            }
            .modal-footer {
                display: flex;
                gap: var(--space-12);
                padding: var(--space-20);
                border-top: 1px solid var(--color-border);
                justify-content: flex-end;
            }
            .hash-verification {
                margin-bottom: var(--space-20);
                padding: var(--space-16);
                background: var(--color-secondary);
                border-radius: var(--radius-base);
            }
            .full-hash {
                display: block;
                word-break: break-all;
                background: var(--color-surface);
                padding: var(--space-8);
                border-radius: var(--radius-sm);
                font-family: var(--font-family-mono);
                font-size: var(--font-size-sm);
                margin: var(--space-8) 0;
            }
            .scenarios-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--space-16);
                margin: var(--space-20) 0;
            }
            .scenario {
                text-align: center;
                padding: var(--space-16);
                border-radius: var(--radius-base);
                border: 1px solid var(--color-border);
            }
            .scenario.conservative {
                background: rgba(var(--color-error-rgb), 0.1);
            }
            .scenario.expected {
                background: rgba(var(--color-warning-rgb), 0.1);
            }
            .scenario.optimistic {
                background: rgba(var(--color-success-rgb), 0.1);
            }
            .scenario-value {
                font-size: var(--font-size-xl);
                font-weight: var(--font-weight-bold);
                color: var(--color-primary);
            }
            .scenario-return {
                font-size: var(--font-size-lg);
                color: var(--color-text-secondary);
            }
            .monte-carlo-summary {
                margin-top: var(--space-20);
                padding: var(--space-16);
                background: var(--color-secondary);
                border-radius: var(--radius-base);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('Se ha producido un error. Por favor, recarga la página.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Error de conexión. Verifica tu conexión a internet.', 'warning');
});

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
});

// Analytics tracking (simulated)
function trackEvent(eventName, parameters = {}) {
    console.log(`Analytics: ${eventName}`, parameters);
}

// Track calculator usage - FIXED: Check for onclick attribute properly
document.addEventListener('click', function(e) {
    if (e.target.matches('button') && e.target.hasAttribute('onclick')) {
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
console.log('💼 Projects loaded:', Object.keys(PROJECTS_DATA).reduce((acc, key) => acc + PROJECTS_DATA[key].length, 0), 'projects');