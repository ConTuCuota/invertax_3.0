// Monte Carlo Web Worker para simulaciones financieras no bloqueantes
// Implementa el Movimiento Geométrico Browniano (GBM)

self.onmessage = function(event) {
    const { investment, expectedReturn, volatility, years, iterations } = event.data;
    
    try {
        // Ejecutar simulación Monte Carlo
        const analysis = runMonteCarloSimulation(investment, expectedReturn, volatility, years, iterations);
        
        // Enviar resultados de vuelta al hilo principal
        self.postMessage({
            success: true,
            data: analysis
        });
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message
        });
    }
};

function runMonteCarloSimulation(investment, expectedReturn, volatility, years = 3, iterations = 1000) {
    const results = [];
    const dt = 1; // Paso de tiempo anual
    
    // Ejecutar iteraciones Monte Carlo
    for (let i = 0; i < iterations; i++) {
        let value = investment;
        
        // Simular evolución año a año usando GBM
        for (let year = 0; year < years; year++) {
            const randomShock = normalRandom();
            const drift = (expectedReturn / 100 - 0.5 * Math.pow(volatility / 100, 2)) * dt;
            const diffusion = (volatility / 100) * Math.sqrt(dt) * randomShock;
            
            value *= Math.exp(drift + diffusion);
        }
        
        results.push(value);
    }
    
    // Ordenar resultados para calcular percentiles
    results.sort((a, b) => a - b);
    
    // Calcular estadísticas
    const analysis = {
        scenarios: results,
        statistics: {
            mean: results.reduce((sum, val) => sum + val, 0) / iterations,
            median: results[Math.floor(iterations * 0.5)],
            p5: results[Math.floor(iterations * 0.05)],
            p25: results[Math.floor(iterations * 0.25)],
            p75: results[Math.floor(iterations * 0.75)],
            p95: results[Math.floor(iterations * 0.95)],
            var95: results[Math.floor(iterations * 0.05)], // VaR al 95%
            min: results[0],
            max: results[iterations - 1],
            standardDeviation: calculateStdDev(results)
        },
        histogram: createHistogram(results, 20),
        calculations: {
            expectedAnnualReturn: expectedReturn,
            volatility: volatility,
            years: years,
            iterations: iterations,
            investmentAmount: investment
        }
    };
    
    // Calcular métricas adicionales
    analysis.metrics = {
        roi: ((analysis.statistics.median - investment) / investment) * 100,
        probabilityOfLoss: (results.filter(r => r < investment).length / iterations) * 100,
        averageReturn: ((analysis.statistics.mean - investment) / investment) * 100,
        sharpeRatio: calculateSharpeRatio(analysis.statistics.mean, investment, analysis.statistics.standardDeviation),
        successRate: (results.filter(r => r > investment * 1.1).length / iterations) * 100 // Ganancia > 10%
    };
    
    return analysis;
}

// Generador de números aleatorios con distribución normal (Box-Muller)
function normalRandom() {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Calcular desviación estándar
function calculateStdDev(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
}

// Crear histograma para visualización
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
        percentage: (count / data.length) * 100,
        frequency: count / data.length
    }));
}

// Calcular ratio de Sharpe simplificado
function calculateSharpeRatio(averageReturn, investment, standardDeviation) {
    const riskFreeRate = 0.02; // Asumimos 2% como tasa libre de riesgo
    const annualizedReturn = (averageReturn - investment) / investment;
    const annualizedStd = standardDeviation / investment;
    
    return (annualizedReturn - riskFreeRate) / annualizedStd;
}

// Función auxiliar para calcular percentiles específicos
function calculatePercentile(sortedArray, percentile) {
    const index = Math.floor(sortedArray.length * (percentile / 100));
    return sortedArray[Math.min(index, sortedArray.length - 1)];
}

// Análisis de escenarios
function analyzeScenarios(results, investment) {
    return {
        bearish: calculatePercentile(results, 10),
        conservative: calculatePercentile(results, 25),
        expected: calculatePercentile(results, 50),
        optimistic: calculatePercentile(results, 75),
        bullish: calculatePercentile(results, 90)
    };
}