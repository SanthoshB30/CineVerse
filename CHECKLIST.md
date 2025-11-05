# 🎬 Setup Checklist

Use this checklist to get your Movie Review Platform up and running.

## ☐ Pre-Setup

- [ ] Node.js installed (v14 or higher)
- [ ] npm or yarn installed
- [ ] Code editor ready (VS Code recommended)
- [ ] Contentstack account created (free tier is fine)

## ☐ Project Setup

### 1. Install Dependencies
```bash
cd Web_Page
npm install
```
- [ ] All dependencies installed without errors
- [ ] `node_modules` folder created

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Open Contentstack dashboard
- [ ] Navigate to Settings → Stack → API Key
- [ ] Copy API Key to `.env`
- [ ] Navigate to Settings → Tokens
- [ ] Create/copy Delivery Token to `.env`
- [ ] Note your environment name (e.g., "development")
- [ ] Add environment to `.env`
- [ ] Confirm your region (us, eu, azure-na, azure-eu)
- [ ] Add region to `.env`

Your `.env` should look like:
```
REACT_APP_CONTENTSTACK_API_KEY=bltxxxxxxxxx
REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=csxxxxxxxxx
REACT_APP_CONTENTSTACK_ENVIRONMENT=development
REACT_APP_CONTENTSTACK_REGION=us
```

## ☐ Contentstack Setup

### 3. Create Content Types

#### Genre Content Type
- [ ] Go to Content Models → Create New
- [ ] Name: Genre, UID: `genre`
- [ ] Add field: Name (Single Line Textbox) - Required
- [ ] Add field: Slug (Single Line Textbox) - Required, Unique
- [ ] Add field: Description (Rich Text Editor)
- [ ] Add field: Featured Image (File)
- [ ] Save content type

#### Director Content Type
- [ ] Create content type: Director, UID: `director`
- [ ] Add field: Name (Single Line Textbox) - Required
- [ ] Add field: Slug (Single Line Textbox) - Required, Unique
- [ ] Add field: Biography (Rich Text Editor)
- [ ] Add field: Profile Image (File)
- [ ] Add field: Birth Year (Number)
- [ ] Save content type

#### Movie Content Type
- [ ] Create content type: Movie, UID: `movie`
- [ ] Add field: Title (Single Line Textbox) - Required
- [ ] Add field: Slug (Single Line Textbox) - Required, Unique
- [ ] Add field: Description (Rich Text Editor) - Required
- [ ] Add field: Release Year (Number) - Required
- [ ] Add field: Duration (Single Line Textbox)
- [ ] Add field: Genre (Reference - Multiple) → Genre content type
- [ ] Add field: Director (Reference - Multiple) → Director content type
- [ ] Add field: Poster Image (File) - Required
- [ ] Add field: Banner Image (File)
- [ ] Add field: Rating (Number)
- [ ] Add field: Trailer URL (Link)
- [ ] Add field: Featured (Boolean)
- [ ] Save content type

#### Review Content Type
- [ ] Create content type: Review, UID: `review`
- [ ] Add field: Movie (Reference - Single) → Movie content type - Required
- [ ] Add field: Reviewer Name (Single Line Textbox) - Required
- [ ] Add field: Rating (Number) - Required
- [ ] Add field: Review Text (Multi Line Textbox) - Required
- [ ] Add field: Date (Date) - Required
- [ ] Save content type

### 4. Add Content

#### Add Genres (at least 3)
- [ ] Create entry: Action
- [ ] Create entry: Drama
- [ ] Create entry: Sci-Fi
- [ ] (Optional) Add more genres
- [ ] Publish all genre entries

#### Add Directors (at least 2)
- [ ] Create director entry with name, slug, biography
- [ ] Upload profile image
- [ ] Add birth year
- [ ] Publish entry
- [ ] Repeat for more directors
- [ ] Publish all director entries

#### Add Movies (at least 5)
- [ ] Create movie entry
- [ ] Add title and generate slug
- [ ] Write description (or use samples from SAMPLE_CONTENT.md)
- [ ] Add release year and duration
- [ ] Upload poster image (2:3 ratio recommended)
- [ ] Upload banner image (16:9 ratio recommended)
- [ ] Add rating (1-5 scale)
- [ ] Link to genres (select from reference)
- [ ] Link to director (select from reference)
- [ ] Add trailer URL (optional)
- [ ] Mark 2-3 movies as "Featured" (checkbox)
- [ ] Publish entry
- [ ] Repeat for more movies
- [ ] Publish all movie entries

#### Add Reviews (at least 3)
- [ ] Create review entry
- [ ] Link to movie
- [ ] Add reviewer name
- [ ] Add rating (1-5)
- [ ] Write review text
- [ ] Set date
- [ ] Publish entry
- [ ] Repeat for more reviews
- [ ] Publish all review entries

## ☐ Testing

### 5. Run Development Server
```bash
npm start
```
- [ ] Server starts without errors
- [ ] Browser opens to http://localhost:3000
- [ ] No console errors in browser

### 6. Test Homepage
- [ ] Hero banner appears with featured movie
- [ ] Featured movie image loads
- [ ] Hero carousel auto-rotates (if multiple featured movies)
- [ ] Genre carousels appear below
- [ ] Movies display in carousels
- [ ] Movie posters load correctly
- [ ] Carousel scroll buttons work
- [ ] "View All" links work

### 7. Test Navigation
- [ ] Navigation bar is visible
- [ ] Logo clicks to homepage
- [ ] Genres dropdown shows genres
- [ ] Directors link works
- [ ] Search bar appears
- [ ] Mobile menu works (resize browser)

### 8. Test Movie Detail Page
- [ ] Click a movie card
- [ ] Movie detail page loads
- [ ] Banner image displays
- [ ] Poster image displays
- [ ] Title and metadata show
- [ ] Genre tags are clickable
- [ ] Director name is clickable
- [ ] Description displays correctly
- [ ] Reviews section appears
- [ ] Reviews display with stars

### 9. Test Director Page
- [ ] Click a director link
- [ ] Director page loads
- [ ] Profile image displays
- [ ] Biography shows
- [ ] Filmography grid appears
- [ ] Movies by director display

### 10. Test Genre Page
- [ ] Click a genre tag or link
- [ ] Genre page loads
- [ ] Banner displays
- [ ] All movies in genre show
- [ ] Sort dropdown works
- [ ] Movies reorder when sorting

### 11. Test Search
- [ ] Type in search bar
- [ ] Press Enter
- [ ] Search results page loads
- [ ] Results display correctly
- [ ] Try searching for non-existent movie
- [ ] "No results" message appears

### 12. Test Chatbot
- [ ] Chatbot button appears (bottom-right)
- [ ] Click to open chatbot
- [ ] Welcome message displays
- [ ] Type: "Tell me about [your movie name]"
- [ ] Bot responds with movie info
- [ ] Type: "Recommend a [genre] movie"
- [ ] Bot recommends movies
- [ ] Type: "What genres are available?"
- [ ] Bot lists genres
- [ ] Close chatbot
- [ ] Reopen - history is preserved

### 13. Test Responsive Design
- [ ] Resize browser to tablet size (768px)
- [ ] Layout adjusts appropriately
- [ ] Resize to mobile (480px)
- [ ] Hamburger menu appears
- [ ] All features work on mobile
- [ ] Chatbot becomes full-screen

## ☐ Production Build

### 14. Build for Production
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] `build` folder created
- [ ] Test production build locally:
```bash
npx serve -s build
```
- [ ] Production build works correctly

## ☐ Deployment (Choose One)

### Option A: Netlify
- [ ] Push code to Git repository
- [ ] Connect repository to Netlify
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `build`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test live site

### Option B: Vercel
- [ ] Push code to Git repository
- [ ] Import project to Vercel
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test live site

### Option C: Other Platform
- [ ] Follow DEPLOYMENT.md for your platform
- [ ] Configure environment variables
- [ ] Deploy
- [ ] Test live site

## ☐ Post-Deployment

### 15. Final Checks
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Navigation works
- [ ] Search functions
- [ ] Chatbot responds
- [ ] No console errors
- [ ] Mobile version works
- [ ] Performance is good

### 16. Optional Enhancements
- [ ] Set up custom domain
- [ ] Configure Contentstack webhooks for auto-deploy
- [ ] Add Google Analytics
- [ ] Set up uptime monitoring
- [ ] Add more content
- [ ] Optimize images
- [ ] Run Lighthouse audit

## ☐ Maintenance

### 17. Content Updates
- [ ] Know how to add new movies
- [ ] Know how to add new directors
- [ ] Know how to add new genres
- [ ] Know how to publish content
- [ ] Test new content appears on site

### 18. Troubleshooting Knowledge
- [ ] Check browser console for errors
- [ ] Verify Contentstack content is published
- [ ] Know where to find API credentials
- [ ] Understand how to redeploy

## 📚 Documentation Reference

Quick links to help:
- **Getting Started**: `QUICKSTART.md`
- **CMS Setup**: `CONTENTSTACK_SETUP.md`
- **Example Content**: `SAMPLE_CONTENT.md`
- **Deployment**: `DEPLOYMENT.md`
- **Full Docs**: `README.md`
- **Project Overview**: `PROJECT_SUMMARY.md`

## 🎉 Success Criteria

You're done when:
- ✅ Site loads without errors
- ✅ All pages are accessible
- ✅ Content displays correctly
- ✅ Images load properly
- ✅ Search and chatbot work
- ✅ Mobile version functions
- ✅ Deployed successfully (if deploying)

## 🆘 Common Issues

**Problem**: Movies not showing
- **Solution**: Check if movies are published in Contentstack

**Problem**: Images not loading
- **Solution**: Verify images are uploaded and published

**Problem**: Blank page
- **Solution**: Check browser console and verify `.env` file

**Problem**: API errors
- **Solution**: Verify Contentstack credentials in `.env`

**Problem**: Build fails
- **Solution**: Check Node version (should be 14+)

## 📞 Need More Help?

1. Check the comprehensive docs in this project
2. Review Contentstack documentation
3. Check browser console for specific errors
4. Verify all entries are published
5. Try restarting the dev server

---

**Good luck! 🚀 You've got this!**

Once you've completed this checklist, you'll have a fully functional movie review platform ready to share with the world.

