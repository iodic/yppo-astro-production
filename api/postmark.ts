import * as postmark from "postmark";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const client = new postmark.ServerClient(
      "20117eea-da45-43d0-a313-b55475dee001",
    );

    const message = {
      From: "marko@stuntcoders.com",
      To: "nikola@stuntcoders.com",
      Subject: "New Contact Form Submission",
      TextBody: `
        Name: ${requestBody.name}
        Email: ${requestBody.email}
        Reason: ${requestBody.reason}
        Message: ${requestBody.message}
      `,
    };

    await client.sendEmail(message);

    return new Response(`Email sent successfully`);
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(`Error sending email`);
  }
}
