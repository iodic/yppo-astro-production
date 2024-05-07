import * as postmark from "postmark";

export default function handler(req:any, res:any) {
  const { body } = req;

  const client = new postmark.ServerClient(
    "20117eea-da45-43d0-a313-b55475dee001",
  );

  const message = {
    From: "marko@stuntcoders.com",
    To: "mr@stuntcoders.com",
    Subject: "New Contact Form Submission",
    TextBody: `
      Name: ${body.name}
      Email: ${body.email}
      Reason: ${body.reason}
      Message: ${body.message}
    `,
  };

  client
    .sendEmail(message)
    .then(() => {
      res.send(`Email sent successfully`);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      res.send(`Error sending email`);
    });
}
