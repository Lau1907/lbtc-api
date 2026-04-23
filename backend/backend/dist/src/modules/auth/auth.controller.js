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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_guards_1 = require("../../common/guards/auth.guards");
const util_service_1 = require("../../common/services/util.service");
const create_user_dto_1 = require("./dto/create-user-dto");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
let AuthController = class AuthController {
    authSvc;
    utilSvc;
    constructor(authSvc, utilSvc) {
        this.authSvc = authSvc;
        this.utilSvc = utilSvc;
    }
    async generateTokens(user) {
        const basePayload = { sub: user.id, name: user.name, lastName: user.lastname, role: user.role };
        const refresh_token_jwt = await this.utilSvc.generateJWT(basePayload, '7d');
        const hashRT = await this.utilSvc.hash(refresh_token_jwt);
        await this.authSvc.updateHash(user.id, hashRT);
        const access_token = await this.utilSvc.generateJWT({ ...basePayload, hash: hashRT }, '1h');
        return { access_token, refresh_token: refresh_token_jwt };
    }
    async register(createUserDto) {
        try {
            const { name, lastname, username, password, role } = createUserDto;
            const hashedPassword = await this.utilSvc.hashPassword(password);
            const user = await this.authSvc.register(name, lastname, username, hashedPassword, role ?? 'user');
            return this.generateTokens(user);
        }
        catch (error) {
            console.error('REGISTER ERROR:', error);
            throw error;
        }
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const user = await this.authSvc.getUserByUsername(username);
        if (!user)
            throw new common_1.UnauthorizedException('El usuario y/o contraseña es incorrecto');
        if (!(await this.utilSvc.checkPassword(password, user.password)))
            throw new common_1.UnauthorizedException('El usuario y/o contraseña son incorrectos');
        await this.authSvc.saveLog(200, '/api/auth/login', `Login exitoso: ${username}`, 'LOGIN_SUCCESS');
        return this.generateTokens(user);
    }
    getProfile(req) {
        return req['user'];
    }
    async refreshToken(req) {
        const sessionUser = req['user'];
        const token = req.headers.authorization?.split(' ')[1];
        const user = await this.authSvc.getUserById(sessionUser.sub);
        if (!user || !user.hash)
            throw new common_1.ForbiddenException('Acceso denegado');
        const isValid = await this.utilSvc.checkPassword(token, user.hash);
        if (!isValid)
            throw new common_1.ForbiddenException('Token inválido');
        return this.generateTokens(user);
    }
    async logout(req) {
        await this.authSvc.updateHash(req['user'].sub, null);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('/refresh'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        util_service_1.UtilService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map