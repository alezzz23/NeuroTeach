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
    recommendNextStep(data) {
        if (!data || typeof data !== 'object') {
            return {
                action: 'error',
                message: 'Datos inválidos: se requiere emotion y performance en el body.',
            };
        }
        const { emotion, performance } = data;
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
};
exports.AdaptationService = AdaptationService;
exports.AdaptationService = AdaptationService = __decorate([
    (0, common_1.Injectable)()
], AdaptationService);
//# sourceMappingURL=adaptation.service.js.map