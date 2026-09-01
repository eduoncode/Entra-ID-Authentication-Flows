import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { OboService } from './services/obo.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, OboService],
  exports: [PassportModule, OboService],
})
export class AuthModule {}
