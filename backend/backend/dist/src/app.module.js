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
const core_1 = require("@nestjs/core");
const http_execption_filter_1 = require("./common/filters/http-execption.filter");
const roles_guard_1 = require("./common/guards/roles.guard");
const database_module_1 = require("./common/providers/database.module");
const prisma_service_1 = require("./common/services/prisma.service");
const util_service_1 = require("./common/services/util.service");
const auth_module_1 = require("./modules/auth/auth.module");
const logs_controller_1 = require("./modules/logs/logs.controller");
const task_module_1 = require("./modules/task/task.module");
const user_module_1 = require("./modules/user/user.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, task_module_1.TaskModule, database_module_1.DatabaseModule, user_module_1.UserModule, config_1.ConfigModule.forRoot()],
        controllers: [logs_controller_1.LogsController],
        providers: [
            prisma_service_1.PrismaService,
            util_service_1.UtilService,
            roles_guard_1.RolesGuard,
            core_1.Reflector,
            {
                provide: core_1.APP_FILTER,
                useClass: http_execption_filter_1.AllExceptionFilter,
            },
        ],
        exports: [prisma_service_1.PrismaService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map