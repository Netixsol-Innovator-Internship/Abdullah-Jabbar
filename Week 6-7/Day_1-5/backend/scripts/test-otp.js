// test-otp.js

// Test OTP functionality
require('dotenv').config();
const { MailService } = require('../dist/mail/mail.service');

(async () => {
  try {
    const mailService = new MailService();

    // Test email send
    const testEmail = 'abdullahjabbar818@gmail.com'; // Replace with your email
    const subject = 'OTP Test - Direct Mail Service';
    const html =
      '<p>Your test OTP is: <b style="font-size:20px">123456</b></p><p>This is a test to verify email sending works.</p>';

    console.log('Testing direct email send...');

    const result = await mailService.sendMail(testEmail, subject, html);
    console.log('Email sent successfully:', result.messageId);
  } catch (error) {
    console.error('Email test failed:', error.message);
    console.error('Full error:', error);
  }
})();
