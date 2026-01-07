import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLowStockAlert(email: string, itemName: string, quantity: number) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ Email alert skipped: RESEND_API_KEY not found in env")
        return
    }

    try {
        await resend.emails.send({
            from: 'Inventory App <onboarding@resend.dev>', // Default testing domain
            to: email,
            subject: `🚨 Low Stock Alert: ${itemName}`,
            html: `
        <h1>Low Stock Warning</h1>
        <p>The item <strong>${itemName}</strong> is running low.</p>
        <p>Current Quantity: <strong>${quantity}</strong></p>
        <p>Please restock soon.</p>
      `,
        });
        console.log(`📧 Email sent to ${email} for ${itemName}`)
    } catch (error) {
        console.error("Failed to send email:", error)
    }
}
