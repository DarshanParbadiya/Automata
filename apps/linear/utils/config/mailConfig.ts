import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  // port: process.env.EMAIL_PORT,
  //* uncomment following line if you are not using ethereal mail server
  // secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//* verify connection configuration for mail server
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('✘ UNABLE TO CONNECT TO THE MAIL SERVER');
//     console.error(error);
//   } else {
//     console.info(`✔ MAIL SERVER IS READY TO SEND MAILS`);
//   }
// });

export const transporterPool = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true, // Enable pooling
  maxConnections: 5, // Limit the number of simultaneous connections
  maxMessages: 10, // Limit the number of messages per connection
});
