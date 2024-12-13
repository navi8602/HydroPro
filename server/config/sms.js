// server/config/sms.js
export const smsConfig = {
  provider: process.env.SMS_PROVIDER || 'twilio',
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER
};
