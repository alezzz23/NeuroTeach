"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let TutorService = class TutorService {
    async askTutor(prompt, emotion) {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new common_1.InternalServerErrorException('OpenRouter API key not set');
        }
        const systemPrompt = `Eres un tutor de IA. Explica el siguiente tema como si el usuario estuviera sintiendo: ${emotion}.`;
        try {
            const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                model: 'mistralai/mistral-7b-instruct',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'NeuroTeach-Tutor',
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al consultar OpenRouter: ' + error.message);
        }
    }
};
exports.TutorService = TutorService;
exports.TutorService = TutorService = __decorate([
    (0, common_1.Injectable)()
], TutorService);
//# sourceMappingURL=tutor.service.js.map