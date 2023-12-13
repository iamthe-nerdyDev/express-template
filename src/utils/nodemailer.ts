import nodemailer from "nodemailer";
import util from "util";
import log from "./logger";
import { config } from "../config";

type SendMailParams = {
  receiver: string;
  subject: string;
  html: string;
};

function removeHTML(html: string) {
  if (!html || html === "") return html;

  return html.toString().replace(/(<([^>]+)>)/gi, "");
}

export async function sendMail(data: SendMailParams): Promise<boolean> {
  const { port, username: user, password: pass, host } = config.smtp;

  const transporter = nodemailer.createTransport({
    port,
    host,
    secure: port === 465,
    auth: { user, pass },
  });

  const mailData = {
    from: user,
    to: data.receiver,
    subject: data.subject,
    text: removeHTML(data.html),
    html: data.html,
  };

  const sendMailPromise = util
    .promisify(transporter.sendMail)
    .bind(transporter);

  try {
    await sendMailPromise(mailData);

    return true;
  } catch (e: any) {
    log.error(e);

    return false;
  }
}
