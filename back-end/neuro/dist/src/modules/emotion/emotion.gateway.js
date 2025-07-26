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
exports.EmotionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt = require("jsonwebtoken");
const axios_1 = require("axios");
let EmotionGateway = class EmotionGateway {
    server;
    async handleConnection(client) {
        const token = client.handshake.auth?.token || client.handshake.query?.token;
        if (!token) {
            client.emit('error', 'No token provided');
            client.disconnect();
            return;
        }
        try {
            jwt.verify(token, process.env.JWT_SECRET || 'secret');
        }
        catch (e) {
            client.emit('error', 'Invalid token');
            client.disconnect();
        }
    }
    handleDisconnect(client) {
    }
    async handleFrame(data, client) {
        try {
            const response = await axios_1.default.post('http://localhost:5000/analyze', {
                image: data.image,
            });
            const emotion = response.data.emotion;
            client.emit('emotion', { emotion });
        }
        catch (error) {
            client.emit('emotion', { error: 'Error al analizar la emoción', details: error?.response?.data?.error || error.message });
        }
    }
};
exports.EmotionGateway = EmotionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EmotionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('frame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EmotionGateway.prototype, "handleFrame", null);
exports.EmotionGateway = EmotionGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/emotion',
    })
], EmotionGateway);
//# sourceMappingURL=emotion.gateway.js.map