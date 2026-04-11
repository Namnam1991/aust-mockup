import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { navn, epost, telefon, kommentar, arrangement, antall, total, subject } = req.body;

  if (!navn || !epost) {
    return res.status(400).json({ error: 'Mangler påkrevde felt' });
  }

  try {
    await resend.emails.send({
      from: 'aust <post@austcommunity.no>',
      to: 'post@austcommunity.no',
      replyTo: epost,
      subject: subject || 'Ny bestilling',
      text: [
        `Arrangement: ${arrangement || '–'}`,
        `Navn: ${navn}`,
        `E-post: ${epost}`,
        `Telefon: ${telefon || '–'}`,
        `Antall plasser: ${antall}`,
        `Total: ${total}`,
        kommentar ? `\nKommentar:\n${kommentar}` : '',
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend booking error:', err);
    return res.status(500).json({ error: 'Kunne ikke sende bestilling' });
  }
}
