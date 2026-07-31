import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString() @IsOptional() SMTP_HOST?: string;
  @Type(() => Number) @IsNumber() @IsOptional() SMTP_PORT?: number;
  @IsString() @IsOptional() SMTP_USER?: string;
  @IsString() @IsOptional() SMTP_PASS?: string;
  @IsString() @IsOptional() SMTP_FROM?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    console.error('Erros de validação de ambiente:', errors.toString());
    throw new Error(errors.toString());
  }
  return validatedConfig;
}