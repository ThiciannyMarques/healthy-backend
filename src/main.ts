import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Segurança: Helmet configura headers HTTP seguros
  app.use(helmet());

  // CORS: Habilitado para integração futura com frontend
  app.enableCors({
    origin: '*', // Em produção, alteraremos para o domínio correto
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Prefixação global de rotas
  app.setGlobalPrefix('api/v1');

  // Validação global fortemente tipada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Lança erro se houver propriedades extras
      transform: true, // Transforma payloads em objetos tipados
    }),
  );

  // Interceptors e Filtros Globais
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
  console.log(
    `Healthy MVP Backend is running on: http://localhost:3000/api/v1`,
  );
}
bootstrap();
