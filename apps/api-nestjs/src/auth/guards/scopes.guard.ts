import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const SCOPES_KEY = 'scopes';

export const Scopes = (...scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.get<string[]>(
      SCOPES_KEY,
      context.getHandler(),
    );
    if (!requiredScopes) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.scp)
      throw new ForbiddenException('Acesso negado: Escopos ausentes');

    let tokenScopes: string[];

    if (typeof user.scp === 'string') {
      tokenScopes = user.scp.split(' ');
    } else {
      console.log('Fallback tokenScopes atingido. Valor recebido:', user.scp);
      tokenScopes = user.scp;
    }

    const hasScope = () =>
      requiredScopes.some((scope) => tokenScopes.includes(scope));

    if (!hasScope())
      throw new ForbiddenException('Acesso negado: Escopos insuficientes');

    return true;
  }
}
