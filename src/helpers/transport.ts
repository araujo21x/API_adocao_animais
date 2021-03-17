import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_AUTH_USER,
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRECT,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN
  },
  tls: { rejectUnauthorized: false }
});

export const mailOptions = (email: string, newPassword: string) => ({
  from: `Adote um anjo <${process.env.EMAIL_SEND}>`,
  to: email,
  subject: 'Sua nova senha para o site adote um anjo.',
  text: `Olá, sua nova senha: ${newPassword}`
});
