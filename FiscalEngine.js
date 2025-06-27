class FiscalEngine {
    constructor() {
        this.estateLimits = {
            percentage: 0.5,
            maxBase: 100000,
            minInvestment: 1000
        };
        
        this.ccaaData = {
            "Madrid": { 
                percentage: 0.4, 
                maxBase: 9279, 
                compatible: true,
                acceptedProfiles: ["startup tecnológica", "innovadora", "empresa de base tecnológica"],
                notes: "Permanencia mínima de 3 años, 5 empleados mínimo"
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
                acceptedProfiles: ["innovadora", "startup"],
                notes: "Requiere sede social en la Comunidad Valenciana" 
            },
            "Andalucía": { 
                percentage: 0.25, 
                maxBase: 10000, 
                compatible: true,
                acceptedProfiles: ["innovadora", "tecnológica", "base científica"],
                notes: "Antigüedad máxima 5 años, sede en Andalucía" 
            },
            "País Vasco": { 
                percentage: 0.35, 
                maxBase: 15000, 
                compatible: true,
                acceptedProfiles: ["startup tecnológica", "innovadora"],
                notes: "Normativa foral específica, consultar disposiciones vigentes"
            },
            "Galicia": { 
                percentage: 0.25, 
                maxBase: 8000, 
                compatible: true,
                acceptedProfiles: ["base tecnológica", "innovadora"],
                notes: "Registro previo en IGAPE, validación técnica previa"
            },
            "Castilla y León": { 
                percentage: 0.20, 
                maxBase: 6000, 
                compatible: true,
                acceptedProfiles: ["innovadora", "creación reciente"],
                notes: "Antigüedad máxima 3 años, sede en CyL"
            },
            "Castilla-La Mancha": { 
                percentage: 0.15, 
                maxBase: 5000, 
                compatible: true,
                acceptedProfiles: ["innovadora", "base tecnológica"],
                notes: "Mínimo 3 empleados a jornada completa"
            },
            "Extremadura": { 
                percentage: 0.20, 
                maxBase: 4000, 
                compatible: true,
                acceptedProfiles: ["startup", "innovadora"],
                notes: "Sede en Extremadura, capital social mínimo" 
            },
            "Murcia": { 
                percentage: 0.20, 
                maxBase: 6000, 
                compatible: true,
                acceptedProfiles: ["tecnológica", "innovadora"],
                notes: "Sede en Murcia, informe de viabilidad validado"
            },
            "Asturias": { 
                percentage: 0.25, 
                maxBase: 7000, 
                compatible: true,
                acceptedProfiles: ["innovadora", "tecnológica"],
                notes: "Antigüedad máxima 3 años, validación por IDEPA"
            },
            "Cantabria": { 
                percentage: 0.15, 
                maxBase: 5000, 
                compatible: true,
                acceptedProfiles: ["startup", "innovadora"],
                notes: "Requiere inscripción en registro autonómico"
            },
            "La Rioja": { 
                percentage: 0.20, 
                maxBase: 6000, 
                compatible: true,
                acceptedProfiles: ["tecnológica", "innovadora"],
                notes: "Certificación ADER previa"
            },
            "Navarra": { 
                percentage: 0.30, 
                maxBase: 10000, 
                compatible: true,
                acceptedProfiles: ["innovadora", "tecnológica"],
                notes: "Normativa foral específica"
            },
            "Aragón": { 
                percentage: 0.25, 
                maxBase: 8000, 
                compatible: true,
                acceptedProfiles: ["startup", "innovadora"],
                notes: "Sede en Aragón, validación previa"
            },
            "Canarias": { 
                percentage: 0, 
                maxBase: 0, 
                compatible: false,
                acceptedProfiles: ["ZEC"],
                notes: "Régimen especial ZEC, consultar normativa específica",
                special: "REF" 
            },
            "Baleares": { 
                percentage: 0, 
                maxBase: 0, 
                compatible: false,
                acceptedProfiles: ["turística", "innovadora"],
                notes: "Consultar normativa vigente",
                special: "ZEC" 
            }
        };
    }

    /**
     * Calcula la distribución óptima de la inversión para maximizar deducciones.
     * Implementa el "Modelo INVERTAX" de optimización secuencial.
     * @param {number} totalInvestment - La inversión total que el usuario desea realizar.
     * @param {string} ccaa - La Comunidad Autónoma del inversor.
     * @param {number} quotaEstatal - La cuota estatal disponible del usuario.
     * @param {number} quotaAutonomica - La cuota autonómica disponible del usuario.
     * @param {object} projectBProfile - Perfil del proyecto para deducción autonómica.
     * @returns {object} Un objeto detallado con el desglose de la inversión y las deducciones.
     */
    calculateOptimalDeductions(totalInvestment, ccaa, quotaEstatal = Infinity, quotaAutonomica = Infinity, projectBProfile = null) {
        // Validación inicial
        if (!ccaa || !totalInvestment || totalInvestment < this.estateLimits.minInvestment) {
            return this.createEmptyResult();
        }
        
        const ccaaInfo = this.ccaaData[ccaa];
        if (!ccaaInfo) return this.createEmptyResult();

        // --- PASO 1: Optimización de la Deducción Estatal ---

        // Inversión necesaria para agotar la cuota estatal
        const investmentNeededForStateQuota = quotaEstatal / this.estateLimits.percentage;

        // Determinar la inversión real para la deducción estatal (Proyecto A)
        const investmentForState = Math.min(
            totalInvestment,
            investmentNeededForStateQuota,
            this.estateLimits.maxBase
        );

        // Calcular la deducción estatal efectiva
        const stateDeduction = investmentForState * this.estateLimits.percentage;

        // --- PASO 2: Optimización de la Deducción Autonómica con el remanente ---

        const remainingInvestment = totalInvestment - investmentForState;
        let investmentForAutonomica = 0;
        let autonomicaDeduction = 0;
        let isProjectBValid = true;
        let profileValidationMessage = "";

        // Validar el perfil del proyecto B para deducciones autonómicas
        if (projectBProfile && ccaaInfo.acceptedProfiles && ccaaInfo.acceptedProfiles.length > 0) {
            if (ccaaInfo.acceptedProfiles.includes("todos")) {
                isProjectBValid = true;
            } else {
                isProjectBValid = ccaaInfo.acceptedProfiles.some(
                    profile => projectBProfile.type && projectBProfile.type.toLowerCase().includes(profile.toLowerCase())
                );
            }
            
            if (!isProjectBValid) {
                profileValidationMessage = `El perfil del proyecto no cumple con los requisitos de ${ccaa}: ${ccaaInfo.acceptedProfiles.join(", ")}`;
            }
        }

        if (remainingInvestment > 0 && ccaaInfo.compatible && ccaaInfo.percentage > 0 && isProjectBValid) {
            // Inversión necesaria para agotar la cuota autonómica
            const investmentNeededForAutonomicaQuota = quotaAutonomica / ccaaInfo.percentage;

            // Determinar la inversión real para la deducción autonómica (Proyecto B)
            investmentForAutonomica = Math.min(
                remainingInvestment,
                investmentNeededForAutonomicaQuota,
                ccaaInfo.maxBase
            );

            // Calcular la deducción autonómica efectiva
            autonomicaDeduction = investmentForAutonomica * ccaaInfo.percentage;
        }

        // --- PASO 3: Calcular Totales y Rentabilidad REAL ---
        
        const totalUsedInvestment = investmentForState + investmentForAutonomica;
        const totalDeduction = stateDeduction + autonomicaDeduction;
        // La rentabilidad fiscal se calcula SOBRE LA INVERSIÓN UTILIZADA para generar ahorro.
        const effectiveFiscalReturn = totalUsedInvestment > 0 ? (totalDeduction / totalUsedInvestment) * 100 : 0;
        const unusedInvestment = totalInvestment - totalUsedInvestment;

        // Crear objeto detallado de resultados
        return {
            investmentSplit: {
                estatal: investmentForState,
                autonomica: investmentForAutonomica,
                totalUsed: totalUsedInvestment,
                unused: unusedInvestment
            },
            deductions: {
                estatal: stateDeduction,
                autonomica: autonomicaDeduction,
                total: totalDeduction
            },
            totals: {
                effectiveFiscalReturn: effectiveFiscalReturn,
                netCost: totalUsedInvestment - totalDeduction
            },
            ccaaInfo: ccaaInfo,
            projectBValidation: {
                valid: isProjectBValid,
                message: profileValidationMessage
            },
            alerts: this.generateAlerts(
                totalInvestment, 
                totalUsedInvestment, 
                unusedInvestment, 
                ccaaInfo, 
                investmentForState, 
                investmentForAutonomica,
                quotaEstatal,
                quotaAutonomica,
                projectBProfile
            )
        };
    }

    createEmptyResult() {
        return {
            investmentSplit: { estatal: 0, autonomica: 0, totalUsed: 0, unused: 0 },
            deductions: { estatal: 0, autonomica: 0, total: 0 },
            totals: { effectiveFiscalReturn: 0, netCost: 0 },
            ccaaInfo: null,
            projectBValidation: { valid: false, message: "" },
            alerts: []
        };
    }

    generateAlerts(totalInvestment, totalUsedInvestment, unusedInvestment, ccaaInfo, investmentForState, investmentForAutonomica, quotaEstatal, quotaAutonomica, projectBProfile) {
        const alerts = [];
        
        // Alertas de inversión no utilizada
        if (unusedInvestment > 0) {
            alerts.push({
                type: 'warning',
                message: `€${unusedInvestment.toLocaleString()} de su inversión deseada no se han podido optimizar por falta de cuota o por exceder los límites de base.`
            });
        }
        
        // Alertas de compatibilidad autonómica
        if (!ccaaInfo.compatible) {
            alerts.push({
                type: 'info',
                message: `La CCAA seleccionada (${ccaaInfo.special || ccaaInfo}) tiene un régimen especial y no es compatible con la deducción estatal.`
            });
        }
        
        // Alertas de límites alcanzados
        if (investmentForState >= this.estateLimits.maxBase) {
             alerts.push({
                type: 'info',
                message: `Se ha alcanzado la base máxima de deducción estatal (€${this.estateLimits.maxBase.toLocaleString()}).`
            });
        }
        
        if (ccaaInfo.compatible && investmentForAutonomica >= ccaaInfo.maxBase) {
             alerts.push({
                type: 'info',
                message: `Se ha alcanzado la base máxima de deducción autonómica (€${ccaaInfo.maxBase.toLocaleString()}).`
            });
        }
        
        // Alertas de cuotas insuficientes
        if (quotaEstatal < (this.estateLimits.maxBase * this.estateLimits.percentage)) {
            alerts.push({
                type: 'warning',
                message: `Su cuota estatal disponible (€${quotaEstatal.toLocaleString()}) limita el aprovechamiento total de la deducción estatal.`
            });
        }
        
        if (ccaaInfo.compatible && quotaAutonomica < (ccaaInfo.maxBase * ccaaInfo.percentage)) {
            alerts.push({
                type: 'warning',
                message: `Su cuota autonómica disponible (€${quotaAutonomica.toLocaleString()}) limita el aprovechamiento total de la deducción autonómica.`
            });
        }
        
        // Alertas específicas de requisitos de la CCAA
        if (ccaaInfo.notes) {
            alerts.push({
                type: 'info',
                message: `Requisitos específicos en ${ccaaInfo}: ${ccaaInfo.notes}`
            });
        }
        
        // Alertas de validación del proyecto B
        if (projectBProfile && ccaaInfo.compatible) {
            if (projectBProfile.years > 5) {
                alerts.push({
                    type: 'warning',
                    message: `El proyecto B tiene ${projectBProfile.years} años de antigüedad, lo que podría superar el límite permitido en algunas CCAA.`
                });
            }
            
            if (!projectBProfile.location || projectBProfile.location !== ccaaInfo) {
                alerts.push({
                    type: 'warning',
                    message: `Es recomendable que el Proyecto B esté ubicado en ${ccaaInfo} para asegurar el cumplimiento de requisitos autonómicos.`
                });
            }
        }
        
        return alerts;
    }

    getCCAAOptions() {
        return Object.entries(this.ccaaData).map(([name, data]) => ({
            value: name,
            label: data.compatible 
                ? `${name} (${(data.percentage * 100).toFixed(0)}% autonómica, compatible)` 
                : `${name} (${data.special || 'NO compatible'})`
        }));
    }
    
    validateProjectBProfile(profile, ccaa) {
        if (!profile || !ccaa) return { valid: false, message: "Datos incompletos" };
        
        const ccaaInfo = this.ccaaData[ccaa];
        if (!ccaaInfo) return { valid: false, message: "CCAA no encontrada" };
        
        // Si no es compatible, no importa el perfil
        if (!ccaaInfo.compatible) {
            return { valid: false, message: "CCAA no compatible con deducciones estatales" };
        }
        
        // Validación de tipo de empresa
        let isTypeValid = false;
        if (ccaaInfo.acceptedProfiles.includes("todos")) {
            isTypeValid = true;
        } else {
            isTypeValid = ccaaInfo.acceptedProfiles.some(
                acceptedType => profile.type && profile.type.toLowerCase().includes(acceptedType.toLowerCase())
            );
        }
        
        if (!isTypeValid) {
            return { 
                valid: false, 
                message: `El tipo de proyecto no cumple con los perfiles aceptados: ${ccaaInfo.acceptedProfiles.join(', ')}` 
            };
        }
        
        // Validación de antigüedad
        if (profile.years > 5) {
            return { 
                valid: false, 
                message: "La antigüedad del proyecto supera el máximo permitido (5 años)" 
            };
        }
        
        // Validación de ubicación
        if (profile.location && profile.location !== ccaa) {
            return { 
                valid: true, 
                warning: `Es recomendable que el proyecto esté ubicado en ${ccaa}` 
            };
        }
        
        return { valid: true, message: "Proyecto válido para deducción autonómica" };
    }
}

// Exportar la clase para uso en el navegador o como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FiscalEngine };
} else {
    // Si estamos en el navegador, añadirlo al objeto global window
    window.FiscalEngine = FiscalEngine;
}