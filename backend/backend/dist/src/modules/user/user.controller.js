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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const auth_guards_1 = require("../../common/guards/auth.guards");
const roles_guard_1 = require("../../common/guards/roles.guard");
const util_service_1 = require("../../common/services/util.service");
const create_user_dto_1 = require("../auth/dto/create-user-dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    userSvc;
    utilSvc;
    constructor(userSvc, utilSvc) {
        this.userSvc = userSvc;
        this.utilSvc = utilSvc;
    }
    async getUsers() {
        return await this.userSvc.getUsers();
    }
    async deleteUser(id) {
        const result = await this.userSvc.deleteUser(id);
        if (!result)
            throw new common_1.HttpException('No se pudo eliminar el usuario', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        return result;
    }
    async getUserById(id) {
        const user = await this.userSvc.getUserById(id);
        if (user)
            return user;
        throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
    }
    async insertUser(user) {
        const encryptedPassword = await this.utilSvc.hashPassword(user.password);
        user.password = encryptedPassword;
        const result = await this.userSvc.insertUser(user);
        if (result == undefined || result == null) {
            throw new common_1.HttpException(`Error al insertar el usuario`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async updateUser(id, user, req) {
        const currentUserId = req['user'].sub;
        const isAdmin = req['user'].role === 'admin';
        if (!isAdmin && currentUserId !== id) {
            throw new common_1.ForbiddenException('No puedes editar el perfil de otro usuario');
        }
        if (user.password) {
            user.password = await this.utilSvc.hashPassword(user.password);
        }
        const result = await this.userSvc.updateUser(id, user);
        if (user.role) {
            await this.userSvc.saveLog(200, '/api/user', `Cambio de rol: usuario ${id} cambió a ${user.role} por usuario ${currentUserId}`, 'ROLE_CHANGED');
        }
        return result;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "insertUser", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("api/user"),
    __metadata("design:paramtypes", [user_service_1.UserService, util_service_1.UtilService])
], UserController);
//# sourceMappingURL=user.controller.js.map