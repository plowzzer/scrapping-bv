import * as nodemailer from "nodemailer";
import mailConfig from "../config/mailer";
import template from "../views/template";

class Mail {
  constructor(
    public to?: string,
    public subject?: string,
    public message?: string
  ) {}

  sendMail() {
    const { host, port, secure, auth } = mailConfig;

    let mailOptions = {
      from: "probe@nave.com.br",
      to: this.to,
      subject: this.subject,
      html: template(this.message),
    };

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: secure ? secure : null,
      auth: auth.user ? auth : null,
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return error;
      } else {
        return "E-mail enviado com sucesso!";
      }
    });
  }
}

export default new Mail();
