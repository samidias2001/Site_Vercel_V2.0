import { get } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  try {
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

    return response.status(200).json({ visits });
  } catch (err) {
    return response.status(200).json({ visits: [] });
  }
}
