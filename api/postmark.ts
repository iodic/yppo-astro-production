import * as postmark from "postmark";

export default function handler(req:any, res:any) {
  const { body } = req;

  const client = new postmark.ServerClient(
    "20117eea-da45-43d0-a313-b55475dee001",
  );

  client.sendEmailWithTemplate({
    From: `YPPO <yppo@personalombuds.com>`,
    To: "yppo@personalombuds.com",
    Bcc: "mr@stuntcoders.com, secreatariat@dialoguethroughconflict.org",
    ReplyTo: `${body.name} ${body.email}`,
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
