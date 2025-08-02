"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptationService = void 0;
const common_1 = require("@nestjs/common");
let AdaptationService = class AdaptationService {
    emotionWeights = {
        'feliz': 1.2,
        'motivado': 1.3,
        'concentrado': 1.1,
        'frustrado': 0.6,
        'aburrido': 0.7,
        'confundido': 0.8,
        'ansioso': 0.7,
        'cansado': 0.5
    };
    learningStrategies = {
        visual: ['diagramas', 'mapas_mentales', 'infografias', 'videos'],
        auditivo: ['explicaciones_verbales', 'podcasts', 'discusiones', 'musica'],
        kinestesico: ['ejercicios_practicos', 'simulaciones', 'experimentos', 'juegos'],
        lectoescritor: ['textos', 'resúmenes', 'ensayos', 'listas']
    };
    recommendNextStep(data) {
        if (!data || typeof data !== 'object') {
            return {
                action: 'error',
                message: 'Datos inválidos: se requiere emotion y performance en el body.',
                difficulty: 'normal',
                strategy: 'revision',
                resources: [],
                estimatedTime: 0,
                confidence: 0
            };
        }
        const { emotion, performance, context, learningStyle = 'visual', timeSpent = 0, attempts = 1 } = data;
        const emotionMultiplier = this.emotionWeights[emotion] || 1.0;
        const adjustedPerformance = performance * emotionMultiplier;
        const difficulty = this.calculateDifficulty(adjustedPerformance, attempts);
        const strategy = this.selectStrategy(emotion, adjustedPerformance, timeSpent);
        const resources = this.getRecommendedResources(learningStyle, difficulty);
        const estimatedTime = this.calculateEstimatedTime(difficulty, emotion);
        const confidence = this.calculateConfidence(emotion, performance, attempts);
        const { action, message } = this.generateActionAndMessage(emotion, adjustedPerformance, difficulty, strategy);
        return {
            action,
            message,
            difficulty,
            strategy,
            resources,
            estimatedTime,
            confidence
        };
    }
    calculateDifficulty(performance, attempts) {
        if (performance >= 90 && attempts <= 2)
            return 'muy_dificil';
        if (performance >= 80)
            return 'dificil';
        if (performance >= 60)
            return 'normal';
        if (performance >= 40)
            return 'facil';
        return 'muy_facil';
    }
    selectStrategy(emotion, performance, timeSpent) {
        if (emotion === 'frustrado' || performance < 40) {
            return 'refuerzo_gradual';
        }
        if (emotion === 'aburrido' || (performance > 85 && timeSpent < 300)) {
            return 'desafio_avanzado';
        }
        if (emotion === 'confundido') {
            return 'explicacion_alternativa';
        }
        if (emotion === 'cansado' || timeSpent > 1800) {
            return 'descanso_activo';
        }
        if (emotion === 'ansioso') {
            return 'relajacion_guiada';
        }
        return 'progresion_normal';
    }
    getRecommendedResources(learningStyle, difficulty) {
        const baseResources = this.learningStrategies[learningStyle] || this.learningStrategies.visual;
        const difficultyResources = {
            'muy_facil': ['tutoriales_basicos', 'ejemplos_simples'],
            'facil': ['ejercicios_guiados', 'practica_asistida'],
            'normal': ['ejercicios_estandar', 'teoria_aplicada'],
            'dificil': ['problemas_complejos', 'casos_estudio'],
            'muy_dificil': ['proyectos_avanzados', 'investigacion_independiente']
        };
        return [...baseResources.slice(0, 2), ...difficultyResources[difficulty]];
    }
    calculateEstimatedTime(difficulty, emotion) {
        const baseTime = {
            'muy_facil': 10,
            'facil': 15,
            'normal': 20,
            'dificil': 30,
            'muy_dificil': 45
        };
        const emotionModifier = {
            'frustrado': 1.5,
            'confundido': 1.3,
            'cansado': 1.4,
            'feliz': 0.9,
            'motivado': 0.8
        };
        return Math.round(baseTime[difficulty] * (emotionModifier[emotion] || 1.0));
    }
    calculateConfidence(emotion, performance, attempts) {
        let confidence = 0.7;
        if (performance >= 80)
            confidence += 0.2;
        else if (performance < 40)
            confidence -= 0.2;
        if (['feliz', 'motivado', 'concentrado'].includes(emotion))
            confidence += 0.1;
        else if (['frustrado', 'confundido'].includes(emotion))
            confidence -= 0.1;
        if (attempts > 3)
            confidence -= 0.1;
        return Math.max(0.1, Math.min(1.0, confidence));
    }
    generateActionAndMessage(emotion, performance, difficulty, strategy) {
        const messages = {
            refuerzo_gradual: {
                action: 'reducir_dificultad',
                message: '🌱 Vamos paso a paso. He preparado ejercicios más sencillos para construir tu confianza.'
            },
            desafio_avanzado: {
                action: 'aumentar_dificultad',
                message: '🚀 ¡Excelente progreso! Es hora de un desafío más emocionante que ponga a prueba tus habilidades.'
            },
            explicacion_alternativa: {
                action: 'cambiar_explicacion',
                message: '💡 Probemos un enfoque diferente. A veces un nuevo punto de vista hace que todo tenga sentido.'
            },
            descanso_activo: {
                action: 'sugerir_pausa',
                message: '⏰ Has trabajado mucho. Te sugiero un breve descanso con una actividad relajante.'
            },
            relajacion_guiada: {
                action: 'tecnicas_relajacion',
                message: '🧘‍♀️ Notamos algo de tensión. Probemos algunas técnicas de respiración antes de continuar.'
            },
            progresion_normal: {
                action: 'continuar_progreso',
                message: '✨ ¡Vas muy bien! Continuemos con el siguiente tema manteniendo este ritmo.'
            }
        };
        return messages[strategy] || messages.progresion_normal;
    }
};
exports.AdaptationService = AdaptationService;
exports.AdaptationService = AdaptationService = __decorate([
    (0, common_1.Injectable)()
], AdaptationService);
//# sourceMappingURL=adaptation.service.js.map