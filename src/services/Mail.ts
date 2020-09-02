import * as nodemailer from "nodemailer";
import mailConfig from "../config/mailer";
import template from "../views/template";

class Mail {
  constructor(
    public to?: string,
    public from?: string,
    public subject?: string,
    public message?: string
  ) {}

  async sendMail() {
    const { host, port, secure, auth } = mailConfig;
    let mailOptions = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      html: template(this.message),
    };

    const transporter = nodemailer.createTransport({
      host,
      port,
      secureConnection: secure,
      tls: { ciphers: "SSLv3" },
      auth: auth.user ? auth : null,
    });

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erro no envio de email:\n", error);
        return false;
      } else {
        console.log("E-mail enviado com sucesso!");
        return true;
      }
    });
  }
}

export default new Mail();
