"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EmotionController = class EmotionController {
    analyzeEmotion(data) {
        const emotions = ['feliz', 'frustrado', 'aburrido', 'confundido'];
        if (data && data.forceEmotion && emotions.includes(data.forceEmotion)) {
            return { emotion: data.forceEmotion };
        }
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        return { emotion: randomEmotion };
    }
};
exports.EmotionController = EmotionController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmotionController.prototype, "analyzeEmotion", null);
exports.EmotionController = EmotionController = __decorate([
    (0, common_1.Controller)('emotion')
], EmotionController);
//# sourceMappingURL=emotion.controller.js.map