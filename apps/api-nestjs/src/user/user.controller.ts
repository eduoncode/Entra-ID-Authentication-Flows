import { Scopes, ScopesGuard } from '@auth/guards/scopes.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'), ScopesGuard)
export class UserController {
  @Get('profile')
  @Scopes('access_as_user')
  getUserProfile(@Req() req: any) {
    return {
      message: 'Acesso concedido via Delegated Scope: access_as_user',
      user: req.user.preferred_username,
    };
  }
}
