
export async function sendEmail(to: String, body: string, authToken: string) {
  console.log(`Sending out email to ${to} with message ${body}`);
  // return true;

  const emailData = {
    to: to,
    subject: body,
    text: body,
  };

  try {
    // Making a POST request to http://localhost:3030/api/email
    const response = await fetch('http://localhost:3030/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : authToken
      },
      body: JSON.stringify(emailData),
    });
      return response.json();
    // console.log

    // If the response is OK, return a success message
    if (response.ok) {
      return { message: 'Email sent successfully' };
    } else {
      // If the response is not OK, return the error message
      const error = await response.json();
      return 'Failed to send email';
    }
  } catch (err) {
    // Handle any network errors
    return 'Error sending email';
  }
}
