# ✅ Contentstack Setup Checklist for CineVerse

> Print this or keep it open as you work through the setup!

---

## 📋 Phase 1: Account & Stack Setup

- [ ] Created Contentstack account at https://www.contentstack.com/
- [ ] Verified email address
- [ ] Created new Stack named "CineVerse"
- [ ] Noted Stack region (us/eu/azure-na/azure-eu)

---

## 📋 Phase 2: Content Types Creation

### Director Content Type
- [ ] Created "Director" content type
- [ ] Added field: **Title** (Single Line Textbox, Mandatory)
- [ ] Added field: **Name** (Single Line Textbox, Mandatory)
- [ ] Added field: **Slug** (Single Line Textbox, Mandatory, Unique)
- [ ] Added field: **Bio** (Multi Line Textbox, Mandatory)
- [ ] Added field: **Birth Year** (Number, Optional)
- [ ] Added field: **Profile Image** (File, Mandatory, Images only)
- [ ] Saved Content Type

### Genre Content Type
- [ ] Created "Genre" content type
- [ ] Added field: **Title** (Single Line Textbox, Mandatory)
- [ ] Added field: **Name** (Single Line Textbox, Mandatory)
- [ ] Added field: **Slug** (Single Line Textbox, Mandatory, Unique)
- [ ] Added field: **Description** (Multi Line Textbox, Mandatory)
- [ ] Saved Content Type

### Movie Content Type
- [ ] Created "Movie" content type
- [ ] Added field: **Title** (Single Line Textbox, Mandatory)
- [ ] Added field: **Slug** (Single Line Textbox, Mandatory, Unique)
- [ ] Added field: **Description** (Multi Line Textbox, Mandatory)
- [ ] Added field: **Release Year** (Number, Mandatory, Min: 1900, Max: 2030)
- [ ] Added field: **Duration** (Single Line Textbox, Mandatory)
- [ ] Added field: **Rating** (Number, Optional, Min: 0, Max: 5)
- [ ] Added field: **Featured** (Boolean, Mandatory)
- [ ] Added field: **Poster Image** (File, Mandatory, Images only)
- [ ] Added field: **Banner Image** (File, Mandatory, Images only)
- [ ] Added field: **Trailer URL** (Link, Optional)
- [ ] Added field: **Genre** (Reference to Genre, Mandatory, Multiple)
- [ ] Added field: **Director** (Reference to Director, Mandatory, Multiple)
- [ ] Saved Content Type

### Review Content Type (Optional)
- [ ] Created "Review" content type
- [ ] Added field: **Reviewer Name** (Single Line Textbox, Mandatory)
- [ ] Added field: **Rating** (Number, Mandatory, Min: 1, Max: 5)
- [ ] Added field: **Review Text** (Multi Line Textbox, Mandatory)
- [ ] Added field: **Review Date** (Date, Mandatory)
- [ ] Added field: **Movie** (Reference to Movie, Mandatory, Single)
- [ ] Saved Content Type

---

## 📋 Phase 3: Assets Upload

### Director Photos (5 images)
- [ ] Uploaded: christopher-nolan.jpg (400x400px)
- [ ] Uploaded: jordan-peele.jpg (400x400px)
- [ ] Uploaded: greta-gerwig.jpg (400x400px)
- [ ] Uploaded: denis-villeneuve.jpg (400x400px)
- [ ] Uploaded: taika-waititi.jpg (400x400px)

### Movie Posters (10 images)
- [ ] Uploaded: poster-inception.jpg (400x600px)
- [ ] Uploaded: poster-get-out.jpg (400x600px)
- [ ] Uploaded: poster-lady-bird.jpg (400x600px)
- [ ] Uploaded: poster-dune.jpg (400x600px)
- [ ] Uploaded: poster-thor-ragnarok.jpg (400x600px)
- [ ] Uploaded: poster-us.jpg (400x600px)
- [ ] Uploaded: poster-the-dark-knight.jpg (400x600px)
- [ ] Uploaded: poster-jojo-rabbit.jpg (400x600px)
- [ ] Uploaded: poster-interstellar.jpg (400x600px)
- [ ] Uploaded: poster-a-quiet-place.jpg (400x600px)

### Movie Banners (10 images)
- [ ] Uploaded: banner-inception.jpg (1920x1080px)
- [ ] Uploaded: banner-get-out.jpg (1920x1080px)
- [ ] Uploaded: banner-lady-bird.jpg (1920x1080px)
- [ ] Uploaded: banner-dune.jpg (1920x1080px)
- [ ] Uploaded: banner-thor-ragnarok.jpg (1920x1080px)
- [ ] Uploaded: banner-us.jpg (1920x1080px)
- [ ] Uploaded: banner-the-dark-knight.jpg (1920x1080px)
- [ ] Uploaded: banner-jojo-rabbit.jpg (1920x1080px)
- [ ] Uploaded: banner-interstellar.jpg (1920x1080px)
- [ ] Uploaded: banner-a-quiet-place.jpg (1920x1080px)

---

## 📋 Phase 4: Director Entries

- [ ] Created & Published: Christopher Nolan (slug: christopher-nolan)
- [ ] Created & Published: Jordan Peele (slug: jordan-peele)
- [ ] Created & Published: Greta Gerwig (slug: greta-gerwig)
- [ ] Created & Published: Denis Villeneuve (slug: denis-villeneuve)
- [ ] Created & Published: Taika Waititi (slug: taika-waititi)

---

## 📋 Phase 5: Genre Entries

- [ ] Created & Published: Horror (slug: horror)
- [ ] Created & Published: Comedy (slug: comedy)
- [ ] Created & Published: Sci-Fi (slug: sci-fi)
- [ ] Created & Published: Action (slug: action)
- [ ] Created & Published: Drama (slug: drama)
- [ ] Created & Published: Thriller (slug: thriller)
- [ ] Created & Published: Adventure (slug: adventure)

---

## 📋 Phase 6: Movie Entries

### Movie 1: Inception
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Sci-Fi, Action, Thriller
- [ ] Added director: Christopher Nolan
- [ ] Set Featured: Yes
- [ ] Published

### Movie 2: Get Out
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Horror, Thriller
- [ ] Added director: Jordan Peele
- [ ] Set Featured: Yes
- [ ] Published

### Movie 3: Lady Bird
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Comedy, Drama
- [ ] Added director: Greta Gerwig
- [ ] Set Featured: No
- [ ] Published

### Movie 4: Dune
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Sci-Fi, Adventure, Drama
- [ ] Added director: Denis Villeneuve
- [ ] Set Featured: Yes
- [ ] Published

### Movie 5: Thor: Ragnarok
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Action, Comedy, Adventure
- [ ] Added director: Taika Waititi
- [ ] Set Featured: No
- [ ] Published

### Movie 6: Us
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Horror, Thriller
- [ ] Added director: Jordan Peele
- [ ] Set Featured: No
- [ ] Published

### Movie 7: The Dark Knight
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Action, Thriller, Drama
- [ ] Added director: Christopher Nolan
- [ ] Set Featured: Yes
- [ ] Published

### Movie 8: Jojo Rabbit
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Comedy, Drama
- [ ] Added director: Taika Waititi
- [ ] Set Featured: No
- [ ] Published

### Movie 9: Interstellar
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Sci-Fi, Drama, Adventure
- [ ] Added director: Christopher Nolan
- [ ] Set Featured: Yes
- [ ] Published

### Movie 10: A Quiet Place
- [ ] Created entry with all fields
- [ ] Added poster and banner images
- [ ] Added genres: Horror, Sci-Fi, Thriller
- [ ] Added director: (Create John Krasinski if needed)
- [ ] Set Featured: No
- [ ] Published

---

## 📋 Phase 7: Review Entries (Optional)

- [ ] Created review for Inception by John Smith (5 stars)
- [ ] Created review for Inception by Sarah Johnson (5 stars)
- [ ] Created review for Get Out by Mike Williams (5 stars)
- [ ] Created review for Dune by Emma Davis (5 stars)
- [ ] Published all reviews

---

## 📋 Phase 8: Get API Credentials

- [ ] Navigated to Settings → Stack → API Keys
- [ ] Copied **API Key**: `________________________`
- [ ] Copied **Delivery Token**: `________________________`
- [ ] Noted **Environment Name**: `________________________`
- [ ] Noted **Region**: `________________________`

---

## 📋 Phase 9: Configure Application

- [ ] Created `.env` file in project root
- [ ] Added `REACT_APP_CONTENTSTACK_API_KEY`
- [ ] Added `REACT_APP_CONTENTSTACK_DELIVERY_TOKEN`
- [ ] Added `REACT_APP_CONTENTSTACK_ENVIRONMENT`
- [ ] Added `REACT_APP_CONTENTSTACK_REGION`
- [ ] Saved `.env` file

---

## 📋 Phase 10: Switch to Real Data

- [ ] Opened `src/api/contentstack.js`
- [ ] Changed `USE_MOCK_DATA = false`
- [ ] Saved file

---

## 📋 Phase 11: Test Your Setup

- [ ] Restarted application (`npm start`)
- [ ] Checked browser console for success message
- [ ] Verified movie count: 10
- [ ] Verified genre count: 7
- [ ] Verified director count: 5
- [ ] Tested homepage - genres display
- [ ] Tested genre selection - movies display
- [ ] Tested movie detail page
- [ ] Tested director page
- [ ] Tested search functionality
- [ ] Tested chatbot with movie queries

---

## 📋 Verification Checklist

### Data Verification
- [ ] All directors have profile images
- [ ] All movies have poster images
- [ ] All movies have banner images
- [ ] All movies are linked to at least 1 genre
- [ ] All movies are linked to at least 1 director
- [ ] 5-6 movies are marked as "featured"
- [ ] All entries are published
- [ ] All slugs are unique

### Application Verification
- [ ] Homepage loads without errors
- [ ] Genre cards display correctly
- [ ] Clicking genre shows movies
- [ ] Movie cards show images properly
- [ ] Movie detail page shows all information
- [ ] Director page lists all movies
- [ ] Search finds movies
- [ ] Chatbot responds to queries
- [ ] Reviews display on movie pages (if created)

---

## 📊 Final Count Summary

| Content Type | Target Count | Actual Count |
|--------------|--------------|--------------|
| Directors | 5 | _____ |
| Genres | 7 | _____ |
| Movies | 10 | _____ |
| Reviews | 4 | _____ |
| **Assets** | | |
| Director Photos | 5 | _____ |
| Movie Posters | 10 | _____ |
| Movie Banners | 10 | _____ |

---

## 🎯 Troubleshooting

If something doesn't work:

### Check These First:
- [ ] All entries are published (not draft)
- [ ] Environment name matches in code and Contentstack
- [ ] API Key and Delivery Token are correct
- [ ] `.env` file exists in project root
- [ ] App was restarted after `.env` changes
- [ ] `USE_MOCK_DATA = false` in contentstack.js
- [ ] Referenced content (Directors, Genres) is published before Movies
- [ ] Browser console shows no error messages

### Common Fixes:
- [ ] Republish all entries
- [ ] Clear browser cache
- [ ] Restart development server
- [ ] Check Contentstack environment is "production"
- [ ] Verify API credentials are active

---

## 🎉 Completion

**Date Completed**: ___________________

**Time Taken**: ___________________

**Total Entries Created**: ___________________

**Total Assets Uploaded**: ___________________

---

## 📝 Notes

Use this space for any notes, issues encountered, or customizations made:

```
_________________________________________________________

_________________________________________________________

_________________________________________________________

_________________________________________________________

_________________________________________________________

_________________________________________________________
```

---

**🎬 Congratulations! Your CineVerse application is now powered by Contentstack!**

**Ready to share with the world! 🚀✨**

---

### Next Steps:
1. Add more movies (expand your catalog)
2. Invite team members to manage content
3. Set up webhooks for real-time updates
4. Configure content workflows
5. Deploy to production!

**Happy content managing! 🎥**

