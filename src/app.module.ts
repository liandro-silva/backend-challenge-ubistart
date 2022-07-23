import { Module } from '@nestjs/common';
import { BackofficeModule } from '@modules/backoffice/backoffice.module';

@Module({
  imports: [BackofficeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
