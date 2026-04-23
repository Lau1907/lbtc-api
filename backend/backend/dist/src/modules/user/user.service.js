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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const pg_1 = require("pg");
const prisma_service_1 = require("../../common/services/prisma.service");
let UserService = class UserService {
    db;
    prisma;
    constructor(db, prisma) {
        this.db = db;
        this.prisma = prisma;
    }
    async getUsers() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                role: true,
                created_at: true
            }
        });
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                role: true,
                created_at: true
            }
        });
        if (!user)
            throw new Error(`User with id ${id} not found`);
        return user;
    }
    async findByUsername(username) {
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }
    async insertUser(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const query = `
        INSERT INTO "User" (name, lastname, username, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
        const result = await this.db.query(query, [
            user.name,
            user.lastname,
            user.username,
            hashedPassword
        ]);
        return result.rows[0];
    }
    async updateUser(id, userUpdated) {
        const user = await this.getUserById(id);
        const hashedPassword = userUpdated.password
            ? await bcrypt.hash(userUpdated.password, 10)
            : user.password;
        const query = `
        UPDATE "User"
        SET
            name=$1,
            lastname=$2,
            username=$3,
            password=$4
        WHERE id=$5
        RETURNING *
        `;
        const result = await this.db.query(query, [
            userUpdated.name ?? user.name,
            userUpdated.lastname ?? user.lastname,
            userUpdated.username ?? user.username,
            hashedPassword,
            id
        ]);
        return result.rows[0];
    }
    async deleteUser(id) {
        await this.getUserById(id);
        const sql = `DELETE FROM "User" WHERE id=$1`;
        const result = await this.db.query(sql, [id]);
        return (result.rowCount ?? 0) > 0;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [pg_1.Client,
        prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map