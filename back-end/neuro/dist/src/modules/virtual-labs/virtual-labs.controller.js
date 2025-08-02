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
exports.VirtualLabsController = void 0;
const common_1 = require("@nestjs/common");
const virtual_labs_service_1 = require("./virtual-labs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let VirtualLabsController = class VirtualLabsController {
    virtualLabsService;
    constructor(virtualLabsService) {
        this.virtualLabsService = virtualLabsService;
    }
    async getAllLabs(category, difficulty) {
        try {
            if (category && category !== 'all') {
                return await this.virtualLabsService.getLabsByCategory(category);
            }
            if (difficulty) {
                return await this.virtualLabsService.getLabsByDifficulty(difficulty);
            }
            return await this.virtualLabsService.getAllLabs();
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener los laboratorios', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getLabStatistics() {
        try {
            return await this.virtualLabsService.getLabStatistics();
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getLabById(id) {
        try {
            const lab = await this.virtualLabsService.getLabById(id);
            if (!lab) {
                throw new common_1.HttpException('Laboratorio no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return lab;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error al obtener el laboratorio', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getLabProgress(labId, req) {
        try {
            const userId = req.user.userId;
            return await this.virtualLabsService.getUserLabProgress(userId, labId);
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener el progreso del laboratorio', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveLabProgress(labId, progressData, req) {
        try {
            const userId = req.user.userId;
            const progress = {
                ...progressData,
                userId,
                labId
            };
            return await this.virtualLabsService.saveLabProgress(progress);
        }
        catch (error) {
            throw new common_1.HttpException('Error al guardar el progreso del laboratorio', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateCode(validateData) {
        try {
            const { code, stepId, labId } = validateData;
            const lab = await this.virtualLabsService.getLabById(labId);
            if (!lab) {
                throw new common_1.HttpException('Laboratorio no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            const step = lab.steps.find(s => s.id === stepId);
            if (!step) {
                throw new common_1.HttpException('Paso del laboratorio no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.virtualLabsService.validateCode(code, step.validation);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error al validar el código', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async executeCode(executeData) {
        try {
            const { code, language } = executeData;
            if (!code || !language) {
                throw new common_1.HttpException('Código y lenguaje son requeridos', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.virtualLabsService.executeCode(code, language);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error al ejecutar el código', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getLabStep(labId, stepId) {
        try {
            const lab = await this.virtualLabsService.getLabById(labId);
            if (!lab) {
                throw new common_1.HttpException('Laboratorio no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            const step = lab.steps.find(s => s.id === stepId);
            if (!step) {
                throw new common_1.HttpException('Paso del laboratorio no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return step;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error al obtener el paso del laboratorio', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async completeLab(labId, req) {
        try {
            const userId = req.user.userId;
            const lab = await this.virtualLabsService.getLabById(labId);
            if (!lab) {
                throw new common_1.HttpException('Laboratorio no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            const completedAt = new Date();
            await this.virtualLabsService.saveLabProgress({
                userId,
                labId,
                completedAt,
                currentStep: lab.steps.length,
                completedSteps: lab.steps.map(step => step.id)
            });
            return {
                message: 'Laboratorio completado exitosamente',
                completedAt
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error al completar el laboratorio', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserProgress(req) {
        try {
            const userId = req.user.userId;
            return {
                userId,
                totalLabsStarted: 2,
                totalLabsCompleted: 1,
                totalTimeSpent: 45,
                recentLabs: [
                    {
                        labId: 1,
                        title: 'Introducción a Python',
                        progress: 100,
                        completedAt: new Date()
                    },
                    {
                        labId: 2,
                        title: 'HTML y CSS Básico',
                        progress: 33,
                        lastAccessed: new Date()
                    }
                ],
                skillsProgress: {
                    python: 75,
                    html: 40,
                    css: 30,
                    javascript: 0,
                    sql: 0
                }
            };
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener el progreso del usuario', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.VirtualLabsController = VirtualLabsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('difficulty')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "getAllLabs", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "getLabStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "getLabById", null);
__decorate([
    (0, common_1.Get)(':id/progress'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "getLabProgress", null);
__decorate([
    (0, common_1.Post)(':id/progress'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "saveLabProgress", null);
__decorate([
    (0, common_1.Post)('validate-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "validateCode", null);
__decorate([
    (0, common_1.Post)('execute-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "executeCode", null);
__decorate([
    (0, common_1.Get)(':id/steps/:stepId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('stepId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "getLabStep", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "completeLab", null);
__decorate([
    (0, common_1.Get)('user/progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VirtualLabsController.prototype, "getUserProgress", null);
exports.VirtualLabsController = VirtualLabsController = __decorate([
    (0, common_1.Controller)('virtual-labs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [virtual_labs_service_1.VirtualLabsService])
], VirtualLabsController);
//# sourceMappingURL=virtual-labs.controller.js.map