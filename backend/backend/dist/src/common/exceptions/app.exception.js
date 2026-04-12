"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppException = void 0;
const common_1 = require("@nestjs/common");
class AppException extends common_1.HttpException {
    message;
    statusCode;
    errorCode;
    constructor(message, statusCode = common_1.HttpStatus.BAD_REQUEST, errorCode) {
        super(message, statusCode);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}
exports.AppException = AppException;
//# sourceMappingURL=app.exception.js.map