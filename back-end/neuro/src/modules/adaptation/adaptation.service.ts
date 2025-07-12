import { Injectable } from '@nestjs/common';

@Injectable()
export class AdaptationService {
  recommendNextStep(data: any) {
    if (!data || typeof data !== 'object') {
      return {
        action: 'error',
        message: 'Datos inválidos: se requiere emotion y performance en el body.',
      };
    }
    const { emotion, performance } = data;
    // Lógica mock basada en reglas simples
    if (emotion === 'frustrado' || performance < 50) {
      return {
        action: 'reducir_dificultad',
        message: 'Vamos a intentarlo con un ejemplo más sencillo.',
      };
    }
    if (emotion === 'aburrido' || performance > 90) {
      return {
        action: 'aumentar_dificultad',
        message: '¡Genial! Probemos un reto más avanzado.',
      };
    }
    if (emotion === 'confundido') {
      return {
        action: 'cambiar_explicacion',
        message: 'Veamos este tema desde otra perspectiva.',
      };
    }
    return {
      action: 'refuerzo_positivo',
      message: '¡Buen trabajo! Continúa así.',
    };
  }
}
