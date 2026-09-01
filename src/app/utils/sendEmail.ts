/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

import config from '../config/index.js';
import AppError from '../helpers/AppError.js';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: Number(config.smtp_port),
  secure: Number(config.smtp_port) === 465,
  auth: {
    user: config.smtp_user,
    pass: config.smtp_pass,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    // const templatePath = path.join(
    //   __dirname,
    //   "../templates",
    //   `${templateName}.ejs`
    // );

    const templatePath = path.resolve(
      __dirname,
      'templates',
      `${templateName}.ejs`,
    );

    console.log('Template Path:', templatePath);

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: config.smtp_from,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);

    return info;
  } catch (error: any) {
    console.error('Email sending error:', error);

    throw new AppError(500, error?.message || 'Failed to send email');
  }
};
