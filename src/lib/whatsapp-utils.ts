/**
 * Generates a WhatsApp URL with a pre-formatted reminder message.
 */
export function generateWhatsAppReminder(
    phone: string,
    invoiceId: string,
    amount: number,
    dueDate: string
) {
    // Clean phone number (remove +, spaces, etc.)
    const cleanPhone = phone.replace(/\D/g, "");

    const message = `*Payment Reminder: UPUC ERP*%0A%0ADear Customer,%0A%0AThis is a friendly reminder that payment for Invoice *${invoiceId}* of *₹${amount}* is due on *${dueDate}*.%0A%0APlease ignore if already paid. Thank you!`;

    return `https://wa.me/${cleanPhone}?text=${message}`;
}
