import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const appUrl = process.env.APP_URL || "https://whisperbox.replit.app";

let resend: Resend | null = null;
if (apiKey) {
  resend = new Resend(apiKey);
}

export async function sendNewMessageNotification({
  toEmail,
  toName,
  username,
}: {
  toEmail: string;
  toName: string;
  username: string;
}): Promise<void> {
  if (!resend) return;

  const dashboardUrl = `${appUrl}/dashboard`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Anonymous Message</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#86ead4,#5ecfb7);padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.25);border-radius:6px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                          <span style="font-size:14px;font-weight:800;color:#0a2520;line-height:28px;">W</span>
                        </td>
                        <td style="padding-left:8px;">
                          <span style="font-size:15px;font-weight:700;color:#0a2520;">WhisperBox</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">You have a new message!</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
                Hey ${toName}, someone sent you an anonymous message on WhisperBox.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf8;border:1px solid rgba(134,234,212,0.4);border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Anonymous Sender</p>
                    <p style="margin:0;font-size:14px;color:#374151;">Someone wants to tell you something — open your dashboard to read it.</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a
                      href="${dashboardUrl}"
                      style="display:inline-block;background:#86ead4;color:#0a2520;font-size:14px;font-weight:700;padding:12px 28px;border-radius:4px;text-decoration:none;"
                    >
                      View in Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e5e7eb;padding:20px 32px;background:#f9fafb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                You're receiving this because email notifications are enabled for <strong>@${username}</strong>.<br/>
                <a href="${dashboardUrl}" style="color:#86ead4;text-decoration:none;">Manage notifications in Settings</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    await resend.emails.send({
      from: `WhisperBox <${fromAddress}>`,
      to: toEmail,
      subject: `📬 You have a new anonymous message on WhisperBox`,
      html,
    });
  } catch (err) {
    console.error("[email] Failed to send notification:", err);
  }
}
