import { Resend } from "resend";
import { getSetting } from "./settingsCache";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const appUrl = process.env.APP_URL || "https://whisperbox.replit.app";

let resend: Resend | null = null;
if (apiKey) {
  resend = new Resend(apiKey);
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => vars[key] ?? `{{${key}}}`,
  );
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
  const fromName = await getSetting("app_name", "WhisperBox");

  const subject = interpolate(
    await getSetting(
      "email_new_msg_subject",
      "📬 Kamu punya pesan anonim baru di {{appName}}",
    ),
    { appName: fromName, name: toName, username },
  );

  const introText = interpolate(
    await getSetting(
      "email_new_msg_intro",
      "Hei {{name}}, seseorang mengirim pesan anonim kepadamu di {{appName}}.",
    ),
    { appName: fromName, name: toName, username },
  );

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pesan Anonim Baru</title>
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
                          <span style="font-size:14px;font-weight:800;color:#0a2520;line-height:28px;">${fromName.charAt(0).toUpperCase()}</span>
                        </td>
                        <td style="padding-left:8px;">
                          <span style="font-size:15px;font-weight:700;color:#0a2520;">${fromName}</span>
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
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Pesan anonim baru!</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">${introText}</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf8;border:1px solid rgba(134,234,212,0.4);border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Pengirim Anonim</p>
                    <p style="margin:0;font-size:14px;color:#374151;">Seseorang ingin menyampaikan sesuatu — buka dashboard untuk membacanya.</p>
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
                      Lihat di Dashboard →
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
                Kamu menerima email ini karena notifikasi email aktif untuk <strong>@${username}</strong>.<br/>
                <a href="${dashboardUrl}" style="color:#86ead4;text-decoration:none;">Kelola notifikasi di Settings</a>
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
      from: `${fromName} <${fromAddress}>`,
      to: toEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("[email] Failed to send notification:", err);
  }
}

export async function sendReplyNotification({
  toEmail,
  originalMessage,
  replyContent,
  ownerUsername,
}: {
  toEmail: string;
  originalMessage: string;
  replyContent: string;
  ownerUsername: string;
}): Promise<void> {
  if (!resend) return;

  const profileUrl = `${appUrl}/@${ownerUsername}`;
  const fromName = await getSetting("app_name", "WhisperBox");

  const subject = interpolate(
    await getSetting(
      "email_reply_subject",
      "💬 @{{ownerUsername}} membalas pesanmu di {{appName}}",
    ),
    { appName: fromName, ownerUsername },
  );

  const introText = interpolate(
    await getSetting(
      "email_reply_intro",
      "<strong>@{{ownerUsername}}</strong> membalas pesan anonim yang kamu kirim di {{appName}}.",
    ),
    { appName: fromName, ownerUsername },
  );

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pesanmu dibalas!</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#86ead4,#5ecfb7);padding:28px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.25);border-radius:6px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                    <span style="font-size:14px;font-weight:800;color:#0a2520;line-height:28px;">${fromName.charAt(0).toUpperCase()}</span>
                  </td>
                  <td style="padding-left:8px;">
                    <span style="font-size:15px;font-weight:700;color:#0a2520;">${fromName}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;">Pesanmu dibalas! 🎉</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">${introText}</p>

              <!-- Original message -->
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Pesanmu</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:16px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:14px;color:#6b7280;font-style:italic;">"${originalMessage.length > 200 ? originalMessage.slice(0, 200) + "…" : originalMessage}"</p>
                  </td>
                </tr>
              </table>

              <!-- Reply -->
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#0d9488;text-transform:uppercase;letter-spacing:0.05em;">Balasan dari @${ownerUsername}</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf8;border:1px solid rgba(134,234,212,0.5);border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0;font-size:15px;color:#111827;font-weight:500;">${replyContent}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a
                      href="${profileUrl}"
                      style="display:inline-block;background:#14b8a6;color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:4px;text-decoration:none;"
                    >
                      Kirim pesan lagi →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e5e7eb;padding:20px 32px;background:#f9fafb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;line-height:1.6;">
                Kamu menerima email ini karena kamu memilih untuk mendapat notifikasi balasan<br/>saat mengirim pesan anonim ke <strong>@${ownerUsername}</strong> di ${fromName}.<br/>
                Email ini dikirim satu kali dan tidak akan digunakan untuk keperluan lain.
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
      from: `${fromName} <${fromAddress}>`,
      to: toEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("[email] Failed to send reply notification:", err);
  }
}
