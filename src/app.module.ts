import { Module } from '@nestjs/common';
import { BackofficeModule } from '@modules/backoffice/backoffice.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [BackofficeModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
