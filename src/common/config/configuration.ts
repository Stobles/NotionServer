export const config = () => ({
  port: process.env.PORT || 3000,
  clientUrl: process.env.CLIENT_URL_BASE,
  serverUrl: process.env.SERVER_URL_BASE,
  domain: process.env.HOST_COOKIE,
  uploadedFilesDest: process.env.UPLOADED_FILES_DESTINATION,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  smtp: {
    host: process.env.SMTP_MAIL_HOST,
    port: process.env.SMTP_MAIL_PORT,
    user: process.env.SMTP_MAIL_USER,
    password: process.env.SMTP_MAIL_PASSWORD,
  },
});
