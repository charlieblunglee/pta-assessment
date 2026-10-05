import nodemailer from "nodemailer";

export interface ExecutiveEmail {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  send(message: ExecutiveEmail): Promise<{ id: string }>;
}

export class ResendEmailProvider implements EmailProvider {
  private readonly apiKey: string;
  private readonly from: string;
  constructor(apiKey: string, from: string) { this.apiKey = apiKey; this.from = from; }

  async send(message: ExecutiveEmail): Promise<{ id: string }> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from: this.from, to: [message.to], subject: message.subject, html: message.html })
    });
    if (!response.ok) throw new Error(`EMAIL_PROVIDER_${response.status}`);
    const data = await response.json() as { id?: string };
    if (!data.id) throw new Error("EMAIL_PROVIDER_INVALID_RESPONSE");
    return { id: data.id };
  }
}

export class PostmarkEmailProvider implements EmailProvider {
  private readonly serverToken: string;
  private readonly from: string;
  constructor(serverToken: string, from: string) { this.serverToken = serverToken; this.from = from; }

  async send(message: ExecutiveEmail): Promise<{ id: string }> {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-postmark-server-token": this.serverToken
      },
      body: JSON.stringify({
        From: this.from,
        To: message.to,
        Subject: message.subject,
        HtmlBody: message.html,
        MessageStream: "outbound"
      })
    });
    if (!response.ok) throw new Error(`EMAIL_PROVIDER_${response.status}`);
    const data = await response.json() as { MessageID?: string; ErrorCode?: number; Message?: string };
    if (!data.MessageID || data.ErrorCode) throw new Error("EMAIL_PROVIDER_INVALID_RESPONSE");
    return { id: data.MessageID };
  }
}

function parseSender(value: string): { name?: string; email: string } {
  const match = value.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);
  if (match) return { name: match[1].trim() || undefined, email: match[2].trim() };
  return { email: value.trim() };
}

export class BrevoEmailProvider implements EmailProvider {
  private readonly apiKey: string;
  private readonly from: string;
  constructor(apiKey: string, from: string) { this.apiKey = apiKey; this.from = from; }

  async send(message: ExecutiveEmail): Promise<{ id: string }> {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": this.apiKey
      },
      body: JSON.stringify({
        sender: parseSender(this.from),
        to: [{ email: message.to }],
        subject: message.subject,
        htmlContent: message.html
      })
    });
    if (!response.ok) throw new Error(`EMAIL_PROVIDER_${response.status}`);
    const data = await response.json() as { messageId?: string };
    if (!data.messageId) throw new Error("EMAIL_PROVIDER_INVALID_RESPONSE");
    return { id: data.messageId };
  }
}

export class GmailEmailProvider implements EmailProvider {
  constructor(private readonly password: string, private readonly from: string) {}

  async send(message: ExecutiveEmail): Promise<{ id: string }> {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com", port: 465, secure: true,
      auth: { user: "techandinnovationcouncil@himap.ph", pass: this.password },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000
    });
    try {
      const info = await transport.sendMail({
        from: this.from, to: message.to, subject: message.subject, html: message.html
      });
      if (!info.messageId || !info.accepted?.length || info.rejected?.length) {
        throw new Error("EMAIL_PROVIDER_RECIPIENT_REJECTED");
      }
      return { id: info.messageId };
    } catch {
      // Never expose SMTP credentials, recipient details, or provider responses.
      throw new Error("EMAIL_PROVIDER_SMTP_FAILED");
    } finally {
      transport.close();
    }
  }
}

export function getEmailProvider(): EmailProvider {
  const provider = (process.env.EMAIL_PROVIDER || "brevo").toLowerCase();
  const from = "HIMAP Technology and Innovation Council <techandinnovationcouncil@himap.ph>";
  if (provider === "gmail") {
    const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
    if (!password) throw new Error("EMAIL_NOT_CONFIGURED");
    return new GmailEmailProvider(password, from);
  }
  if (provider === "brevo") {
    const key = process.env.BREVO_API_KEY;
    if (!key) throw new Error("EMAIL_NOT_CONFIGURED");
    return new BrevoEmailProvider(key, from);
  }
  if (provider === "postmark") {
    const token = process.env.POSTMARK_SERVER_TOKEN;
    if (!token) throw new Error("EMAIL_NOT_CONFIGURED");
    return new PostmarkEmailProvider(token, from);
  }
  if (provider === "resend") {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("EMAIL_NOT_CONFIGURED");
    return new ResendEmailProvider(key, from);
  }
  throw new Error("EMAIL_PROVIDER_UNSUPPORTED");
}
