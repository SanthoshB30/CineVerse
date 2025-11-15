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

<!-- https://movie-review-page.contentstackapps.com/home -->

<!-- sign up user content type sign up create entry call, sign in get entry call  
sign up personalize 
review like 
youutube prefix 
icon , name , color 
page metadata, context for search, brandintent
entry how many of them visited recently how many watched 
curl 'https://app.contentstack.com/analytics/v1/dashboard/data/processor/entries?processor=entries&from=2025-10-14&to=2025-11-13&orgUid=blt901eb1bb5a80c8b6&includeTotalCount=false&chartType=status-view-trend&duration=day&r=0.19991769338440368' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'authtoken: blte04f49de9472425e' \
  -H 'content-type: application/json' \
  -b '_biz_uid=521a4cf9260c48d8d6fee3dc111179f6; _mkto_trk=id:489-WNI-383&token:_mch-contentstack.com-592b0a8eb7a3630c8b3741967b282217; _ga=GA1.1.863985116.1737711457; cb_group_id=null; cb_anonymous_id=%22daf34aa2-f261-4cd7-8bcf-2be9009181fc%22; _biz_flagsA=%7B%22Version%22%3A1%2C%22ViewThrough%22%3A%221%22%2C%22XDomain%22%3A%221%22%2C%22Mkto%22%3A%221%22%2C%22Frm%22%3A%221%22%7D; cb_user_id=%22sb%40contentstack.com%22; _CEFT=EgNwlgpg7hAmBcAJAogCwK4C8QE0BMiAUjgNADmymA0gIYC0ASpgCywDOA2AMYD2AdiAgAnAC5wkaLLgLF4eAMwBOZngCAARlCQYCdQA0AMiACCANgBmhAIoB5KyQDsIgA4h0qAJ54AjgBEAkkA%3D; _gcl_au=1.1.365426673.1760698576; __q_state_XfUkqQXxJ43uw9xi=eyJ1dWlkIjoiNzllNTc3NjYtOTk5Mi00NWYzLWFmZGYtZTEyMDY5NjcyNTJmIiwiY29va2llRG9tYWluIjoiY29udGVudHN0YWNrLmNvbSIsIm1lc3NlbmdlckV4cGFuZGVkIjpmYWxzZSwicHJvbXB0RGlzbWlzc2VkIjpmYWxzZSwiY29udmVyc2F0aW9uSWQiOiIxNjk0MDA2MTA0MjU1NzkxNDc5In0=; _fbp=fb.1.1760698584048.843395859917621462; _biz_nA=74; _biz_pendingA=%5B%22ipv%3F_biz_r%3Dhttps%253A%252F%252Fstag-gcp-na-app.csnonprod.com%252F%26_biz_h%3D802059049%26_biz_u%3D521a4cf9260c48d8d6fee3dc111179f6%26_biz_l%3Dhttps%253A%252F%252Fwww.contentstack.com%252Fplatform%26_biz_t%3D1761816220025%26_biz_i%3DPlatform%2520Overview%2520%257C%2520Contentstack%26_biz_n%3D73%26rnd%3D480478%22%5D; OptanonAlertBoxClosed=2025-10-30T09:23:40.798Z; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Oct+30+2025+14%3A53%3A41+GMT%2B0530+(India+Standard+Time)&version=202308.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A1%2CC0002%3A1&AwaitingReconsent=false&geolocation=IN%3BTN; _ga_HX5WXEB69W=GS2.1.s1761816220$o22$g0$t1761816222$j58$l0$h0; _ce.s=v~2753be440d57aa6ec23c554fb5eac86cd7f045e1~lcw~1761816223622~vir~returning~lva~1761816221916~vpv~12~v11ls~e9fe7300-ab47-11f0-af61-d5252380dd14~gtrk.ngv~%7B%7D~flvl~%2CHEhuzvY2HJY%3AgEzKa-Rz4ds%2C1XLvA6fJQOQ%3A7tpvuhy2qDI~v11.fhb~1743484984324~v11.lhb~1743485017173~gtrk.la~mguqo05v~v11.cs~402569~v11.s~21307b50-b572-11f0-8abd-6fd94555bd88~v11.vs~2753be440d57aa6ec23c554fb5eac86cd7f045e1~v11.fsvd~eyJ1cmwiOiJjb250ZW50c3RhY2suY29tL3BsYXRmb3JtIiwicmVmIjoiaHR0cHM6Ly9zdGFnLWdjcC1uYS1hcHAuY3Nub25wcm9kLmNvbS8iLCJ1dG0iOltdfQ%3D%3D~v11.sla~1761816223623~lcw~1761816223623; _clck=iatn83%5E2%5Eg0l%5E0%5E1850; _rdt_uuid=1760698581520.a54942ec-7b15-40a0-a35b-92090cfa6cc1; _uetvid=d8639440da3611efac28d143dff88368; _cs_c=0; authtoken=hmTLMieQbn2wSIwHYtgc2Os4TC28BB0FiOFOcXzT+0k=; __cs_user=blte04f49de9472425e; show-app-switcher=true; bltb76b27f1fb0fe371.firstLogin=false; _hp2_ses_props.869366022=%7B%22ts%22%3A1763023391786%2C%22d%22%3A%22app.contentstack.com%22%2C%22h%22%3A%22%2F%22%7D; show-breadcrumb=true; _hp2_id.869366022=%7B%22userId%22%3A%224733404695240239%22%2C%22pageviewId%22%3A%221330867549042724%22%2C%22sessionId%22%3A%22434158219220786%22%2C%22identity%22%3A%22bltb76b27f1fb0fe371%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%2C%22oldIdentity%22%3Anull%7D; _cs_id=821c9585-c645-a162-8936-74a9b218e7ec.1762158038.14.1763029226.1763023391.1752517853.1796322038912.1.x; _cs_s=227.5.U.9.1763031026935; _hp2_props.869366022=%7B%22region%22%3A%22NA%22%2C%22email%22%3A%22santhosh.baskaran%40contentstack.com%22%2C%22plan_id%22%3A%22CSI%20services%20Plan%22%2C%22organization_uid%22%3A%22blt901eb1bb5a80c8b6%22%2C%22organization_name%22%3A%22CSI%20services%22%2C%22organization_tag%22%3A%22employee%22%2C%22org_expiry%22%3A%2212-31-2030%22%2C%22has_trial_stack%22%3A%22%22%2C%22isOwner%22%3A%22%22%2C%22is_org_expired%22%3Afalse%2C%22origin%22%3A%22%22%7D; _dd_s=rum=0&expire=1763030128642' \
  -H 'priority: u=1, i' \
  -H 'referer: https://app.contentstack.com/' \
  -H 'sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'-->
