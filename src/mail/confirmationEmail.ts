import { readFileSync } from 'fs';
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';

const getConfirmationEmailContent = (token: string) => {
  const html = readFileSync(
    `${__dirname}/templates/confirmationEmail.html`,
    'utf8'
  );
  const { FRONT_DOMAIN } = process.env;
  html.replace('{FRONT_DOMAIN}', FRONT_DOMAIN || 'http://localhost:8000');
  html.replace('{TOKEN}', token);
  return html;
};

export const sendConfirmationEmail = async (
  userEmail: string,
  token: string
) => {
  const testAccount = await createTestAccount();
  const transport = createTransport({
    name: testAccount.smtp.host,
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const html = getConfirmationEmailContent(token);
  const info = await transport.sendMail({
    from: testAccount.user,
    to: userEmail,
    subject: 'Confirmation Email',
    html,
  });

  const url = getTestMessageUrl(info);
  console.log('url', url);

  return info;
};
