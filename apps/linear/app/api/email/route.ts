import nodemailer from 'nodemailer';
import { transporterPool } from '../../../utils/config/mailConfig';
import { sendOTPHTML } from '../../../utils/template/otpTemplate';
import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json();
    const token = request.headers.get('Authorization');
    console.log(token);
    if (!token) {
      return NextResponse.json(
        { message: 'You are not Authorized to send Emails' },
        { status: 401 }
      );
    }

    // const decoded = jwt.decode(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sec3rt');
      // const decoded = jwt.verify(token, secretKey); // Verifies the token signature
      // console.log('Verified Payload:', decoded);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token:' });
    }

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${to}`,

      subject: `${subject}`,
      text: subject,
      html: sendOTPHTML({ message: text, name: to }),
    };
    await transporterPool.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error : any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to send email', error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
