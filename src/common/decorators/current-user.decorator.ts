import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser } from '../../modules/auth/strategies/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUser }>();
    if (!request || !request.user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }
    return request.user;
  },
);
