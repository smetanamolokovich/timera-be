import { Module } from '@nestjs/common';
import { SERVICE_TOKENS } from '../../common/tokens';
import { NodemailerEmailService } from './infra/nodemailer-email.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: SERVICE_TOKENS.EmailService,
      useClass: NodemailerEmailService,
    },
  ],
  exports: [SERVICE_TOKENS.EmailService],
})
export class EmailModule {}
