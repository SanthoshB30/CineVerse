# 🎯 Contentstack UI Step-by-Step Guide

## Complete walkthrough for creating your CineVerse content in Contentstack

---

## 📌 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Creating Content Types](#creating-content-types)
3. [Uploading Assets](#uploading-assets)
4. [Creating Entries](#creating-entries)
5. [Publishing Content](#publishing-content)
6. [Getting API Credentials](#getting-api-credentials)
7. [Testing Your Setup](#testing-your-setup)

---

## 1️⃣ Initial Setup

### Step 1.1: Create Contentstack Account

1. Go to https://www.contentstack.com/
2. Click **"Start Free Trial"** or **"Sign Up"**
3. Fill in:
   - Email address
   - Password
   - Organization name (e.g., "CineVerse")
4. Verify your email
5. Log in to your account

### Step 1.2: Create a Stack

1. After login, you'll see the Dashboard
2. Click **"+ New Stack"** button (top right)
3. Fill in Stack details:
   - **Stack Name**: `CineVerse`
   - **Description**: `Movie review platform content`
   - **Master Language**: English - United States
4. Click **"Create"**
5. You'll be taken to the Stack Dashboard

---

## 2️⃣ Creating Content Types

### ⚠️ IMPORTANT: Create in this exact order!
1. Director
2. Genre
3. Movie (references Director & Genre)
4. Review (references Movie)

---

### 2.1: Create DIRECTOR Content Type

#### Navigate to Content Models:
1. From Stack Dashboard, click **"Content Models"** in left sidebar
2. Click **"+ New Content Type"** button

#### Basic Settings:
```
Name: Director
API UID: director (auto-generated)
Description: Movie directors and filmmakers
```
3. Click **"Create"**

#### Add Fields (click "+ New Field" for each):

**Field 1: Title**
1. Click **"Single Line Textbox"**
2. Settings:
   - Display Name: `Title`
   - UID: `title` (auto-generated)
   - Instruction Value: `Enter the director's full name`
   - Max Characters: Leave empty
3. Click **"Mandatory"** toggle (turn ON)
4. Click **"Save"**

**Field 2: Name**
1. Click **"Single Line Textbox"**
2. Settings:
   - Display Name: `Name`
   - UID: `name`
   - Instruction Value: `Display name for the director`
3. Click **"Mandatory"** toggle (turn ON)
4. Click **"Save"**

**Field 3: Slug**
1. Click **"Single Line Textbox"**
2. Settings:
   - Display Name: `Slug`
   - UID: `slug`
   - Instruction Value: `URL-friendly identifier (e.g., christopher-nolan)`
3. Click **"Mandatory"** toggle (turn ON)
4. Click **"Unique"** toggle (turn ON)
5. Click **"Save"**

**Field 4: Bio**
1. Click **"Multi Line Textbox"**
2. Settings:
   - Display Name: `Bio`
   - UID: `bio`
   - Instruction Value: `Brief biography of the director`
3. Click **"Mandatory"** toggle (turn ON)
4. Click **"Save"**

**Field 5: Birth Year**
1. Click **"Number"**
2. Settings:
   - Display Name: `Birth Year`
   - UID: `birth_year`
   - Instruction Value: `Year of birth (e.g., 1970)`
   - Minimum: `1900`
   - Maximum: `2010`
3. Leave **"Mandatory"** toggle OFF
4. Click **"Save"**

**Field 6: Profile Image**
1. Click **"File"**
2. Settings:
   - Display Name: `Profile Image`
   - UID: `profile_image`
   - Instruction Value: `Director's profile photo (400x400 recommended)`
3. Click **"Mandatory"** toggle (turn ON)
4. In "Allowed Extensions" → Select **"Images Only"**
5. Click **"Save"**

#### Finalize:
- Click **"Save"** (top right) to save the Content Type
- Your Director content type is now created! ✅

---

### 2.2: Create GENRE Content Type

#### Navigate & Create:
1. Click **"Content Models"** → **"+ New Content Type"**
2. Name: `Genre`
3. API UID: `genre`
4. Description: `Movie genres and categories`
5. Click **"Create"**

#### Add Fields:

**Field 1: Title**
```
Type: Single Line Textbox
Display Name: Title
UID: title
Mandatory: Yes
```

**Field 2: Name**
```
Type: Single Line Textbox
Display Name: Name
UID: name
Mandatory: Yes
```

**Field 3: Slug**
```
Type: Single Line Textbox
Display Name: Slug
UID: slug
Instruction: URL-friendly identifier (e.g., sci-fi)
Mandatory: Yes
Unique: Yes
```

**Field 4: Description**
```
Type: Multi Line Textbox
Display Name: Description
UID: description
Instruction: Brief description of the genre
Mandatory: Yes
```

#### Save the Content Type ✅

---

### 2.3: Create MOVIE Content Type

#### Navigate & Create:
1. Click **"Content Models"** → **"+ New Content Type"**
2. Name: `Movie`
3. API UID: `movie`
4. Description: `Movies and films`
5. Click **"Create"**

#### Add Fields (12 fields total):

**Fields 1-5: Basic Info**
```
1. Title (Single Line Textbox) - Mandatory
2. Slug (Single Line Textbox) - Mandatory, Unique
3. Description (Multi Line Textbox) - Mandatory
4. Release Year (Number) - Mandatory, Min: 1900, Max: 2030
5. Duration (Single Line Textbox) - Mandatory
   Instruction: Format: "2h 28min"
```

**Fields 6-7: Rating & Featured**
```
6. Rating (Number) - Optional, Min: 0, Max: 5
   Instruction: Rating out of 5 (e.g., 4.8)

7. Featured (Boolean) - Mandatory
   Instruction: Show this movie on the homepage
```

**Fields 8-10: Media**
```
8. Poster Image (File) - Mandatory, Images Only
   Instruction: Vertical movie poster (400x600 or 2:3 ratio)

9. Banner Image (File) - Mandatory, Images Only
   Instruction: Horizontal banner (1920x1080 or 16:9 ratio)

10. Trailer URL (Link) - Optional
    Instruction: YouTube or Vimeo trailer link
```

**Field 11: Genre (REFERENCE) - IMPORTANT!**
1. Click **"Reference"**
2. Settings:
   - Display Name: `Genre`
   - UID: `genre`
   - Instruction Value: `Select one or more genres`
3. Click **"Mandatory"** toggle (turn ON)
4. **Reference Settings**:
   - Click **"Multiple"** toggle (turn ON)
   - In "Content Types" dropdown → Select **"Genre"**
5. Click **"Save"**

**Field 12: Director (REFERENCE) - IMPORTANT!**
1. Click **"Reference"**
2. Settings:
   - Display Name: `Director`
   - UID: `director`
   - Instruction Value: `Select one or more directors`
3. Click **"Mandatory"** toggle (turn ON)
4. **Reference Settings**:
   - Click **"Multiple"** toggle (turn ON)
   - In "Content Types" dropdown → Select **"Director"**
5. Click **"Save"**

#### Save the Content Type ✅

---

### 2.4: Create REVIEW Content Type (Optional)

#### Navigate & Create:
1. Click **"Content Models"** → **"+ New Content Type"**
2. Name: `Review`
3. API UID: `review`
4. Description: `Movie reviews and ratings`
5. Click **"Create"**

#### Add Fields:

**Fields 1-4: Review Info**
```
1. Reviewer Name (Single Line Textbox) - Mandatory
2. Rating (Number) - Mandatory, Min: 1, Max: 5
   Instruction: Rating from 1 to 5 stars (integer)
3. Review Text (Multi Line Textbox) - Mandatory
4. Review Date (Date) - Mandatory
```

**Field 5: Movie (REFERENCE) - IMPORTANT!**
1. Click **"Reference"**
2. Settings:
   - Display Name: `Movie`
   - UID: `movie`
   - Instruction Value: `The movie being reviewed`
3. Click **"Mandatory"** toggle (turn ON)
4. **Reference Settings**:
   - Leave **"Multiple"** toggle OFF (single reference only)
   - In "Content Types" dropdown → Select **"Movie"**
5. Click **"Save"**

#### Save the Content Type ✅

---

## 3️⃣ Uploading Assets

### 3.1: Navigate to Assets

1. Click **"Assets"** in left sidebar
2. You'll see the Assets library (empty at first)

### 3.2: Upload Director Photos (5 images)

#### For each director:
1. Click **"+ Upload"** button (top right)
2. Click **"Select files from your computer"**
3. Select director photo (400x400px recommended)
4. After upload, click on the image thumbnail
5. In the right panel:
   - **Title**: `Christopher Nolan Profile`
   - **Description**: `Profile photo of Christopher Nolan`
   - **Tags**: `director, profile, nolan`
6. Click **"Save"**
7. Repeat for all 5 directors

**Image Naming Convention:**
- `director-christopher-nolan.jpg`
- `director-jordan-peele.jpg`
- `director-greta-gerwig.jpg`
- `director-denis-villeneuve.jpg`
- `director-taika-waititi.jpg`

### 3.3: Upload Movie Posters (10 images)

1. Click **"+ Upload"** button
2. Select movie poster (400x600px, vertical, 2:3 ratio)
3. Set metadata:
   - **Title**: `Inception Poster`
   - **Description**: `Movie poster for Inception`
   - **Tags**: `movie, poster, inception`
4. Click **"Save"**
5. Repeat for all 10 movies

**Image Naming Convention:**
- `poster-inception.jpg`
- `poster-get-out.jpg`
- `poster-dune.jpg`
- `poster-the-dark-knight.jpg`
- etc.

### 3.4: Upload Movie Banners (10 images)

1. Click **"+ Upload"** button
2. Select movie banner (1920x1080px, horizontal, 16:9 ratio)
3. Set metadata:
   - **Title**: `Inception Banner`
   - **Description**: `Banner image for Inception`
   - **Tags**: `movie, banner, inception`
4. Click **"Save"**
5. Repeat for all 10 movies

**Image Naming Convention:**
- `banner-inception.jpg`
- `banner-get-out.jpg`
- `banner-dune.jpg`
- `banner-the-dark-knight.jpg`
- etc.

### 📸 Where to Get Images:

**Free Stock Photo Sites:**
- Unsplash.com (high-quality, free)
- Pexels.com
- Pixabay.com
- Use search terms: "portrait", "person", "cinema", "space", etc.

---

## 4️⃣ Creating Entries

### ⚠️ IMPORTANT: Create in this exact order!
1. All Director entries (5)
2. All Genre entries (7)
3. All Movie entries (10)
4. All Review entries (4 - optional)

---

### 4.1: Create Director Entries (5 entries)

#### Director #1: Christopher Nolan

1. Click **"Entries"** in left sidebar
2. Click **"+ New Entry"** (top right)
3. Select **"Director"** from the dropdown
4. Fill in the form:

```
Title: Christopher Nolan
Name: Christopher Nolan
Slug: christopher-nolan
Bio: Christopher Nolan is a British-American film director, producer, and screenwriter known for his intellectually challenging films.
Birth Year: 1970
```

5. **Profile Image**:
   - Click **"Choose an existing asset"**
   - Select `director-christopher-nolan.jpg` from the list
   - Click **"Insert"**

6. Click **"Save"** (top right)
7. Click **"Publish"** (top right)
8. In the publish modal:
   - Select Environment: `production`
   - Click **"Publish"**

#### Repeat for remaining directors:

**Director #2: Jordan Peele**
```
Title: Jordan Peele
Name: Jordan Peele
Slug: jordan-peele
Bio: Jordan Peele is an American filmmaker and actor known for his horror films that explore social themes.
Birth Year: 1979
Profile Image: [Select director-jordan-peele.jpg]
```

**Director #3: Greta Gerwig**
```
Title: Greta Gerwig
Name: Greta Gerwig
Slug: greta-gerwig
Bio: Greta Gerwig is an American actress, writer, and director known for her distinctive voice in independent cinema.
Birth Year: 1983
Profile Image: [Select director-greta-gerwig.jpg]
```

**Director #4: Denis Villeneuve**
```
Title: Denis Villeneuve
Name: Denis Villeneuve
Slug: denis-villeneuve
Bio: Denis Villeneuve is a Canadian filmmaker known for his visually stunning science fiction films.
Birth Year: 1967
Profile Image: [Select director-denis-villeneuve.jpg]
```

**Director #5: Taika Waititi**
```
Title: Taika Waititi
Name: Taika Waititi
Slug: taika-waititi
Bio: Taika Waititi is a New Zealand filmmaker known for his quirky, comedic style.
Birth Year: 1975
Profile Image: [Select director-taika-waititi.jpg]
```

✅ **All 5 Directors Created & Published!**

---

### 4.2: Create Genre Entries (7 entries)

#### Genre #1: Horror

1. Click **"Entries"** → **"+ New Entry"** → **"Genre"**
2. Fill in:
```
Title: Horror
Name: Horror
Slug: horror
Description: Films designed to frighten and invoke our darkest fears.
```
3. **Save & Publish**

#### Create remaining genres:

**Genre #2: Comedy**
```
Title: Comedy
Name: Comedy
Slug: comedy
Description: Films designed to make audiences laugh and feel good.
```

**Genre #3: Sci-Fi**
```
Title: Sci-Fi
Name: Sci-Fi
Slug: sci-fi
Description: Films exploring futuristic concepts, space, and technology.
```

**Genre #4: Action**
```
Title: Action
Name: Action
Slug: action
Description: High-energy films with intense sequences and stunts.
```

**Genre #5: Drama**
```
Title: Drama
Name: Drama
Slug: drama
Description: Character-driven films that explore emotional themes.
```

**Genre #6: Thriller**
```
Title: Thriller
Name: Thriller
Slug: thriller
Description: Suspenseful films that keep you on the edge of your seat.
```

**Genre #7: Adventure**
```
Title: Adventure
Name: Adventure
Slug: adventure
Description: Exciting films featuring journeys and exploration.
```

✅ **All 7 Genres Created & Published!**

---

### 4.3: Create Movie Entries (10 entries)

#### Movie #1: Inception

1. Click **"Entries"** → **"+ New Entry"** → **"Movie"**
2. Fill in basic info:
```
Title: Inception
Slug: inception
Description: A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.
Release Year: 2010
Duration: 2h 28min
Rating: 4.8
Featured: ✅ (toggle ON)
```

3. **Poster Image**:
   - Click **"Choose an existing asset"**
   - Select `poster-inception.jpg`
   - Click **"Insert"**

4. **Banner Image**:
   - Click **"Choose an existing asset"**
   - Select `banner-inception.jpg`
   - Click **"Insert"**

5. **Trailer URL**:
```
https://www.youtube.com/watch?v=YoHD9XEInc0
```

6. **Genre** (Reference field):
   - Click **"Add existing"**
   - Search and select: **Sci-Fi**
   - Click **"Add existing"** again → Select: **Action**
   - Click **"Add existing"** again → Select: **Thriller**

7. **Director** (Reference field):
   - Click **"Add existing"**
   - Search and select: **Christopher Nolan**

8. **Save & Publish**

#### Movie #2: Get Out

```
Title: Get Out
Slug: get-out
Description: A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.
Release Year: 2017
Duration: 1h 44min
Rating: 4.5
Featured: ✅ ON
Poster Image: [Select poster-get-out.jpg]
Banner Image: [Select banner-get-out.jpg]
Trailer URL: https://www.youtube.com/watch?v=sRfnevzM9kQ
Genre: [Select: Horror, Thriller]
Director: [Select: Jordan Peele]
```

#### Movie #3: Dune

```
Title: Dune
Slug: dune
Description: A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.
Release Year: 2021
Duration: 2h 35min
Rating: 4.6
Featured: ✅ ON
Poster Image: [Select poster-dune.jpg]
Banner Image: [Select banner-dune.jpg]
Trailer URL: https://www.youtube.com/watch?v=n9xhJrPXop4
Genre: [Select: Sci-Fi, Adventure, Drama]
Director: [Select: Denis Villeneuve]
```

#### Movie #4: The Dark Knight

```
Title: The Dark Knight
Slug: the-dark-knight
Description: When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.
Release Year: 2008
Duration: 2h 32min
Rating: 4.9
Featured: ✅ ON
Poster Image: [Select poster-the-dark-knight.jpg]
Banner Image: [Select banner-the-dark-knight.jpg]
Genre: [Select: Action, Thriller, Drama]
Director: [Select: Christopher Nolan]
```

#### Movie #5: Interstellar

```
Title: Interstellar
Slug: interstellar
Description: A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.
Release Year: 2014
Duration: 2h 49min
Rating: 4.7
Featured: ✅ ON
Poster Image: [Select poster-interstellar.jpg]
Banner Image: [Select banner-interstellar.jpg]
Genre: [Select: Sci-Fi, Drama, Adventure]
Director: [Select: Christopher Nolan]
```

**Continue for movies 6-10...**

✅ **All 10 Movies Created & Published!**

---

### 4.4: Create Review Entries (4 entries - Optional)

#### Review #1: For Inception

1. Click **"Entries"** → **"+ New Entry"** → **"Review"**
2. Fill in:
```
Reviewer Name: John Smith
Rating: 5
Review Text: Absolutely mind-bending! Nolan at his best. The visuals are stunning and the story keeps you engaged till the very end.
Review Date: 2023-06-15 (use date picker)
Movie: [Click "Add existing" → Select "Inception"]
```
3. **Save & Publish**

#### Review #2-4: Continue similarly...

✅ **All Reviews Created & Published!**

---

## 5️⃣ Publishing Content

### Bulk Publish (After creating all entries):

1. Click **"Entries"** in left sidebar
2. You'll see all entries from all content types
3. Click the **checkbox** at the top to select all entries
4. Click **"Bulk Actions"** dropdown (top)
5. Select **"Publish"**
6. In the modal:
   - Environment: `production`
   - Locales: `en-us` (English)
7. Click **"Publish"**
8. Wait for confirmation

✅ **All Content Published!**

---

## 6️⃣ Getting API Credentials

### Step 6.1: Get API Key

1. Click **"Settings"** (gear icon) in left sidebar
2. Click **"Stack"** → **"API Keys"**
3. You'll see your **Delivery Key** or **Management Key**
4. Click on the **"Delivery"** key (or create one)
5. Copy the **API Key**:
   ```
   Example: blt1234567890abcdef
   ```
6. Keep it safe!

### Step 6.2: Get Delivery Token

1. In the same API Key view
2. Scroll down to **"Tokens"** section
3. Find **"Delivery Token"** or click **"+ Add Token"**
4. Copy the **Delivery Token**:
   ```
   Example: cs1234567890abcdef
   ```
5. Keep it safe!

### Step 6.3: Get Environment Name

1. Click **"Settings"** → **"Environments"**
2. You'll see your environments (usually `production`, `development`)
3. Note the **Environment Name**: `production`

### Step 6.4: Get Region

1. Check your Contentstack URL in browser
2. Regions:
   - `app.contentstack.com` → Region: **us**
   - `eu-app.contentstack.com` → Region: **eu**
   - `azure-na-app.contentstack.com` → Region: **azure-na**
   - `azure-eu-app.contentstack.com` → Region: **azure-eu**

---

## 7️⃣ Testing Your Setup

### Step 7.1: Test in Browser

Open this URL in your browser (replace with your credentials):

```
https://cdn.contentstack.io/v3/content_types/movie/entries?environment=production&include_count=true
```

Headers (use a tool like Postman or browser extension):
```
api_key: YOUR_API_KEY
access_token: YOUR_DELIVERY_TOKEN
```

You should see JSON with your movies! 🎉

### Step 7.2: Update Your App

Create `.env` file in your project root:

```bash
REACT_APP_CONTENTSTACK_API_KEY=blt1234567890abcdef
REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=cs1234567890abcdef
REACT_APP_CONTENTSTACK_ENVIRONMENT=production
REACT_APP_CONTENTSTACK_REGION=us
```

### Step 7.3: Switch to Real Data

In `src/api/contentstack.js`:
```javascript
const USE_MOCK_DATA = false;  // Change to false
```

### Step 7.4: Restart App

```bash
npm start
```

### Step 7.5: Check Console

You should see:
```
✅ Data loaded successfully in 2.34s:
   - Movies: 10
   - Genres: 7
   - Directors: 5
   - Reviews: 4
```

---

## 🎉 Congratulations!

Your CineVerse app is now powered by Contentstack!

### What You Can Do Now:

- ✅ Browse genres on homepage
- ✅ View all movies by genre
- ✅ See movie details with directors
- ✅ Browse all directors
- ✅ Search for movies
- ✅ Use AI chatbot for recommendations
- ✅ Read movie reviews

### Next Steps:

1. Add more movies to your Contentstack
2. Add more directors
3. Customize genres
4. Add more reviews
5. Share your app! 🚀

---

## 📞 Need Help?

### Common Issues:

**❌ "No entries found"**
- Check if entries are published
- Verify environment name
- Check API credentials

**❌ "Authentication failed"**
- Verify API Key and Delivery Token
- Check .env file exists
- Restart your app

**❌ "References not showing"**
- Make sure referenced entries are published
- Check reference field settings
- Verify content type UIDs

### Contentstack Documentation:
- https://www.contentstack.com/docs/
- https://www.contentstack.com/docs/developers/apis/content-delivery-api/

---

**Happy content managing! 🎬✨**

