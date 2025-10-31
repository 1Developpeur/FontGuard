# Google Fonts Privacy Proxy

A Cloudflare Worker that acts as a privacy-focused proxy for Google Fonts, allowing you to serve Google Fonts from your own domain without exposing user data to Google's servers.

## 🔒 Privacy Benefits

- **No IP tracking**: User requests never reach Google's servers directly
- **No referrer leakage**: Your website visitors browsing data stays private

## 🚀 Features

- Proxies Google Fonts CSS API (`fonts.googleapis.com/css2`)
- Proxies Google Fonts static files (`fonts.gstatic.com`)
- Automatic URL rewriting in CSS files
- Removes tracking headers and privacy-invasive headers
- Aggressive caching for optimal performance
- Health check endpoint

## 📋 Prerequisites

- Cloudflare account (free tier works)
- Custom domain or Cloudflare Workers subdomain
- Basic knowledge of Cloudflare Workers

## 🛠️ Installation

### Method 1: Cloudflare Dashboard

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** → **Create application** → **Create Worker**
3. Replace the default code with the contents of `worker.js`
4. Click **Save and Deploy**
5. Optionally, set up a custom domain in the **Triggers** tab

### Method 2: Wrangler CLI (not tested)   

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/1Developpeur/FontGuard
   cd FontGuard
   ```

3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

4. Deploy the worker:
   ```bash
   wrangler deploy
   ```

## 📖 Usage

### Basic Usage

Replace your Google Fonts URLs, only domain changes:

**Before:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**After:**
```html
<link href="https://your-worker-domain.workers.dev/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Health Check

Check if your worker is running:
```bash
curl https://your-worker-domain.workers.dev/health
```

## 🔧 Configuration

### Environment Variables

You can customize the worker behavior by modifying the code:

- **Cache TTL**: Adjust `cacheTtl` values for different caching strategies
- **CORS**: Modify `access-control-allow-origin` header as needed
- **Headers**: Add or remove headers from the `headersToRemove` array

### Wrangler Configuration

Create a `wrangler.toml` file for advanced configuration:

```toml
name = "google-fonts-proxy"
main = "worker.js"
compatibility_date = "2024-01-01"

[env.production]
route = "fonts.yourdomain.com/*"
```

## 🎯 Supported Endpoints

| Endpoint | Description | Example |
|----------|-------------|----------|
| `/css2` | Google Fonts CSS API | `/css2?family=Inter:wght@400;500` |
| `/gstatic` | Font files (woff2, woff, ttf) | `/gstatic/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2` |
| `/health` | Health check | Returns service status |
| `/` | Service info | Returns basic service information |

## 🚨 Legal Disclaimer

**IMPORTANT**: This software is provided "as is" without warranty of any kind. Users are responsible for:

- Ensuring compliance with Google Fonts' Terms of Service
- Verifying compatibility with local privacy laws (GDPR, CCPA, etc.)
- Understanding that font files are still served from Google's infrastructure
- Monitoring usage to stay within Cloudflare Workers limits

**The authors and contributors of this project:**
- Make no warranties about the software's functionality or reliability
- Are not responsible for any damages or legal issues arising from its use
- Do not guarantee compliance with any specific privacy regulations
- Recommend consulting with legal counsel for compliance requirements

**Use at your own risk and responsibility.**

## 📊 Performance & Limits

### Cloudflare Workers Limits (Free Tier)
- 100,000 requests per day
- 10ms CPU time per request
- 128MB memory per request

## 📝 License

No license provided. Use at your own risk and responsibility.

## 🔗 Related Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Google Fonts API Documentation](https://developers.google.com/fonts/docs/css2)
- [GDPR and Web Fonts](https://www.cookieyes.com/blog/google-fonts-gdpr/)

## ⚠️ Troubleshooting

### Common Issues

**Fonts not loading:**
- Check browser console for CORS errors
- Verify worker domain is accessible
- Ensure CSS URLs are correctly rewritten

**Performance issues:**
- Monitor Cloudflare Workers analytics
- Check cache hit rates
- Consider upgrading to Workers Paid plan for higher limits

**GDPR compliance:**
- This proxy doesn't guarantee compliance with GDPR
- Consult legal counsel for your specific requirements
- Consider adding privacy policy updates

---

**Made with ❤️ for privacy-conscious developers**
