# Configuration Vercel — formulaire de rendez-vous → Telegram

Le site est prévu pour un déploiement statique sur Vercel avec deux fonctions serverless :
- `/api/track-visit.js`
- `/api/get-visits.js`
- `/api/send-appointment.js`

## Variables d'environnement Vercel

Dans **Vercel → Project → Settings → Environment Variables**, créer :

- `TELEGRAM_BOT_TOKEN` = token du bot Telegram
- `TELEGRAM_CHAT_ID` = ID du chat qui doit recevoir les demandes

Ne jamais mettre ces valeurs dans un fichier HTML/JS public ni dans GitHub.

Après ajout/modification des variables, effectuer un nouveau déploiement.

## Fonctionnement

`rendez-vous.html` envoie les données à `/api/send-appointment`.
La fonction serverless lit les variables d'environnement et envoie la notification à Telegram.

## Structure importante

```text
/
├── rendez-vous.html
├── api/
│   ├── send-appointment.js
│   ├── track-visit.js
│   └── get-visits.js
├── js/
├── images/
├── package.json
└── ...
```

Le fichier `send-appointment.js` n'est volontairement plus à la racine : pour Vercel, la fonction doit être dans `api/send-appointment.js`.
