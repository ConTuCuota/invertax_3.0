// INVERTAX Portfolio Optimizer
// Optimizador de cartera con algoritmos de Modern Portfolio Theory

class PortfolioOptimizer {
    constructor() {
        this.riskFreeRate = 0.02;
        this.marketReturn = 0.08;
        this.optimizationMethods = ['meanVariance', 'sharpe', 'minVariance', 'equalWeight'];
    }

    /**
     * Optimización de cartera usando Modern Portfolio Theory
     */
    optimizePortfolio(investments, constraints = {}) {
        const {
            maxRisk = 0.3,
            minReturn = 0.15,
            maxConcentration = 0.4,
            sectors = [],
            regions = []
        } = constraints;

        // Calcular matriz de covarianza
        const covarianceMatrix = this.calculateCovarianceMatrix(investments);
        
        // Calcular retornos esperados
        const expectedReturns = this.calculateExpectedReturns(investments);
        
        // Optimización por método de Sharpe
        const sharpeOptimal = this.optimizeSharpeRatio(expectedReturns, covarianceMatrix);
        
        // Optimización por mínima varianza
        const minVarianceOptimal = this.optimizeMinVariance(covarianceMatrix);
        
        // Optimización por máximo retorno
        const maxReturnOptimal = this.optimizeMaxReturn(expectedReturns, covarianceMatrix, maxRisk);

        return {
            sharpeOptimal,
            minVarianceOptimal,
            maxReturnOptimal,
            efficientFrontier: this.calculateEfficientFrontier(expectedReturns, covarianceMatrix),
            riskMetrics: this.calculatePortfolioRisk(sharpeOptimal.weights, covarianceMatrix),
            diversificationMetrics: this.calculateDiversificationMetrics(sharpeOptimal.weights, investments)
        };
    }

    /**
     * Cálculo de matriz de covarianza
     */
    calculateCovarianceMatrix(investments) {
        const n = investments.length;
        const matrix = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    // Varianza en la diagonal
                    matrix[i][j] = Math.pow(investments[i].volatility || 0.25, 2);
                } else {
                    // Correlación entre activos
                    const correlation = this.estimateCorrelation(investments[i], investments[j]);
                    const vol_i = investments[i].volatility || 0.25;
                    const vol_j = investments[j].volatility || 0.25;
                    matrix[i][j] = correlation * vol_i * vol_j;
                }
            }
        }
        
        return matrix;
    }

    /**
     * Estimación de correlación entre inversiones
     */
    estimateCorrelation(investment1, investment2) {
        // Correlación basada en sector y región
        let correlation = 0.3; // Correlación base
        
        if (investment1.sector === investment2.sector) {
            correlation += 0.2;
        }
        
        if (investment1.region === investment2.region) {
            correlation += 0.15;
        }
        
        if (investment1.stage === investment2.stage) {
            correlation += 0.1;
        }
        
        return Math.min(correlation, 0.8);
    }

    /**
     * Cálculo de retornos esperados
     */
    calculateExpectedReturns(investments) {
        return investments.map(inv => {
            const baseReturn = inv.expectedReturn || 0.25;
            const fiscalBenefit = inv.fiscalReturn || 0.5;
            const riskAdjustment = this.calculateRiskAdjustment(inv);
            
            return baseReturn + fiscalBenefit - riskAdjustment;
        });
    }

    /**
     * Ajuste por riesgo específico
     */
    calculateRiskAdjustment(investment) {
        let adjustment = 0;
        
        // Ajuste por etapa de la empresa
        switch (investment.stage) {
            case 'seed': adjustment += 0.05; break;
            case 'series_a': adjustment += 0.03; break;
            case 'series_b': adjustment += 0.02; break;
            default: adjustment += 0.04;
        }
        
        // Ajuste por sector
        const highRiskSectors = ['biotech', 'crypto', 'gaming'];
        if (highRiskSectors.includes(investment.sector)) {
            adjustment += 0.03;
        }
        
        return adjustment;
    }

    /**
     * Optimización del ratio de Sharpe
     */
    optimizeSharpeRatio(expectedReturns, covarianceMatrix) {
        const n = expectedReturns.length;
        
        // Implementación simplificada del algoritmo de optimización
        // En producción se usaría una librería de optimización numérica
        let bestSharpe = -Infinity;
        let bestWeights = Array(n).fill(1/n);
        
        // Búsqueda por grid (simplificado)
        for (let iterations = 0; iterations < 1000; iterations++) {
            const weights = this.generateRandomWeights(n);
            const portfolioReturn = this.calculatePortfolioReturn(weights, expectedReturns);
            const portfolioRisk = this.calculatePortfolioRisk(weights, covarianceMatrix);
            const sharpe = (portfolioReturn - this.riskFreeRate) / portfolioRisk.volatility;
            
            if (sharpe > bestSharpe) {
                bestSharpe = sharpe;
                bestWeights = [...weights];
            }
        }
        
        return {
            weights: bestWeights,
            expectedReturn: this.calculatePortfolioReturn(bestWeights, expectedReturns),
            risk: this.calculatePortfolioRisk(bestWeights, covarianceMatrix),
            sharpeRatio: bestSharpe
        };
    }

    /**
     * Optimización de mínima varianza
     */
    optimizeMinVariance(covarianceMatrix) {
        const n = covarianceMatrix.length;
        let minVariance = Infinity;
        let bestWeights = Array(n).fill(1/n);
        
        for (let iterations = 0; iterations < 1000; iterations++) {
            const weights = this.generateRandomWeights(n);
            const risk = this.calculatePortfolioRisk(weights, covarianceMatrix);
            
            if (risk.variance < minVariance) {
                minVariance = risk.variance;
                bestWeights = [...weights];
            }
        }
        
        return {
            weights: bestWeights,
            risk: this.calculatePortfolioRisk(bestWeights, covarianceMatrix)
        };
    }

    /**
     * Optimización de máximo retorno con restricción de riesgo
     */
    optimizeMaxReturn(expectedReturns, covarianceMatrix, maxRisk) {
        const n = expectedReturns.length;
        let maxReturn = -Infinity;
        let bestWeights = Array(n).fill(1/n);
        
        for (let iterations = 0; iterations < 1000; iterations++) {
            const weights = this.generateRandomWeights(n);
            const portfolioReturn = this.calculatePortfolioReturn(weights, expectedReturns);
            const portfolioRisk = this.calculatePortfolioRisk(weights, covarianceMatrix);
            
            if (portfolioRisk.volatility <= maxRisk && portfolioReturn > maxReturn) {
                maxReturn = portfolioReturn;
                bestWeights = [...weights];
            }
        }
        
        return {
            weights: bestWeights,
            expectedReturn: maxReturn,
            risk: this.calculatePortfolioRisk(bestWeights, covarianceMatrix)
        };
    }

    /**
     * Generación de pesos aleatorios que suman 1
     */
    generateRandomWeights(n) {
        const weights = Array(n).fill(0).map(() => Math.random());
        const sum = weights.reduce((a, b) => a + b, 0);
        return weights.map(w => w / sum);
    }

    /**
     * Cálculo de retorno de cartera
     */
    calculatePortfolioReturn(weights, expectedReturns) {
        return weights.reduce((sum, weight, i) => sum + weight * expectedReturns[i], 0);
    }

    /**
     * Cálculo de riesgo de cartera
     */
    calculatePortfolioRisk(weights, covarianceMatrix) {
        const n = weights.length;
        let variance = 0;
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                variance += weights[i] * weights[j] * covarianceMatrix[i][j];
            }
        }
        
        return {
            variance: variance,
            volatility: Math.sqrt(variance),
            standardDeviation: Math.sqrt(variance)
        };
    }

    /**
     * Cálculo de frontera eficiente
     */
    calculateEfficientFrontier(expectedReturns, covarianceMatrix, points = 50) {
        const frontier = [];
        const minReturn = Math.min(...expectedReturns);
        const maxReturn = Math.max(...expectedReturns);
        
        for (let i = 0; i < points; i++) {
            const targetReturn = minReturn + (maxReturn - minReturn) * i / (points - 1);
            const optimal = this.optimizeForTargetReturn(expectedReturns, covarianceMatrix, targetReturn);
            
            if (optimal) {
                frontier.push({
                    return: targetReturn,
                    risk: optimal.risk.volatility,
                    weights: optimal.weights
                });
            }
        }
        
        return frontier;
    }

    /**
     * Optimización para retorno objetivo
     */
    optimizeForTargetReturn(expectedReturns, covarianceMatrix, targetReturn) {
        const n = expectedReturns.length;
        let minRisk = Infinity;
        let bestWeights = null;
        
        for (let iterations = 0; iterations < 500; iterations++) {
            const weights = this.generateRandomWeights(n);
            const portfolioReturn = this.calculatePortfolioReturn(weights, expectedReturns);
            
            if (Math.abs(portfolioReturn - targetReturn) < 0.01) {
                const risk = this.calculatePortfolioRisk(weights, covarianceMatrix);
                if (risk.volatility < minRisk) {
                    minRisk = risk.volatility;
                    bestWeights = [...weights];
                }
            }
        }
        
        return bestWeights ? {
            weights: bestWeights,
            risk: this.calculatePortfolioRisk(bestWeights, covarianceMatrix)
        } : null;
    }

    /**
     * Métricas de diversificación
     */
    calculateDiversificationMetrics(weights, investments) {
        // Índice de Herfindahl-Hirschman
        const hhi = weights.reduce((sum, weight) => sum + weight * weight, 0);
        
        // Diversificación por sector
        const sectorWeights = {};
        investments.forEach((inv, i) => {
            const sector = inv.sector || 'unknown';
            sectorWeights[sector] = (sectorWeights[sector] || 0) + weights[i];
        });
        
        // Diversificación por región
        const regionWeights = {};
        investments.forEach((inv, i) => {
            const region = inv.region || 'unknown';
            regionWeights[region] = (regionWeights[region] || 0) + weights[i];
        });
        
        return {
            herfindahlIndex: hhi,
            effectiveNumberOfAssets: 1 / hhi,
            sectorConcentration: Math.max(...Object.values(sectorWeights)),
            regionConcentration: Math.max(...Object.values(regionWeights)),
            diversificationRatio: this.calculateDiversificationRatio(weights, investments),
            sectorDistribution: sectorWeights,
            regionDistribution: regionWeights
        };
    }

    /**
     * Ratio de diversificación
     */
    calculateDiversificationRatio(weights, investments) {
        const weightedAverageVol = weights.reduce((sum, weight, i) => {
            return sum + weight * (investments[i].volatility || 0.25);
        }, 0);
        
        const portfolioVol = 0.2; // Simplificado
        
        return weightedAverageVol / portfolioVol;
    }

    /**
     * Análisis de contribución al riesgo
     */
    calculateRiskContribution(weights, covarianceMatrix) {
        const n = weights.length;
        const portfolioVariance = this.calculatePortfolioRisk(weights, covarianceMatrix).variance;
        const contributions = [];
        
        for (let i = 0; i < n; i++) {
            let marginalContribution = 0;
            for (let j = 0; j < n; j++) {
                marginalContribution += weights[j] * covarianceMatrix[i][j];
            }
            
            const contribution = weights[i] * marginalContribution / portfolioVariance;
            contributions.push({
                asset: i,
                weight: weights[i],
                riskContribution: contribution,
                marginalRisk: marginalContribution
            });
        }
        
        return contributions;
    }

    /**
     * Backtesting de estrategia
     */
    backtestStrategy(weights, historicalReturns, rebalanceFrequency = 'quarterly') {
        const results = {
            totalReturn: 0,
            volatility: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            calmarRatio: 0,
            winRate: 0,
            periods: []
        };
        
        // Simulación simplificada
        let portfolioValue = 1;
        let peak = 1;
        let drawdown = 0;
        let maxDrawdown = 0;
        const returns = [];
        
        for (let period = 0; period < historicalReturns.length; period++) {
            const periodReturn = weights.reduce((sum, weight, i) => {
                return sum + weight * (historicalReturns[period][i] || 0);
            }, 0);
            
            portfolioValue *= (1 + periodReturn);
            returns.push(periodReturn);
            
            if (portfolioValue > peak) {
                peak = portfolioValue;
                drawdown = 0;
            } else {
                drawdown = (peak - portfolioValue) / peak;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
            
            results.periods.push({
                period: period,
                return: periodReturn,
                portfolioValue: portfolioValue,
                drawdown: drawdown
            });
        }
        
        results.totalReturn = portfolioValue - 1;
        results.volatility = this.calculateVolatility(returns);
        results.sharpeRatio = (results.totalReturn - this.riskFreeRate) / results.volatility;
        results.maxDrawdown = maxDrawdown;
        results.calmarRatio = results.totalReturn / maxDrawdown;
        results.winRate = returns.filter(r => r > 0).length / returns.length;
        
        return results;
    }

    /**
     * Cálculo de volatilidad
     */
    calculateVolatility(returns) {
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
        return Math.sqrt(variance);
    }
}

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
    window.PortfolioOptimizer = PortfolioOptimizer;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioOptimizer };
}