import { Injectable } from '@nestjs/common';

export interface AdaptationRequest {
  emotion: string;
  performance: number;
  context?: string;
  learningStyle?: string;
  timeSpent?: number;
  attempts?: number;
}

export interface AdaptationResponse {
  action: string;
  message: string;
  difficulty: 'muy_facil' | 'facil' | 'normal' | 'dificil' | 'muy_dificil';
  strategy: string;
  resources: string[];
  estimatedTime: number;
  confidence: number;
}

@Injectable()
export class AdaptationService {
  private readonly emotionWeights = {
    'feliz': 1.2,
    'motivado': 1.3,
    'concentrado': 1.1,
    'frustrado': 0.6,
    'aburrido': 0.7,
    'confundido': 0.8,
    'ansioso': 0.7,
    'cansado': 0.5
  };

  private readonly learningStrategies = {
    visual: ['diagramas', 'mapas_mentales', 'infografias', 'videos'],
    auditivo: ['explicaciones_verbales', 'podcasts', 'discusiones', 'musica'],
    kinestesico: ['ejercicios_practicos', 'simulaciones', 'experimentos', 'juegos'],
    lectoescritor: ['textos', 'resúmenes', 'ensayos', 'listas']
  };

  recommendNextStep(data: AdaptationRequest): AdaptationResponse {
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
    
    // Calcular puntuación ajustada por emoción
    const emotionMultiplier = this.emotionWeights[emotion] || 1.0;
    const adjustedPerformance = performance * emotionMultiplier;
    
    // Determinar dificultad basada en rendimiento y intentos
    const difficulty = this.calculateDifficulty(adjustedPerformance, attempts);
    
    // Seleccionar estrategia de aprendizaje
    const strategy = this.selectStrategy(emotion, adjustedPerformance, timeSpent);
    
    // Obtener recursos recomendados
    const resources = this.getRecommendedResources(learningStyle, difficulty);
    
    // Calcular tiempo estimado
    const estimatedTime = this.calculateEstimatedTime(difficulty, emotion);
    
    // Calcular confianza en la recomendación
    const confidence = this.calculateConfidence(emotion, performance, attempts);
    
    // Generar acción y mensaje personalizado
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

  private calculateDifficulty(performance: number, attempts: number): 'muy_facil' | 'facil' | 'normal' | 'dificil' | 'muy_dificil' {
    if (performance >= 90 && attempts <= 2) return 'muy_dificil';
    if (performance >= 80) return 'dificil';
    if (performance >= 60) return 'normal';
    if (performance >= 40) return 'facil';
    return 'muy_facil';
  }

  private selectStrategy(emotion: string, performance: number, timeSpent: number): string {
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

  private getRecommendedResources(learningStyle: string, difficulty: string): string[] {
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

  private calculateEstimatedTime(difficulty: string, emotion: string): number {
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

  private calculateConfidence(emotion: string, performance: number, attempts: number): number {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on performance
    if (performance >= 80) confidence += 0.2;
    else if (performance < 40) confidence -= 0.2;
    
    // Adjust based on emotion
    if (['feliz', 'motivado', 'concentrado'].includes(emotion)) confidence += 0.1;
    else if (['frustrado', 'confundido'].includes(emotion)) confidence -= 0.1;
    
    // Adjust based on attempts
    if (attempts > 3) confidence -= 0.1;
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  private generateActionAndMessage(emotion: string, performance: number, difficulty: string, strategy: string): { action: string, message: string } {
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
}
