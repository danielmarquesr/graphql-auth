import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';

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

  const { FRONT_DOMAIN } = process.env;
  const info = await transport.sendMail({
    from: testAccount.user,
    to: userEmail,
    subject: 'Confirmation Email',
    html: `
      <h2>Confirmation Email</h2>
      <div>
        <a href="${FRONT_DOMAIN}/confirm?token=${token}">Click here</a> to confirm your email.
      </div>
    `,
  });

  const url = getTestMessageUrl(info);
  console.log('url', url);

  return info;
};
