import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [UserController],
})
export class UserModule {}
