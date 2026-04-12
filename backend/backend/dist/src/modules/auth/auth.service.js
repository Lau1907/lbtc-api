"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../common/services/prisma.service");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    userService;
    jwtSvc;
    prisma;
    constructor(userService, jwtSvc, prisma) {
        this.userService = userService;
        this.jwtSvc = jwtSvc;
        this.prisma = prisma;
    }
    async login(username, password) {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no existe');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Contraseña incorrecta');
        }
        const payload = {
            sub: user.id,
            username: user.username
        };
        const access_token = await this.jwtSvc.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        });
        const refresh_token = await this.jwtSvc.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d'
        });
        return {
            access_token,
            refresh_token
        };
    }
    async refreshToken(token) {
        try {
            const payload = await this.jwtSvc.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_SECRET
            });
            const user = await this.userService.getUserById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Usuario no válido');
            }
            const newPayload = {
                sub: user.id,
                username: user.username
            };
            const access_token = await this.jwtSvc.signAsync(newPayload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1h'
            });
            const refresh_token = await this.jwtSvc.signAsync(newPayload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            });
            return {
                access_token,
                refresh_token
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
    }
    async updateHash(userId, hash) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: { hash },
        });
    }
    async getUserById(id) {
        return await this.prisma.user.findFirst({ where: { id } });
    }
    async getUserByUsername(username) {
        return await this.prisma.user.findFirst({ where: { username } });
    }
    async register(name, lastname, username, hashedPassword) {
        return await this.prisma.user.create({
            data: { name, lastname, username, password: hashedPassword },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map