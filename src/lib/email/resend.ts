import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendExpiryNotificationParams {
  to: string
  contactName: string
  companyName: string
  serviceName: string
  serviceCategory: string
  expiryDate: string
  daysLeft: number
}

export async function sendExpiryNotification({
  to,
  contactName,
  companyName,
  serviceName,
  serviceCategory,
  expiryDate,
  daysLeft,
}: SendExpiryNotificationParams) {
  const isExpired = daysLeft <= 0
  const urgency = isExpired ? 'EXPIRED' : daysLeft <= 7 ? 'URGENT' : 'REMINDER'

  const subject = isExpired
    ? `⚠️ EXPIRED: ${serviceName} for ${companyName}`
    : daysLeft <= 7
      ? `🔴 URGENT: ${serviceName} expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
      : `📋 Reminder: ${serviceName} expires in ${daysLeft} days`

  const html = buildEmailTemplate({
    contactName,
    companyName,
    serviceName,
    serviceCategory,
    expiryDate,
    daysLeft,
    urgency,
  })

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Relsoft Notify <onboarding@resend.dev>',
    to: [to],
    subject,
    html,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

function buildEmailTemplate({
  contactName,
  companyName,
  serviceName,
  serviceCategory,
  expiryDate,
  daysLeft,
  urgency,
}: {
  contactName: string
  companyName: string
  serviceName: string
  serviceCategory: string
  expiryDate: string
  daysLeft: number
  urgency: string
}) {
  const isExpired = daysLeft <= 0
  const accentColor = isExpired ? '#dc2626' : daysLeft <= 7 ? '#dc2626' : daysLeft <= 14 ? '#f59e0b' : '#2563eb'
  const statusText = isExpired
    ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`
    : `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">

    <!-- Header -->
    <div style="background-color:#0f1729;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="display:inline-block;background-color:#2563eb;border-radius:12px;padding:12px;margin-bottom:16px;">
        <span style="color:white;font-size:20px;font-weight:bold;">RS</span>
      </div>
      <h1 style="color:white;font-size:22px;margin:0 0 4px;">Relsoft Notify</h1>
      <p style="color:#94a3b8;font-size:13px;margin:0;">Service Expiry Alert</p>
    </div>

    <!-- Urgency Banner -->
    <div style="background-color:${accentColor};padding:12px 24px;text-align:center;">
      <span style="color:white;font-size:13px;font-weight:700;letter-spacing:1px;">${urgency}: ${statusText}</span>
    </div>

    <!-- Body -->
    <div style="background-color:white;padding:32px;border-radius:0 0 16px 16px;">
      <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Hi <strong>${contactName}</strong>,
      </p>
      <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 24px;">
        This is a notification regarding a service ${isExpired ? 'that has expired' : 'approaching its expiration date'} for <strong>${companyName}</strong>.
      </p>

      <!-- Service Details Card -->
      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Service</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;text-align:right;">${serviceName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #e2e8f0;">Category</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;text-align:right;border-top:1px solid #e2e8f0;">${serviceCategory || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #e2e8f0;">Company</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;text-align:right;border-top:1px solid #e2e8f0;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #e2e8f0;">Expiry Date</td>
            <td style="padding:8px 0;color:${accentColor};font-size:14px;font-weight:700;text-align:right;border-top:1px solid #e2e8f0;">${expiryDate}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #e2e8f0;">Status</td>
            <td style="padding:8px 0;text-align:right;border-top:1px solid #e2e8f0;">
              <span style="display:inline-block;background-color:${accentColor};color:white;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">${statusText}</span>
            </td>
          </tr>
        </table>
      </div>

      <p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 8px;">
        ${isExpired
          ? 'Please take immediate action to renew this service and avoid disruption.'
          : 'Please ensure timely renewal to avoid any service disruption.'}
      </p>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
        If this has already been addressed, you can disregard this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px;">
      <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">
        Sent by Relsoft Notify — Service Expiry Management System
      </p>
      <p style="color:#94a3b8;font-size:11px;margin:0;">
        © ${new Date().getFullYear()} Relsoft LLC. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>`
}
