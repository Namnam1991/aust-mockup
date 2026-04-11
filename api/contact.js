import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { navn, epost, melding, topic } = req.body;

  if (!navn || !epost || !melding) {
    return res.status(400).json({ error: 'Mangler påkrevde felt' });
  }

  try {
    await resend.emails.send({
      from: 'aust <post@austcommunity.no>',
      to: 'post@austcommunity.no',
      replyTo: epost,
      subject: `Kontaktskjema – ${topic || 'Spørsmål'}`,
      text: [
        `Emne: ${topic || '–'}`,
        `Navn: ${navn}`,
        `E-post: ${epost}`,
        '',
        melding,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend contact error:', err);
    return res.status(500).json({ error: 'Kunne ikke sende melding' });
  }
}
