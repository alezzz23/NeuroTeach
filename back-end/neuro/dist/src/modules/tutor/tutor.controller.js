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
exports.TutorController = void 0;
const common_1 = require("@nestjs/common");
const tutor_service_1 = require("./tutor.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TutorController = class TutorController {
    tutorService;
    constructor(tutorService) {
        this.tutorService = tutorService;
    }
    async askTutor(prompt, emotion) {
        return this.tutorService.askTutor(prompt, emotion);
    }
};
exports.TutorController = TutorController;
__decorate([
    (0, common_1.Post)('ask'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('prompt')),
    __param(1, (0, common_1.Body)('emotion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TutorController.prototype, "askTutor", null);
exports.TutorController = TutorController = __decorate([
    (0, common_1.Controller)('tutor'),
    __metadata("design:paramtypes", [tutor_service_1.TutorService])
], TutorController);
//# sourceMappingURL=tutor.controller.js.map