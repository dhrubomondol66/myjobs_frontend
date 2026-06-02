import emailjs from '@emailjs/browser';

// Initialize EmailJS (you need to replace with your Public Key)
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS on app start
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Send a password reset email using EmailJS
 * @param {string} email - User's email address
 * @param {string} resetLink - Password reset link (e.g., http://yourdomain.com/reset?token=xxx)
 * @param {string} userName - User's name (optional)
 * @returns {Promise} EmailJS response
 */
export const sendPasswordResetEmail = async (email, resetLink, userName = 'User') => {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn('EmailJS is not configured. Please set environment variables.');
    throw new Error('Email service is not configured');
  }

  const templateParams = {
    to_email: email,
    user_name: userName,
    reset_link: resetLink,
    // You can add more parameters like:
    // reset_code: code,
    // expiry_time: '30 minutes',
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

/**
 * Alternative: Send password reset email with code (if using codes instead of links)
 */
export const sendPasswordResetCode = async (email, resetCode, userName = 'User') => {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn('EmailJS is not configured. Please set environment variables.');
    throw new Error('Email service is not configured');
  }

  const templateParams = {
    to_email: email,
    user_name: userName,
    reset_code: resetCode,
    expiry_time: '30 minutes',
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    console.log('Reset code email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send reset code email:', error);
    throw error;
  }
};
