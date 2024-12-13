// server/services/auth/sms.service.js
export const smsService = {
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  async sendVerificationCode(phone, code) {
    // Интеграция с SMS-провайдером
    console.log(`Sending code ${code} to ${phone}`);
  }
};
