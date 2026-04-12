"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
require("dotenv/config");
const app_module_1 = require("./app.module");
const http_execption_filter_ts_1 = require("./common/filters/http-execption.filter.ts");
const prisma_service_1 = require("./common/services/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true
    }));
    const prisma = app.get(prisma_service_1.PrismaService);
    app.useGlobalFilters(new http_execption_filter_ts_1.AllExceptionFilter(prisma));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API con vulnerabilidades de seguridad')
        .setDescription('')
        .setVersion('')
        .addTag('')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
//# sourceMappingURL=main.js.map