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
| movies | Reference | Multiple, Content Type: Movie | No | Movies the actor has appeared in |

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

### 6. Review Content Type 🔄 UPDATED

**Content Type UID:** `review`

| Field Name | Field Type | Properties | Required | Description |
|------------|-----------|------------|----------|-------------|
| reviewer_name | Single Line Textbox | - | ✅ Yes | Name of reviewer |
| rating | Number | Integer, Min: 1, Max: 5 | ✅ Yes | Rating out of 5 |
| review_text | Multi Line Textbox | - | ✅ Yes | Review content |
| review_date | Date | - | No | Date of review |
| movie | Reference | Single, Content Type: Movie | ✅ Yes | Movie being reviewed |
| upvotes | Number | Integer, Min: 0, Default: 0 | No | Number of users who found this review helpful |
| downvotes | Number | Integer, Min: 0, Default: 0 | No | Number of users who did not find this review helpful |

**⚡ Contentstack Automate Integration:**
- Use `upvotes` and `downvotes` fields for voting workflows
- Trigger automations on vote count changes
- Build leaderboards and reputation systems
- Send notifications when reviews get engagement

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
Movies: [Reference to Forrest Gump, Cast Away, Saving Private Ryan, etc.]
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
- **Movie** ← **Actor** (Actors reference multiple movies they appeared in)
- **Review** → **Movie** (Each review references one movie)
- **Collection** → **Movie** (Collections contain multiple movies)

### Usage in App:
1. **Home Page** displays featured movies
2. **Genre Page** shows movies filtered by genre
3. **Director Page** shows movies directed by that director
4. **Actor Page** shows movies the actor has appeared in (filmography)
5. **Movie Detail** shows related genres, directors, actors, and reviews
6. **Collection Page** shows grouped movies from the collection

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
- `movies` - List of movies the actor has appeared in (filmography)

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

## ⚡ Contentstack Automate: Review Voting System

### Review Content Type - Complete JSON Schema

Use this JSON schema to import/create the Review content type with voting support:

```json
{
  "content_type": {
    "title": "Review",
    "uid": "review",
    "description": "Movie reviews and ratings by users or AI profiles",
    "schema": [
      {
        "display_name": "Reviewer Name",
        "uid": "reviewer_name",
        "data_type": "text",
        "mandatory": true
      },
      {
        "display_name": "Rating",
        "uid": "rating",
        "data_type": "number",
        "mandatory": true,
        "field_metadata": {
          "min": 1,
          "max": 5,
          "description": "Rating out of 5"
        }
      },
      {
        "display_name": "Review Text",
        "uid": "review_text",
        "data_type": "text",
        "mandatory": true,
        "field_metadata": {
          "multiline": true
        }
      },
      {
        "display_name": "Review Date",
        "uid": "review_date",
        "data_type": "isodate",
        "mandatory": false
      },
      {
        "display_name": "Movie",
        "uid": "movie",
        "data_type": "reference",
        "mandatory": true,
        "multiple": false,
        "reference_to": ["movie"],
        "field_metadata": {
          "description": "Select the movie being reviewed"
        }
      },
      {
        "display_name": "Upvotes",
        "uid": "upvotes",
        "data_type": "number",
        "mandatory": false,
        "field_metadata": {
          "default_value": 0,
          "description": "Number of users who found this review helpful"
        }
      },
      {
        "display_name": "Downvotes",
        "uid": "downvotes",
        "data_type": "number",
        "mandatory": false,
        "field_metadata": {
          "default_value": 0,
          "description": "Number of users who did not find this review helpful"
        }
      }
    ],
    "options": {
      "title": "reviewer_name",
      "publishable": true,
      "is_page": false,
      "singleton": false,
      "sub_title": ["rating", "review_text"],
      "url_pattern": "/review/:uid",
      "url_prefix": "/"
    }
  }
}
```

### Automate Workflow Examples

#### 1. 🏆 Top Review Notification

**Trigger:** Entry Update (Review)
**Condition:** When `upvotes` field changes
**Actions:**

```javascript
// Check if review has reached top status
if (review.upvotes >= 10) {
  // Update a "Top Review" collection
  await stack.ContentType("collection")
    .Entry("top_reviews_uid")
    .update({
      reviews: [...existingReviews, review.uid]
    });
  
  // Send notification
  await sendNotification({
    channel: "slack",
    message: `🌟 Review by ${review.reviewer_name} on "${review.movie.title}" reached ${review.upvotes} upvotes!`
  });
}
```

#### 2. 📊 Reviewer Reputation System

**Trigger:** Entry Update (Review)
**Condition:** When `upvotes` or `downvotes` changes
**Actions:**

```javascript
// Calculate net score
const netScore = review.upvotes - review.downvotes;
const helpfulnessRatio = review.upvotes / (review.upvotes + review.downvotes + 1);

// Update reviewer profile/badge
if (helpfulnessRatio > 0.8 && review.upvotes > 20) {
  await assignBadge(review.reviewer_name, "trusted_reviewer");
}

// Log analytics
await logToAnalytics({
  event: "review_engagement",
  reviewer: review.reviewer_name,
  movie: review.movie.title,
  netScore: netScore
});
```

#### 3. 🔄 Real-time Vote Update via API

**Frontend Implementation:**

```javascript
// When user clicks upvote
const handleUpvote = async (reviewUid) => {
  const review = await fetch(`/api/review/${reviewUid}`);
  
  await stack.ContentType("review")
    .Entry(reviewUid)
    .update({
      upvotes: review.upvotes + 1
    });
  
  // Re-fetch reviews to show updated count
  refreshReviews();
};
```

#### 4. 📧 Weekly Top Reviews Digest

**Trigger:** Scheduled (Every Monday 9 AM)
**Actions:**

```javascript
// Get all reviews from past week
const reviews = await stack.ContentType("review")
  .Query()
  .where("review_date", {
    $gte: getLastWeekDate()
  })
  .find();

// Sort by engagement
const topReviews = reviews
  .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
  .slice(0, 10);

// Send email digest
await sendEmailDigest({
  subject: "Top 10 Movie Reviews This Week",
  reviews: topReviews
});
```

### Setting Up Automation in Contentstack

1. **Navigate to Automate:**
   - Go to Contentstack Dashboard
   - Click on **Automate** in the sidebar

2. **Create New Workflow:**
   - Click **+ New Workflow**
   - Name: "Review Vote Notification"
   - Description: "Notify when reviews get upvotes"

3. **Configure Trigger:**
   - Type: Entry Update
   - Content Type: Review
   - Condition: `upvotes` field changes

4. **Add Actions:**
   - Webhook to your backend
   - Slack notification
   - Email notification
   - Update related entries

5. **Test & Deploy:**
   - Use test entries to verify workflow
   - Monitor execution logs
   - Adjust conditions as needed

### API Usage Examples

#### Fetch Reviews with Vote Counts

```javascript
const reviews = await stack.ContentType("review")
  .Query()
  .includeReference("movie")
  .addParam("include_count", true)
  .find();

reviews.forEach(review => {
  console.log(`${review.reviewer_name}: ${review.upvotes}↑ ${review.downvotes}↓`);
});
```

#### Update Vote Count

```javascript
// Upvote
await stack.ContentType("review")
  .Entry(reviewUid)
  .fetch()
  .then(entry => {
    entry.upvotes = (entry.upvotes || 0) + 1;
    return entry.update();
  });

// Downvote
await stack.ContentType("review")
  .Entry(reviewUid)
  .fetch()
  .then(entry => {
    entry.downvotes = (entry.downvotes || 0) + 1;
    return entry.update();
  });
```

#### Get Top Rated Reviews

```javascript
const topReviews = await stack.ContentType("review")
  .Query()
  .includeReference("movie")
  .addQuery("upvotes", { $gte: 10 })
  .addParam("order_by", "-upvotes")
  .limit(10)
  .find();
```

### Benefits of This Setup

✅ **Engagement Tracking:** Monitor which reviews users find helpful
✅ **Quality Control:** Surface the most valuable reviews
✅ **Community Building:** Reward helpful reviewers
✅ **Content Moderation:** Flag reviews with high downvotes
✅ **Analytics:** Track review engagement metrics
✅ **Automated Workflows:** Trigger actions based on votes
✅ **Leaderboards:** Create "Top Reviewer" rankings
✅ **Notifications:** Alert teams about trending reviews

---

## 🎉 You're All Set!

Once you complete this setup, your CineVerse application will have:
- ✅ Full integration with Contentstack CMS
- ✅ Dynamic content management
- ✅ Beautiful Netflix-style UI
- ✅ Fast, cached data loading
- ✅ Responsive design across all devices

Enjoy building your movie universe! 🎬✨

