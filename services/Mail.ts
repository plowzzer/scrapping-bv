import * as nodemailer from "nodemailer";
import mailConfig from "../config/mailer";

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
      html: this.message,
    };

    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: false,
      auth: auth.user ? auth : null,
    });

    // transporter.use('compile')

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
