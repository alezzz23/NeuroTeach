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
exports.LearnController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const learn_service_1 = require("./learn.service");
const learn_runtime_1 = require("./learn.runtime");
let LearnController = class LearnController {
    learnService;
    constructor(learnService) {
        this.learnService = learnService;
    }
    async listTracks() {
        return this.learnService.listTracks();
    }
    async listTracksWithProgress(req) {
        const userId = req.user.userId;
        return this.learnService.listTracksWithProgress(userId);
    }
    async getDashboardSummary(req) {
        const userId = req.user.userId;
        return this.learnService.getDashboardLearningSummary(userId);
    }
    async getTrackBySlug(slug) {
        const track = await this.learnService.getTrackBySlug(slug);
        if (!track || !track.isPublished) {
            throw new common_1.HttpException('Track no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return track;
    }
    async getTrackProgress(slug, req) {
        const userId = req.user.userId;
        const progress = await this.learnService.getTrackProgress(userId, slug);
        if (!progress) {
            throw new common_1.HttpException('Track no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return progress;
    }
    async getExerciseById(id) {
        const exercise = await this.learnService.getExerciseById(id);
        if (!exercise) {
            throw new common_1.HttpException('Ejercicio no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return exercise;
    }
    async getExerciseProgress(id, req) {
        const userId = req.user.userId;
        return this.learnService.getExerciseProgress(userId, id);
    }
    async saveExerciseProgress(id, body, req) {
        const userId = req.user.userId;
        if (!body || typeof body !== 'object') {
            throw new common_1.HttpException('Body inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.learnService.saveExerciseProgress(userId, id, body);
    }
    async runExercise(id, body) {
        const exercise = await this.learnService.getExerciseById(id);
        if (!exercise) {
            throw new common_1.HttpException('Ejercicio no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const code = String(body?.code ?? '');
        const submission = body?.submission;
        return (0, learn_runtime_1.runCodeMvp)(code, exercise.language, submission, exercise);
    }
    async validateExercise(id, body) {
        const exercise = await this.learnService.getExerciseById(id);
        if (!exercise) {
            throw new common_1.HttpException('Ejercicio no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const code = String(body?.code ?? '');
        const submission = body?.submission;
        return (0, learn_runtime_1.validateCodeMvp)(code, exercise.validation, submission, exercise);
    }
};
exports.LearnController = LearnController;
__decorate([
    (0, common_1.Get)('tracks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "listTracks", null);
__decorate([
    (0, common_1.Get)('tracks-with-progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "listTracksWithProgress", null);
__decorate([
    (0, common_1.Get)('dashboard-summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('tracks/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "getTrackBySlug", null);
__decorate([
    (0, common_1.Get)('tracks/:slug/progress'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "getTrackProgress", null);
__decorate([
    (0, common_1.Get)('exercises/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "getExerciseById", null);
__decorate([
    (0, common_1.Get)('exercises/:id/progress'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "getExerciseProgress", null);
__decorate([
    (0, common_1.Post)('exercises/:id/progress'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "saveExerciseProgress", null);
__decorate([
    (0, common_1.Post)('exercises/:id/run'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "runExercise", null);
__decorate([
    (0, common_1.Post)('exercises/:id/validate'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "validateExercise", null);
exports.LearnController = LearnController = __decorate([
    (0, common_1.Controller)('learn'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [learn_service_1.LearnService])
], LearnController);
//# sourceMappingURL=learn.controller.js.map