import { Roles, RolesGuard } from '@auth/guards/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('Admin.ReadWrite')
  getAdminData() {
    return { message: 'Acesso concedido via App Role: Admin.ReadWrite' };
  }
}
