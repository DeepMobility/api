import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { AdminController } from './admin.controller';
import { PlatformController } from './platform.controller';
import { AdminModule } from '../domain/admin/admin.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AdminModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [AdminController, PlatformController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ApplicationModule {}
