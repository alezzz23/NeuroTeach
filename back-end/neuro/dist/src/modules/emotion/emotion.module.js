"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionModule = void 0;
const common_1 = require("@nestjs/common");
const emotion_controller_1 = require("./emotion.controller");
const emotion_gateway_1 = require("./emotion.gateway");
let EmotionModule = class EmotionModule {
};
exports.EmotionModule = EmotionModule;
exports.EmotionModule = EmotionModule = __decorate([
    (0, common_1.Module)({
        controllers: [emotion_controller_1.EmotionController],
        providers: [emotion_gateway_1.EmotionGateway],
    })
], EmotionModule);
//# sourceMappingURL=emotion.module.js.map