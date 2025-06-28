// INVERTAX Risk Analyzer
// Analizador de riesgo avanzado con modelos cuantitativos

class RiskAnalyzer {
    constructor() {
        this.confidenceLevels = [0.90, 0.95, 0.99];
        this.timeHorizons = [1, 3, 5, 10]; // años
        this.stressTestScenarios = this.initializeStressScenarios();
    }

    /**
     * Análisis completo de riesgo
     */
    analyzeRisk(investment, fiscalOptimization, marketData = {}) {
        const analysis = {
            // Métricas básicas de riesgo
            valueAtRisk: this.calculateVaR(investment, fiscalOptimization),
            expectedShortfall: this.calculateExpectedShortfall(investment, fiscalOptimization),
            
            // Análisis de escenarios
            stressTests: this.performStressTesting(investment, fiscalOptimization),
            scenarioAnalysis: this.performScenarioAnalysis(investment, fiscalOptimization),
            
            // Riesgo específico de inversiones en empresas nuevas
            startupRisks: this.analyzeStartupSpecificRisks(investment, fiscalOptimization),
            
            // Riesgo regulatorio y fiscal
            regulatoryRisks: this.analyzeRegulatoryRisks(fiscalOptimization),
            
            // Métricas de liquidez
            liquidityRisks: this.analyzeLiquidityRisks(investment),
            
            // Concentración y diversificación
            concentrationRisks: this.analyzeConcentrationRisks(investment),
            
            // Riesgo temporal
            temporalRisks: this.analyzeTemporalRisks(investment, fiscalOptimization),
            
            // Score de riesgo general
            overallRiskScore: 0,
            riskRating: '',
            
            // Recomendaciones de mitigación
            mitigationStrategies: []
        };

        // Calcular score general de riesgo
        analysis.overallRiskScore = this.calculateOverallRiskScore(analysis);
        analysis.riskRating = this.getRiskRating(analysis.overallRiskScore);
        
        // Generar estrategias de mitigación
        analysis.mitigationStrategies = this.generateMitigationStrategies(analysis);

        return analysis;
    }

    /**
     * Cálculo de Value at Risk (VaR)
     */
    calculateVaR(investment, fiscalOptimization) {
        const results = {};
        
        this.confidenceLevels.forEach(confidence => {
            this.timeHorizons.forEach(horizon => {
                // Parámetros del modelo
                const annualVolatility = 0.35; // 35% volatilidad anual típica para startups
                const expectedReturn = 0.25; // 25% retorno esperado anual
                const fiscalBenefit = fiscalOptimization.totalDeduction;
                const netInvestment = investment.totalUsedInvestment - fiscalBenefit;
                
                // Cálculo VaR paramétrico (distribución normal)
                const timeAdjustedVol = annualVolatility * Math.sqrt(horizon);
                const zScore = this.getZScore(confidence);
                const worstCaseReturn = expectedReturn * horizon - zScore * timeAdjustedVol;
                
                const varAmount = netInvestment * (1 - Math.exp(worstCaseReturn));
                const varPercentage = (varAmount / investment.totalUsedInvestment) * 100;
                
                results[`var_${confidence}_${horizon}y`] = {
                    confidence: confidence,
                    horizon: horizon,
                    varAmount: varAmount,
                    varPercentage: varPercentage,
                    interpretation: `Con ${confidence * 100}% de confianza, la pérdida máxima en ${horizon} año(s) no excederá €${varAmount.toLocaleString()}`
                };
            });
        });

        return results;
    }

    /**
     * Cálculo de Expected Shortfall (ES)
     */
    calculateExpectedShortfall(investment, fiscalOptimization) {
        const results = {};
        
        this.confidenceLevels.forEach(confidence => {
            this.timeHorizons.forEach(horizon => {
                const annualVolatility = 0.35;
                const expectedReturn = 0.25;
                const fiscalBenefit = fiscalOptimization.totalDeduction;
                const netInvestment = investment.totalUsedInvestment - fiscalBenefit;
                
                const timeAdjustedVol = annualVolatility * Math.sqrt(horizon);
                const zScore = this.getZScore(confidence);
                
                // Expected Shortfall para distribución normal
                const phi = this.normalPDF(zScore);
                const expectedShortfallMultiplier = phi / (1 - confidence);
                const esReturn = expectedReturn * horizon - expectedShortfallMultiplier * timeAdjustedVol;
                
                const esAmount = netInvestment * (1 - Math.exp(esReturn));
                const esPercentage = (esAmount / investment.totalUsedInvestment) * 100;
                
                results[`es_${confidence}_${horizon}y`] = {
                    confidence: confidence,
                    horizon: horizon,
                    esAmount: esAmount,
                    esPercentage: esPercentage,
                    interpretation: `La pérdida esperada en el ${(1-confidence)*100}% de peores escenarios en ${horizon} año(s) es €${esAmount.toLocaleString()}`
                };
            });
        });

        return results;
    }

    /**
     * Pruebas de estrés
     */
    performStressTesting(investment, fiscalOptimization) {
        const stressTests = {};
        
        this.stressTestScenarios.forEach(scenario => {
            const result = this.applyStressScenario(investment, fiscalOptimization, scenario);
            stressTests[scenario.name] = result;
        });

        return stressTests;
    }

    /**
     * Aplicar escenario de estrés
     */
    applyStressScenario(investment, fiscalOptimization, scenario) {
        const baseValue = investment.totalUsedInvestment;
        const fiscalBenefit = fiscalOptimization.totalDeduction;
        const netInvestment = baseValue - fiscalBenefit;
        
        // Aplicar shocks del escenario
        let stressedValue = netInvestment;
        
        // Shock de mercado
        if (scenario.marketShock) {
            stressedValue *= (1 + scenario.marketShock);
        }
        
        // Shock de liquidez
        if (scenario.liquidityShock) {
            stressedValue *= (1 - scenario.liquidityShock);
        }
        
        // Shock regulatorio (afecta beneficios fiscales)
        let stressedFiscalBenefit = fiscalBenefit;
        if (scenario.regulatoryShock) {
            stressedFiscalBenefit *= (1 - scenario.regulatoryShock);
        }
        
        const totalLoss = baseValue - (stressedValue + stressedFiscalBenefit);
        const lossPercentage = (totalLoss / baseValue) * 100;
        
        return {
            scenario: scenario.name,
            description: scenario.description,
            originalValue: baseValue,
            stressedValue: stressedValue + stressedFiscalBenefit,
            totalLoss: totalLoss,
            lossPercentage: lossPercentage,
            severity: this.categorizeLoss(lossPercentage),
            probability: scenario.probability
        };
    }

    /**
     * Análisis de riesgos específicos de startups
     */
    analyzeStartupSpecificRisks(investment, fiscalOptimization) {
        return {
            // Riesgo de fracaso empresarial
            businessFailureRisk: {
                probability: 0.7, // 70% de startups fallan en 10 años
                impact: investment.totalUsedInvestment * 0.9, // Pérdida del 90%
                timeframe: '2-5 años',
                mitigationFactors: ['Due diligence', 'Diversificación', 'Seguimiento activo']
            },
            
            // Riesgo de dilución
            dilutionRisk: {
                probability: 0.8, // 80% probabilidad de dilución
                impact: investment.totalUsedInvestment * 0.3, // Dilución del 30%
                timeframe: '1-3 años',
                mitigationFactors: ['Derechos anti-dilución', 'Participación en rondas futuras']
            },
            
            // Riesgo de liquidez
            liquidityRisk: {
                probability: 0.9, // 90% probabilidad de baja liquidez
                impact: investment.totalUsedInvestment * 0.2, // Descuento de liquidez 20%
                timeframe: '3+ años',
                mitigationFactors: ['Horizonte largo', 'Mercado secundario', 'Derechos de venta']
            },
            
            // Riesgo tecnológico
            technologyRisk: {
                probability: 0.4, // 40% riesgo de obsolescencia tecnológica
                impact: investment.totalUsedInvestment * 0.6, // Pérdida del 60%
                timeframe: '2-4 años',
                mitigationFactors: ['Análisis tecnológico', 'Diversificación sectorial']
            },
            
            // Riesgo de mercado
            marketRisk: {
                probability: 0.5, // 50% riesgo de cambio de mercado
                impact: investment.totalUsedInvestment * 0.4, // Pérdida del 40%
                timeframe: '1-3 años',
                mitigationFactors: ['Análisis de mercado', 'Flexibilidad del modelo de negocio']
            }
        };
    }

    /**
     * Análisis de riesgos regulatorios
     */
    analyzeRegulatoryRisks(fiscalOptimization) {
        const ccaaData = fiscalOptimization.ccaaData;
        
        return {
            // Riesgo de cambio normativo
            regulatoryChangeRisk: {
                probability: 0.3, // 30% probabilidad en 5 años
                impact: fiscalOptimization.totalDeduction * 0.5,
                description: 'Cambios en la normativa fiscal que reduzcan beneficios',
                timeframe: '1-5 años'
            },
            
            // Riesgo de incompatibilidad
            incompatibilityRisk: {
                probability: ccaaData.compatible ? 0.1 : 0.8,
                impact: fiscalOptimization.totalDeduction * (ccaaData.compatible ? 0.2 : 1.0),
                description: 'Riesgo de pérdida de compatibilidad entre deducciones',
                timeframe: '1-3 años'
            },
            
            // Riesgo de auditoría fiscal
            auditRisk: {
                probability: 0.15, // 15% probabilidad de auditoría
                impact: fiscalOptimization.totalDeduction * 0.1, // Costes adicionales
                description: 'Riesgo de auditoría y costes asociados',
                timeframe: '1-7 años'
            },
            
            // Riesgo de interpretación normativa
            interpretationRisk: {
                probability: 0.2, // 20% probabilidad de interpretación adversa
                impact: fiscalOptimization.totalDeduction * 0.3,
                description: 'Riesgo de interpretación desfavorable por parte de Hacienda',
                timeframe: '1-5 años'
            }
        };
    }

    /**
     * Análisis de riesgos de liquidez
     */
    analyzeLiquidityRisks(investment) {
        return {
            // Liquidez inmediata (< 1 año)
            immediateliquidity: {
                availability: 0.05, // 5% del valor
                discount: 0.5, // 50% descuento
                timeToLiquidate: '1-3 meses'
            },
            
            // Liquidez a corto plazo (1-3 años)
            shortTermLiquidity: {
                availability: 0.2, // 20% del valor
                discount: 0.3, // 30% descuento
                timeToLiquidate: '6-12 meses'
            },
            
            // Liquidez a medio plazo (3-5 años)
            mediumTermLiquidity: {
                availability: 0.5, // 50% del valor
                discount: 0.15, // 15% descuento
                timeToLiquidate: '3-6 meses'
            },
            
            // Liquidez a largo plazo (5+ años)
            longTermLiquidity: {
                availability: 0.8, // 80% del valor
                discount: 0.05, // 5% descuento
                timeToLiquidate: '1-3 meses'
            }
        };
    }

    /**
     * Análisis de riesgos de concentración
     */
    analyzeConcentrationRisks(investment) {
        // Análisis simplificado - en producción se analizaría la cartera completa
        return {
            sectorConcentration: {
                level: 'high', // Asumiendo alta concentración
                risk: 0.7,
                description: 'Alta concentración en un sector específico'
            },
            
            geographicConcentration: {
                level: 'medium',
                risk: 0.4,
                description: 'Concentración geográfica en España'
            },
            
            stageConcentration: {
                level: 'high',
                risk: 0.8,
                description: 'Alta concentración en empresas de nueva creación'
            },
            
            temporalConcentration: {
                level: 'high',
                risk: 0.6,
                description: 'Concentración temporal en un período específico'
            }
        };
    }

    /**
     * Análisis de riesgos temporales
     */
    analyzeTemporalRisks(investment, fiscalOptimization) {
        return {
            // Riesgo de permanencia mínima
            holdingPeriodRisk: {
                minimumPeriod: 3, // años
                penaltyForEarlyExit: fiscalOptimization.totalDeduction,
                probabilityOfEarlyExit: 0.25,
                description: 'Riesgo de necesidad de liquidez antes de 3 años'
            },
            
            // Riesgo de timing de mercado
            marketTimingRisk: {
                impact: investment.totalUsedInvestment * 0.2,
                probability: 0.6,
                description: 'Riesgo de invertir en momento subóptimo del ciclo'
            },
            
            // Riesgo de inflación
            inflationRisk: {
                annualImpact: investment.totalUsedInvestment * 0.025, // 2.5% anual
                cumulativeImpact3Years: investment.totalUsedInvestment * 0.077,
                description: 'Erosión del valor real por inflación'
            }
        };
    }

    /**
     * Inicializar escenarios de estrés
     */
    initializeStressScenarios() {
        return [
            {
                name: 'crisis_economica',
                description: 'Crisis económica severa similar a 2008',
                marketShock: -0.4, // -40% valor de mercado
                liquidityShock: 0.3, // -30% liquidez
                regulatoryShock: 0.1, // -10% beneficios fiscales
                probability: 0.05 // 5% probabilidad en 10 años
            },
            {
                name: 'burbuja_tecnologica',
                description: 'Estallido de burbuja tecnológica',
                marketShock: -0.6, // -60% valor de mercado
                liquidityShock: 0.5, // -50% liquidez
                regulatoryShock: 0.0,
                probability: 0.1 // 10% probabilidad en 10 años
            },
            {
                name: 'cambio_fiscal',
                description: 'Cambio adverso en normativa fiscal',
                marketShock: -0.1, // -10% valor de mercado
                liquidityShock: 0.1, // -10% liquidez
                regulatoryShock: 0.5, // -50% beneficios fiscales
                probability: 0.2 // 20% probabilidad en 5 años
            },
            {
                name: 'pandemia',
                description: 'Pandemia global con restricciones económicas',
                marketShock: -0.3, // -30% valor de mercado
                liquidityShock: 0.4, // -40% liquidez
                regulatoryShock: 0.0,
                probability: 0.15 // 15% probabilidad en 10 años
            },
            {
                name: 'crisis_sectorial',
                description: 'Crisis específica del sector tecnológico',
                marketShock: -0.5, // -50% valor de mercado
                liquidityShock: 0.3, // -30% liquidez
                regulatoryShock: 0.0,
                probability: 0.25 // 25% probabilidad en 10 años
            }
        ];
    }

    /**
     * Calcular score general de riesgo
     */
    calculateOverallRiskScore(analysis) {
        const weights = {
            var: 0.25,
            stressTests: 0.20,
            startupRisks: 0.20,
            regulatoryRisks: 0.15,
            liquidityRisks: 0.10,
            concentrationRisks: 0.10
        };

        let score = 0;

        // Score basado en VaR
        const var95_3y = analysis.valueAtRisk['var_0.95_3y'];
        if (var95_3y) {
            const varScore = Math.min(var95_3y.varPercentage / 50 * 100, 100);
            score += varScore * weights.var;
        }

        // Score basado en stress tests
        const stressScores = Object.values(analysis.stressTests).map(test => test.lossPercentage);
        const avgStressScore = stressScores.reduce((sum, s) => sum + s, 0) / stressScores.length;
        score += Math.min(avgStressScore, 100) * weights.stressTests;

        // Score basado en riesgos de startup
        const startupRiskScore = 70; // Score fijo alto para startups
        score += startupRiskScore * weights.startupRisks;

        // Score basado en riesgos regulatorios
        const regulatoryScore = analysis.regulatoryRisks.incompatibilityRisk.probability * 100;
        score += regulatoryScore * weights.regulatoryRisks;

        // Score basado en liquidez
        const liquidityScore = 80; // Score alto por baja liquidez de startups
        score += liquidityScore * weights.liquidityRisks;

        // Score basado en concentración
        const concentrationScore = 75; // Score alto por concentración típica
        score += concentrationScore * weights.concentrationRisks;

        return Math.round(score);
    }

    /**
     * Obtener rating de riesgo
     */
    getRiskRating(score) {
        if (score < 20) return 'Muy Bajo';
        if (score < 40) return 'Bajo';
        if (score < 60) return 'Medio';
        if (score < 80) return 'Alto';
        return 'Muy Alto';
    }

    /**
     * Generar estrategias de mitigación
     */
    generateMitigationStrategies(analysis) {
        const strategies = [];

        // Estrategias basadas en el score general
        if (analysis.overallRiskScore > 70) {
            strategies.push({
                priority: 'high',
                category: 'diversification',
                title: 'Diversificación Urgente',
                description: 'Diversificar inmediatamente entre múltiples empresas, sectores y etapas',
                implementation: ['Invertir en al menos 10-15 empresas', 'Diversificar por sectores', 'Incluir diferentes etapas de desarrollo'],
                expectedImpact: 'Reducción del 30-40% en el riesgo general'
            });
        }

        // Estrategias para riesgos de liquidez
        if (analysis.liquidityRisks.immediateliquidity.availability < 0.1) {
            strategies.push({
                priority: 'medium',
                category: 'liquidity',
                title: 'Gestión de Liquidez',
                description: 'Establecer reservas de liquidez y planificar salidas',
                implementation: ['Mantener 20% en activos líquidos', 'Planificar calendario de salidas', 'Negociar derechos de venta'],
                expectedImpact: 'Mejora en la flexibilidad financiera'
            });
        }

        // Estrategias para riesgos regulatorios
        if (analysis.regulatoryRisks.regulatoryChangeRisk.probability > 0.2) {
            strategies.push({
                priority: 'medium',
                category: 'regulatory',
                title: 'Monitoreo Regulatorio',
                description: 'Establecer sistema de seguimiento de cambios normativos',
                implementation: ['Suscripción a alertas normativas', 'Consulta regular con asesores fiscales', 'Planificación de escenarios'],
                expectedImpact: 'Reducción del riesgo de sorpresas regulatorias'
            });
        }

        // Estrategias para riesgos de concentración
        if (analysis.concentrationRisks.sectorConcentration.risk > 0.6) {
            strategies.push({
                priority: 'high',
                category: 'concentration',
                title: 'Diversificación Sectorial',
                description: 'Reducir concentración en sectores específicos',
                implementation: ['Invertir en máximo 30% por sector', 'Incluir sectores no correlacionados', 'Considerar sectores defensivos'],
                expectedImpact: 'Reducción del 25% en riesgo de concentración'
            });
        }

        return strategies.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    /**
     * Funciones auxiliares
     */
    getZScore(confidence) {
        const zScores = {
            0.90: 1.282,
            0.95: 1.645,
            0.99: 2.326
        };
        return zScores[confidence] || 1.645;
    }

    normalPDF(x) {
        return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }

    categorizeLoss(lossPercentage) {
        if (lossPercentage < 10) return 'Leve';
        if (lossPercentage < 25) return 'Moderada';
        if (lossPercentage < 50) return 'Severa';
        return 'Extrema';
    }

    /**
     * Análisis de escenarios
     */
    performScenarioAnalysis(investment, fiscalOptimization) {
        const scenarios = [
            {
                name: 'optimista',
                description: 'Escenario optimista con alto crecimiento',
                marketGrowth: 0.3,
                probability: 0.2
            },
            {
                name: 'base',
                description: 'Escenario base con crecimiento moderado',
                marketGrowth: 0.15,
                probability: 0.6
            },
            {
                name: 'pesimista',
                description: 'Escenario pesimista con bajo crecimiento',
                marketGrowth: -0.1,
                probability: 0.2
            }
        ];

        return scenarios.map(scenario => {
            const baseValue = investment.totalUsedInvestment;
            const fiscalBenefit = fiscalOptimization.totalDeduction;
            const netInvestment = baseValue - fiscalBenefit;
            
            const projectedValue = netInvestment * (1 + scenario.marketGrowth);
            const totalValue = projectedValue + fiscalBenefit;
            const totalReturn = ((totalValue - baseValue) / baseValue) * 100;

            return {
                ...scenario,
                projectedValue: totalValue,
                totalReturn: totalReturn,
                netReturn: totalReturn - (fiscalBenefit / baseValue * 100)
            };
        });
    }
}

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
    window.RiskAnalyzer = RiskAnalyzer;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RiskAnalyzer };
}