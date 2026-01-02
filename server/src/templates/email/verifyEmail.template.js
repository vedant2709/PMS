import { baseEmailTemplate } from "./base.template.js";

export const verifyEmailTemplate = (name, verifyUrl) =>
  baseEmailTemplate(`
    <div class="header">Verify your email</div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>
        Thanks for signing up for <strong>PMS App</strong>.
        Please verify your email address to activate your account.
      </p>

      <a href="${verifyUrl}" class="button">Verify Email</a>

      <p style="margin-top:16px;">
        This link will expire in 15 minutes.
      </p>

      <p>
        If you didn’t create this account, you can safely ignore this email.
      </p>
    </div>
  `);
