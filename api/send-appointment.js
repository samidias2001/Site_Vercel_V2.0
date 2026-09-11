export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = request.body || {};
    const childName = (data.childName || '').toString().trim();
    const childAge = (data.childAge || '').toString().trim();
    const childAgeUnit = (data.childAgeUnit || 'ans').toString().trim();
    const parentPhone = (data.parentPhone || '').toString().trim();
    const city = (data.city || '').toString().trim();
    const reason = (data.reason || '').toString().trim();
    const desiredDate = (data.desiredDate || '').toString().trim();
    const website = (data.website || '').toString().trim();

    // Honeypot anti-spam: un champ invisible rempli par un bot est ignoré.
    if (website) {
      return response.status(200).json({ success: true });
    }

    // Validation minimale côté serveur
    if (!childName || !childAge || !parentPhone || !desiredDate) {
      return response.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    // Refuser toute date antérieure à aujourd'hui (revalidation côté serveur,
    // au cas où la validation côté navigateur aurait été contournée)
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Algiers' }); // format YYYY-MM-DD
    if (desiredDate < todayStr) {
      return response.status(400).json({ error: 'La date souhaitée ne peut pas être antérieure à aujourd\'hui' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant dans les variables d\'environnement');
      return response.status(500).json({ error: 'Configuration serveur incomplète' });
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { timeZone: 'Africa/Algiers' });
    const timeStr = now.toLocaleTimeString('fr-FR', { timeZone: 'Africa/Algiers' });

    const messageLines = [
      '🆕 Nouvelle demande de rendez-vous',
      '',
      `👶 Enfant : ${childName}`,
      `🎂 Âge : ${childAge} ${childAgeUnit}`,
      `📞 Téléphone parent : ${parentPhone}`,
      `📍 Ville : ${city || 'Non précisée'}`,
      `📝 Motif : ${reason || 'Non précisé'}`,
      `📅 Date souhaitée : ${desiredDate}`,
      '',
      `🕒 Reçu le ${dateStr} à ${timeStr}`,
    ];
    const text = messageLines.join('\n');

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    const tgResult = await tgResponse.json();

    if (!tgResponse.ok || !tgResult.ok) {
      console.error('Erreur envoi Telegram:', tgResult);
      return response.status(502).json({ error: 'Échec de l\'envoi Telegram' });
    }

    return response.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur send-appointment:', err);
    return response.status(500).json({ error: err.message });
  }
}
