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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const course_service_1 = require("./course.service");
const jwt_auth_guard_1 = require("../modules/auth/jwt-auth.guard");
let CourseController = class CourseController {
    courseService;
    constructor(courseService) {
        this.courseService = courseService;
    }
    async getAllCourses() {
        return this.courseService.getAllCourses();
    }
    async getMyCoursesProgress(req) {
        const userId = req.user.userId;
        return this.courseService.getCoursesWithProgress(userId);
    }
    async getCourseById(id) {
        return this.courseService.getCourseById(id);
    }
    async enrollInCourse(courseId, req) {
        const userId = req.user.userId;
        return this.courseService.enrollUserInCourse(userId, courseId);
    }
    async getLesson(lessonId) {
        return this.courseService.getLessonById(lessonId);
    }
    async completeLesson(lessonId, req, body) {
        const userId = req.user.userId;
        return this.courseService.completeLessonProgress(userId, lessonId, body.score, body.timeSpent);
    }
    async getUserLessonProgress(courseId, req) {
        const userId = req.user.userId;
        return this.courseService.getUserLessonProgress(userId, courseId);
    }
    async createCourse(courseData) {
        return this.courseService.createCourse(courseData);
    }
    async createLesson(courseId, lessonData) {
        return this.courseService.createLesson({
            ...lessonData,
            courseId,
        });
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)('my-progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getMyCoursesProgress", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.Post)(':id/enroll'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "enrollInCourse", null);
__decorate([
    (0, common_1.Get)(':id/lessons/:lessonId'),
    __param(0, (0, common_1.Param)('lessonId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getLesson", null);
__decorate([
    (0, common_1.Post)(':id/lessons/:lessonId/complete'),
    __param(0, (0, common_1.Param)('lessonId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "completeLesson", null);
__decorate([
    (0, common_1.Get)(':id/my-progress'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getUserLessonProgress", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Post)(':id/lessons'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "createLesson", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
//# sourceMappingURL=course.controller.js.map