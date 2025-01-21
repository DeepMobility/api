import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AdminController } from './admin.controller';
import { PlatformController } from './platform.controller';
import { AdminModule } from '../domain/admin/admin.module';
import { PlatformModule } from '../domain/platform/platform.module';

@Module({
  imports: [
    AdminModule,
    PlatformModule,
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
