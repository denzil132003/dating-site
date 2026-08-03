# ❤️ Anime Romantic Date Invitation

A dreamy, anime-themed romantic date invitation website. Would you like to go on a date? 💘

## Features

- 🌸 Animated sakura petals, hearts & sparkles
- 🎬 Background video with mute/unmute control
- 🎵 Background music player
- 🏍️ Motorcycle ride date option with geolocation pickup
- 🎬 Movie date option with genre selection
- 💌 Custom date idea (notebook-style textarea)
- 🎉 Confetti celebration
- 📧 EmailJS integration (configure your keys)
- 🔗 Shareable invitation link

## 🚀 Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Branch**, select `main` and `/ (root)` as the folder.
4. Click **Save**. Your site will be live at:
   `https://<your-username>.github.io/dating-site/`

## 📧 Email Setup (optional)

To receive her reply by email, configure EmailJS at the top of `script.js`:

```js
const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',
  serviceID: 'YOUR_SERVICE_ID',
  templateID: 'YOUR_TEMPLATE_ID'
};
```

Steps:
1. Create a free account at [emailjs.com](https://www.emailjs.com)
2. Create an Email Service, then an Email Template
3. Paste your keys above

Template placeholders used: `{{option}}`, `{{genres}}`, `{{idea}}`, `{{location}}`, `{{time}}`

Replies are sent to: `danzilbaraik@gmail.com` (change in `script.js` if needed).

## 🎬 Replace Media

- **Background video**: replace the `<video>` source in `index.html`
- **Background music**: replace the `<audio>` source in `index.html`

---

Made with 💖
