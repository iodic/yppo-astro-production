import * as postmark from "postmark";

export default function handler(req:any, res:any) {
  const { body } = req;

  const client = new postmark.ServerClient(
    "20117eea-da45-43d0-a313-b55475dee001",
  );

  client.sendEmailWithTemplate({
    From: `${body.email}`,
    Bcc: "marijac@stuntcoders.com",
    To: "yppo@personalombuds.com",
    "TemplateAlias": "welcome",
    "TemplateModel": {
      "name": `${body.name}`,
      "email": `${body.email}`,
      "message": `${body.message}`,
    }
  }).then(() => {
    res.send(`Email sent successfully`);
  })
  .catch((error) => {
    console.error("Error sending email:", error);
    res.send(`Error sending email`);
  });;
}
