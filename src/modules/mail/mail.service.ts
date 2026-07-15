import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: parseInt(port, 10) === 465,
        auth: { user, pass },
      });
      this.logger.log('Serviço de e-mail SMTP real inicializado.');
    } else {
      this.logger.warn(
        'Credenciais SMTP ausentes. O sistema rodará em MODO SIMULADO de envio de e-mails.',
      );
    }
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const resetUrl = `healthy://reset-password?token=${token}`;
    const subject = 'Recuperação de Senha - Healthy App';
    const textContent = `Você solicitou a recuperação de sua senha. Use o seguinte token para redefini-la no aplicativo: ${token}\n\nOu clique no link para abrir o app: ${resetUrl}`;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"Healthy Team" <${process.env.SMTP_FROM || 'no-reply@healthy.app'}>`,
          to: email,
          subject,
          text: textContent,
        });
        this.logger.log(
          `E-mail de recuperação enviado com sucesso para: ${email}`,
        );
      } catch (error) {
        this.logger.error(
          `Falha ao enviar e-mail real de recuperação para ${email}`,
          error,
        );
        throw new Error('Falha ao enviar e-mail de recuperação.');
      }
    } else {
      this.logger.warn('=== [SIMULAÇÃO DE ENVIO DE E-MAIL] ===');
      this.logger.warn(`Para: ${email}`);
      this.logger.warn(`Assunto: ${subject}`);
      this.logger.warn(`Token: ${token}`);
      this.logger.warn(`Link (Deep Link): ${resetUrl}`);
      this.logger.warn('======================================');
    }
  }
}
