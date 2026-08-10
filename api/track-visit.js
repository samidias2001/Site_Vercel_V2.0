import { put, get } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = request.body;
    const ip = request.headers['x-forwarded-for'] || 
               request.headers['x-real-ip'] || 
               data.ip || 'inconnue';
    
    const visit = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      ip: ip.split(',')[0].trim(),
      device: data.device || 'inconnu',
      ua: data.ua || 'inconnu',
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      timestamp: Date.now(),
    };

    let visits = [];
    try {
      const blob = await get('visits/all-visits.json');
      if (blob) {
        const text = await blob.text();
        visits = JSON.parse(text);
      }
    } catch (e) {
      visits = [];
    }

    visits.push(visit);
    if (visits.length > 3000) visits = visits.slice(-3000);

    await put('visits/all-visits.json', JSON.stringify(visits), {
      access: 'private',
      addRandomSuffix: false,
    });

    return response.status(200).json({ success: true });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}
