// INVERTAX - Aplicación Principal v3.0
// Sistema completo de optimización fiscal para inversiones en nuevas empresas

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
  version: '3.0.0',
  debug: false,
  api: {
    baseUrl: '/api',
    timeout: 10000
  },
  fiscal: {
    stateDeductionRate: 0.50,
    maxStateBase: 100000,
    minInvestment: 1000,
    maxInvestment: 1000000
  },
  ui: {
    animationDuration: 250,
    debounceDelay: 300,
    toastDuration: 5000
  }
};

// ===== DATOS FISCALES CCAA =====
const CCAA_DATA = {
  'madrid': {
    name: 'Madrid',
    percentage: 0.40,
    maxBase: 9279,
    compatible: true,
    requirements: ['Permanencia 3 años', '5 empleados mínimo'],
    acceptedProfiles: ['tecnología', 'innovación', 'i+d', 'todos']
  },
  'cataluna': {
    name: 'Cataluña',
    percentage: 0.50,
    maxBase: 12000,
    compatible: false,
    requirements: ['Business angel acreditado'],
    acceptedProfiles: ['tecnología', 'innovación']
  },
  'valencia': {
    name: 'Valencia',
    percentage: 0.30,
    maxBase: 6000,
    compatible: true,
    requirements: ['Sede en la Comunidad Valenciana'],
    acceptedProfiles: ['todos']
  },
  'andalucia': {
    name: 'Andalucía',
    percentage: 0.25,
    maxBase: 10000,
    compatible: true,
    requirements: ['Antigüedad máxima 5 años'],
    acceptedProfiles: ['todos']
  },
  'pais_vasco': {
    name: 'País Vasco',
    percentage: 0.35,
    maxBase: 15000,
    compatible: true,
    requirements: ['Normativa foral específica'],
    acceptedProfiles: ['tecnología', 'industrial']
  },
  'galicia': {
    name: 'Galicia',
    percentage: 0.25,
    maxBase: 8000,
    compatible: true,
    requirements: ['Registro previo en IGAPE'],
    acceptedProfiles: ['todos']
  },
  'castilla_leon': {
    name: 'Castilla y León',
    percentage: 0.30,
    maxBase: 10000,
    compatible: true,
    requirements: ['Sede social en la comunidad'],
    acceptedProfiles: ['todos']
  },
  'aragon': {
    name: 'Aragón',
    percentage: 0.25,
    maxBase: 9000,
    compatible: true,
    requirements: ['Actividad en Aragón'],
    acceptedProfiles: ['todos']
  },
  'asturias': {
    name: 'Asturias',
    percentage: 0.20,
    maxBase: 6000,
    compatible: true,
    requirements: ['Domicilio fiscal en Asturias'],
    acceptedProfiles: ['todos']
  },
  'cantabria': {
    name: 'Cantabria',
    percentage: 0.20,
    maxBase: 6000,
    compatible: true,
    requirements: ['Sede en Cantabria'],
    acceptedProfiles: ['todos']
  },
  'castilla_mancha': {
    name: 'Castilla-La Mancha',
    percentage: 0.25,
    maxBase: 6000,
    compatible: true,
    requirements: ['Actividad en la región'],
    acceptedProfiles: ['todos']
  },
  'extremadura': {
    name: 'Extremadura',
    percentage: 0.30,
    maxBase: 4000,
    compatible: true,
    requirements: ['Domicilio en Extremadura'],
    acceptedProfiles: ['todos']
  },
  'murcia': {
    name: 'Murcia',
    percentage: 0.20,
    maxBase: 6000,
    compatible: true,
    requirements: ['Sede social en Murcia'],
    acceptedProfiles: ['todos']
  },
  'navarra': {
    name: 'Navarra',
    percentage: 0.30,
    maxBase: 10000,
    compatible: true,
    requirements: ['Normativa foral'],
    acceptedProfiles: ['tecnología', 'innovación']
  },
  'rioja': {
    name: 'La Rioja',
    percentage: 0.30,
    maxBase: 6000,
    compatible: true,
    requirements: ['Domicilio en La Rioja'],
    acceptedProfiles: ['todos']
  },
  'baleares': {
    name: 'Baleares',
    percentage: 0.25,
    maxBase: 6000,
    compatible: true,
    requirements: ['Sede en las islas'],
    acceptedProfiles: ['todos']
  },
  'canarias': {
    name: 'Canarias',
    percentage: 0.25,
    maxBase: 6000,
    compatible: true,
    requirements: ['Domicilio en Canarias'],
    acceptedProfiles: ['todos']
  }
};

// ===== MOTOR FISCAL CORREGIDO =====
class FiscalEngine {
  constructor() {
    this.stateDeductionRate = CONFIG.fiscal.stateDeductionRate;
    this.maxStateBase = CONFIG.fiscal.maxStateBase;
    this.cache = new Map();
  }

  /**
   * Cálculo principal del modelo INVERTAX corregido
   * Empresas independientes para maximizar deducciones
   */
  calculateOptimalDeductions(totalInvestment, ccaaCode, stateQuota, regionalQuota, projectProfile = null) {
    // Validaciones de entrada
    const validation = this.validateInputs(totalInvestment, ccaaCode, stateQuota, regionalQuota);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const ccaaData = CCAA_DATA[ccaaCode];
    
    // PASO 1: Optimizar deducción estatal (Empresa A)
    const stateOptimization = this.optimizeStateDeduction(totalInvestment, stateQuota);
    
    // PASO 2: Optimizar deducción autonómica (Empresa B) - SOLO con capital remanente
    const remainingInvestment = totalInvestment - stateOptimization.investment;
    const regionalOptimization = this.optimizeRegionalDeduction(
      remainingInvestment, 
      ccaaData, 
      regionalQuota, 
      projectProfile
    );

    // PASO 3: Calcular totales reales
    const totalUsedInvestment = stateOptimization.investment + regionalOptimization.investment;
    const totalDeduction = stateOptimization.deduction + regionalOptimization.deduction;
    const unoptimizedCapital = totalInvestment - totalUsedInvestment;
    
    // RENTABILIDAD FISCAL REAL = Deducción total / Inversión utilizada
    const effectiveFiscalReturn = totalUsedInvestment > 0 ? 
      (totalDeduction / totalUsedInvestment) * 100 : 0;

    return {
      // Datos de entrada
      totalInvestment,
      ccaa: ccaaCode,
      ccaaData,
      stateQuota,
      regionalQuota,
      
      // Distribución de inversión
      distributions: [
        {
          project: "Empresa A (Deducción Estatal)",
          investment: stateOptimization.investment,
          deductionRate: this.stateDeductionRate,
          deduction: stateOptimization.deduction,
          description: "Art. 68.1 LIRPF - Deducción estatal del 50%",
          type: "estatal"
        },
        {
          project: "Empresa B (Deducción Autonómica)",
          investment: regionalOptimization.investment,
          deductionRate: ccaaData.percentage,
          deduction: regionalOptimization.deduction,
          description: `Deducción autonómica ${ccaaData.name} - ${(ccaaData.percentage * 100).toFixed(0)}%`,
          type: "autonomica",
          compatible: ccaaData.compatible
        }
      ].filter(d => d.investment > 0),
      
      // Totales
      totalUsedInvestment,
      totalDeduction,
      unoptimizedCapital,
      effectiveFiscalReturn,
      
      // Análisis
      analysis: {
        isOptimal: unoptimizedCapital < totalInvestment * 0.1,
        efficiency: totalUsedInvestment / totalInvestment,
        maxPossibleDeduction: this.calculateMaxPossibleDeduction(totalInvestment, ccaaData),
        recommendations: this.generateRecommendations(totalInvestment, totalUsedInvestment, ccaaData)
      },
      
      // Metadatos
      timestamp: new Date().toISOString(),
      version: CONFIG.version
    };
  }

  /**
   * Optimización de deducción estatal
   */
  optimizeStateDeduction(totalInvestment, stateQuota) {
    // Inversión necesaria para agotar la cuota estatal
    const investmentNeededForQuota = stateQuota / this.stateDeductionRate;
    
    // Inversión óptima: mínimo entre disponible, necesaria para cuota y límite legal
    const optimalInvestment = Math.min(
      totalInvestment,
      investmentNeededForQuota,
      this.maxStateBase
    );
    
    // Deducción real obtenida
    const actualDeduction = optimalInvestment * this.stateDeductionRate;
    
    return {
      investment: optimalInvestment,
      deduction: Math.min(actualDeduction, stateQuota)
    };
  }

  /**
   * Optimización de deducción autonómica
   */
  optimizeRegionalDeduction(remainingInvestment, ccaaData, regionalQuota, projectProfile) {
    // Si no hay capital remanente o no es compatible
    if (remainingInvestment <= 0 || !ccaaData.compatible) {
      return { investment: 0, deduction: 0 };
    }

    // Validar perfil de proyecto si se especifica
    if (projectProfile && !this.validateProjectProfile(projectProfile, ccaaData)) {
      return { investment: 0, deduction: 0 };
    }

    // Inversión necesaria para agotar la cuota autonómica
    const investmentNeededForQuota = regionalQuota / ccaaData.percentage;
    
    // Inversión óptima autonómica
    const optimalInvestment = Math.min(
      remainingInvestment,
      investmentNeededForQuota,
      ccaaData.maxBase
    );
    
    // Deducción real obtenida
    const actualDeduction = optimalInvestment * ccaaData.percentage;
    
    return {
      investment: optimalInvestment,
      deduction: Math.min(actualDeduction, regionalQuota)
    };
  }

  /**
   * Validaciones de entrada
   */
  validateInputs(investment, ccaaCode, stateQuota, regionalQuota) {
    const errors = [];

    if (!investment || investment < CONFIG.fiscal.minInvestment) {
      errors.push(`Inversión mínima: €${CONFIG.fiscal.minInvestment.toLocaleString()}`);
    }
    
    if (investment > CONFIG.fiscal.maxInvestment) {
      errors.push(`Inversión máxima: €${CONFIG.fiscal.maxInvestment.toLocaleString()}`);
    }

    if (!ccaaCode || !CCAA_DATA[ccaaCode]) {
      errors.push("Comunidad Autónoma no válida");
    }

    if (stateQuota < 0) {
      errors.push("La cuota estatal no puede ser negativa");
    }

    if (regionalQuota < 0) {
      errors.push("La cuota autonómica no puede ser negativa");
    }

    return {
      isValid: errors.length === 0,
      error: errors.join('; ')
    };
  }

  /**
   * Validar perfil de proyecto
   */
  validateProjectProfile(projectProfile, ccaaData) {
    if (!projectProfile || ccaaData.acceptedProfiles.includes('todos')) {
      return true;
    }
    
    return ccaaData.acceptedProfiles.some(profile => 
      projectProfile.toLowerCase().includes(profile.toLowerCase())
    );
  }

  /**
   * Calcular máxima deducción posible
   */
  calculateMaxPossibleDeduction(totalInvestment, ccaaData) {
    const maxStateDeduction = Math.min(totalInvestment, this.maxStateBase) * this.stateDeductionRate;
    const maxRegionalDeduction = ccaaData.compatible ? 
      Math.min(totalInvestment, ccaaData.maxBase) * ccaaData.percentage : 0;
    
    return maxStateDeduction + maxRegionalDeduction;
  }

  /**
   * Generar recomendaciones
   */
  generateRecommendations(totalInvestment, usedInvestment, ccaaData) {
    const recommendations = [];
    const utilizationRate = usedInvestment / totalInvestment;

    if (utilizationRate < 0.8) {
      recommendations.push({
        type: 'warning',
        message: `Solo se está utilizando el ${(utilizationRate * 100).toFixed(1)}% del capital disponible`,
        action: 'Considere aumentar las cuotas fiscales o distribuir la inversión en varios años'
      });
    }

    if (!ccaaData.compatible) {
      recommendations.push({
        type: 'info',
        message: `${ccaaData.name} no permite combinar deducciones estatales y autonómicas`,
        action: 'Evalúe cambiar de residencia fiscal o maximizar solo la deducción autonómica'
      });
    }

    if (totalInvestment > 50000) {
      recommendations.push({
        type: 'success',
        message: 'Inversión significativa detectada',
        action: 'Considere una estrategia plurianual para maximizar beneficios'
      });
    }

    return recommendations;
  }
}

// ===== SIMULADOR PLURIANUAL AVANZADO =====
class MultiyearSimulator {
  constructor(fiscalEngine) {
    this.fiscalEngine = fiscalEngine;
  }

  /**
   * Simular estrategia plurianual con reinversión
   */
  simulate(baseParams, strategy = 'fixed', years = 5) {
    const results = {
      strategy,
      years,
      yearlyResults: [],
      totals: {
        totalInvested: 0,
        totalDeducted: 0,
        cumulativeReturn: 0,
        averageFiscalReturn: 0
      },
      analysis: {
        bestYear: null,
        worstYear: null,
        growthRate: 0,
        efficiency: 0
      }
    };

    let cumulativeInvestment = 0;
    let cumulativeDeduction = 0;
    let availableCapital = baseParams.totalInvestment;

    for (let year = 1; year <= years; year++) {
      // Calcular parámetros para este año
      const yearParams = this.calculateYearParams(baseParams, year, strategy, availableCapital);
      
      try {
        // Ejecutar simulación fiscal para este año
        const yearResult = this.fiscalEngine.calculateOptimalDeductions(
          yearParams.investment,
          yearParams.ccaa,
          yearParams.stateQuota,
          yearParams.regionalQuota
        );

        // Simular retorno de inversión (15% anual promedio)
        const investmentReturn = yearResult.totalUsedInvestment * 0.15;
        
        // Actualizar acumulados
        cumulativeInvestment += yearResult.totalUsedInvestment;
        cumulativeDeduction += yearResult.totalDeduction;
        
        // Capital disponible para próximo año (capital no usado + retornos)
        availableCapital = yearResult.unoptimizedCapital + investmentReturn;

        const yearData = {
          year,
          investment: yearResult.totalUsedInvestment,
          deduction: yearResult.totalDeduction,
          fiscalReturn: yearResult.effectiveFiscalReturn,
          investmentReturn,
          availableCapital,
          cumulativeInvestment,
          cumulativeDeduction,
          cumulativeFiscalReturn: (cumulativeDeduction / cumulativeInvestment) * 100,
          distributions: yearResult.distributions
        };

        results.yearlyResults.push(yearData);

      } catch (error) {
        console.warn(`Error en año ${year}:`, error.message);
        break;
      }
    }

    // Calcular totales y análisis
    this.calculateTotals(results);
    this.analyzeResults(results);

    return results;
  }

  /**
   * Calcular parámetros para cada año según estrategia
   */
  calculateYearParams(baseParams, year, strategy, availableCapital) {
    let investmentMultiplier = 1;
    let quotaMultiplier = 1;

    switch (strategy) {
      case 'inflation':
        // Crecimiento con inflación (2.5% anual)
        investmentMultiplier = Math.pow(1.025, year - 1);
        quotaMultiplier = Math.pow(1.025, year - 1);
        break;
        
      case 'income_growth':
        // Crecimiento de ingresos (5% anual)
        investmentMultiplier = Math.pow(1.05, year - 1);
        quotaMultiplier = Math.pow(1.05, year - 1);
        break;
        
      case 'aggressive':
        // Crecimiento agresivo (10% anual)
        investmentMultiplier = Math.pow(1.10, year - 1);
        quotaMultiplier = Math.pow(1.10, year - 1);
        break;
        
      case 'fixed':
      default:
        // Mantener valores fijos
        break;
    }

    return {
      investment: Math.min(availableCapital, baseParams.totalInvestment * investmentMultiplier),
      ccaa: baseParams.ccaa,
      stateQuota: baseParams.stateQuota * quotaMultiplier,
      regionalQuota: baseParams.regionalQuota * quotaMultiplier
    };
  }

  /**
   * Calcular totales
   */
  calculateTotals(results) {
    const lastYear = results.yearlyResults[results.yearlyResults.length - 1];
    if (lastYear) {
      results.totals.totalInvested = lastYear.cumulativeInvestment;
      results.totals.totalDeducted = lastYear.cumulativeDeduction;
      results.totals.cumulativeReturn = lastYear.cumulativeFiscalReturn;
      results.totals.averageFiscalReturn = results.yearlyResults.reduce((sum, year) => 
        sum + year.fiscalReturn, 0) / results.yearlyResults.length;
    }
  }

  /**
   * Analizar resultados
   */
  analyzeResults(results) {
    if (results.yearlyResults.length === 0) return;

    // Encontrar mejor y peor año
    let bestYear = results.yearlyResults[0];
    let worstYear = results.yearlyResults[0];

    results.yearlyResults.forEach(year => {
      if (year.fiscalReturn > bestYear.fiscalReturn) bestYear = year;
      if (year.fiscalReturn < worstYear.fiscalReturn) worstYear = year;
    });

    results.analysis.bestYear = bestYear;
    results.analysis.worstYear = worstYear;

    // Calcular tasa de crecimiento
    if (results.yearlyResults.length > 1) {
      const firstYear = results.yearlyResults[0];
      const lastYear = results.yearlyResults[results.yearlyResults.length - 1];
      results.analysis.growthRate = ((lastYear.investment / firstYear.investment) - 1) * 100;
    }

    // Calcular eficiencia general
    results.analysis.efficiency = results.totals.totalDeducted / results.totals.totalInvested;
  }
}

// ===== SIMULADOR MONTE CARLO =====
class MonteCarloSimulator {
  constructor() {
    this.worker = null;
    this.initializeWorker();
  }

  initializeWorker() {
    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker('./monteCarlo-worker.js');
      } catch (error) {
        console.warn('Web Worker no disponible, usando simulación síncrona');
      }
    }
  }

  /**
   * Ejecutar simulación Monte Carlo
   */
  async simulate(investment, expectedReturn = 25, volatility = 35, years = 3, iterations = 1000) {
    return new Promise((resolve, reject) => {
      if (this.worker) {
        // Usar Web Worker
        this.worker.onmessage = (event) => {
          if (event.data.success) {
            resolve(this.processResults(event.data.data));
          } else {
            reject(new Error(event.data.error));
          }
        };

        this.worker.postMessage({
          investment,
          expectedReturn,
          volatility,
          years,
          iterations
        });
      } else {
        // Simulación síncrona como fallback
        try {
          const results = this.runSyncSimulation(investment, expectedReturn, volatility, years, iterations);
          resolve(this.processResults(results));
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  /**
   * Simulación síncrona (fallback)
   */
  runSyncSimulation(investment, expectedReturn, volatility, years, iterations) {
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
    
    return this.calculateStatistics(results, investment);
  }

  /**
   * Generar número aleatorio con distribución normal
   */
  normalRandom() {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  /**
   * Calcular estadísticas
   */
  calculateStatistics(results, investment) {
    results.sort((a, b) => a - b);
    const length = results.length;
    
    return {
      scenarios: results,
      statistics: {
        mean: results.reduce((sum, val) => sum + val, 0) / length,
        median: results[Math.floor(length * 0.5)],
        p5: results[Math.floor(length * 0.05)],
        p25: results[Math.floor(length * 0.25)],
        p75: results[Math.floor(length * 0.75)],
        p95: results[Math.floor(length * 0.95)],
        min: results[0],
        max: results[length - 1]
      },
      metrics: {
        probabilityOfLoss: (results.filter(r => r < investment).length / length) * 100,
        averageReturn: ((results.reduce((sum, val) => sum + val, 0) / length - investment) / investment) * 100
      }
    };
  }

  /**
   * Procesar resultados
   */
  processResults(data) {
    return {
      ...data,
      interpretation: {
        conservative: {
          value: data.statistics.p25,
          probability: 75,
          description: "Escenario conservador (25% de probabilidad de obtener menos)"
        },
        expected: {
          value: data.statistics.median,
          probability: 50,
          description: "Escenario esperado (50% de probabilidad)"
        },
        optimistic: {
          value: data.statistics.p75,
          probability: 25,
          description: "Escenario optimista (25% de probabilidad de obtener más)"
        }
      }
    };
  }
}

// ===== GESTOR DE INTERFAZ =====
class UIManager {
  constructor() {
    this.fiscalEngine = new FiscalEngine();
    this.multiyearSimulator = new MultiyearSimulator(this.fiscalEngine);
    this.monteCarloSimulator = new MonteCarloSimulator();
    this.currentResults = null;
    this.debounceTimers = new Map();
    
    this.initializeEventListeners();
    this.initializeQuickCalculator();
    this.initializeNavigation();
  }

  /**
   * Inicializar navegación
   */
  initializeNavigation() {
    // Toggle de menú móvil
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav__menu--open');
        navToggle.classList.toggle('nav__toggle--open');
      });
    }

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Cerrar menú móvil si está abierto
          navMenu?.classList.remove('nav__menu--open');
          navToggle?.classList.remove('nav__toggle--open');
        }
      });
    });

    // Indicador de sección activa
    this.initializeScrollSpy();
  }

  /**
   * Inicializar scroll spy
   */
  initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  /**
   * Inicializar calculadora rápida del hero
   */
  initializeQuickCalculator() {
    const quickForm = document.getElementById('quick-calculator');
    if (!quickForm) return;

    const inputs = quickForm.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.debounce('quick-calc', () => {
          this.updateQuickCalculator();
        }, 300);
      });
    });

    // Cálculo inicial
    this.updateQuickCalculator();
  }

  /**
   * Actualizar calculadora rápida
   */
  updateQuickCalculator() {
    const form = document.getElementById('quick-calculator');
    if (!form) return;

    try {
      const formData = new FormData(form);
      const investment = parseFloat(formData.get('quick-investment')) || 10000;
      const ccaa = formData.get('quick-ccaa') || 'madrid';
      const stateQuota = parseFloat(formData.get('quick-state-quota')) || 5000;
      const regionalQuota = parseFloat(formData.get('quick-regional-quota')) || 1250;

      const results = this.fiscalEngine.calculateOptimalDeductions(
        investment, ccaa, stateQuota, regionalQuota
      );

      this.updateQuickResults(results);
    } catch (error) {
      console.warn('Error en calculadora rápida:', error.message);
    }
  }

  /**
   * Actualizar resultados de calculadora rápida
   */
  updateQuickResults(results) {
    const elements = {
      stateInvestment: document.getElementById('quick-state-investment'),
      stateDeduction: document.getElementById('quick-state-deduction'),
      regionalInvestment: document.getElementById('quick-regional-investment'),
      regionalDeduction: document.getElementById('quick-regional-deduction'),
      totalDeduction: document.getElementById('quick-total-deduction'),
      fiscalReturn: document.getElementById('quick-fiscal-return'),
      unoptimized: document.getElementById('quick-unoptimized')
    };

    const stateDistribution = results.distributions.find(d => d.type === 'estatal');
    const regionalDistribution = results.distributions.find(d => d.type === 'autonomica');

    if (elements.stateInvestment) {
      elements.stateInvestment.textContent = `€${(stateDistribution?.investment || 0).toLocaleString()}`;
    }
    if (elements.stateDeduction) {
      elements.stateDeduction.textContent = `€${(stateDistribution?.deduction || 0).toLocaleString()}`;
    }
    if (elements.regionalInvestment) {
      elements.regionalInvestment.textContent = `€${(regionalDistribution?.investment || 0).toLocaleString()}`;
    }
    if (elements.regionalDeduction) {
      elements.regionalDeduction.textContent = `€${(regionalDistribution?.deduction || 0).toLocaleString()}`;
    }
    if (elements.totalDeduction) {
      elements.totalDeduction.textContent = `€${results.totalDeduction.toLocaleString()}`;
    }
    if (elements.fiscalReturn) {
      elements.fiscalReturn.textContent = `${results.effectiveFiscalReturn.toFixed(1)}%`;
    }
    if (elements.unoptimized) {
      elements.unoptimized.textContent = `€${results.unoptimizedCapital.toLocaleString()}`;
    }
  }

  /**
   * Inicializar event listeners
   */
  initializeEventListeners() {
    // Simulador principal
    const mainForm = document.getElementById('fiscal-simulator');
    if (mainForm) {
      mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.runMainSimulation();
      });

      // Actualización en tiempo real
      const inputs = mainForm.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          this.debounce('main-sim', () => {
            this.runMainSimulation();
          }, CONFIG.ui.debounceDelay);
        });
      });
    }

    // Simulador plurianual
    const multiyearForm = document.getElementById('multiyear-form');
    if (multiyearForm) {
      multiyearForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.runMultiyearSimulation();
      });
    }

    // Monte Carlo
    const monteCarloBtn = document.getElementById('run-monte-carlo');
    if (monteCarloBtn) {
      monteCarloBtn.addEventListener('click', () => {
        this.runMonteCarloSimulation();
      });
    }

    // Exportación
    const exportButtons = document.querySelectorAll('[data-export]');
    exportButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const format = e.target.dataset.export;
        this.exportResults(format);
      });
    });

    // Comparador de CCAA
    const compareBtn = document.getElementById('compare-ccaa');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        this.showCCAAComparison();
      });
    }
  }

  /**
   * Ejecutar simulación principal
   */
  async runMainSimulation() {
    const form = document.getElementById('fiscal-simulator');
    if (!form) return;

    try {
      this.showLoading('main-results');
      
      const formData = new FormData(form);
      const params = {
        totalInvestment: parseFloat(formData.get('investment')) || 0,
        ccaa: formData.get('ccaa') || 'madrid',
        stateQuota: parseFloat(formData.get('state-quota')) || 0,
        regionalQuota: parseFloat(formData.get('regional-quota')) || 0,
        projectProfile: formData.get('project-profile') || null
      };

      const results = this.fiscalEngine.calculateOptimalDeductions(
        params.totalInvestment,
        params.ccaa,
        params.stateQuota,
        params.regionalQuota,
        params.projectProfile
      );

      this.currentResults = results;
      this.displayMainResults(results);
      
    } catch (error) {
      this.showError('main-results', error.message);
    } finally {
      this.hideLoading('main-results');
    }
  }

  /**
   * Ejecutar simulación plurianual
   */
  async runMultiyearSimulation() {
    if (!this.currentResults) {
      this.showToast('Primero ejecute una simulación básica', 'warning');
      return;
    }

    try {
      this.showLoading('multiyear-results');
      
      const form = document.getElementById('multiyear-form');
      const formData = new FormData(form);
      
      const strategy = formData.get('strategy') || 'fixed';
      const years = parseInt(formData.get('years')) || 5;
      
      const baseParams = {
        totalInvestment: this.currentResults.totalInvestment,
        ccaa: this.currentResults.ccaa,
        stateQuota: this.currentResults.stateQuota,
        regionalQuota: this.currentResults.regionalQuota
      };

      const results = this.multiyearSimulator.simulate(baseParams, strategy, years);
      this.displayMultiyearResults(results);
      
    } catch (error) {
      this.showError('multiyear-results', error.message);
    } finally {
      this.hideLoading('multiyear-results');
    }
  }

  /**
   * Ejecutar simulación Monte Carlo
   */
  async runMonteCarloSimulation() {
    if (!this.currentResults) {
      this.showToast('Primero ejecute una simulación básica', 'warning');
      return;
    }

    try {
      this.showLoading('monte-carlo-results');
      
      const investment = this.currentResults.totalUsedInvestment;
      const results = await this.monteCarloSimulator.simulate(investment);
      
      this.displayMonteCarloResults(results);
      
    } catch (error) {
      this.showError('monte-carlo-results', error.message);
    } finally {
      this.hideLoading('monte-carlo-results');
    }
  }

  /**
   * Mostrar resultados principales
   */
  displayMainResults(results) {
    const container = document.getElementById('main-results');
    if (!container) return;

    container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h3 class="results-title">Resultados de Optimización Fiscal</h3>
          <div class="results-badges">
            <span class="badge badge--success">✓ Cálculo Completado</span>
            <span class="badge badge--info">v${CONFIG.version}</span>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-value">€${results.totalDeduction.toLocaleString()}</div>
            <div class="kpi-label">Deducción Total</div>
            <div class="kpi-change positive">+${results.effectiveFiscalReturn.toFixed(1)}% rentabilidad</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">€${results.totalUsedInvestment.toLocaleString()}</div>
            <div class="kpi-label">Inversión Utilizada</div>
            <div class="kpi-change ${results.analysis.efficiency > 0.8 ? 'positive' : 'warning'}">
              ${(results.analysis.efficiency * 100).toFixed(1)}% eficiencia
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">${results.distributions.length}</div>
            <div class="kpi-label">Empresas Necesarias</div>
            <div class="kpi-change positive">Diversificación óptima</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">€${results.unoptimizedCapital.toLocaleString()}</div>
            <div class="kpi-label">Capital No Optimizado</div>
            <div class="kpi-change ${results.unoptimizedCapital < results.totalInvestment * 0.1 ? 'positive' : 'warning'}">
              ${((results.unoptimizedCapital / results.totalInvestment) * 100).toFixed(1)}% del total
            </div>
          </div>
        </div>

        <div class="distributions-section">
          <h4>Distribución de Inversión</h4>
          <div class="distributions-grid">
            ${results.distributions.map(dist => `
              <div class="distribution-card">
                <div class="distribution-header">
                  <h5>${dist.project}</h5>
                  <span class="badge badge--${dist.type === 'estatal' ? 'info' : 'success'}">
                    ${(dist.deductionRate * 100).toFixed(0)}%
                  </span>
                </div>
                <div class="distribution-details">
                  <div class="detail-row">
                    <span>Inversión:</span>
                    <strong>€${dist.investment.toLocaleString()}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Deducción:</span>
                    <strong>€${dist.deduction.toLocaleString()}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Rentabilidad:</span>
                    <strong>${((dist.deduction / dist.investment) * 100).toFixed(1)}%</strong>
                  </div>
                </div>
                <p class="distribution-description">${dist.description}</p>
              </div>
            `).join('')}
          </div>
        </div>

        ${results.analysis.recommendations.length > 0 ? `
          <div class="recommendations-section">
            <h4>Recomendaciones</h4>
            <div class="recommendations-list">
              ${results.analysis.recommendations.map(rec => `
                <div class="recommendation-item recommendation--${rec.type}">
                  <div class="recommendation-icon">
                    ${rec.type === 'warning' ? '⚠️' : rec.type === 'success' ? '✅' : 'ℹ️'}
                  </div>
                  <div class="recommendation-content">
                    <p><strong>${rec.message}</strong></p>
                    <p class="recommendation-action">${rec.action}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Añadir estilos CSS para las nuevas clases
    this.addResultsStyles();
  }

  /**
   * Mostrar resultados plurianuales
   */
  displayMultiyearResults(results) {
    const container = document.getElementById('multiyear-results');
    if (!container) return;

    container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h3 class="results-title">Simulación Plurianual (${results.years} años)</h3>
          <div class="results-badges">
            <span class="badge badge--info">Estrategia: ${results.strategy}</span>
            <span class="badge badge--success">
              ${results.totals.averageFiscalReturn.toFixed(1)}% promedio
            </span>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-value">€${results.totals.totalInvested.toLocaleString()}</div>
            <div class="kpi-label">Inversión Total Acumulada</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">€${results.totals.totalDeducted.toLocaleString()}</div>
            <div class="kpi-label">Deducción Total Acumulada</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">${results.totals.cumulativeReturn.toFixed(1)}%</div>
            <div class="kpi-label">Rentabilidad Fiscal Final</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">${results.analysis.growthRate.toFixed(1)}%</div>
            <div class="kpi-label">Crecimiento Total</div>
          </div>
        </div>

        <div class="timeline-section">
          <h4>Evolución Año a Año</h4>
          <div class="timeline-container">
            ${results.yearlyResults.map(year => `
              <div class="timeline-item">
                <div class="timeline-year">Año ${year.year}</div>
                <div class="timeline-content">
                  <div class="timeline-metric">
                    <span>Inversión:</span>
                    <strong>€${year.investment.toLocaleString()}</strong>
                  </div>
                  <div class="timeline-metric">
                    <span>Deducción:</span>
                    <strong>€${year.deduction.toLocaleString()}</strong>
                  </div>
                  <div class="timeline-metric">
                    <span>Rentabilidad:</span>
                    <strong>${year.fiscalReturn.toFixed(1)}%</strong>
                  </div>
                  <div class="timeline-metric">
                    <span>Acumulado:</span>
                    <strong>€${year.cumulativeDeduction.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Mostrar resultados Monte Carlo
   */
  displayMonteCarloResults(results) {
    const container = document.getElementById('monte-carlo-results');
    if (!container) return;

    container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h3 class="results-title">Análisis Monte Carlo</h3>
          <div class="results-badges">
            <span class="badge badge--info">1000 simulaciones</span>
            <span class="badge badge--success">
              ${(100 - results.metrics.probabilityOfLoss).toFixed(1)}% éxito
            </span>
          </div>
        </div>

        <div class="scenarios-grid">
          <div class="scenario-card scenario--conservative">
            <h4>Escenario Conservador</h4>
            <div class="scenario-value">€${results.interpretation.conservative.value.toLocaleString()}</div>
            <p>${results.interpretation.conservative.description}</p>
          </div>
          <div class="scenario-card scenario--expected">
            <h4>Escenario Esperado</h4>
            <div class="scenario-value">€${results.interpretation.expected.value.toLocaleString()}</div>
            <p>${results.interpretation.expected.description}</p>
          </div>
          <div class="scenario-card scenario--optimistic">
            <h4>Escenario Optimista</h4>
            <div class="scenario-value">€${results.interpretation.optimistic.value.toLocaleString()}</div>
            <p>${results.interpretation.optimistic.description}</p>
          </div>
        </div>

        <div class="statistics-section">
          <h4>Estadísticas Detalladas</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Retorno Promedio:</span>
              <span class="stat-value">${results.metrics.averageReturn.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Probabilidad de Pérdida:</span>
              <span class="stat-value">${results.metrics.probabilityOfLoss.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Mejor Caso (P95):</span>
              <span class="stat-value">€${results.statistics.p95.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Peor Caso (P5):</span>
              <span class="stat-value">€${results.statistics.p5.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Exportar resultados
   */
  exportResults(format) {
    if (!this.currentResults) {
      this.showToast('No hay resultados para exportar', 'warning');
      return;
    }

    try {
      switch (format) {
        case 'pdf':
          this.exportToPDF();
          break;
        case 'json':
          this.exportToJSON();
          break;
        case 'csv':
          this.exportToCSV();
          break;
        default:
          throw new Error('Formato no soportado');
      }
      
      this.showToast(`Resultados exportados en formato ${format.toUpperCase()}`, 'success');
    } catch (error) {
      this.showToast(`Error al exportar: ${error.message}`, 'error');
    }
  }

  /**
   * Exportar a JSON
   */
  exportToJSON() {
    const data = {
      ...this.currentResults,
      exportDate: new Date().toISOString(),
      version: CONFIG.version
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this.downloadFile(blob, `invertax-resultados-${Date.now()}.json`);
  }

  /**
   * Exportar a CSV
   */
  exportToCSV() {
    const headers = ['Concepto', 'Valor', 'Descripción'];
    const rows = [
      ['Inversión Total', `€${this.currentResults.totalInvestment.toLocaleString()}`, 'Capital disponible para invertir'],
      ['Inversión Utilizada', `€${this.currentResults.totalUsedInvestment.toLocaleString()}`, 'Capital efectivamente invertido'],
      ['Deducción Total', `€${this.currentResults.totalDeduction.toLocaleString()}`, 'Beneficio fiscal obtenido'],
      ['Rentabilidad Fiscal', `${this.currentResults.effectiveFiscalReturn.toFixed(2)}%`, 'Deducción / Inversión utilizada'],
      ['Capital No Optimizado', `€${this.currentResults.unoptimizedCapital.toLocaleString()}`, 'Capital sin optimizar fiscalmente'],
      ['CCAA', this.currentResults.ccaaData.name, 'Comunidad Autónoma seleccionada'],
      ['Compatible', this.currentResults.ccaaData.compatible ? 'Sí' : 'No', 'Compatibilidad deducciones'],
      ...this.currentResults.distributions.map(dist => [
        dist.project,
        `€${dist.investment.toLocaleString()}`,
        `${(dist.deductionRate * 100)}% deducción`
      ])
    ];

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, `invertax-resultados-${Date.now()}.csv`);
  }

  /**
   * Exportar a PDF (simulado)
   */
  exportToPDF() {
    // En una implementación real, usaríamos una librería como jsPDF
    const htmlContent = this.generatePDFContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    this.downloadFile(blob, `invertax-informe-${Date.now()}.html`);
  }

  /**
   * Generar contenido para PDF
   */
  generatePDFContent() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>INVERTAX - Informe de Optimización Fiscal</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .section { margin-bottom: 30px; }
          .kpi { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; }
          .distribution { margin: 10px 0; padding: 15px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVERTAX</h1>
          <h2>Informe de Optimización Fiscal</h2>
          <p>Generado el ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
        
        <div class="section">
          <h3>Resumen Ejecutivo</h3>
          <div class="kpi">
            <strong>Inversión Total:</strong><br>
            €${this.currentResults.totalInvestment.toLocaleString()}
          </div>
          <div class="kpi">
            <strong>Deducción Total:</strong><br>
            €${this.currentResults.totalDeduction.toLocaleString()}
          </div>
          <div class="kpi">
            <strong>Rentabilidad Fiscal:</strong><br>
            ${this.currentResults.effectiveFiscalReturn.toFixed(2)}%
          </div>
        </div>

        <div class="section">
          <h3>Distribución de Inversión</h3>
          ${this.currentResults.distributions.map(dist => `
            <div class="distribution">
              <h4>${dist.project}</h4>
              <p><strong>Inversión:</strong> €${dist.investment.toLocaleString()}</p>
              <p><strong>Deducción:</strong> €${dist.deduction.toLocaleString()} (${(dist.deductionRate * 100)}%)</p>
              <p>${dist.description}</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3>Información Legal</h3>
          <p>Este informe se basa en la normativa fiscal vigente (Art. 68.1 LIRPF) y los datos proporcionados por el usuario. 
          Se recomienda consultar con un asesor fiscal antes de tomar decisiones de inversión.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Descargar archivo
   */
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Mostrar comparación de CCAA
   */
  showCCAAComparison() {
    if (!this.currentResults) {
      this.showToast('Primero ejecute una simulación básica', 'warning');
      return;
    }

    const modal = this.createModal('Comparación por Comunidades Autónomas');
    const comparisons = this.generateCCAAComparisons();
    
    modal.body.innerHTML = `
      <div class="ccaa-comparison">
        <p class="comparison-intro">
          Comparación de rentabilidad fiscal para una inversión de 
          €${this.currentResults.totalInvestment.toLocaleString()} con cuotas de 
          €${this.currentResults.stateQuota.toLocaleString()} (estatal) y 
          €${this.currentResults.regionalQuota.toLocaleString()} (autonómica).
        </p>
        <div class="comparison-grid">
          ${comparisons.map(comp => `
            <div class="comparison-card ${comp.ccaa === this.currentResults.ccaa ? 'current' : ''}">
              <h4>${comp.name}</h4>
              <div class="comparison-metrics">
                <div class="metric">
                  <span>Deducción Total:</span>
                  <strong>€${comp.totalDeduction.toLocaleString()}</strong>
                </div>
                <div class="metric">
                  <span>Rentabilidad:</span>
                  <strong>${comp.fiscalReturn.toFixed(1)}%</strong>
                </div>
                <div class="metric">
                  <span>Compatible:</span>
                  <strong>${comp.compatible ? 'Sí' : 'No'}</strong>
                </div>
              </div>
              ${comp.ccaa === this.currentResults.ccaa ? '<div class="current-badge">Actual</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.showModal(modal);
  }

  /**
   * Generar comparaciones de CCAA
   */
  generateCCAAComparisons() {
    const comparisons = [];
    
    Object.keys(CCAA_DATA).forEach(ccaaCode => {
      try {
        const result = this.fiscalEngine.calculateOptimalDeductions(
          this.currentResults.totalInvestment,
          ccaaCode,
          this.currentResults.stateQuota,
          this.currentResults.regionalQuota
        );
        
        comparisons.push({
          ccaa: ccaaCode,
          name: CCAA_DATA[ccaaCode].name,
          totalDeduction: result.totalDeduction,
          fiscalReturn: result.effectiveFiscalReturn,
          compatible: CCAA_DATA[ccaaCode].compatible
        });
      } catch (error) {
        // Ignorar errores de CCAA específicas
      }
    });

    return comparisons.sort((a, b) => b.totalDeduction - a.totalDeduction);
  }

  /**
   * Crear modal
   */
  createModal(title) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer">
          <button class="btn btn--secondary modal-close">Cerrar</button>
        </div>
      </div>
    `;

    // Event listeners para cerrar
    modal.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        this.hideModal(modal);
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideModal(modal);
      }
    });

    return {
      element: modal,
      body: modal.querySelector('.modal-body'),
      footer: modal.querySelector('.modal-footer')
    };
  }

  /**
   * Mostrar modal
   */
  showModal(modal) {
    document.body.appendChild(modal.element);
    document.body.style.overflow = 'hidden';
    
    // Añadir estilos del modal si no existen
    this.addModalStyles();
    
    // Animación de entrada
    requestAnimationFrame(() => {
      modal.element.classList.add('modal-show');
    });
  }

  /**
   * Ocultar modal
   */
  hideModal(modal) {
    modal.element.classList.remove('modal-show');
    
    setTimeout(() => {
      if (modal.element.parentNode) {
        modal.element.parentNode.removeChild(modal.element);
      }
      document.body.style.overflow = '';
    }, 300);
  }

  /**
   * Añadir estilos de resultados
   */
  addResultsStyles() {
    if (document.getElementById('results-styles')) return;

    const style = document.createElement('style');
    style.id = 'results-styles';
    style.textContent = `
      .distributions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-4);
        margin-top: var(--space-4);
      }
      
      .distribution-card {
        background: var(--color-surface);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        transition: all var(--duration-normal) var(--ease-out);
      }
      
      .distribution-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-base);
      }
      
      .distribution-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
      }
      
      .distribution-header h5 {
        margin: 0;
        color: var(--color-text-primary);
        font-size: var(--text-lg);
      }
      
      .distribution-details {
        margin-bottom: var(--space-4);
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-2);
        padding-bottom: var(--space-2);
        border-bottom: 1px solid var(--color-gray-100);
      }
      
      .detail-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .distribution-description {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        margin: 0;
        font-style: italic;
      }
      
      .recommendations-section {
        margin-top: var(--space-8);
      }
      
      .recommendations-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-top: var(--space-4);
      }
      
      .recommendation-item {
        display: flex;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        border-left: 4px solid;
      }
      
      .recommendation--success {
        background: var(--color-success-light);
        border-left-color: var(--color-success);
      }
      
      .recommendation--warning {
        background: var(--color-warning-light);
        border-left-color: var(--color-warning);
      }
      
      .recommendation--info {
        background: var(--color-info-light);
        border-left-color: var(--color-info);
      }
      
      .recommendation-icon {
        font-size: var(--text-xl);
        flex-shrink: 0;
      }
      
      .recommendation-content p {
        margin: 0;
        margin-bottom: var(--space-2);
      }
      
      .recommendation-content p:last-child {
        margin-bottom: 0;
      }
      
      .recommendation-action {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }
      
      .timeline-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-top: var(--space-4);
      }
      
      .timeline-item {
        display: flex;
        gap: var(--space-4);
        padding: var(--space-4);
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-gray-200);
      }
      
      .timeline-year {
        font-weight: var(--font-bold);
        color: var(--color-primary);
        min-width: 80px;
        font-size: var(--text-lg);
      }
      
      .timeline-content {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--space-3);
      }
      
      .timeline-metric {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      
      .timeline-metric span {
        font-size: var(--text-sm);
        color: var(--color-text-secondary);
      }
      
      .scenarios-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-8);
      }
      
      .scenario-card {
        padding: var(--space-6);
        border-radius: var(--radius-lg);
        text-align: center;
        border: 2px solid;
      }
      
      .scenario--conservative {
        background: var(--color-warning-light);
        border-color: var(--color-warning);
      }
      
      .scenario--expected {
        background: var(--color-info-light);
        border-color: var(--color-info);
      }
      
      .scenario--optimistic {
        background: var(--color-success-light);
        border-color: var(--color-success);
      }
      
      .scenario-value {
        font-size: var(--text-3xl);
        font-weight: var(--font-extrabold);
        margin: var(--space-3) 0;
        color: var(--color-text-primary);
      }
      
      .statistics-section {
        margin-top: var(--space-8);
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-4);
        margin-top: var(--space-4);
      }
      
      .stat-item {
        display: flex;
        justify-content: space-between;
        padding: var(--space-3);
        background: var(--color-surface);
        border-radius: var(--radius-base);
        border: 1px solid var(--color-gray-200);
      }
      
      .stat-label {
        color: var(--color-text-secondary);
      }
      
      .stat-value {
        font-weight: var(--font-bold);
        color: var(--color-text-primary);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Añadir estilos de modal
   */
  addModalStyles() {
    if (document.getElementById('modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
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
        z-index: var(--z-modal);
        opacity: 0;
        transition: opacity var(--duration-normal) var(--ease-out);
      }
      
      .modal-overlay.modal-show {
        opacity: 1;
      }
      
      .modal-container {
        background: var(--color-surface);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-2xl);
        max-width: 90vw;
        max-height: 90vh;
        overflow: hidden;
        transform: scale(0.9);
        transition: transform var(--duration-normal) var(--ease-out);
      }
      
      .modal-show .modal-container {
        transform: scale(1);
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-6);
        border-bottom: 1px solid var(--color-gray-200);
      }
      
      .modal-header h3 {
        margin: 0;
        color: var(--color-text-primary);
      }
      
      .modal-close {
        background: none;
        border: none;
        font-size: var(--text-2xl);
        cursor: pointer;
        color: var(--color-text-muted);
        padding: var(--space-2);
        border-radius: var(--radius-base);
        transition: all var(--duration-fast) var(--ease-out);
      }
      
      .modal-close:hover {
        background: var(--color-gray-100);
        color: var(--color-text-primary);
      }
      
      .modal-body {
        padding: var(--space-6);
        max-height: 60vh;
        overflow-y: auto;
      }
      
      .modal-footer {
        padding: var(--space-6);
        border-top: 1px solid var(--color-gray-200);
        display: flex;
        justify-content: flex-end;
        gap: var(--space-3);
      }
      
      .ccaa-comparison {
        max-width: 800px;
      }
      
      .comparison-intro {
        margin-bottom: var(--space-6);
        padding: var(--space-4);
        background: var(--color-gray-50);
        border-radius: var(--radius-lg);
        color: var(--color-text-secondary);
      }
      
      .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--space-4);
      }
      
      .comparison-card {
        padding: var(--space-4);
        border: 2px solid var(--color-gray-200);
        border-radius: var(--radius-lg);
        position: relative;
        transition: all var(--duration-normal) var(--ease-out);
      }
      
      .comparison-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-base);
      }
      
      .comparison-card.current {
        border-color: var(--color-primary);
        background: var(--color-primary-light);
      }
      
      .comparison-card h4 {
        margin: 0 0 var(--space-3) 0;
        color: var(--color-text-primary);
      }
      
      .comparison-metrics {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      
      .comparison-metrics .metric {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-sm);
      }
      
      .current-badge {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: var(--color-primary);
        color: var(--color-text-inverse);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-base);
        font-size: var(--text-xs);
        font-weight: var(--font-semibold);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Utilidades de UI
   */
  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.classList.add('loading');
    }
  }

  hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.classList.remove('loading');
    }
  }

  showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div class="error-content">
            <h3>Error en el cálculo</h3>
            <p>${message}</p>
            <button class="btn btn--primary" onclick="location.reload()">
              Reintentar
            </button>
          </div>
        </div>
      `;
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">
          ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close">&times;</button>
    `;

    // Añadir estilos de toast si no existen
    this.addToastStyles();

    // Event listener para cerrar
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.hideToast(toast);
    });

    // Añadir al DOM
    document.body.appendChild(toast);

    // Mostrar con animación
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.hideToast(toast);
    }, CONFIG.ui.toastDuration);
  }

  hideToast(toast) {
    toast.classList.remove('toast-show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  addToastStyles() {
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast {
        position: fixed;
        top: var(--space-4);
        right: var(--space-4);
        background: var(--color-surface);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        padding: var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-3);
        z-index: var(--z-toast);
        transform: translateX(100%);
        transition: transform var(--duration-normal) var(--ease-out);
        max-width: 400px;
      }
      
      .toast.toast-show {
        transform: translateX(0);
      }
      
      .toast--success {
        border-left: 4px solid var(--color-success);
      }
      
      .toast--warning {
        border-left: 4px solid var(--color-warning);
      }
      
      .toast--error {
        border-left: 4px solid var(--color-error);
      }
      
      .toast--info {
        border-left: 4px solid var(--color-info);
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex: 1;
      }
      
      .toast-icon {
        font-size: var(--text-lg);
      }
      
      .toast-message {
        color: var(--color-text-primary);
        font-size: var(--text-sm);
      }
      
      .toast-close {
        background: none;
        border: none;
        font-size: var(--text-lg);
        cursor: pointer;
        color: var(--color-text-muted);
        padding: var(--space-1);
        border-radius: var(--radius-base);
        transition: all var(--duration-fast) var(--ease-out);
      }
      
      .toast-close:hover {
        background: var(--color-gray-100);
        color: var(--color-text-primary);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Debounce utility
   */
  debounce(key, func, delay) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    
    const timer = setTimeout(func, delay);
    this.debounceTimers.set(key, timer);
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Inicializar aplicación
    const app = new UIManager();
    
    // Hacer disponible globalmente para debugging
    if (CONFIG.debug) {
      window.INVERTAX = {
        app,
        fiscalEngine: app.fiscalEngine,
        config: CONFIG,
        ccaaData: CCAA_DATA
      };
    }
    
    console.log(`✅ INVERTAX v${CONFIG.version} inicializado correctamente`);
    
  } catch (error) {
    console.error('❌ Error en inicialización:', error);
    
    // Mostrar error en la interfaz
    const errorContainer = document.createElement('div');
    errorContainer.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        text-align: center;
        z-index: 9999;
      ">
        <h3 style="color: #dc2626; margin-bottom: 1rem;">Error de Inicialización</h3>
        <p style="margin-bottom: 1rem;">Ha ocurrido un error al cargar la aplicación.</p>
        <button onclick="location.reload()" style="
          background: #1e40af;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
        ">
          Reintentar
        </button>
      </div>
    `;
    document.body.appendChild(errorContainer);
  }
});

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('✅ Service Worker registrado:', registration.scope);
      })
      .catch(error => {
        console.warn('⚠️ Error registrando Service Worker:', error);
      });
  });
}

// ===== MANEJO DE ERRORES GLOBALES =====
window.addEventListener('error', (event) => {
  console.error('❌ Error global:', event.error);
  
  if (CONFIG.debug) {
    alert(`Error: ${event.error.message}\nArchivo: ${event.filename}\nLínea: ${event.lineno}`);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rechazada:', event.reason);
  
  if (CONFIG.debug) {
    alert(`Promise rechazada: ${event.reason}`);
  }
});