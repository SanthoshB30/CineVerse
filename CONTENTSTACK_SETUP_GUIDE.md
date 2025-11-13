# Contentstack Setup Guide for CineVerse

## 📋 Content Types to Create in Contentstack

### 1. Movie Content Type

**Content Type UID:** `movie`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| title | Single Line Textbox | Unique: No | ✅ Yes | Movie title |
| slug | Single Line Textbox | Unique: Yes | ✅ Yes | URL-friendly slug (e.g., "inception") |
| description | Rich Text Editor | - | No | Movie synopsis/description |
| release_year | Number | Integer | No | Year of release (e.g., 2010) |
| duration | Single Line Textbox | - | No | Runtime (e.g., "2h 28min") |
| rating | Number | Decimal, Min: 0, Max: 5 | No | Movie rating out of 5 |
| featured | Boolean | Default: false | No | Show in featured/trending carousel |
| upcoming | Boolean | Default: false | No | Show in profile page background slideshow |
| poster_image | File | Accept: Images only | No | Poster image (portrait, 2:3 ratio) |
| banner_image | File | Accept: Images only | No | Banner/backdrop image (16:9 ratio) |
| trailer_url | Single Line Textbox | - | No | YouTube or video URL |
| streaming_links | Group | Multiple | No | Where to watch |
| ↳ platform | Single Line Textbox | - | No | Platform name (e.g., "Netflix") |
| ↳ watch_url | Single Line Textbox | - | No | Link to watch on platform |
| genre | Reference | Multiple, Content Type: Genre | No | Movie genres |
| director | Reference | Multiple, Content Type: Director | No | Movie directors |

---

### 2. Genre Content Type

**Content Type UID:** `genre`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| name | Single Line Textbox | - | ✅ Yes | Genre name (e.g., "Horror") |
| slug | Single Line Textbox | Unique: Yes | ✅ Yes | URL slug (e.g., "horror") |
| description | Multi Line Textbox | - | No | Genre description |
| genre_image | File | Accept: Images only | No | Genre icon/image (recommended: 200x200px) |

---

### 3. Director Content Type

**Content Type UID:** `director`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| name | Single Line Textbox | - | ✅ Yes | Director name |
| slug | Single Line Textbox | Unique: Yes | ✅ Yes | URL slug (e.g., "christopher-nolan") |
| bio | Rich Text Editor | - | No | Biography |
| birth_year | Number | Integer | No | Birth year |
| profile_image | File | Accept: Images only | No | Profile photo |

---

### 4. Actor Content Type ⭐ NEW

**Content Type UID:** `actor`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| name | Single Line Textbox | - | ✅ Yes | Actor name |
| slug | Single Line Textbox | Unique: Yes | ✅ Yes | URL slug (e.g., "tom-hanks") |
| bio | Rich Text Editor | - | No | Biography |
| birth_year | Number | Integer | No | Birth year |
| profile_image | File | Accept: Images only | No | Profile photo |

---

### 5. Collection Content Type ⭐ NEW

**Content Type UID:** `collection`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| title | Single Line Textbox | - | ✅ Yes | Collection title (e.g., "Top 10 This Week") |
| slug | Single Line Textbox | Unique: Yes | ✅ Yes | URL slug |
| description | Multi Line Textbox | - | No | Collection description |
| featured_image | File | Accept: Images only | No | Banner image for collection |
| movies | Reference | Multiple, Content Type: Movie | No | Movies in this collection |

---

### 6. Review Content Type

**Content Type UID:** `review`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| reviewer_name | Single Line Textbox | - | ✅ Yes | Name of reviewer |
| rating | Number | Integer, Min: 1, Max: 5 | ✅ Yes | Rating out of 5 |
| review_text | Multi Line Textbox | - | ✅ Yes | Review content |
| review_date | Date | - | No | Date of review |
| movie | Reference | Single, Content Type: Movie | ✅ Yes | Movie being reviewed |

---

### 7. AppSettings Content Type (Optional) 🔄

**Content Type UID:** `app_settings`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| signup_headline | Single Line Textbox | - | No | Headline for signup page |
| signup_tagline | Single Line Textbox | - | No | Tagline for signup page |
| background_image | File | Accept: Images only | No | Background for auth pages |
| theme_colors | Group | Single | No | UI theme configuration |
| ↳ primary_color | Single Line Textbox | - | No | Primary color hex code |
| ↳ accent_color | Single Line Textbox | - | No | Accent color hex code |

---

## 🔧 Setup Instructions

### Step 1: Create Content Types

1. Log in to your Contentstack account
2. Navigate to **Content Models** → **Content Types**
3. Click **+ New Content Type**
4. Create each content type listed above with the specified fields

### Step 2: Create Entries

#### Sample Movie Entry:
```
Title: Inception
Slug: inception
Description: A thief who steals corporate secrets...
Release Year: 2010
Duration: 2h 28min
Rating: 4.8
Featured: true
Upcoming: false
Poster Image: [Upload poster image]
Banner Image: [Upload backdrop image]
Trailer URL: https://www.youtube.com/watch?v=YoHD9XEInc0
Streaming Links:
  - Platform: Netflix
    Watch URL: https://www.netflix.com/title/70131314
  - Platform: Prime Video
    Watch URL: https://www.amazon.com/...
Genre: [Reference to Sci-Fi, Action, Thriller]
Director: [Reference to Christopher Nolan]
```

#### Sample Genre Entry:
```
Name: Horror
Slug: horror
Description: Films designed to frighten and invoke our darkest fears.
```

#### Sample Director Entry:
```
Name: Christopher Nolan
Slug: christopher-nolan
Bio: Christopher Nolan is a British-American film director...
Birth Year: 1970
Profile Image: [Upload photo]
```

#### Sample Actor Entry:
```
Name: Tom Hanks
Slug: tom-hanks
Bio: Thomas Jeffrey Hanks is an American actor and filmmaker...
Birth Year: 1956
Profile Image: [Upload photo]
```

#### Sample Collection Entry:
```
Title: Top 10 This Week
Slug: top-10-this-week
Description: The most popular movies this week
Featured Image: [Upload banner]
Movies: [Reference to 10 movie entries]
```

#### Sample Review Entry:
```
Reviewer Name: John Smith
Rating: 5
Review Text: Absolutely mind-bending! Nolan at his best...
Review Date: 2023-06-15
Movie: [Reference to Inception]
```

### Step 3: Configure Environment

1. Go to **Settings** → **Environments**
2. Make sure you have an environment (e.g., "production" or "testing")
3. Note your environment name

### Step 4: Get API Credentials

1. Go to **Settings** → **Tokens**
2. Create a new **Delivery Token**
3. Note the following:
   - API Key
   - Delivery Token
   - Environment name
   - Region (e.g., "us", "eu", "azure-na")

### Step 5: Configure Environment Variables

Create or update `.env` file in your project root:

```bash
# Contentstack Configuration
REACT_APP_CONTENTSTACK_API_KEY=your_api_key_here
REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
REACT_APP_CONTENTSTACK_ENVIRONMENT=production
REACT_APP_CONTENTSTACK_REGION=us
```

⚠️ **Important:** Add `.env` to your `.gitignore` file to keep credentials secure!

### Step 6: Publish Entries

1. For each entry you create, click **Publish**
2. Select your environment (e.g., "production")
3. Confirm the publish action

**Note:** Entries must be published to appear in the app!

### Step 7: Test the Application

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will:
1. Initialize data from Contentstack on load
2. Display loading stats in the console
3. Cache all data for fast access
4. Show data in the UI

---

## 📊 Data Relationships

### Movie Relationships:
- **Movie** → **Genre** (Multiple genres per movie)
- **Movie** → **Director** (Multiple directors per movie)
- **Review** → **Movie** (Each review references one movie)
- **Collection** → **Movie** (Collections contain multiple movies)

### Usage in App:
1. **Home Page** displays featured movies
2. **Genre Page** shows movies filtered by genre
3. **Director Page** shows movies directed by that director
4. **Movie Detail** shows related genres, directors, and reviews
5. **Collection Page** shows grouped movies from the collection

---

## 🎯 Recommended Entry Counts

For a good demo:
- **Movies:** 20-50 entries
- **Genres:** 7-10 entries (Horror, Comedy, Sci-Fi, Action, Drama, Thriller, Adventure, etc.)
- **Directors:** 10-20 entries
- **Actors:** 10-20 entries
- **Collections:** 3-5 entries ("Top 10 This Week", "Oscar Winners", "Classic Films", etc.)
- **Reviews:** 2-5 per popular movie

---

## 🔍 Field Usage in UI

### Movie Fields:
- `title` - Displayed everywhere (cards, detail page, search)
- `slug` - Used in URLs (/movie/inception)
- `description` - Movie detail page synopsis
- `poster_image` - Movie cards, detail page
- `banner_image` - Hero carousel, movie detail hero
- `rating` - Displayed as stars (⭐ 4.8/5)
- `featured` - Controls appearance in trending carousel
- `upcoming` - Used for profile page background slideshow ⭐
- `streaming_links` - "Watch Now On" buttons
- `genre` - Filter movies, show tags
- `director` - Link to director page

### Collection Fields:
- `title` - Collection name
- `slug` - URL (/collection/top-10-this-week)
- `description` - Collection description
- `featured_image` - Hero banner on collection page
- `movies` - List of movies in the collection

### Actor Fields:
- `name` - Actor name
- `slug` - URL (/actor/tom-hanks)
- `bio` - Biography on actor page
- `birth_year` - "Born 1956"
- `profile_image` - Circular profile photo

---

## ⚡ Performance Tips

1. **Image Optimization:**
   - Poster images: 300x450px recommended
   - Banner images: 1920x1080px recommended
   - Profile images: 300x300px recommended
   - Use WebP format for smaller file sizes

2. **Data Loading:**
   - App fetches all data once on initialization
   - Data is cached in memory for fast access
   - No additional API calls during navigation

3. **Publishing:**
   - Publish entries in batches
   - Use bulk actions for faster publishing
   - Set up publish workflows for consistency

---

## 🎬 Sample Data Sets

### Recommended Movies to Add:
1. **Inception** (2010) - Sci-Fi, Action, Thriller
2. **Get Out** (2017) - Horror, Thriller
3. **Lady Bird** (2017) - Comedy, Drama
4. **Dune** (2021) - Sci-Fi, Adventure, Drama
5. **Thor: Ragnarok** (2017) - Action, Comedy, Adventure
6. **The Dark Knight** (2008) - Action, Thriller, Drama
7. **Interstellar** (2014) - Sci-Fi, Drama, Adventure
8. **A Quiet Place** (2018) - Horror, Sci-Fi, Thriller
9. **Parasite** (2019) - Thriller, Drama
10. **Barbie** (2023) - Comedy, Adventure

### Recommended Directors:
1. Christopher Nolan
2. Jordan Peele
3. Greta Gerwig
4. Denis Villeneuve
5. Taika Waititi
6. Bong Joon-ho
7. Ava DuVernay
8. Ryan Coogler

### Recommended Actors:
1. Tom Hanks
2. Meryl Streep
3. Leonardo DiCaprio
4. Jennifer Lawrence
5. Denzel Washington
6. Cate Blanchett
7. Idris Elba
8. Zendaya

---

## 🚀 Go Live Checklist

- [ ] All content types created in Contentstack
- [ ] Sample entries created and published
- [ ] Environment variables configured in `.env`
- [ ] App tested locally with real Contentstack data
- [ ] Images optimized for web
- [ ] All required relationships configured
- [ ] Entries published to production environment
- [ ] Data loading logs show successful fetch
- [ ] All pages display correctly with real data

---

## 📞 Support

If you encounter issues:

1. **Check Console Logs:**
   - Look for Contentstack initialization messages
   - Check for API errors or missing credentials

2. **Verify Credentials:**
   - API Key, Delivery Token, Environment name
   - Ensure credentials match your Contentstack stack

3. **Check Publishing:**
   - Make sure all entries are published
   - Verify the correct environment is selected

4. **Test API Connection:**
   - Check network tab in browser DevTools
   - Look for Contentstack API requests

5. **Review Data Structure:**
   - Ensure field names match exactly
   - Check that references are properly linked

---

## 🎉 You're All Set!

Once you complete this setup, your CineVerse application will have:
- ✅ Full integration with Contentstack CMS
- ✅ Dynamic content management
- ✅ Beautiful Netflix-style UI
- ✅ Fast, cached data loading
- ✅ Responsive design across all devices

Enjoy building your movie universe! 🎬✨

