import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = "Franchise Church <noreply@thefranchiselagos.com.ng>";
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? "https://thefranchiselagos.com.ng";

// ─── Shared layout wrapper ────────────────────────────────────────────────────

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1b1b1b;font-family:Ubuntu,Helvetica,sans-serif;color:#ffffff;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <img src="${APP_URL()}/assets/logo.png" alt="Franchise Church" style="height:44px;width:auto;margin-bottom:32px;display:block;">
    ${body}
    <p style="margin-top:40px;color:#6b7280;font-size:12px;">
      &copy; ${new Date().getFullYear()} Franchise Church, Lagos.
    </p>
  </div>
</body>
</html>`;
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:28px;padding:12px 28px;background:#af601a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;">${label}</a>`;
}

// ─── Email builders ───────────────────────────────────────────────────────────

function adminNotificationHtml(opts: { fullName: string; email: string; username: string }) {
  return wrap(`
    <h2 style="color:#af601a;font-size:20px;margin-bottom:16px;">New Member Signup</h2>
    <p style="color:#e5e5e5;line-height:1.6;">A new member has registered and is awaiting approval.</p>
    <table style="width:100%;margin-top:24px;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Full Name</td><td style="padding:8px 0;color:#fff;font-size:14px;">${opts.fullName}</td></tr>
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Email</td><td style="padding:8px 0;color:#fff;font-size:14px;">${opts.email}</td></tr>
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Username</td><td style="padding:8px 0;color:#fff;font-size:14px;">@${opts.username}</td></tr>
    </table>
    ${btn(`${APP_URL()}/admin/members`, "Review in Admin Dashboard")}
  `);
}

function welcomeHtml(opts: { fullName: string }) {
  return wrap(`
    <h1 style="color:#af601a;font-size:24px;margin-bottom:16px;">Welcome to Franchise Church Online</h1>
    <p style="color:#e5e5e5;line-height:1.8;font-size:16px;">Hi ${opts.fullName},</p>
    <p style="color:#e5e5e5;line-height:1.8;font-size:16px;">Your membership has been approved! You now have full access to the Franchise Church community, sermon library, and member features.</p>
    <p style="color:#e5e5e5;line-height:1.8;font-size:16px;font-style:italic;">We envision all men celebrating endless life in Christ.</p>
    ${btn(`${APP_URL()}/social`, "Explore the Community")}
  `);
}

function rejectionHtml(opts: { fullName: string; reason: string }) {
  const reasonBlock = opts.reason
    ? `<div style="background:#2d2d2d;border-left:4px solid #af601a;padding:16px;margin:24px 0;border-radius:4px;"><p style="color:#e5e5e5;margin:0;font-size:14px;">${opts.reason}</p></div>`
    : "";
  return wrap(`
    <h2 style="color:#af601a;font-size:20px;margin-bottom:16px;">Regarding Your Membership Application</h2>
    <p style="color:#e5e5e5;line-height:1.8;">Hi ${opts.fullName},</p>
    <p style="color:#e5e5e5;line-height:1.8;">After review, we are unable to approve your membership application at this time.</p>
    ${reasonBlock}
    <p style="color:#e5e5e5;line-height:1.8;">If you believe this is in error or would like to speak with our pastoral team, please reach out.</p>
    ${btn(`${APP_URL()}/pages/counselling`, "Contact Us")}
  `);
}

function passwordResetHtml(opts: { fullName: string; resetUrl: string }) {
  return wrap(`
    <h2 style="color:#af601a;font-size:20px;margin-bottom:16px;">Reset Your Password</h2>
    <p style="color:#e5e5e5;line-height:1.8;">Hi ${opts.fullName},</p>
    <p style="color:#e5e5e5;line-height:1.8;">We received a request to reset your password. Click the button below. This link expires in 1 hour.</p>
    ${btn(opts.resetUrl, "Reset Password")}
    <p style="margin-top:24px;color:#9ca3af;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
  `);
}

// ─── Public send functions ────────────────────────────────────────────────────

export async function sendAdminNotification(opts: {
  fullName: string;
  email: string;
  username: string;
}) {
  const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!adminEmails.length) return;

  await resend.emails.send({
    from: FROM,
    to: adminEmails,
    subject: `New member signup: ${opts.fullName} (${opts.email})`,
    html: adminNotificationHtml(opts),
  });
}

export async function sendWelcomeEmail(opts: { to: string; fullName: string }) {
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Welcome to Franchise Church Online",
    html: welcomeHtml({ fullName: opts.fullName }),
  });
}

export async function sendRejectionEmail(opts: {
  to: string;
  fullName: string;
  reason: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Your Franchise Church membership application",
    html: rejectionHtml({ fullName: opts.fullName, reason: opts.reason }),
  });
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  fullName: string;
  token: string;
}) {
  const resetUrl = `${APP_URL()}/auth/reset-password?token=${opts.token}`;
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Reset your Franchise Church password",
    html: passwordResetHtml({ fullName: opts.fullName, resetUrl }),
  });
}
