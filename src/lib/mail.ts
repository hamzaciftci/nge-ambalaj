import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (!transporter) {
        const smtpConfig = {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465 (SSL/TLS), false for other ports (STARTTLS)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        };
        transporter = nodemailer.createTransport(smtpConfig);
    }
    return transporter;
}

export interface MailOptions {
    to: string;
    subject: string;
    text?: string;
    html: string;
}

export async function sendMail(options: MailOptions) {
    const from = process.env.SMTP_FROM || `"NGE Ambalaj" <${process.env.SMTP_USER}>`;

    const mailOptions = {
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    try {
        const info = await getTransporter().sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
