// INVERTAX - Aplicación Principal Mejorada v3.0
// Sistema integral de optimización fiscal con funcionalidades avanzadas

// Configuración global mejorada
const CONFIG = {
    version: '3.0.0',
    api: {
        baseUrl: window.location.origin,
        timeout: 10000,
        retries: 3
    },
    cache: {
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        maxSize: 50 * 1024 * 1024 // 50MB
    },
    analytics: {
        enabled: true,
        batchSize: 10,
        flushInterval: 30000
    },
    features: {
        advancedCalculations: true,
        portfolioOptimization: true,
        riskAnalysis: true,
        realTimeUpdates: true,
        offlineMode: true,
        notifications: true
    }
};

// Base de datos CCAA actualizada con datos precisos 2024
const CCAA_DATA = {
    'madrid': {
        name: 'Madrid',
        percentage: 0.40,
        maxBase: 9279,
        compatible: true,
        requirements: ['Permanencia 3 años', 'Mínimo 5 empleados', 'Sede en Madrid'],
        acceptedProfiles: ['empresa tecnológica', 'empresa innovadora', 'empresa joven', 'todos'],
        riskLevel: 'bajo',
        processingTime: '2-3 meses',
        successRate: 0.95,
        averageReturn: 0.42,
        marketShare: 0.35,
        regulatoryStability: 0.9
    },
    'cataluna': {
        name: 'Cataluña',
        percentage: 0.50,
        maxBase: 12000,
        compatible: false,
        requirements: ['Business angel acreditado', 'Empresa catalana', 'Sector tecnológico'],
        acceptedProfiles: ['empresa tecnológica', 'empresa base tecnológica'],
        riskLevel: 'medio',
        processingTime: '3-4 meses',
        successRate: 0.85,
        averageReturn: 0.48,
        marketShare: 0.25,
        regulatoryStability: 0.7
    },
    'valencia': {
        name: 'Valencia',
        percentage: 0.30,
        maxBase: 6000,
        compatible: true,
        requirements: ['Sede en Comunidad Valenciana', 'Actividad innovadora'],
        acceptedProfiles: ['empresa innovadora', 'empresa local', 'empresa joven'],
        riskLevel: 'bajo',
        processingTime: '2-3 meses',
        successRate: 0.90,
        averageReturn: 0.32,
        marketShare: 0.15,
        regulatoryStability: 0.85
    },
    'andalucia': {
        name: 'Andalucía',
        percentage: 0.25,
        maxBase: 10000,
        compatible: true,
        requirements: ['Antigüedad máxima 5 años', 'Actividad en Andalucía'],
        acceptedProfiles: ['empresa joven', 'empresa local', 'empresa innovadora'],
        riskLevel: 'medio',
        processingTime: '3-4 meses',
        successRate: 0.88,
        averageReturn: 0.28,
        marketShare: 0.12,
        regulatoryStability: 0.8
    },
    'pais_vasco': {
        name: 'País Vasco',
        percentage: 0.35,
        maxBase: 15000,
        compatible: true,
        requirements: ['Normativa foral específica', 'Empresa vasca'],
        acceptedProfiles: ['empresa tecnológica', 'empresa innovadora', 'empresa base tecnológica'],
        riskLevel: 'bajo',
        processingTime: '2-3 meses',
        successRate: 0.92,
        averageReturn: 0.38,
        marketShare: 0.08,
        regulatoryStability: 0.95,
        special: true
    },
    'galicia': {
        name: 'Galicia',
        percentage: 0.25,
        maxBase: 8000,
        compatible: true,
        requirements: ['Registro previo en IGAPE', 'Actividad en Galicia'],
        acceptedProfiles: ['empresa local', 'empresa joven', 'empresa innovadora'],
        riskLevel: 'medio',
        processingTime: '3-4 meses',
        successRate: 0.87,
        averageReturn: 0.27,
        marketShare: 0.05,
        regulatoryStability: 0.82
    }
};

// Motor de cálculo fiscal avanzado
class AdvancedFiscalCalculator {
    constructor() {
        this.stateDeductionRate = 0.50;
        this.stateMaxBase = 100000;
        this.minimumInvestment = 1000;
        this.maximumInvestment = 500000;
        this.cache = new Map();
        this.calculationHistory = [];
        this.optimizationStrategies = new Map();
    }

    // Cálculo principal optimizado con validaciones avanzadas
    calculateOptimalDistribution(params) {
        const startTime = performance.now();
        
        try {
            // Validar parámetros de entrada
            const validation = this.validateInputParameters(params);
            if (!validation.isValid) {
                throw new Error(validation.errors.join('; '));
            }

            const {
                totalInvestment,
                ccaaCode,
                stateQuota,
                regionalQuota,
                projectProfile,
                investmentHorizon = 3,
                riskTolerance = 'medium'
            } = params;

            // Generar clave de cache
            const cacheKey = this.generateCacheKey(params);
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const ccaaData = CCAA_DATA[ccaaCode];
            
            // Inicializar resultado
            const result = {
                input: params,
                timestamp: new Date().toISOString(),
                calculationId: this.generateCalculationId(),
                
                // Distribución optimizada
                distributions: [],
                totalInvestment: totalInvestment,
                totalUsedInvestment: 0,
                totalDeduction: 0,
                unoptimizedCapital: 0,
                
                // Métricas financieras
                effectiveFiscalReturn: 0,
                netPresentValue: 0,
                internalRateOfReturn: 0,
                paybackPeriod: 0,
                riskAdjustedReturn: 0,
                
                // Análisis de riesgo
                riskMetrics: {},
                
                // Optimización temporal
                temporalAnalysis: {},
                
                // Recomendaciones
                recommendations: [],
                
                // Métricas de calidad
                optimizationScore: 0,
                confidenceLevel: 0,
                
                // Metadatos
                calculationTime: 0,
                version: CONFIG.version
            };

            // FASE 1: Optimización de deducción estatal
            const stateOptimization = this.optimizeStateDeduction(totalInvestment, stateQuota);
            if (stateOptimization.investment > 0) {
                result.distributions.push({
                    type: 'estatal',
                    project: 'Proyecto A (Deducción Estatal)',
                    investment: stateOptimization.investment,
                    deductionRate: this.stateDeductionRate,
                    deduction: stateOptimization.deduction,
                    efficiency: stateOptimization.efficiency,
                    description: 'Art. 68.1 LIRPF - Deducción estatal del 50%',
                    legalBasis: 'Ley 35/2006, Art. 68.1',
                    requirements: ['Permanencia 3 años', 'Empresa < 3 años', 'Actividad económica real'],
                    riskLevel: 'bajo'
                });
                
                result.totalDeduction += stateOptimization.deduction;
                result.totalUsedInvestment += stateOptimization.investment;
            }

            // FASE 2: Optimización de deducción autonómica
            const remainingInvestment = totalInvestment - stateOptimization.investment;
            const regionalOptimization = this.optimizeRegionalDeduction(
                remainingInvestment, 
                ccaaData, 
                regionalQuota, 
                projectProfile
            );

            if (regionalOptimization.investment > 0) {
                result.distributions.push({
                    type: 'autonomica',
                    project: `Proyecto B (Deducción ${ccaaData.name})`,
                    investment: regionalOptimization.investment,
                    deductionRate: ccaaData.percentage,
                    deduction: regionalOptimization.deduction,
                    efficiency: regionalOptimization.efficiency,
                    description: `Deducción autonómica ${ccaaData.name} - ${(ccaaData.percentage * 100).toFixed(0)}%`,
                    legalBasis: `Normativa autonómica ${ccaaData.name}`,
                    requirements: ccaaData.requirements,
                    riskLevel: ccaaData.riskLevel,
                    compatible: ccaaData.compatible,
                    processingTime: ccaaData.processingTime
                });
                
                result.totalDeduction += regionalOptimization.deduction;
                result.totalUsedInvestment += regionalOptimization.investment;
            }

            // FASE 3: Cálculo de capital no optimizado
            result.unoptimizedCapital = totalInvestment - result.totalUsedInvestment;

            // FASE 4: Métricas financieras avanzadas
            if (result.totalUsedInvestment > 0) {
                result.effectiveFiscalReturn = (result.totalDeduction / result.totalUsedInvestment) * 100;
                result.netPresentValue = this.calculateNPV(result.totalUsedInvestment, result.totalDeduction, investmentHorizon);
                result.internalRateOfReturn = this.calculateIRR(result.totalUsedInvestment, result.totalDeduction, investmentHorizon);
                result.paybackPeriod = this.calculatePaybackPeriod(result.totalUsedInvestment, result.totalDeduction);
                result.riskAdjustedReturn = this.calculateRiskAdjustedReturn(result.effectiveFiscalReturn, ccaaData, riskTolerance);
            }

            // FASE 5: Análisis de riesgo avanzado
            result.riskMetrics = this.calculateAdvancedRiskMetrics(result, ccaaData, params);

            // FASE 6: Análisis temporal
            result.temporalAnalysis = this.performTemporalAnalysis(result, investmentHorizon);

            // FASE 7: Generación de recomendaciones inteligentes
            result.recommendations = this.generateIntelligentRecommendations(result, ccaaData, params);

            // FASE 8: Scoring de optimización
            result.optimizationScore = this.calculateOptimizationScore(result);
            result.confidenceLevel = this.calculateConfidenceLevel(result, ccaaData);

            // Finalizar cálculo
            const endTime = performance.now();
            result.calculationTime = endTime - startTime;

            // Guardar en cache y historial
            this.cache.set(cacheKey, result);
            this.calculationHistory.push({
                id: result.calculationId,
                timestamp: result.timestamp,
                params: params,
                result: result
            });

            // Limpiar cache si es muy grande
            if (this.cache.size > 100) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }

            return result;

        } catch (error) {
            console.error('Error en cálculo fiscal:', error);
            throw new Error(`Error en optimización fiscal: ${error.message}`);
        }
    }

    // Validación avanzada de parámetros
    validateInputParameters(params) {
        const errors = [];
        const {
            totalInvestment,
            ccaaCode,
            stateQuota,
            regionalQuota
        } = params;

        // Validar inversión
        if (!totalInvestment || totalInvestment < this.minimumInvestment) {
            errors.push(`Inversión mínima: €${this.minimumInvestment.toLocaleString()}`);
        }
        if (totalInvestment > this.maximumInvestment) {
            errors.push(`Inversión máxima: €${this.maximumInvestment.toLocaleString()}`);
        }

        // Validar CCAA
        if (!ccaaCode || !CCAA_DATA[ccaaCode]) {
            errors.push('Comunidad Autónoma no válida');
        }

        // Validar cuotas
        if (stateQuota < 0 || stateQuota > 100000) {
            errors.push('Cuota estatal debe estar entre €0 y €100.000');
        }
        if (regionalQuota < 0 || regionalQuota > 50000) {
            errors.push('Cuota autonómica debe estar entre €0 y €50.000');
        }

        // Validaciones de coherencia
        if (stateQuota > totalInvestment * 0.8) {
            errors.push('La cuota estatal parece excesiva para la inversión indicada');
        }

        // Validar perfil de proyecto si se proporciona
        if (params.projectProfile && ccaaCode) {
            const ccaaData = CCAA_DATA[ccaaCode];
            if (!ccaaData.acceptedProfiles.includes('todos') && 
                !ccaaData.acceptedProfiles.some(profile => 
                    params.projectProfile.toLowerCase().includes(profile.toLowerCase())
                )) {
                errors.push(`Perfil de proyecto no compatible con ${ccaaData.name}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Optimización de deducción estatal mejorada
    optimizeStateDeduction(totalInvestment, stateQuota) {
        const maxInvestmentByBase = Math.min(totalInvestment, this.stateMaxBase);
        const maxDeductionPossible = maxInvestmentByBase * this.stateDeductionRate;
        const actualDeduction = Math.min(maxDeductionPossible, stateQuota);
        const optimalInvestment = actualDeduction / this.stateDeductionRate;

        return {
            investment: optimalInvestment,
            deduction: actualDeduction,
            efficiency: optimalInvestment > 0 ? (actualDeduction / optimalInvestment) : 0,
            utilizationRate: optimalInvestment / maxInvestmentByBase,
            marginalBenefit: this.stateDeductionRate
        };
    }

    // Optimización de deducción autonómica mejorada
    optimizeRegionalDeduction(remainingInvestment, ccaaData, regionalQuota, projectProfile) {
        if (remainingInvestment <= 0 || !ccaaData.compatible || ccaaData.percentage <= 0) {
            return { 
                investment: 0, 
                deduction: 0, 
                efficiency: 0,
                reason: 'Sin inversión remanente o CCAA incompatible'
            };
        }

        // Validar perfil de proyecto
        if (projectProfile && !ccaaData.acceptedProfiles.includes('todos')) {
            const isCompatible = ccaaData.acceptedProfiles.some(profile => 
                projectProfile.toLowerCase().includes(profile.toLowerCase())
            );
            
            if (!isCompatible) {
                return { 
                    investment: 0, 
                    deduction: 0, 
                    efficiency: 0,
                    reason: `Perfil "${projectProfile}" no compatible con ${ccaaData.name}`
                };
            }
        }

        const maxInvestmentByBase = Math.min(remainingInvestment, ccaaData.maxBase);
        const maxDeductionPossible = maxInvestmentByBase * ccaaData.percentage;
        const actualDeduction = Math.min(maxDeductionPossible, regionalQuota);
        const optimalInvestment = actualDeduction / ccaaData.percentage;

        return {
            investment: optimalInvestment,
            deduction: actualDeduction,
            efficiency: optimalInvestment > 0 ? (actualDeduction / optimalInvestment) : 0,
            utilizationRate: optimalInvestment / maxInvestmentByBase,
            marginalBenefit: ccaaData.percentage,
            processingTime: ccaaData.processingTime,
            successRate: ccaaData.successRate
        };
    }

    // Cálculo de VPN mejorado
    calculateNPV(investment, deduction, years = 3) {
        const discountRate = 0.05; // Tasa de descuento 5%
        const immediateReturn = deduction; // Deducción inmediata
        
        // Flujos de caja futuros estimados
        const futureCashFlows = [];
        for (let year = 1; year <= years; year++) {
            const expectedReturn = investment * 0.15 * Math.pow(0.9, year - 1); // Retorno decreciente
            futureCashFlows.push(expectedReturn);
        }
        
        // Calcular VPN
        let npv = immediateReturn - investment;
        futureCashFlows.forEach((cashFlow, index) => {
            npv += cashFlow / Math.pow(1 + discountRate, index + 1);
        });
        
        return npv;
    }

    // Cálculo de TIR mejorado
    calculateIRR(investment, deduction, years = 3) {
        const netInvestment = investment - deduction;
        if (netInvestment <= 0) return Infinity;
        
        // Estimación de valor final
        const expectedFinalValue = investment * Math.pow(1.2, years); // 20% anual
        
        // Cálculo de TIR usando aproximación
        const irr = Math.pow(expectedFinalValue / netInvestment, 1/years) - 1;
        return irr * 100;
    }

    // Período de recuperación mejorado
    calculatePaybackPeriod(investment, deduction) {
        const netInvestment = investment - deduction;
        if (netInvestment <= 0) return 0;
        
        const annualCashFlow = investment * 0.18; // 18% anual esperado
        if (annualCashFlow <= 0) return Infinity;
        
        return netInvestment / annualCashFlow;
    }

    // Retorno ajustado por riesgo
    calculateRiskAdjustedReturn(fiscalReturn, ccaaData, riskTolerance) {
        let riskAdjustment = 1;
        
        // Ajuste por estabilidad regulatoria
        riskAdjustment *= ccaaData.regulatoryStability || 0.8;
        
        // Ajuste por tolerancia al riesgo
        const riskMultipliers = {
            'low': 0.7,
            'medium': 0.85,
            'high': 1.0
        };
        riskAdjustment *= riskMultipliers[riskTolerance] || 0.85;
        
        // Ajuste por nivel de riesgo de la CCAA
        const ccaaRiskMultipliers = {
            'bajo': 0.95,
            'medio': 0.85,
            'alto': 0.75
        };
        riskAdjustment *= ccaaRiskMultipliers[ccaaData.riskLevel] || 0.85;
        
        return fiscalReturn * riskAdjustment;
    }

    // Métricas de riesgo avanzadas
    calculateAdvancedRiskMetrics(result, ccaaData, params) {
        const totalInvestment = result.totalUsedInvestment;
        const totalDeduction = result.totalDeduction;
        
        return {
            // Value at Risk (VaR) al 95%
            var95: totalInvestment * 0.15,
            
            // Expected Shortfall
            expectedShortfall: totalInvestment * 0.25,
            
            // Ratio de cobertura fiscal
            fiscalCoverageRatio: totalDeduction / totalInvestment,
            
            // Diversificación de riesgo
            diversificationScore: result.distributions.length > 1 ? 0.8 : 0.4,
            
            // Riesgo regulatorio
            regulatoryRisk: ccaaData.compatible ? 0.1 : 0.3,
            
            // Riesgo de liquidez
            liquidityRisk: 0.6, // Empresas nuevas tienen liquidez limitada
            
            // Concentración de riesgo
            concentrationRisk: result.unoptimizedCapital > totalInvestment * 0.2 ? 0.7 : 0.3,
            
            // Riesgo temporal
            temporalRisk: params.investmentHorizon < 3 ? 0.8 : 0.4,
            
            // Score de riesgo general (0-100)
            overallRiskScore: this.calculateOverallRiskScore(result, ccaaData, params)
        };
    }

    // Score de riesgo general
    calculateOverallRiskScore(result, ccaaData, params) {
        let score = 0;
        const weights = {
            fiscal: 0.3,
            regulatory: 0.25,
            liquidity: 0.2,
            concentration: 0.15,
            temporal: 0.1
        };

        // Riesgo fiscal
        const fiscalRisk = Math.min(result.effectiveFiscalReturn / 50 * 100, 100);
        score += (100 - fiscalRisk) * weights.fiscal;

        // Riesgo regulatorio
        const regulatoryRisk = ccaaData.compatible ? 20 : 80;
        score += regulatoryRisk * weights.regulatory;

        // Riesgo de liquidez
        const liquidityRisk = 70; // Alto para empresas nuevas
        score += liquidityRisk * weights.liquidity;

        // Riesgo de concentración
        const concentrationRisk = result.unoptimizedCapital > result.totalInvestment * 0.2 ? 80 : 40;
        score += concentrationRisk * weights.concentration;

        // Riesgo temporal
        const temporalRisk = params.investmentHorizon < 3 ? 80 : 40;
        score += temporalRisk * weights.temporal;

        return Math.round(score);
    }

    // Análisis temporal avanzado
    performTemporalAnalysis(result, investmentHorizon) {
        const analysis = {
            horizonYears: investmentHorizon,
            yearlyProjections: [],
            cumulativeReturn: 0,
            breakEvenPoint: 0,
            optimalExitStrategy: {}
        };

        const annualGrowthRate = 0.15; // 15% anual esperado
        const inflationRate = 0.025; // 2.5% inflación

        for (let year = 1; year <= investmentHorizon; year++) {
            const nominalValue = result.totalUsedInvestment * Math.pow(1 + annualGrowthRate, year);
            const realValue = nominalValue / Math.pow(1 + inflationRate, year);
            const cumulativeBenefit = result.totalDeduction + (nominalValue - result.totalUsedInvestment);
            const roi = ((cumulativeBenefit - result.totalInvestment) / result.totalInvestment) * 100;

            analysis.yearlyProjections.push({
                year: year,
                nominalValue: nominalValue,
                realValue: realValue,
                cumulativeBenefit: cumulativeBenefit,
                roi: roi,
                riskAdjustedROI: roi * (1 - year * 0.05) // Riesgo creciente con el tiempo
            });

            if (cumulativeBenefit >= result.totalInvestment && analysis.breakEvenPoint === 0) {
                analysis.breakEvenPoint = year;
            }
        }

        analysis.cumulativeReturn = analysis.yearlyProjections[investmentHorizon - 1]?.roi || 0;

        // Estrategia de salida óptima
        analysis.optimalExitStrategy = {
            recommendedYear: Math.min(investmentHorizon, 5),
            reason: 'Equilibrio entre rentabilidad y riesgo',
            expectedReturn: analysis.yearlyProjections[Math.min(investmentHorizon - 1, 4)]?.roi || 0
        };

        return analysis;
    }

    // Recomendaciones inteligentes mejoradas
    generateIntelligentRecommendations(result, ccaaData, params) {
        const recommendations = [];
        const efficiency = result.effectiveFiscalReturn;
        const unoptimized = result.unoptimizedCapital;
        const totalInvestment = result.totalInvestment;

        // Análisis de eficiencia fiscal
        if (efficiency > 45) {
            recommendations.push({
                type: 'success',
                priority: 'high',
                category: 'efficiency',
                title: 'Optimización Excelente',
                message: `Tu estrategia fiscal es altamente eficiente con ${efficiency.toFixed(1)}% de rentabilidad fiscal.`,
                actionable: false,
                impact: 'positive',
                confidence: 0.95
            });
        } else if (efficiency < 25) {
            recommendations.push({
                type: 'warning',
                priority: 'high',
                category: 'efficiency',
                title: 'Oportunidad de Mejora Significativa',
                message: `Rentabilidad fiscal baja (${efficiency.toFixed(1)}%). Considera las siguientes acciones:`,
                actionable: true,
                actions: [
                    'Aumentar cuotas fiscales disponibles',
                    'Revisar distribución temporal de la inversión',
                    'Consultar con asesor fiscal especializado',
                    'Evaluar cambio de residencia fiscal'
                ],
                impact: 'improvement',
                confidence: 0.85,
                potentialGain: `Hasta ${(50 - efficiency).toFixed(1)}% adicional`
            });
        }

        // Análisis de capital no optimizado
        if (unoptimized > totalInvestment * 0.15) {
            const percentage = (unoptimized / totalInvestment * 100).toFixed(1);
            recommendations.push({
                type: 'warning',
                priority: 'medium',
                category: 'optimization',
                title: 'Capital Sin Optimizar Detectado',
                message: `${percentage}% de tu capital (€${unoptimized.toLocaleString()}) no está optimizado fiscalmente.`,
                actionable: true,
                actions: [
                    'Distribuir inversión en múltiples años fiscales',
                    'Incrementar cuotas disponibles',
                    'Considerar inversión en otras CCAA',
                    'Evaluar vehículos de inversión alternativos'
                ],
                impact: 'optimization',
                confidence: 0.9,
                potentialSaving: `€${(unoptimized * 0.4).toLocaleString()} adicionales`
            });
        }

        // Recomendaciones específicas por CCAA
        if (!ccaaData.compatible) {
            recommendations.push({
                type: 'info',
                priority: 'medium',
                category: 'regulatory',
                title: 'Incompatibilidad Autonómica Detectada',
                message: `${ccaaData.name} no permite combinar deducciones estatales y autonómicas.`,
                actionable: true,
                actions: [
                    'Evaluar cambio de residencia fiscal',
                    'Maximizar solo deducción autonómica',
                    'Planificar distribución temporal',
                    'Consultar alternativas legales'
                ],
                impact: 'regulatory',
                confidence: 1.0,
                legalBasis: 'Normativa autonómica específica'
            });
        }

        // Recomendaciones de diversificación
        if (result.distributions.length === 1) {
            recommendations.push({
                type: 'info',
                priority: 'low',
                category: 'diversification',
                title: 'Oportunidad de Diversificación',
                message: 'Considera diversificar entre múltiples empresas para reducir el riesgo de concentración.',
                actionable: true,
                actions: [
                    'Invertir en al menos 5-10 empresas diferentes',
                    'Diversificar por sectores económicos',
                    'Escalonar inversiones en el tiempo',
                    'Incluir diferentes etapas de desarrollo'
                ],
                impact: 'risk_management',
                confidence: 0.8,
                riskReduction: '30-40%'
            });
        }

        // Recomendaciones temporales
        const paybackPeriod = result.paybackPeriod;
        if (paybackPeriod > 5) {
            recommendations.push({
                type: 'warning',
                priority: 'medium',
                category: 'temporal',
                title: 'Período de Recuperación Extenso',
                message: `El período de recuperación estimado es de ${paybackPeriod.toFixed(1)} años.`,
                actionable: true,
                actions: [
                    'Revisar expectativas de rentabilidad',
                    'Considerar empresas con mayor potencial',
                    'Evaluar estrategia de salida anticipada',
                    'Diversificar horizontes temporales'
                ],
                impact: 'temporal',
                confidence: 0.75
            });
        }

        // Recomendaciones de riesgo
        if (result.riskMetrics.overallRiskScore > 70) {
            recommendations.push({
                type: 'warning',
                priority: 'high',
                category: 'risk',
                title: 'Nivel de Riesgo Elevado',
                message: `Score de riesgo: ${result.riskMetrics.overallRiskScore}/100. Se recomienda precaución.`,
                actionable: true,
                actions: [
                    'Reducir concentración de inversiones',
                    'Aumentar diversificación sectorial',
                    'Considerar seguros de inversión',
                    'Establecer límites de pérdida'
                ],
                impact: 'risk_mitigation',
                confidence: 0.9
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    // Score de optimización mejorado
    calculateOptimizationScore(result) {
        let score = 0;
        const weights = {
            efficiency: 0.35,
            utilization: 0.25,
            diversification: 0.15,
            risk: 0.15,
            temporal: 0.1
        };

        // Score de eficiencia fiscal (0-100)
        const efficiencyScore = Math.min(result.effectiveFiscalReturn / 50 * 100, 100);
        score += efficiencyScore * weights.efficiency;

        // Score de utilización de capital (0-100)
        const utilizationScore = (result.totalUsedInvestment / result.totalInvestment) * 100;
        score += utilizationScore * weights.utilization;

        // Score de diversificación (0-100)
        const diversificationScore = Math.min(result.distributions.length * 50, 100);
        score += diversificationScore * weights.diversification;

        // Score de gestión de riesgo (0-100)
        const riskScore = 100 - (result.riskMetrics.overallRiskScore || 50);
        score += riskScore * weights.risk;

        // Score temporal (0-100)
        const temporalScore = result.paybackPeriod < 3 ? 100 : Math.max(0, 100 - (result.paybackPeriod - 3) * 20);
        score += temporalScore * weights.temporal;

        return Math.round(Math.max(0, Math.min(100, score)));
    }

    // Nivel de confianza mejorado
    calculateConfidenceLevel(result, ccaaData) {
        let confidence = 0.8; // Base de confianza

        // Ajustar por compatibilidad normativa
        confidence += ccaaData.compatible ? 0.1 : -0.15;

        // Ajustar por utilización de capital
        const utilization = result.totalUsedInvestment / result.totalInvestment;
        confidence += (utilization - 0.5) * 0.2;

        // Ajustar por estabilidad regulatoria
        confidence += (ccaaData.regulatoryStability - 0.8) * 0.2;

        // Ajustar por tasa de éxito histórica
        confidence += (ccaaData.successRate - 0.85) * 0.3;

        // Ajustar por complejidad
        if (ccaaData.special) confidence -= 0.05;

        return Math.max(0.5, Math.min(0.98, confidence));
    }

    // Funciones auxiliares
    generateCacheKey(params) {
        const keyData = {
            investment: params.totalInvestment,
            ccaa: params.ccaaCode,
            stateQuota: params.stateQuota,
            regionalQuota: params.regionalQuota,
            profile: params.projectProfile || 'none',
            horizon: params.investmentHorizon || 3,
            risk: params.riskTolerance || 'medium'
        };
        return btoa(JSON.stringify(keyData)).replace(/[^a-zA-Z0-9]/g, '');
    }

    generateCalculationId() {
        return 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Comparación entre CCAA
    compareRegions(investment, stateQuota, regionalQuota) {
        const comparisons = [];

        Object.keys(CCAA_DATA).forEach(ccaaCode => {
            try {
                const result = this.calculateOptimalDistribution({
                    totalInvestment: investment,
                    ccaaCode: ccaaCode,
                    stateQuota: stateQuota,
                    regionalQuota: regionalQuota
                });

                comparisons.push({
                    ccaa: ccaaCode,
                    name: CCAA_DATA[ccaaCode].name,
                    totalDeduction: result.totalDeduction,
                    effectiveFiscalReturn: result.effectiveFiscalReturn,
                    optimizationScore: result.optimizationScore,
                    riskScore: result.riskMetrics.overallRiskScore,
                    compatible: CCAA_DATA[ccaaCode].compatible,
                    processingTime: CCAA_DATA[ccaaCode].processingTime,
                    successRate: CCAA_DATA[ccaaCode].successRate,
                    marketShare: CCAA_DATA[ccaaCode].marketShare
                });
            } catch (error) {
                console.warn(`Error calculando para ${ccaaCode}:`, error);
            }
        });

        return comparisons.sort((a, b) => b.totalDeduction - a.totalDeduction);
    }

    // Análisis de escenarios
    analyzeScenarios(baseParams) {
        const scenarios = [
            { name: 'Conservador', factor: 0.8, description: 'Escenario pesimista con menores cuotas' },
            { name: 'Base', factor: 1.0, description: 'Escenario actual con parámetros introducidos' },
            { name: 'Optimista', factor: 1.2, description: 'Escenario optimista con mayores cuotas' },
            { name: 'Máximo', factor: 1.5, description: 'Escenario máximo teórico' }
        ];

        return scenarios.map(scenario => {
            const params = {
                ...baseParams,
                stateQuota: baseParams.stateQuota * scenario.factor,
                regionalQuota: baseParams.regionalQuota * scenario.factor
            };

            try {
                const result = this.calculateOptimalDistribution(params);
                return {
                    ...scenario,
                    result: result,
                    totalDeduction: result.totalDeduction,
                    effectiveFiscalReturn: result.effectiveFiscalReturn,
                    optimizationScore: result.optimizationScore
                };
            } catch (error) {
                return {
                    ...scenario,
                    error: error.message
                };
            }
        });
    }

    // Obtener historial de cálculos
    getCalculationHistory() {
        return this.calculationHistory.slice(-10); // Últimos 10 cálculos
    }

    // Limpiar cache
    clearCache() {
        this.cache.clear();
        this.calculationHistory = [];
    }
}

// Simulador Monte Carlo avanzado
class MonteCarloSimulator {
    constructor() {
        this.defaultIterations = 10000;
        this.worker = null;
        this.isRunning = false;
    }

    // Simulación Monte Carlo con Web Worker
    async runSimulation(params) {
        if (this.isRunning) {
            throw new Error('Simulación ya en progreso');
        }

        this.isRunning = true;

        try {
            const {
                investment,
                expectedReturn = 0.25,
                volatility = 0.35,
                years = 3,
                iterations = this.defaultIterations,
                fiscalBenefit = 0
            } = params;

            // Crear Web Worker si no existe
            if (!this.worker) {
                this.worker = new Worker('./monteCarlo-worker.js');
            }

            // Ejecutar simulación
            const result = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout en simulación Monte Carlo'));
                }, 30000); // 30 segundos timeout

                this.worker.onmessage = (event) => {
                    clearTimeout(timeout);
                    if (event.data.success) {
                        resolve(event.data.data);
                    } else {
                        reject(new Error(event.data.error));
                    }
                };

                this.worker.onerror = (error) => {
                    clearTimeout(timeout);
                    reject(error);
                };

                this.worker.postMessage({
                    investment: investment - fiscalBenefit, // Inversión neta
                    expectedReturn,
                    volatility,
                    years,
                    iterations
                });
            });

            // Procesar resultados
            const processedResult = this.processMonteCarloResults(result, fiscalBenefit, investment);
            
            return processedResult;

        } finally {
            this.isRunning = false;
        }
    }

    // Procesar resultados de Monte Carlo
    processMonteCarloResults(rawResult, fiscalBenefit, originalInvestment) {
        const { statistics, histogram, scenarios } = rawResult;

        // Ajustar estadísticas por beneficio fiscal
        const adjustedStats = {};
        Object.keys(statistics).forEach(key => {
            adjustedStats[key] = statistics[key] + fiscalBenefit;
        });

        // Calcular métricas adicionales
        const metrics = {
            // ROI ajustado por beneficio fiscal
            adjustedROI: ((adjustedStats.median - originalInvestment) / originalInvestment) * 100,
            
            // Probabilidad de pérdida (considerando beneficio fiscal)
            probabilityOfLoss: scenarios.filter(s => s + fiscalBenefit < originalInvestment).length / scenarios.length * 100,
            
            // Valor en Riesgo (VaR) al 95%
            var95: originalInvestment - (adjustedStats.p5),
            
            // Expected Shortfall (ES)
            expectedShortfall: this.calculateExpectedShortfall(scenarios, fiscalBenefit, originalInvestment),
            
            // Ratio de Sharpe ajustado
            sharpeRatio: this.calculateAdjustedSharpeRatio(adjustedStats, originalInvestment),
            
            // Probabilidad de duplicar inversión
            probabilityOfDoubling: scenarios.filter(s => s + fiscalBenefit >= originalInvestment * 2).length / scenarios.length * 100,
            
            // Percentil de break-even
            breakEvenPercentile: this.calculateBreakEvenPercentile(scenarios, fiscalBenefit, originalInvestment)
        };

        // Análisis de escenarios
        const scenarioAnalysis = {
            bearish: { value: adjustedStats.p5, probability: 5 },
            conservative: { value: adjustedStats.p25, probability: 25 },
            expected: { value: adjustedStats.median, probability: 50 },
            optimistic: { value: adjustedStats.p75, probability: 75 },
            bullish: { value: adjustedStats.p95, probability: 95 }
        };

        return {
            originalParams: rawResult.calculations,
            adjustedStatistics: adjustedStats,
            metrics: metrics,
            scenarioAnalysis: scenarioAnalysis,
            histogram: histogram,
            riskProfile: this.generateRiskProfile(metrics),
            recommendations: this.generateMonteCarloRecommendations(metrics, scenarioAnalysis)
        };
    }

    // Calcular Expected Shortfall
    calculateExpectedShortfall(scenarios, fiscalBenefit, originalInvestment) {
        const adjustedScenarios = scenarios.map(s => s + fiscalBenefit);
        const lossScenarios = adjustedScenarios.filter(s => s < originalInvestment);
        
        if (lossScenarios.length === 0) return 0;
        
        const averageLoss = lossScenarios.reduce((sum, s) => sum + s, 0) / lossScenarios.length;
        return originalInvestment - averageLoss;
    }

    // Calcular Sharpe ratio ajustado
    calculateAdjustedSharpeRatio(stats, originalInvestment) {
        const riskFreeRate = 0.02; // 2% tasa libre de riesgo
        const expectedReturn = (stats.mean - originalInvestment) / originalInvestment;
        const volatility = stats.standardDeviation / originalInvestment;
        
        return (expectedReturn - riskFreeRate) / volatility;
    }

    // Calcular percentil de break-even
    calculateBreakEvenPercentile(scenarios, fiscalBenefit, originalInvestment) {
        const adjustedScenarios = scenarios.map(s => s + fiscalBenefit).sort((a, b) => a - b);
        const breakEvenIndex = adjustedScenarios.findIndex(s => s >= originalInvestment);
        
        if (breakEvenIndex === -1) return 100;
        return (breakEvenIndex / adjustedScenarios.length) * 100;
    }

    // Generar perfil de riesgo
    generateRiskProfile(metrics) {
        let riskLevel = 'medium';
        let riskScore = 50;

        if (metrics.probabilityOfLoss < 20 && metrics.sharpeRatio > 1) {
            riskLevel = 'low';
            riskScore = 25;
        } else if (metrics.probabilityOfLoss > 40 || metrics.sharpeRatio < 0.5) {
            riskLevel = 'high';
            riskScore = 75;
        }

        return {
            level: riskLevel,
            score: riskScore,
            description: this.getRiskDescription(riskLevel),
            factors: this.getRiskFactors(metrics)
        };
    }

    // Descripción del riesgo
    getRiskDescription(riskLevel) {
        const descriptions = {
            'low': 'Perfil de riesgo bajo. Inversión relativamente segura con alta probabilidad de retorno positivo.',
            'medium': 'Perfil de riesgo moderado. Balance equilibrado entre riesgo y rentabilidad esperada.',
            'high': 'Perfil de riesgo alto. Mayor volatilidad con potencial de altos retornos pero también pérdidas significativas.'
        };
        return descriptions[riskLevel];
    }

    // Factores de riesgo
    getRiskFactors(metrics) {
        const factors = [];

        if (metrics.probabilityOfLoss > 30) {
            factors.push('Alta probabilidad de pérdida');
        }
        if (metrics.var95 > metrics.adjustedROI * 0.5) {
            factors.push('VaR elevado');
        }
        if (metrics.sharpeRatio < 0.5) {
            factors.push('Ratio riesgo-retorno desfavorable');
        }
        if (metrics.probabilityOfDoubling < 20) {
            factors.push('Baja probabilidad de duplicar inversión');
        }

        return factors;
    }

    // Recomendaciones basadas en Monte Carlo
    generateMonteCarloRecommendations(metrics, scenarioAnalysis) {
        const recommendations = [];

        // Recomendación basada en probabilidad de pérdida
        if (metrics.probabilityOfLoss > 40) {
            recommendations.push({
                type: 'warning',
                title: 'Alto Riesgo de Pérdida',
                message: `${metrics.probabilityOfLoss.toFixed(1)}% probabilidad de pérdida. Considera diversificar o reducir exposición.`,
                priority: 'high'
            });
        }

        // Recomendación basada en Sharpe ratio
        if (metrics.sharpeRatio < 0.5) {
            recommendations.push({
                type: 'info',
                title: 'Ratio Riesgo-Retorno Subóptimo',
                message: 'El ratio de Sharpe indica que el riesgo puede no estar bien compensado por el retorno esperado.',
                priority: 'medium'
            });
        }

        // Recomendación basada en VaR
        if (metrics.var95 > scenarioAnalysis.expected.value * 0.3) {
            recommendations.push({
                type: 'warning',
                title: 'VaR Elevado',
                message: 'El Valor en Riesgo es significativo. Considera estrategias de cobertura.',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    // Terminar worker
    terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.isRunning = false;
    }
}

// Gestor de documentos mejorado
class DocumentManager {
    constructor() {
        this.documents = new Map();
        this.templates = new Map();
        this.initializeTemplates();
    }

    // Inicializar plantillas de documentos
    initializeTemplates() {
        this.templates.set('simulation_report', {
            name: 'Informe de Simulación Fiscal',
            type: 'pdf',
            sections: ['header', 'summary', 'distributions', 'risk_analysis', 'recommendations', 'legal_disclaimer']
        });

        this.templates.set('comparison_report', {
            name: 'Comparativa entre CCAA',
            type: 'pdf',
            sections: ['header', 'comparison_table', 'analysis', 'recommendations']
        });

        this.templates.set('monte_carlo_report', {
            name: 'Análisis Monte Carlo',
            type: 'pdf',
            sections: ['header', 'methodology', 'results', 'risk_metrics', 'scenarios']
        });
    }

    // Generar documento PDF
    async generatePDF(data, templateType = 'simulation_report') {
        try {
            const template = this.templates.get(templateType);
            if (!template) {
                throw new Error(`Plantilla ${templateType} no encontrada`);
            }

            // Crear documento PDF usando jsPDF (se cargaría dinámicamente)
            const doc = await this.createPDFDocument(data, template);
            
            // Generar hash SHA-256 para integridad
            const hash = await this.generateDocumentHash(doc);
            
            // Metadatos del documento
            const metadata = {
                id: this.generateDocumentId(),
                type: templateType,
                title: template.name,
                createdAt: new Date().toISOString(),
                hash: hash,
                size: doc.length || 0,
                version: CONFIG.version
            };

            // Guardar en almacenamiento local
            this.documents.set(metadata.id, {
                metadata: metadata,
                content: doc,
                data: data
            });

            return {
                documentId: metadata.id,
                metadata: metadata,
                downloadUrl: this.createDownloadUrl(doc, metadata.title)
            };

        } catch (error) {
            console.error('Error generando PDF:', error);
            throw new Error(`Error al generar documento: ${error.message}`);
        }
    }

    // Crear documento PDF
    async createPDFDocument(data, template) {
        // Simulación de generación PDF - en producción usaría jsPDF
        const pdfContent = this.generatePDFContent(data, template);
        
        return new Blob([pdfContent], { type: 'application/pdf' });
    }

    // Generar contenido PDF
    generatePDFContent(data, template) {
        let content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(${template.name}) Tj
0 -20 Td
(Fecha: ${new Date().toLocaleDateString('es-ES')}) Tj
0 -20 Td
(Versión: ${CONFIG.version}) Tj
`;

        // Añadir contenido específico según el tipo de documento
        if (data.result) {
            content += `
0 -40 Td
(RESUMEN EJECUTIVO) Tj
0 -20 Td
(Inversión Total: €${data.result.totalInvestment?.toLocaleString() || 'N/A'}) Tj
0 -20 Td
(Deducción Total: €${data.result.totalDeduction?.toLocaleString() || 'N/A'}) Tj
0 -20 Td
(Rentabilidad Fiscal: ${data.result.effectiveFiscalReturn?.toFixed(2) || 'N/A'}%) Tj
`;
        }

        content += `
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
456
%%EOF`;

        return content;
    }

    // Exportar a JSON
    exportToJSON(data) {
        const jsonData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                version: CONFIG.version,
                type: 'invertax_simulation'
            },
            data: data
        };

        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        return {
            blob: blob,
            downloadUrl: this.createDownloadUrl(blob, 'simulacion_invertax.json')
        };
    }

    // Exportar a Excel (CSV)
    exportToExcel(data) {
        let csvContent = 'INVERTAX - Simulación Fiscal\n\n';
        
        if (data.result) {
            csvContent += 'RESUMEN EJECUTIVO\n';
            csvContent += `Inversión Total,€${data.result.totalInvestment?.toLocaleString() || 'N/A'}\n`;
            csvContent += `Deducción Total,€${data.result.totalDeduction?.toLocaleString() || 'N/A'}\n`;
            csvContent += `Rentabilidad Fiscal,${data.result.effectiveFiscalReturn?.toFixed(2) || 'N/A'}%\n\n`;
            
            if (data.result.distributions && data.result.distributions.length > 0) {
                csvContent += 'DISTRIBUCIÓN DE INVERSIÓN\n';
                csvContent += 'Proyecto,Inversión,Deducción,Eficiencia\n';
                
                data.result.distributions.forEach(dist => {
                    csvContent += `"${dist.project}",€${dist.investment?.toLocaleString() || 'N/A'},€${dist.deduction?.toLocaleString() || 'N/A'},${(dist.efficiency * 100)?.toFixed(2) || 'N/A'}%\n`;
                });
            }
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        return {
            blob: blob,
            downloadUrl: this.createDownloadUrl(blob, 'simulacion_invertax.csv')
        };
    }

    // Generar hash SHA-256
    async generateDocumentHash(content) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(content.toString());
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.warn('Error generando hash:', error);
            return 'hash_' + Date.now();
        }
    }

    // Crear URL de descarga
    createDownloadUrl(blob, filename) {
        const url = URL.createObjectURL(blob);
        
        // Programar limpieza de URL
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 60000); // 1 minuto
        
        return { url, filename };
    }

    // Generar ID de documento
    generateDocumentId() {
        return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obtener historial de documentos
    getDocumentHistory() {
        return Array.from(this.documents.values()).map(doc => doc.metadata);
    }

    // Obtener documento por ID
    getDocument(documentId) {
        return this.documents.get(documentId);
    }

    // Limpiar documentos antiguos
    cleanupOldDocuments(maxAge = 24 * 60 * 60 * 1000) { // 24 horas
        const now = Date.now();
        
        for (const [id, doc] of this.documents.entries()) {
            const docAge = now - new Date(doc.metadata.createdAt).getTime();
            if (docAge > maxAge) {
                this.documents.delete(id);
            }
        }
    }
}

// Gestor de notificaciones mejorado
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.container = null;
        this.init();
    }

    // Inicializar contenedor de notificaciones
    init() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    // Mostrar notificación
    show(message, type = 'info', duration = this.defaultDuration, actions = []) {
        const notification = {
            id: this.generateId(),
            message,
            type,
            duration,
            actions,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.renderNotification(notification);

        // Auto-remover si tiene duración
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification.id);
            }, duration);
        }

        // Limpiar notificaciones antiguas
        this.cleanup();

        return notification.id;
    }

    // Renderizar notificación
    renderNotification(notification) {
        const element = document.createElement('div');
        element.className = `notification notification--${notification.type}`;
        element.dataset.id = notification.id;
        element.style.cssText = `
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-4);
            margin-bottom: var(--space-2);
            box-shadow: var(--shadow-lg);
            pointer-events: auto;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            position: relative;
        `;

        // Icono según tipo
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };

        // Colores según tipo
        const colors = {
            success: 'var(--color-success)',
            warning: 'var(--color-warning)',
            error: 'var(--color-error)',
            info: 'var(--color-info)'
        };

        element.style.borderLeftColor = colors[notification.type];
        element.style.borderLeftWidth = '4px';

        let html = `
            <div style="display: flex; align-items: flex-start; gap: var(--space-3);">
                <span style="font-size: var(--font-size-lg); flex-shrink: 0;">${icons[notification.type]}</span>
                <div style="flex: 1;">
                    <div style="color: var(--color-text); font-weight: var(--font-weight-medium); margin-bottom: var(--space-1);">
                        ${notification.message}
                    </div>
        `;

        // Añadir acciones si existen
        if (notification.actions && notification.actions.length > 0) {
            html += '<div style="display: flex; gap: var(--space-2); margin-top: var(--space-2);">';
            notification.actions.forEach(action => {
                html += `<button class="btn btn--sm btn--outline" onclick="window.notificationManager.handleAction('${notification.id}', '${action.id}')">${action.label}</button>`;
            });
            html += '</div>';
        }

        html += `
                </div>
                <button onclick="window.notificationManager.remove('${notification.id}')" style="
                    background: none;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    padding: var(--space-1);
                    font-size: var(--font-size-lg);
                    line-height: 1;
                ">×</button>
            </div>
        `;

        element.innerHTML = html;
        this.container.appendChild(element);

        // Añadir animación CSS si no existe
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Remover notificación
    remove(id) {
        const element = this.container.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    // Manejar acciones de notificación
    handleAction(notificationId, actionId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            const action = notification.actions.find(a => a.id === actionId);
            if (action && action.handler) {
                action.handler();
            }
        }
        this.remove(notificationId);
    }

    // Limpiar notificaciones antiguas
    cleanup() {
        if (this.notifications.length > this.maxNotifications) {
            const toRemove = this.notifications.slice(0, this.notifications.length - this.maxNotifications);
            toRemove.forEach(notification => {
                this.remove(notification.id);
            });
        }
    }

    // Generar ID único
    generateId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Métodos de conveniencia
    success(message, duration, actions) {
        return this.show(message, 'success', duration, actions);
    }

    warning(message, duration, actions) {
        return this.show(message, 'warning', duration, actions);
    }

    error(message, duration, actions) {
        return this.show(message, 'error', duration, actions);
    }

    info(message, duration, actions) {
        return this.show(message, 'info', duration, actions);
    }
}

// Gestor de almacenamiento offline mejorado
class OfflineStorageManager {
    constructor() {
        this.dbName = 'InvertaxDB';
        this.dbVersion = 3;
        this.db = null;
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.init();
    }

    // Inicializar base de datos IndexedDB
    async init() {
        try {
            this.db = await this.openDatabase();
            this.setupOnlineListeners();
            await this.processSyncQueue();
        } catch (error) {
            console.error('Error inicializando almacenamiento offline:', error);
        }
    }

    // Abrir base de datos
    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Store para simulaciones
                if (!db.objectStoreNames.contains('simulations')) {
                    const simulationsStore = db.createObjectStore('simulations', { keyPath: 'id' });
                    simulationsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    simulationsStore.createIndex('synced', 'synced', { unique: false });
                }

                // Store para documentos
                if (!db.objectStoreNames.contains('documents')) {
                    const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
                    documentsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    documentsStore.createIndex('type', 'type', { unique: false });
                }

                // Store para configuración
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                // Store para analytics
                if (!db.objectStoreNames.contains('analytics')) {
                    const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' });
                    analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    analyticsStore.createIndex('synced', 'synced', { unique: false });
                }
            };
        });
    }

    // Guardar simulación
    async saveSimulation(simulationData) {
        try {
            const data = {
                id: simulationData.calculationId || this.generateId(),
                timestamp: Date.now(),
                data: simulationData,
                synced: this.isOnline,
                version: CONFIG.version
            };

            const transaction = this.db.transaction(['simulations'], 'readwrite');
            const store = transaction.objectStore('simulations');
            await store.put(data);

            // Añadir a cola de sincronización si está offline
            if (!this.isOnline) {
                this.syncQueue.push({
                    type: 'simulation',
                    action: 'create',
                    data: data
                });
            }

            return data.id;
        } catch (error) {
            console.error('Error guardando simulación:', error);
            throw error;
        }
    }

    // Obtener simulaciones
    async getSimulations(limit = 10) {
        try {
            const transaction = this.db.transaction(['simulations'], 'readonly');
            const store = transaction.objectStore('simulations');
            const index = store.index('timestamp');
            
            const request = index.openCursor(null, 'prev');
            const results = [];
            
            return new Promise((resolve, reject) => {
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor && results.length < limit) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error obteniendo simulaciones:', error);
            return [];
        }
    }

    // Guardar documento
    async saveDocument(documentData) {
        try {
            const data = {
                id: documentData.documentId || this.generateId(),
                timestamp: Date.now(),
                data: documentData,
                type: documentData.metadata?.type || 'unknown',
                version: CONFIG.version
            };

            const transaction = this.db.transaction(['documents'], 'readwrite');
            const store = transaction.objectStore('documents');
            await store.put(data);

            return data.id;
        } catch (error) {
            console.error('Error guardando documento:', error);
            throw error;
        }
    }

    // Obtener documentos
    async getDocuments(type = null, limit = 20) {
        try {
            const transaction = this.db.transaction(['documents'], 'readonly');
            const store = transaction.objectStore('documents');
            
            let request;
            if (type) {
                const index = store.index('type');
                request = index.openCursor(IDBKeyRange.only(type), 'prev');
            } else {
                const index = store.index('timestamp');
                request = index.openCursor(null, 'prev');
            }
            
            const results = [];
            
            return new Promise((resolve, reject) => {
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor && results.length < limit) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error obteniendo documentos:', error);
            return [];
        }
    }

    // Guardar configuración
    async saveSetting(key, value) {
        try {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            await store.put({ key, value, timestamp: Date.now() });
        } catch (error) {
            console.error('Error guardando configuración:', error);
        }
    }

    // Obtener configuración
    async getSetting(key, defaultValue = null) {
        try {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const result = await store.get(key);
            return result ? result.value : defaultValue;
        } catch (error) {
            console.error('Error obteniendo configuración:', error);
            return defaultValue;
        }
    }

    // Configurar listeners de conectividad
    setupOnlineListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processSyncQueue();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Procesar cola de sincronización
    async processSyncQueue() {
        if (!this.isOnline || this.syncQueue.length === 0) return;

        const itemsToSync = [...this.syncQueue];
        this.syncQueue = [];

        for (const item of itemsToSync) {
            try {
                await this.syncItem(item);
            } catch (error) {
                console.error('Error sincronizando item:', error);
                // Volver a añadir a la cola si falla
                this.syncQueue.push(item);
            }
        }
    }

    // Sincronizar item individual
    async syncItem(item) {
        // En una implementación real, aquí se enviarían los datos al servidor
        console.log('Sincronizando item:', item.type, item.action);
        
        // Simular sincronización exitosa
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Marcar como sincronizado en la base de datos local
        if (item.type === 'simulation') {
            const transaction = this.db.transaction(['simulations'], 'readwrite');
            const store = transaction.objectStore('simulations');
            const data = await store.get(item.data.id);
            if (data) {
                data.synced = true;
                data.syncedAt = Date.now();
                await store.put(data);
            }
        }
    }

    // Limpiar datos antiguos
    async cleanup(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 días
        try {
            const cutoffTime = Date.now() - maxAge;
            
            // Limpiar simulaciones antiguas
            const simTransaction = this.db.transaction(['simulations'], 'readwrite');
            const simStore = simTransaction.objectStore('simulations');
            const simIndex = simStore.index('timestamp');
            const simRequest = simIndex.openCursor(IDBKeyRange.upperBound(cutoffTime));
            
            simRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                }
            };

            // Limpiar documentos antiguos
            const docTransaction = this.db.transaction(['documents'], 'readwrite');
            const docStore = docTransaction.objectStore('documents');
            const docIndex = docStore.index('timestamp');
            const docRequest = docIndex.openCursor(IDBKeyRange.upperBound(cutoffTime));
            
            docRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                }
            };

        } catch (error) {
            console.error('Error en limpieza de datos:', error);
        }
    }

    // Obtener estadísticas de almacenamiento
    async getStorageStats() {
        try {
            const stats = {
                simulations: 0,
                documents: 0,
                settings: 0,
                analytics: 0,
                totalSize: 0
            };

            // Contar simulaciones
            const simTransaction = this.db.transaction(['simulations'], 'readonly');
            const simStore = simTransaction.objectStore('simulations');
            stats.simulations = await simStore.count();

            // Contar documentos
            const docTransaction = this.db.transaction(['documents'], 'readonly');
            const docStore = docTransaction.objectStore('documents');
            stats.documents = await docStore.count();

            // Contar configuraciones
            const setTransaction = this.db.transaction(['settings'], 'readonly');
            const setStore = setTransaction.objectStore('settings');
            stats.settings = await setStore.count();

            // Estimar tamaño total (aproximado)
            if ('estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                stats.totalSize = estimate.usage || 0;
                stats.quota = estimate.quota || 0;
            }

            return stats;
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return null;
        }
    }

    // Generar ID único
    generateId() {
        return 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Gestor de analytics mejorado
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.batchSize = CONFIG.analytics.batchSize;
        this.flushInterval = CONFIG.analytics.flushInterval;
        this.isEnabled = CONFIG.analytics.enabled;
        
        if (this.isEnabled) {
            this.init();
        }
    }

    // Inicializar analytics
    init() {
        // Configurar flush automático
        setInterval(() => {
            this.flush();
        }, this.flushInterval);

        // Flush al cerrar la página
        window.addEventListener('beforeunload', () => {
            this.flush(true);
        });

        // Eventos automáticos
        this.trackPageView();
        this.setupAutoTracking();
    }

    // Rastrear evento
    track(eventName, properties = {}) {
        if (!this.isEnabled) return;

        const event = {
            id: this.generateEventId(),
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                userId: this.userId,
                url: window.location.href,
                userAgent: navigator.userAgent,
                version: CONFIG.version
            }
        };

        this.events.push(event);

        // Flush si alcanzamos el tamaño de lote
        if (this.events.length >= this.batchSize) {
            this.flush();
        }
    }

    // Rastrear vista de página
    trackPageView() {
        this.track('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
    }

    // Rastrear simulación
    trackSimulation(params, result) {
        this.track('simulation_completed', {
            investment: params.totalInvestment,
            ccaa: params.ccaaCode,
            fiscal_return: result.effectiveFiscalReturn,
            optimization_score: result.optimizationScore,
            calculation_time: result.calculationTime,
            distributions_count: result.distributions.length
        });
    }

    // Rastrear exportación de documento
    trackDocumentExport(type, format) {
        this.track('document_exported', {
            document_type: type,
            format: format
        });
    }

    // Rastrear error
    trackError(error, context = {}) {
        this.track('error_occurred', {
            error_message: error.message,
            error_stack: error.stack,
            context: context
        });
    }

    // Configurar rastreo automático
    setupAutoTracking() {
        // Rastrear clics en botones
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button, .btn');
            if (button) {
                this.track('button_clicked', {
                    button_text: button.textContent?.trim(),
                    button_class: button.className,
                    button_id: button.id
                });
            }
        });

        // Rastrear envío de formularios
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.tagName === 'FORM') {
                this.track('form_submitted', {
                    form_id: form.id,
                    form_class: form.className
                });
            }
        });

        // Rastrear tiempo en página
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            this.track('time_on_page', {
                duration: timeOnPage,
                page: window.location.pathname
            });
        });
    }

    // Enviar eventos al servidor
    async flush(sync = false) {
        if (this.events.length === 0) return;

        const eventsToSend = [...this.events];
        this.events = [];

        try {
            const payload = {
                events: eventsToSend,
                session: {
                    id: this.sessionId,
                    userId: this.userId,
                    timestamp: Date.now()
                }
            };

            if (sync) {
                // Usar sendBeacon para envío síncrono
                navigator.sendBeacon('/api/analytics', JSON.stringify(payload));
            } else {
                // Envío asíncrono normal
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            }

        } catch (error) {
            console.warn('Error enviando analytics:', error);
            
            // Volver a añadir eventos a la cola si falla
            this.events.unshift(...eventsToSend);
            
            // Guardar en almacenamiento offline si está disponible
            if (window.offlineStorage) {
                eventsToSend.forEach(event => {
                    window.offlineStorage.saveAnalyticsEvent(event);
                });
            }
        }
    }

    // Generar ID de sesión
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obtener ID de usuario
    getUserId() {
        let userId = localStorage.getItem('invertax_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('invertax_user_id', userId);
        }
        return userId;
    }

    // Generar ID de evento
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Habilitar/deshabilitar analytics
    setEnabled(enabled) {
        this.isEnabled = enabled;
        localStorage.setItem('invertax_analytics_enabled', enabled.toString());
    }

    // Obtener estadísticas de la sesión
    getSessionStats() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            eventsQueued: this.events.length,
            sessionDuration: Date.now() - parseInt(this.sessionId.split('_')[1])
        };
    }
}

// Instancias globales
let fiscalCalculator;
let monteCarloSimulator;
let documentManager;
let notificationManager;
let offlineStorage;
let analyticsManager;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('🚀 Iniciando INVERTAX v3.0...');

        // Inicializar componentes principales
        fiscalCalculator = new AdvancedFiscalCalculator();
        monteCarloSimulator = new MonteCarloSimulator();
        documentManager = new DocumentManager();
        notificationManager = new NotificationManager();
        offlineStorage = new OfflineStorageManager();
        analyticsManager = new AnalyticsManager();

        // Hacer disponibles globalmente
        window.fiscalCalculator = fiscalCalculator;
        window.monteCarloSimulator = monteCarloSimulator;
        window.documentManager = documentManager;
        window.notificationManager = notificationManager;
        window.offlineStorage = offlineStorage;
        window.analyticsManager = analyticsManager;

        // Inicializar interfaz
        await initializeInterface();
        
        // Configurar PWA
        await initializePWA();
        
        // Configurar capacidades offline
        await initializeOfflineCapabilities();

        // Mostrar notificación de bienvenida
        notificationManager.success('INVERTAX v3.0 cargado correctamente', 3000);

        console.log('✅ INVERTAX v3.0 inicializado correctamente');

    } catch (error) {
        console.error('❌ Error inicializando INVERTAX:', error);
        
        // Mostrar error al usuario
        if (window.notificationManager) {
            notificationManager.error('Error inicializando la aplicación. Por favor, recarga la página.', 0);
        }
    }
});

// Inicializar interfaz de usuario
async function initializeInterface() {
    // Poblar selector de CCAA
    populateCCAASelector();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar navegación
    setupNavigation();
    
    // Cargar configuración guardada
    await loadSavedSettings();
    
    // Configurar tooltips y ayuda
    setupTooltips();
    
    // Configurar validación de formularios
    setupFormValidation();
}

// Poblar selector de CCAA
function populateCCAASelector() {
    const selector = document.getElementById('ccaa');
    if (!selector) return;

    // Limpiar opciones existentes (excepto la primera)
    while (selector.children.length > 1) {
        selector.removeChild(selector.lastChild);
    }

    // Añadir opciones de CCAA
    Object.entries(CCAA_DATA).forEach(([code, data]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${data.name} (${(data.percentage * 100).toFixed(0)}% - ${data.compatible ? 'Compatible' : 'No compatible'})`;
        selector.appendChild(option);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de cálculo principal
    const calculateBtn = document.querySelector('[onclick="calculateAdvanced()"]');
    if (calculateBtn) {
        calculateBtn.removeAttribute('onclick');
        calculateBtn.addEventListener('click', handleCalculation);
    }

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }

    // Cambios en inputs para validación en tiempo real
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
        input.addEventListener('blur', handleInputBlur);
    });

    // Selector de CCAA para mostrar información
    const ccaaSelector = document.getElementById('ccaa');
    if (ccaaSelector) {
        ccaaSelector.addEventListener('change', handleCCAAChange);
    }
}

// Manejar cálculo principal
async function handleCalculation(event) {
    event.preventDefault();
    
    try {
        // Mostrar loading
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '🔄 Calculando...';
        button.disabled = true;

        // Obtener parámetros del formulario
        const params = getFormParameters();
        
        // Validar parámetros
        if (!validateParameters(params)) {
            return;
        }

        // Realizar cálculo
        const result = fiscalCalculator.calculateOptimalDistribution(params);
        
        // Mostrar resultados
        displayResults(result);
        
        // Guardar en almacenamiento offline
        await offlineStorage.saveSimulation(result);
        
        // Rastrear evento
        analyticsManager.trackSimulation(params, result);
        
        // Mostrar notificación de éxito
        notificationManager.success('Cálculo completado exitosamente', 3000);

    } catch (error) {
        console.error('Error en cálculo:', error);
        notificationManager.error(`Error en el cálculo: ${error.message}`, 5000);
        analyticsManager.trackError(error, { context: 'calculation' });
    } finally {
        // Restaurar botón
        const button = event.target;
        button.textContent = '🎯 Optimizar mi Inversión';
        button.disabled = false;
    }
}

// Obtener parámetros del formulario
function getFormParameters() {
    return {
        totalInvestment: parseFloat(document.getElementById('investment')?.value) || 0,
        ccaaCode: document.getElementById('ccaa')?.value || '',
        stateQuota: parseFloat(document.getElementById('stateQuota')?.value) || 0,
        regionalQuota: parseFloat(document.getElementById('regionalQuota')?.value) || 0,
        projectProfile: document.getElementById('projectProfile')?.value || '',
        investmentHorizon: 3, // Por defecto 3 años
        riskTolerance: 'medium' // Por defecto medio
    };
}

// Validar parámetros
function validateParameters(params) {
    const errors = [];

    if (!params.totalInvestment || params.totalInvestment < 1000) {
        errors.push('La inversión mínima es €1.000');
    }

    if (!params.ccaaCode) {
        errors.push('Debe seleccionar una Comunidad Autónoma');
    }

    if (params.stateQuota < 0) {
        errors.push('La cuota estatal no puede ser negativa');
    }

    if (params.regionalQuota < 0) {
        errors.push('La cuota autonómica no puede ser negativa');
    }

    if (errors.length > 0) {
        notificationManager.warning(errors.join('; '), 5000);
        return false;
    }

    return true;
}

// Mostrar resultados
function displayResults(result) {
    const resultsContainer = document.getElementById('simulatorResults');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = generateResultsHTML(result);
    resultsContainer.style.display = 'block';
    
    // Scroll suave a los resultados
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Configurar event listeners para los resultados
    setupResultsEventListeners(result);
}

// Generar HTML de resultados
function generateResultsHTML(result) {
    return `
        <div class="results-container">
            <div class="results-main">
                <div class="results-header">
                    <h3>📊 Resultados de Optimización Fiscal</h3>
                    <div class="results-badges">
                        <span class="badge badge--success">Cálculo ID: ${result.calculationId}</span>
                        <span class="badge badge--info">Score: ${result.optimizationScore}/100</span>
                        <span class="badge badge--info">Confianza: ${(result.confidenceLevel * 100).toFixed(0)}%</span>
                    </div>
                </div>

                <div class="results-summary">
                    <div class="result-main-kpi">
                        <div class="kpi-card">
                            <div class="kpi-label">Inversión Total</div>
                            <div class="kpi-value">€${result.totalInvestment.toLocaleString()}</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Deducción Total</div>
                            <div class="kpi-value">€${result.totalDeduction.toLocaleString()}</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Rentabilidad Fiscal</div>
                            <div class="kpi-value">${result.effectiveFiscalReturn.toFixed(2)}%</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Capital Utilizado</div>
                            <div class="kpi-value">€${result.totalUsedInvestment.toLocaleString()}</div>
                            ${result.unoptimizedCapital > 0 ? `<div class="kpi-change warning">€${result.unoptimizedCapital.toLocaleString()} sin optimizar</div>` : ''}
                        </div>
                    </div>
                </div>

                ${generateDistributionHTML(result)}
                ${generateMetricsHTML(result)}
                ${generateRiskAnalysisHTML(result)}
                ${generateRecommendationsHTML(result)}
                ${generateActionsHTML(result)}
            </div>
        </div>
    `;
}

// Generar HTML de distribución
function generateDistributionHTML(result) {
    if (!result.distributions || result.distributions.length === 0) {
        return '<div class="alert alert--warning">No se encontró distribución óptima con los parámetros proporcionados.</div>';
    }

    let html = `
        <div class="distribution-section">
            <h4>📈 Distribución Óptima de Inversión</h4>
            <div class="distribution-chart">
    `;

    result.distributions.forEach(dist => {
        const percentage = (dist.investment / result.totalInvestment) * 100;
        html += `
            <div class="distribution-item">
                <div class="distribution-header">
                    <h5>${dist.project}</h5>
                    <span class="distribution-amount">€${dist.investment.toLocaleString()}</span>
                </div>
                <div class="distribution-bar">
                    <div class="distribution-fill ${dist.type}" style="width: ${percentage}%"></div>
                </div>
                <div class="distribution-details">
                    <span>Deducción: €${dist.deduction.toLocaleString()}</span>
                    <span>Eficiencia: ${(dist.efficiency * 100).toFixed(1)}%</span>
                    <span>Tipo: ${dist.type}</span>
                </div>
                <p class="distribution-description">${dist.description}</p>
            </div>
        `;
    });

    if (result.unoptimizedCapital > 0) {
        const percentage = (result.unoptimizedCapital / result.totalInvestment) * 100;
        html += `
            <div class="distribution-item warning">
                <div class="distribution-header">
                    <h5>⚠️ Capital No Optimizado</h5>
                    <span class="distribution-amount">€${result.unoptimizedCapital.toLocaleString()}</span>
                </div>
                <div class="distribution-bar">
                    <div class="distribution-fill unoptimized" style="width: ${percentage}%"></div>
                </div>
                <p class="distribution-description">Este capital no genera deducciones fiscales con la configuración actual.</p>
            </div>
        `;
    }

    html += '</div></div>';
    return html;
}

// Generar HTML de métricas
function generateMetricsHTML(result) {
    return `
        <div class="metrics-section">
            <h4>📊 Métricas Financieras Avanzadas</h4>
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-label">VPN</div>
                    <div class="metric-value ${result.netPresentValue > 0 ? 'positive' : 'negative'}">
                        €${result.netPresentValue.toLocaleString()}
                    </div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">TIR</div>
                    <div class="metric-value ${result.internalRateOfReturn > 0 ? 'positive' : 'negative'}">
                        ${result.internalRateOfReturn.toFixed(2)}%
                    </div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Payback</div>
                    <div class="metric-value neutral">
                        ${result.paybackPeriod.toFixed(1)} años
                    </div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Retorno Ajustado</div>
                    <div class="metric-value ${result.riskAdjustedReturn > 0 ? 'positive' : 'negative'}">
                        ${result.riskAdjustedReturn.toFixed(2)}%
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generar HTML de análisis de riesgo
function generateRiskAnalysisHTML(result) {
    const riskMetrics = result.riskMetrics;
    let riskLevel = 'medium';
    let riskColor = 'medium';
    
    if (riskMetrics.overallRiskScore < 40) {
        riskLevel = 'Bajo';
        riskColor = 'low';
    } else if (riskMetrics.overallRiskScore > 70) {
        riskLevel = 'Alto';
        riskColor = 'high';
    } else {
        riskLevel = 'Medio';
        riskColor = 'medium';
    }

    return `
        <div class="risk-section">
            <h4>⚠️ Análisis de Riesgo</h4>
            <div class="risk-summary">
                <div class="risk-score">
                    <div class="risk-score-circle ${riskColor}">
                        <div class="risk-score-value">${riskMetrics.overallRiskScore}</div>
                        <div class="risk-score-label">RIESGO</div>
                    </div>
                </div>
                <div class="risk-score-info">
                    <h5>Nivel de Riesgo: ${riskLevel}</h5>
                    <div class="risk-metrics">
                        <div class="risk-metric">
                            <span class="risk-metric-label">VaR 95%:</span>
                            <span class="risk-metric-value">€${riskMetrics.var95.toLocaleString()}</span>
                        </div>
                        <div class="risk-metric">
                            <span class="risk-metric-label">Riesgo Regulatorio:</span>
                            <span class="risk-metric-value">${(riskMetrics.regulatoryRisk * 100).toFixed(0)}%</span>
                        </div>
                        <div class="risk-metric">
                            <span class="risk-metric-label">Diversificación:</span>
                            <span class="risk-metric-value">${(riskMetrics.diversificationScore * 100).toFixed(0)}%</span>
                        </div>
                        <div class="risk-metric">
                            <span class="risk-metric-label">Liquidez:</span>
                            <span class="risk-metric-value">${(riskMetrics.liquidityRisk * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generar HTML de recomendaciones
function generateRecommendationsHTML(result) {
    if (!result.recommendations || result.recommendations.length === 0) {
        return '';
    }

    let html = `
        <div class="recommendations-section">
            <h4>💡 Recomendaciones Personalizadas</h4>
            <div class="recommendations-list">
    `;

    result.recommendations.forEach(rec => {
        const iconMap = {
            success: '✅',
            warning: '⚠️',
            info: 'ℹ️',
            error: '❌'
        };

        html += `
            <div class="recommendation-item ${rec.type}">
                <div class="recommendation-header">
                    <span class="recommendation-icon">${iconMap[rec.type]}</span>
                    <h5>${rec.title}</h5>
                    <span class="recommendation-priority priority-${rec.priority}">${rec.priority}</span>
                </div>
                <p class="recommendation-message">${rec.message}</p>
                ${rec.actions ? `
                    <div class="recommendation-actions">
                        <strong>Acciones recomendadas:</strong>
                        <ul>
                            ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}

// Generar HTML de acciones
function generateActionsHTML(result) {
    return `
        <div class="results-actions">
            <button class="btn btn--primary" onclick="exportToPDF('${result.calculationId}')">
                📄 Exportar PDF
            </button>
            <button class="btn btn--secondary" onclick="exportToJSON('${result.calculationId}')">
                📊 Exportar JSON
            </button>
            <button class="btn btn--secondary" onclick="exportToExcel('${result.calculationId}')">
                📈 Exportar Excel
            </button>
            <button class="btn btn--outline" onclick="runMonteCarloAnalysis('${result.calculationId}')">
                🎲 Análisis Monte Carlo
            </button>
            <button class="btn btn--outline" onclick="compareWithOtherCCAA('${result.calculationId}')">
                🗺️ Comparar CCAA
            </button>
        </div>
    `;
}

// Configurar event listeners para resultados
function setupResultsEventListeners(result) {
    // Los event listeners se configuran mediante onclick en el HTML
    // En una implementación más robusta, se usarían addEventListener
}

// Exportar a PDF
async function exportToPDF(calculationId) {
    try {
        const calculation = fiscalCalculator.calculationHistory.find(c => c.id === calculationId);
        if (!calculation) {
            throw new Error('Cálculo no encontrado');
        }

        const document = await documentManager.generatePDF(calculation, 'simulation_report');
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = document.downloadUrl.url;
        link.download = document.downloadUrl.filename;
        link.click();

        // Rastrear exportación
        analyticsManager.trackDocumentExport('simulation_report', 'pdf');
        
        notificationManager.success('PDF generado exitosamente', 3000);

    } catch (error) {
        console.error('Error exportando PDF:', error);
        notificationManager.error(`Error generando PDF: ${error.message}`, 5000);
    }
}

// Exportar a JSON
async function exportToJSON(calculationId) {
    try {
        const calculation = fiscalCalculator.calculationHistory.find(c => c.id === calculationId);
        if (!calculation) {
            throw new Error('Cálculo no encontrado');
        }

        const exportData = documentManager.exportToJSON(calculation);
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = exportData.downloadUrl.url;
        link.download = exportData.downloadUrl.filename;
        link.click();

        // Rastrear exportación
        analyticsManager.trackDocumentExport('simulation_data', 'json');
        
        notificationManager.success('JSON generado exitosamente', 3000);

    } catch (error) {
        console.error('Error exportando JSON:', error);
        notificationManager.error(`Error generando JSON: ${error.message}`, 5000);
    }
}

// Exportar a Excel
async function exportToExcel(calculationId) {
    try {
        const calculation = fiscalCalculator.calculationHistory.find(c => c.id === calculationId);
        if (!calculation) {
            throw new Error('Cálculo no encontrado');
        }

        const exportData = documentManager.exportToExcel(calculation);
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = exportData.downloadUrl.url;
        link.download = exportData.downloadUrl.filename;
        link.click();

        // Rastrear exportación
        analyticsManager.trackDocumentExport('simulation_data', 'excel');
        
        notificationManager.success('Excel generado exitosamente', 3000);

    } catch (error) {
        console.error('Error exportando Excel:', error);
        notificationManager.error(`Error generando Excel: ${error.message}`, 5000);
    }
}

// Ejecutar análisis Monte Carlo
async function runMonteCarloAnalysis(calculationId) {
    try {
        const calculation = fiscalCalculator.calculationHistory.find(c => c.id === calculationId);
        if (!calculation) {
            throw new Error('Cálculo no encontrado');
        }

        // Mostrar loading
        notificationManager.info('Ejecutando simulación Monte Carlo...', 0);

        const params = {
            investment: calculation.result.totalUsedInvestment,
            expectedReturn: 0.25, // 25% anual esperado
            volatility: 0.35, // 35% volatilidad
            years: 3,
            iterations: 5000,
            fiscalBenefit: calculation.result.totalDeduction
        };

        const monteCarloResult = await monteCarloSimulator.runSimulation(params);
        
        // Mostrar resultados en modal o nueva sección
        displayMonteCarloResults(monteCarloResult);
        
        notificationManager.success('Análisis Monte Carlo completado', 3000);

    } catch (error) {
        console.error('Error en análisis Monte Carlo:', error);
        notificationManager.error(`Error en análisis Monte Carlo: ${error.message}`, 5000);
    }
}

// Mostrar resultados Monte Carlo
function displayMonteCarloResults(result) {
    // Crear modal o sección para mostrar resultados
    const modal = document.createElement('div');
    modal.className = 'monte-carlo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎲 Análisis Monte Carlo</h3>
                <button class="modal-close" onclick="this.closest('.monte-carlo-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="scenario-analysis">
                    <h4>Análisis de Escenarios</h4>
                    <div class="scenarios-grid">
                        <div class="scenario-item">
                            <div class="scenario-label">Pesimista (P5)</div>
                            <div class="scenario-value">€${result.scenarioAnalysis.bearish.value.toLocaleString()}</div>
                        </div>
                        <div class="scenario-item">
                            <div class="scenario-label">Conservador (P25)</div>
                            <div class="scenario-value">€${result.scenarioAnalysis.conservative.value.toLocaleString()}</div>
                        </div>
                        <div class="scenario-item">
                            <div class="scenario-label">Esperado (P50)</div>
                            <div class="scenario-value">€${result.scenarioAnalysis.expected.value.toLocaleString()}</div>
                        </div>
                        <div class="scenario-item">
                            <div class="scenario-label">Optimista (P75)</div>
                            <div class="scenario-value">€${result.scenarioAnalysis.optimistic.value.toLocaleString()}</div>
                        </div>
                        <div class="scenario-item">
                            <div class="scenario-label">Muy Optimista (P95)</div>
                            <div class="scenario-value">€${result.scenarioAnalysis.bullish.value.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                
                <div class="risk-metrics">
                    <h4>Métricas de Riesgo</h4>
                    <div class="metrics-grid">
                        <div class="metric-item">
                            <div class="metric-label">ROI Ajustado</div>
                            <div class="metric-value">${result.metrics.adjustedROI.toFixed(2)}%</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Probabilidad de Pérdida</div>
                            <div class="metric-value">${result.metrics.probabilityOfLoss.toFixed(1)}%</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">VaR 95%</div>
                            <div class="metric-value">€${result.metrics.var95.toLocaleString()}</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Ratio Sharpe</div>
                            <div class="metric-value">${result.metrics.sharpeRatio.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Comparar con otras CCAA
async function compareWithOtherCCAA(calculationId) {
    try {
        const calculation = fiscalCalculator.calculationHistory.find(c => c.id === calculationId);
        if (!calculation) {
            throw new Error('Cálculo no encontrado');
        }

        const params = calculation.params;
        const comparisons = fiscalCalculator.compareRegions(
            params.totalInvestment,
            params.stateQuota,
            params.regionalQuota
        );

        displayCCAAComparison(comparisons, params.ccaaCode);

    } catch (error) {
        console.error('Error comparando CCAA:', error);
        notificationManager.error(`Error en comparación: ${error.message}`, 5000);
    }
}

// Mostrar comparación de CCAA
function displayCCAAComparison(comparisons, currentCCAA) {
    const modal = document.createElement('div');
    modal.className = 'ccaa-comparison-modal';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>🗺️ Comparación entre Comunidades Autónomas</h3>
                <button class="modal-close" onclick="this.closest('.ccaa-comparison-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="comparison-table-container">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Ranking</th>
                                <th>CCAA</th>
                                <th>Deducción Total</th>
                                <th>Rentabilidad Fiscal</th>
                                <th>Score Optimización</th>
                                <th>Compatible</th>
                                <th>Riesgo</th>
                                <th>Tiempo Procesamiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${comparisons.map((comp, index) => `
                                <tr class="${comp.ccaa === currentCCAA ? 'current-ccaa' : ''}">
                                    <td class="ranking">
                                        <span class="rank-badge ${index < 3 ? 'rank-top' : 'rank-normal'}">${index + 1}</span>
                                        ${comp.ccaa === currentCCAA ? '<span class="current-badge">Actual</span>' : ''}
                                    </td>
                                    <td><strong>${comp.name}</strong></td>
                                    <td>€${comp.totalDeduction.toLocaleString()}</td>
                                    <td>${comp.effectiveFiscalReturn.toFixed(2)}%</td>
                                    <td>
                                        <div class="score-bar">
                                            <div class="score-fill" style="width: ${comp.optimizationScore}%"></div>
                                            <span class="score-text">${comp.optimizationScore}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="compatibility-badge ${comp.compatible ? 'compatible' : 'incompatible'}">
                                            ${comp.compatible ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="risk-badge risk-${comp.riskScore < 40 ? 'bajo' : comp.riskScore > 70 ? 'alto' : 'medio'}">
                                            ${comp.riskScore < 40 ? 'Bajo' : comp.riskScore > 70 ? 'Alto' : 'Medio'}
                                        </span>
                                    </td>
                                    <td>${comp.processingTime}</td>
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
                            <p>${comparisons[0].name} ofrece la mayor deducción total con €${comparisons[0].totalDeduction.toLocaleString()}</p>
                        </div>
                        <div class="insight-card">
                            <h6>Mayor Rentabilidad</h6>
                            <p>${comparisons.sort((a, b) => b.effectiveFiscalReturn - a.effectiveFiscalReturn)[0].name} tiene la mayor rentabilidad fiscal (${comparisons.sort((a, b) => b.effectiveFiscalReturn - a.effectiveFiscalReturn)[0].effectiveFiscalReturn.toFixed(2)}%)</p>
                        </div>
                        <div class="insight-card">
                            <h6>Menor Riesgo</h6>
                            <p>${comparisons.sort((a, b) => a.riskScore - b.riskScore)[0].name} presenta el menor nivel de riesgo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Manejar cambio de CCAA
function handleCCAAChange(event) {
    const ccaaCode = event.target.value;
    if (!ccaaCode) return;

    const ccaaData = CCAA_DATA[ccaaCode];
    if (!ccaaData) return;

    // Mostrar información de la CCAA seleccionada
    showCCAAInfo(ccaaData);
}

// Mostrar información de CCAA
function showCCAAInfo(ccaaData) {
    // Actualizar información en la interfaz
    const infoContainer = document.querySelector('.ccaa-info');
    if (infoContainer) {
        infoContainer.innerHTML = `
            <div class="ccaa-info-card">
                <h5>${ccaaData.name}</h5>
                <p><strong>Deducción:</strong> ${(ccaaData.percentage * 100).toFixed(0)}%</p>
                <p><strong>Base máxima:</strong> €${ccaaData.maxBase.toLocaleString()}</p>
                <p><strong>Compatible:</strong> ${ccaaData.compatible ? 'Sí' : 'No'}</p>
                <p><strong>Tiempo procesamiento:</strong> ${ccaaData.processingTime}</p>
                <p><strong>Tasa de éxito:</strong> ${(ccaaData.successRate * 100).toFixed(0)}%</p>
            </div>
        `;
    }
}

// Manejar cambios en inputs
function handleInputChange(event) {
    const input = event.target;
    validateInput(input);
}

// Manejar blur en inputs
function handleInputBlur(event) {
    const input = event.target;
    validateInput(input, true);
}

// Validar input individual
function validateInput(input, showErrors = false) {
    const value = input.value;
    const type = input.type;
    const id = input.id;
    
    let isValid = true;
    let errorMessage = '';

    // Validaciones específicas por campo
    switch (id) {
        case 'investment':
            if (value && (parseFloat(value) < 1000 || parseFloat(value) > 500000)) {
                isValid = false;
                errorMessage = 'La inversión debe estar entre €1.000 y €500.000';
            }
            break;
        case 'stateQuota':
            if (value && (parseFloat(value) < 0 || parseFloat(value) > 100000)) {
                isValid = false;
                errorMessage = 'La cuota estatal debe estar entre €0 y €100.000';
            }
            break;
        case 'regionalQuota':
            if (value && (parseFloat(value) < 0 || parseFloat(value) > 50000)) {
                isValid = false;
                errorMessage = 'La cuota autonómica debe estar entre €0 y €50.000';
            }
            break;
    }

    // Aplicar estilos de validación
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('error');
        
        if (showErrors && errorMessage) {
            notificationManager.warning(errorMessage, 3000);
        }
    }

    return isValid;
}

// Configurar navegación
function setupNavigation() {
    // Navegación suave entre secciones
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Menú móvil
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav__menu--open');
            navToggle.classList.toggle('nav__toggle--open');
        });
    }
}

// Cargar configuración guardada
async function loadSavedSettings() {
    try {
        // Cargar configuración desde almacenamiento offline
        const savedCCAA = await offlineStorage.getSetting('default_ccaa');
        if (savedCCAA) {
            const ccaaSelector = document.getElementById('ccaa');
            if (ccaaSelector) {
                ccaaSelector.value = savedCCAA;
                handleCCAAChange({ target: ccaaSelector });
            }
        }

        // Cargar otras configuraciones
        const analyticsEnabled = await offlineStorage.getSetting('analytics_enabled', true);
        analyticsManager.setEnabled(analyticsEnabled);

    } catch (error) {
        console.warn('Error cargando configuración:', error);
    }
}

// Configurar tooltips
function setupTooltips() {
    const helpIcons = document.querySelectorAll('.help-icon');
    helpIcons.forEach(icon => {
        icon.addEventListener('mouseenter', (event) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = event.target.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--color-text);
                color: white;
                padding: var(--space-2) var(--space-3);
                border-radius: var(--radius-base);
                font-size: var(--font-size-sm);
                z-index: 1000;
                max-width: 200px;
                box-shadow: var(--shadow-lg);
            `;
            
            document.body.appendChild(tooltip);
            
            // Posicionar tooltip
            const rect = event.target.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 5) + 'px';
            
            // Remover al salir
            event.target.addEventListener('mouseleave', () => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, { once: true });
        });
    });
}

// Configurar validación de formularios
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            const inputs = form.querySelectorAll('.form-control[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input, true)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                event.preventDefault();
                notificationManager.error('Por favor, corrige los errores en el formulario', 5000);
            }
        });
    });
}

// Manejar envío de formulario de contacto
function handleContactSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simular envío
    notificationManager.info('Enviando consulta...', 2000);
    
    setTimeout(() => {
        notificationManager.success('Consulta enviada correctamente. Te contactaremos pronto.', 5000);
        event.target.reset();
        
        // Rastrear evento
        analyticsManager.track('contact_form_submitted', {
            subject: data.contactSubject
        });
    }, 2000);
}

// Inicializar PWA
async function initializePWA() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('✅ Service Worker registrado:', registration);
            
            // Escuchar actualizaciones
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        notificationManager.info('Nueva versión disponible', 0, [
                            {
                                id: 'update',
                                label: 'Actualizar',
                                handler: () => window.location.reload()
                            }
                        ]);
                    }
                });
            });
            
        } catch (error) {
            console.warn('Error registrando Service Worker:', error);
        }
    }

    // Configurar instalación PWA
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        
        // Mostrar botón de instalación
        showInstallButton(deferredPrompt);
    });

    // Detectar si ya está instalada
    window.addEventListener('appinstalled', () => {
        notificationManager.success('INVERTAX instalado correctamente como aplicación', 5000);
        analyticsManager.track('pwa_installed');
    });
}

// Mostrar botón de instalación
function showInstallButton(deferredPrompt) {
    const installButton = document.createElement('button');
    installButton.className = 'btn btn--primary install-button';
    installButton.innerHTML = '📱 Instalar App';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        box-shadow: var(--shadow-xl);
    `;
    
    installButton.addEventListener('click', async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            analyticsManager.track('pwa_install_accepted');
        } else {
            analyticsManager.track('pwa_install_dismissed');
        }
        
        installButton.remove();
        deferredPrompt = null;
    });
    
    document.body.appendChild(installButton);
    
    // Auto-remover después de 30 segundos
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.remove();
        }
    }, 30000);
}

// Inicializar capacidades offline
async function initializeOfflineCapabilities() {
    // Configurar sincronización en segundo plano
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Registrar sync con tag más corto
            const syncTag = 'data-sync';
            if (syncTag.length <= 128) { // Verificar límite de longitud
                await registration.sync.register(syncTag);
                console.log('✅ Background sync registrado');
            }
        } catch (error) {
            console.warn('Background sync no disponible:', error);
        }
    }

    // Configurar notificaciones push
    if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('✅ Notificaciones habilitadas');
        }
    }

    // Configurar detección de conectividad
    window.addEventListener('online', () => {
        notificationManager.success('Conexión restablecida', 3000);
        analyticsManager.track('connectivity_restored');
    });

    window.addEventListener('offline', () => {
        notificationManager.warning('Sin conexión - Modo offline activado', 5000);
        analyticsManager.track('connectivity_lost');
    });

    // Configurar manejo de errores no capturados
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promise rejection no manejada:', event.reason);
        
        
        
        // No mostrar notificación para errores de sync
        if (!event.reason?.message?.includes('sync')) {
            analyticsManager.trackError(new Error(event.reason), { type: 'unhandled_rejection' });
        }
    });
}

// Función de cálculo legacy (mantener compatibilidad)
function calculateAdvanced() {
    const calculateBtn = document.querySelector('[onclick="calculateAdvanced()"]');
    if (calculateBtn) {
        handleCalculation({ target: calculateBtn, preventDefault: () => {} });
    }
}

// Poblar grid de compatibilidad CCAA
function populateCCAACompatibilityGrid() {
    const container = document.getElementById('ccaaCompatibility');
    if (!container) return;

    let html = '';
    Object.entries(CCAA_DATA).forEach(([code, data]) => {
        html += `
            <div class="ccaa-legal-item ${data.compatible ? 'compatible' : 'incompatible'}">
                <div class="ccaa-legal-header">
                    <h4>${data.name}</h4>
                    <span class="ccaa-percentage">${(data.percentage * 100).toFixed(0)}%</span>
                </div>
                <div class="ccaa-legal-details">
                    <p><strong>Base máxima:</strong> €${data.maxBase.toLocaleString()}</p>
                    <p><strong>Compatible:</strong> ${data.compatible ? 'Sí' : 'No'}</p>
                    <p><strong>Tiempo:</strong> ${data.processingTime}</p>
                    <p><strong>Éxito:</strong> ${(data.successRate * 100).toFixed(0)}%</p>
                    <span class="risk-level risk-${data.riskLevel}">${data.riskLevel}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Inicializar grid de CCAA cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(populateCCAACompatibilityGrid, 1000);
});

console.log('📱 INVERTAX v3.0 - Aplicación principal cargada');