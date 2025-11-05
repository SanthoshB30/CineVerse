# Deployment Guide

This guide covers deploying your Movie Review Platform to various hosting platforms.

## Pre-Deployment Checklist

- [ ] All Contentstack content is published
- [ ] Environment variables are configured
- [ ] Application tested locally (`npm start`)
- [ ] Production build works (`npm run build`)
- [ ] All images are optimized
- [ ] No console errors in production build

## Environment Variables

All platforms require these environment variables:

```
REACT_APP_CONTENTSTACK_API_KEY=your_api_key
REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
REACT_APP_CONTENTSTACK_ENVIRONMENT=production
REACT_APP_CONTENTSTACK_REGION=us
```

## Deployment Options

### Option 1: Netlify (Recommended)

#### Via Git Repository

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider and repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: 18 or higher

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all `REACT_APP_*` variables
   - Redeploy if needed

5. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add custom domain
   - Configure DNS settings

#### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Option 2: Vercel

#### Via Git Repository

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Click "Add New" → "Project"
   - Import your repository

3. **Configure Project**
   - Framework Preset: Create React App
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Add Environment Variables**
   - Add all `REACT_APP_*` variables
   - Deploy

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/repository-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub**
   - Go to repository Settings → Pages
   - Source: gh-pages branch
   - Save

**Note**: Environment variables need to be embedded during build on GitHub Pages.

### Option 4: AWS Amplify

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify**
   ```bash
   amplify init
   ```

3. **Add Hosting**
   ```bash
   amplify add hosting
   ```

4. **Configure Build Settings**
   - Create `amplify.yml`:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: build
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Deploy**
   ```bash
   amplify publish
   ```

### Option 5: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configuration**
   - Public directory: `build`
   - Single-page app: Yes
   - GitHub integration: Optional

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Option 6: Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add Buildpack**
   ```bash
   heroku buildpacks:set mars/create-react-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set REACT_APP_CONTENTSTACK_API_KEY=your_key
   heroku config:set REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=your_token
   heroku config:set REACT_APP_CONTENTSTACK_ENVIRONMENT=production
   heroku config:set REACT_APP_CONTENTSTACK_REGION=us
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 7: Docker

1. **Create Dockerfile**
   ```dockerfile
   # Build stage
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   ARG REACT_APP_CONTENTSTACK_API_KEY
   ARG REACT_APP_CONTENTSTACK_DELIVERY_TOKEN
   ARG REACT_APP_CONTENTSTACK_ENVIRONMENT
   ARG REACT_APP_CONTENTSTACK_REGION
   ENV REACT_APP_CONTENTSTACK_API_KEY=$REACT_APP_CONTENTSTACK_API_KEY
   ENV REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=$REACT_APP_CONTENTSTACK_DELIVERY_TOKEN
   ENV REACT_APP_CONTENTSTACK_ENVIRONMENT=$REACT_APP_CONTENTSTACK_ENVIRONMENT
   ENV REACT_APP_CONTENTSTACK_REGION=$REACT_APP_CONTENTSTACK_REGION
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
     listen 80;
     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t movie-platform \
     --build-arg REACT_APP_CONTENTSTACK_API_KEY=your_key \
     --build-arg REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=your_token \
     --build-arg REACT_APP_CONTENTSTACK_ENVIRONMENT=production \
     --build-arg REACT_APP_CONTENTSTACK_REGION=us .
   
   docker run -p 80:80 movie-platform
   ```

## Post-Deployment

### 1. Test Your Deployment

- [ ] Homepage loads correctly
- [ ] Featured movies carousel works
- [ ] Genre carousels scroll properly
- [ ] Movie detail pages display correctly
- [ ] Director pages show filmography
- [ ] Search functionality works
- [ ] Chatbot responds correctly
- [ ] All images load
- [ ] Navigation works on mobile
- [ ] No console errors

### 2. Set Up Analytics (Optional)

#### Google Analytics

Add to `public/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Performance Optimization

#### Enable Compression
Most platforms enable this by default. For custom servers:
- Enable gzip/brotli compression
- Serve static assets with cache headers

#### CDN Configuration
- Use Contentstack's built-in CDN for images
- Consider Cloudflare for additional caching

#### Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse https://your-site-url --view
```

### 4. SEO Optimization

#### Update Meta Tags
Edit `public/index.html`:
```html
<meta name="description" content="Discover and review movies">
<meta property="og:title" content="MovieHub">
<meta property="og:description" content="Your go-to movie review platform">
<meta property="og:image" content="https://your-site/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
```

#### Generate Sitemap
Use tools like:
- react-router-sitemap
- Or create manually and add to `public/sitemap.xml`

### 5. Monitoring

#### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- Netlify/Vercel built-in monitoring

#### Error Tracking
- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)
- [Rollbar](https://rollbar.com/)

## Continuous Deployment

### Netlify/Vercel Auto-Deploy

Both platforms auto-deploy on git push:
1. Push to main branch
2. Build triggers automatically
3. Deploy to production

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          REACT_APP_CONTENTSTACK_API_KEY: ${{ secrets.CONTENTSTACK_API_KEY }}
          REACT_APP_CONTENTSTACK_DELIVERY_TOKEN: ${{ secrets.CONTENTSTACK_DELIVERY_TOKEN }}
          REACT_APP_CONTENTSTACK_ENVIRONMENT: ${{ secrets.CONTENTSTACK_ENVIRONMENT }}
          REACT_APP_CONTENTSTACK_REGION: ${{ secrets.CONTENTSTACK_REGION }}
      - name: Deploy
        # Add deployment steps for your platform
```

## Contentstack Webhooks

Auto-redeploy when content changes:

1. **Get Deploy Hook URL**
   - Netlify: Build & Deploy → Build hooks
   - Vercel: Settings → Git → Deploy Hooks

2. **Configure in Contentstack**
   - Settings → Webhooks → Create Webhook
   - URL: Your deploy hook URL
   - Events: Entry Publish, Entry Unpublish
   - Save

Now your site rebuilds automatically when content changes!

## Custom Domain

### Netlify
1. Domain settings → Add domain
2. Configure DNS:
   - A record: 75.2.60.5
   - Or CNAME: your-site.netlify.app

### Vercel
1. Settings → Domains → Add
2. Configure DNS:
   - A record: 76.76.21.21
   - Or CNAME: cname.vercel-dns.com

### Cloudflare (Optional)
1. Add your domain to Cloudflare
2. Point DNS to your host
3. Enable proxy (orange cloud)
4. SSL/TLS: Full (strict)

## Troubleshooting

### Build Fails
- Check Node version (use 18+)
- Verify environment variables
- Test build locally first
- Check build logs for errors

### Blank Page After Deploy
- Check browser console
- Verify environment variables
- Check if build/index.html exists
- Test API connections

### Images Not Loading
- Check Contentstack CORS settings
- Verify image URLs are correct
- Check CDN configuration

### 404 on Refresh
- Configure SPA routing:
  - Netlify: `_redirects` file with `/* /index.html 200`
  - Vercel: Automatic
  - Others: Configure server rewrites

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to git
   - Use different tokens for dev/prod
   - Rotate tokens periodically

2. **API Keys**
   - Use read-only delivery tokens
   - Don't use management tokens in frontend

3. **HTTPS**
   - Always use HTTPS (most platforms enable by default)
   - Configure HSTS headers

4. **Content Security Policy**
   - Add CSP headers
   - Whitelist image sources

## Backup Strategy

1. **Contentstack**
   - Export content regularly
   - Keep backup of content models

2. **Code**
   - Use Git for version control
   - Tag releases
   - Keep documentation updated

## Cost Optimization

- **Contentstack**: Use free tier for testing
- **Hosting**: Netlify/Vercel have generous free tiers
- **CDN**: Contentstack includes CDN
- **Bandwidth**: Optimize images before uploading

## Support Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Contentstack Webhooks](https://www.contentstack.com/docs/developers/webhooks)
- [React Deployment](https://create-react-app.dev/docs/deployment)

Happy deploying! 🚀

