"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const tutor_module_1 = require("./modules/tutor/tutor.module");
const emotion_module_1 = require("./modules/emotion/emotion.module");
const user_module_1 = require("./modules/user/user.module");
const history_module_1 = require("./modules/history/history.module");
const adaptation_module_1 = require("./modules/adaptation/adaptation.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            tutor_module_1.TutorModule,
            emotion_module_1.EmotionModule,
            user_module_1.UserModule,
            history_module_1.HistoryModule,
            adaptation_module_1.AdaptationModule,
            analytics_module_1.AnalyticsModule,
            gamification_module_1.GamificationModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map