# 🎬 Complete Contentstack Setup Guide for CineVerse

## 📋 Overview

This guide provides **EVERYTHING** you need to set up Contentstack for your CineVerse application, including:
- ✅ 4 Content Types with all fields
- ✅ Field specifications and configurations
- ✅ Sample entries to create
- ✅ Assets to upload
- ✅ Relationships between content types
- ✅ Step-by-step process

---

## 🏗️ Content Architecture

### Content Types Needed:

1. **Director** (4-5 entries)
2. **Genre** (7 entries minimum)
3. **Movie** (10+ entries)
4. **Review** (Optional: 4-10 entries)

### Relationships:

```
Movie
  ├── References → Genre (Multiple)
  └── References → Director (Multiple)

Review
  └── References → Movie (Single)
```

---

## 📦 Content Type 1: DIRECTOR

### Fields Configuration:

| Field Name | Field Type | UID | Required | Details |
|------------|-----------|-----|----------|---------|
| Title | Single Line Textbox | title | ✅ Yes | Director's full name |
| Name | Single Line Textbox | name | ✅ Yes | Display name |
| Slug | Single Line Textbox | slug | ✅ Yes | URL-friendly, unique |
| Bio | Multi Line Textbox | bio | ✅ Yes | Director biography |
| Birth Year | Number | birth_year | ❌ No | Integer, e.g., 1970 |
| Profile Image | File | profile_image | ✅ Yes | Director photo |

### Field Details:

#### 1. Title (Single Line Textbox)
```
Display Name: Title
UID: title
Help Text: Enter the director's full name
Mandatory: Yes
Unique: No
Multiple: No
```

#### 2. Name (Single Line Textbox)
```
Display Name: Name
UID: name
Help Text: Display name for the director
Mandatory: Yes
Unique: No
Multiple: No
```

#### 3. Slug (Single Line Textbox)
```
Display Name: Slug
UID: slug
Help Text: URL-friendly identifier (e.g., christopher-nolan)
Mandatory: Yes
Unique: Yes
Multiple: No
Format: Lowercase, hyphens only
```

#### 4. Bio (Multi Line Textbox)
```
Display Name: Bio
UID: bio
Help Text: Brief biography of the director
Mandatory: Yes
Multiple: No
Rich Text Editor: Optional (Plain text is fine)
```

#### 5. Birth Year (Number)
```
Display Name: Birth Year
UID: birth_year
Help Text: Year of birth (e.g., 1970)
Mandatory: No
Min Value: 1900
Max Value: 2010
```

#### 6. Profile Image (File)
```
Display Name: Profile Image
UID: profile_image
Help Text: Director's profile photo (400x400 recommended)
Mandatory: Yes
Allowed file types: Images only
Dimensions: 400x400px (recommended)
```

### Sample Entries to Create:

#### Entry 1: Christopher Nolan
```
Title: Christopher Nolan
Name: Christopher Nolan
Slug: christopher-nolan
Bio: Christopher Nolan is a British-American film director, producer, and screenwriter known for his intellectually challenging films.
Birth Year: 1970
Profile Image: [Upload a director photo]
```

#### Entry 2: Jordan Peele
```
Title: Jordan Peele
Name: Jordan Peele
Slug: jordan-peele
Bio: Jordan Peele is an American filmmaker and actor known for his horror films that explore social themes.
Birth Year: 1979
Profile Image: [Upload a director photo]
```

#### Entry 3: Greta Gerwig
```
Title: Greta Gerwig
Name: Greta Gerwig
Slug: greta-gerwig
Bio: Greta Gerwig is an American actress, writer, and director known for her distinctive voice in independent cinema.
Birth Year: 1983
Profile Image: [Upload a director photo]
```

#### Entry 4: Denis Villeneuve
```
Title: Denis Villeneuve
Name: Denis Villeneuve
Slug: denis-villeneuve
Bio: Denis Villeneuve is a Canadian filmmaker known for his visually stunning science fiction films.
Birth Year: 1967
Profile Image: [Upload a director photo]
```

#### Entry 5: Taika Waititi
```
Title: Taika Waititi
Name: Taika Waititi
Slug: taika-waititi
Bio: Taika Waititi is a New Zealand filmmaker known for his quirky, comedic style.
Birth Year: 1975
Profile Image: [Upload a director photo]
```

---

## 📦 Content Type 2: GENRE

### Fields Configuration:

| Field Name | Field Type | UID | Required | Details |
|------------|-----------|-----|----------|---------|
| Title | Single Line Textbox | title | ✅ Yes | Genre name |
| Name | Single Line Textbox | name | ✅ Yes | Display name |
| Slug | Single Line Textbox | slug | ✅ Yes | URL-friendly, unique |
| Description | Multi Line Textbox | description | ✅ Yes | Genre description |

### Field Details:

#### 1. Title (Single Line Textbox)
```
Display Name: Title
UID: title
Help Text: Genre name
Mandatory: Yes
Unique: No
```

#### 2. Name (Single Line Textbox)
```
Display Name: Name
UID: name
Help Text: Display name for the genre
Mandatory: Yes
Unique: No
```

#### 3. Slug (Single Line Textbox)
```
Display Name: Slug
UID: slug
Help Text: URL-friendly identifier (e.g., sci-fi)
Mandatory: Yes
Unique: Yes
Format: Lowercase, hyphens only
```

#### 4. Description (Multi Line Textbox)
```
Display Name: Description
UID: description
Help Text: Brief description of the genre
Mandatory: Yes
```

### Sample Entries to Create:

#### Entry 1: Horror
```
Title: Horror
Name: Horror
Slug: horror
Description: Films designed to frighten and invoke our darkest fears.
```

#### Entry 2: Comedy
```
Title: Comedy
Name: Comedy
Slug: comedy
Description: Films designed to make audiences laugh and feel good.
```

#### Entry 3: Sci-Fi
```
Title: Sci-Fi
Name: Sci-Fi
Slug: sci-fi
Description: Films exploring futuristic concepts, space, and technology.
```

#### Entry 4: Action
```
Title: Action
Name: Action
Slug: action
Description: High-energy films with intense sequences and stunts.
```

#### Entry 5: Drama
```
Title: Drama
Name: Drama
Slug: drama
Description: Character-driven films that explore emotional themes.
```

#### Entry 6: Thriller
```
Title: Thriller
Name: Thriller
Slug: thriller
Description: Suspenseful films that keep you on the edge of your seat.
```

#### Entry 7: Adventure
```
Title: Adventure
Name: Adventure
Slug: adventure
Description: Exciting films featuring journeys and exploration.
```

---

## 📦 Content Type 3: MOVIE (Main Content Type)

### Fields Configuration:

| Field Name | Field Type | UID | Required | Details |
|------------|-----------|-----|----------|---------|
| Title | Single Line Textbox | title | ✅ Yes | Movie title |
| Slug | Single Line Textbox | slug | ✅ Yes | URL-friendly, unique |
| Description | Multi Line Textbox | description | ✅ Yes | Movie plot/synopsis |
| Release Year | Number | release_year | ✅ Yes | Integer (e.g., 2010) |
| Duration | Single Line Textbox | duration | ✅ Yes | Format: "2h 28min" |
| Rating | Number | rating | ❌ No | Decimal 0-5 (e.g., 4.8) |
| Featured | Boolean | featured | ✅ Yes | Show on homepage |
| Poster Image | File | poster_image | ✅ Yes | Vertical poster |
| Banner Image | File | banner_image | ✅ Yes | Horizontal banner |
| Trailer URL | Link | trailer_url | ❌ No | YouTube/Vimeo link |
| Genre | Reference | genre | ✅ Yes | Multiple references |
| Director | Reference | director | ✅ Yes | Multiple references |

### Field Details:

#### 1. Title (Single Line Textbox)
```
Display Name: Title
UID: title
Help Text: Movie title
Mandatory: Yes
Unique: No
```

#### 2. Slug (Single Line Textbox)
```
Display Name: Slug
UID: slug
Help Text: URL-friendly identifier (e.g., inception)
Mandatory: Yes
Unique: Yes
Format: Lowercase, hyphens only
```

#### 3. Description (Multi Line Textbox)
```
Display Name: Description
UID: description
Help Text: Movie plot and synopsis
Mandatory: Yes
Rich Text Editor: Optional
```

#### 4. Release Year (Number)
```
Display Name: Release Year
UID: release_year
Help Text: Year the movie was released (e.g., 2010)
Mandatory: Yes
Min Value: 1900
Max Value: 2030
```

#### 5. Duration (Single Line Textbox)
```
Display Name: Duration
UID: duration
Help Text: Movie length (e.g., "2h 28min")
Mandatory: Yes
Format: "Xh YYmin"
```

#### 6. Rating (Number)
```
Display Name: Rating
UID: rating
Help Text: Movie rating out of 5 (e.g., 4.8)
Mandatory: No
Min Value: 0
Max Value: 5
Decimal Places: 1
```

#### 7. Featured (Boolean)
```
Display Name: Featured
UID: featured
Help Text: Show this movie on the homepage hero banner
Mandatory: Yes
Default Value: false
```

#### 8. Poster Image (File)
```
Display Name: Poster Image
UID: poster_image
Help Text: Vertical movie poster (400x600 recommended)
Mandatory: Yes
Allowed file types: Images only
Dimensions: 400x600px or 2:3 ratio
```

#### 9. Banner Image (File)
```
Display Name: Banner Image
UID: banner_image
Help Text: Horizontal banner image (1920x1080 recommended)
Mandatory: Yes
Allowed file types: Images only
Dimensions: 1920x1080px or 16:9 ratio
```

#### 10. Trailer URL (Link)
```
Display Name: Trailer URL
UID: trailer_url
Help Text: YouTube or Vimeo trailer link
Mandatory: No
```

#### 11. Genre (Reference)
```
Display Name: Genre
UID: genre
Help Text: Select one or more genres
Reference To: Genre (Content Type)
Mandatory: Yes
Multiple: Yes
Min Instances: 1
Max Instances: 5
```

#### 12. Director (Reference)
```
Display Name: Director
UID: director
Help Text: Select one or more directors
Reference To: Director (Content Type)
Mandatory: Yes
Multiple: Yes
Min Instances: 1
Max Instances: 3
```

### Sample Entries to Create:

#### Entry 1: Inception
```
Title: Inception
Slug: inception
Description: A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.
Release Year: 2010
Duration: 2h 28min
Rating: 4.8
Featured: Yes (true)
Poster Image: [Upload movie poster]
Banner Image: [Upload banner]
Trailer URL: https://www.youtube.com/watch?v=YoHD9XEInc0
Genre: [Select: Sci-Fi, Action, Thriller]
Director: [Select: Christopher Nolan]
```

#### Entry 2: Get Out
```
Title: Get Out
Slug: get-out
Description: A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.
Release Year: 2017
Duration: 1h 44min
Rating: 4.5
Featured: Yes (true)
Poster Image: [Upload movie poster]
Banner Image: [Upload banner]
Trailer URL: https://www.youtube.com/watch?v=sRfnevzM9kQ
Genre: [Select: Horror, Thriller]
Director: [Select: Jordan Peele]
```

#### Entry 3: Dune
```
Title: Dune
Slug: dune
Description: A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.
Release Year: 2021
Duration: 2h 35min
Rating: 4.6
Featured: Yes (true)
Poster Image: [Upload movie poster]
Banner Image: [Upload banner]
Trailer URL: https://www.youtube.com/watch?v=n9xhJrPXop4
Genre: [Select: Sci-Fi, Adventure, Drama]
Director: [Select: Denis Villeneuve]
```

#### Entry 4: The Dark Knight
```
Title: The Dark Knight
Slug: the-dark-knight
Description: When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.
Release Year: 2008
Duration: 2h 32min
Rating: 4.9
Featured: Yes (true)
Poster Image: [Upload movie poster]
Banner Image: [Upload banner]
Trailer URL: https://www.youtube.com/watch?v=EXeTwQWrcwY
Genre: [Select: Action, Thriller, Drama]
Director: [Select: Christopher Nolan]
```

#### Entry 5: Interstellar
```
Title: Interstellar
Slug: interstellar
Description: A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.
Release Year: 2014
Duration: 2h 49min
Rating: 4.7
Featured: Yes (true)
Poster Image: [Upload movie poster]
Banner Image: [Upload banner]
Trailer URL: https://www.youtube.com/watch?v=zSWdZVtXT7E
Genre: [Select: Sci-Fi, Drama, Adventure]
Director: [Select: Christopher Nolan]
```

---

## 📦 Content Type 4: REVIEW (Optional)

### Fields Configuration:

| Field Name | Field Type | UID | Required | Details |
|------------|-----------|-----|----------|---------|
| Reviewer Name | Single Line Textbox | reviewer_name | ✅ Yes | User's name |
| Rating | Number | rating | ✅ Yes | Integer 1-5 |
| Review Text | Multi Line Textbox | review_text | ✅ Yes | Review content |
| Review Date | Date | review_date | ✅ Yes | When posted |
| Movie | Reference | movie | ✅ Yes | Single reference |

### Field Details:

#### 1. Reviewer Name (Single Line Textbox)
```
Display Name: Reviewer Name
UID: reviewer_name
Help Text: Name of the person reviewing
Mandatory: Yes
```

#### 2. Rating (Number)
```
Display Name: Rating
UID: rating
Help Text: Rating from 1 to 5 stars
Mandatory: Yes
Min Value: 1
Max Value: 5
Decimal Places: 0 (Integer only)
```

#### 3. Review Text (Multi Line Textbox)
```
Display Name: Review Text
UID: review_text
Help Text: The review content
Mandatory: Yes
```

#### 4. Review Date (Date)
```
Display Name: Review Date
UID: review_date
Help Text: Date the review was posted
Mandatory: Yes
```

#### 5. Movie (Reference)
```
Display Name: Movie
UID: movie
Help Text: The movie being reviewed
Reference To: Movie (Content Type)
Mandatory: Yes
Multiple: No (Single reference only)
```

### Sample Entries to Create:

#### Review 1: Inception Review
```
Reviewer Name: John Smith
Rating: 5
Review Text: Absolutely mind-bending! Nolan at his best. The visuals are stunning and the story keeps you engaged till the very end.
Review Date: 2023-06-15
Movie: [Select: Inception]
```

#### Review 2: Get Out Review
```
Reviewer Name: Mike Williams
Rating: 5
Review Text: A brilliant social thriller that will stay with you long after watching. Jordan Peele is a genius.
Review Date: 2023-05-10
Movie: [Select: Get Out]
```

---

## 🎯 Step-by-Step Creation Process

### Phase 1: Setup Contentstack Account

1. **Sign up** at https://www.contentstack.com/
2. **Create a Stack** (your project)
3. **Note your credentials**:
   - API Key
   - Delivery Token
   - Environment name
   - Region

### Phase 2: Create Content Types (IN THIS ORDER)

#### Step 1: Create Director Content Type
```
1. Go to Content Models → Create New
2. Name: Director
3. API UID: director
4. Add fields as specified above
5. Save Content Type
```

#### Step 2: Create Genre Content Type
```
1. Go to Content Models → Create New
2. Name: Genre
3. API UID: genre
4. Add fields as specified above
5. Save Content Type
```

#### Step 3: Create Movie Content Type
```
1. Go to Content Models → Create New
2. Name: Movie
3. API UID: movie
4. Add all fields as specified above
5. For Genre field: Reference → Multiple → Select "Genre"
6. For Director field: Reference → Multiple → Select "Director"
7. Save Content Type
```

#### Step 4: Create Review Content Type (Optional)
```
1. Go to Content Models → Create New
2. Name: Review
3. API UID: review
4. Add all fields as specified above
5. For Movie field: Reference → Single → Select "Movie"
6. Save Content Type
```

### Phase 3: Upload Assets

#### Director Photos (5 images needed)
```
Dimensions: 400x400px (square)
Format: JPG or PNG
Size: < 500KB each

Upload to: Assets → Upload
Naming: director-christopher-nolan.jpg, etc.
```

#### Movie Posters (10 images needed)
```
Dimensions: 400x600px (2:3 ratio, vertical)
Format: JPG or PNG
Size: < 1MB each

Upload to: Assets → Upload
Naming: poster-inception.jpg, poster-get-out.jpg, etc.
```

#### Movie Banners (10 images needed)
```
Dimensions: 1920x1080px (16:9 ratio, horizontal)
Format: JPG or PNG
Size: < 2MB each

Upload to: Assets → Upload
Naming: banner-inception.jpg, banner-get-out.jpg, etc.
```

### Phase 4: Create Entries (IN THIS ORDER)

#### Step 1: Create Director Entries (5 entries)
```
1. Go to Entries → Director → Create New
2. Fill in all fields for Christopher Nolan
3. Select Profile Image from uploaded assets
4. Save & Publish
5. Repeat for other 4 directors
```

#### Step 2: Create Genre Entries (7 entries)
```
1. Go to Entries → Genre → Create New
2. Fill in all fields for Horror
3. Save & Publish
4. Repeat for all 7 genres
```

#### Step 3: Create Movie Entries (10 entries)
```
1. Go to Entries → Movie → Create New
2. Fill in all fields for Inception
3. Select Poster Image from uploaded assets
4. Select Banner Image from uploaded assets
5. In Genre field: Select multiple genres (Sci-Fi, Action, Thriller)
6. In Director field: Select Christopher Nolan
7. Save & Publish
8. Repeat for all 10 movies
```

#### Step 4: Create Review Entries (4 entries - Optional)
```
1. Go to Entries → Review → Create New
2. Fill in reviewer name, rating, text, date
3. In Movie field: Select Inception
4. Save & Publish
5. Repeat for other reviews
```

### Phase 5: Publish Everything

```
1. Go to Entries
2. Select all entries
3. Bulk Actions → Publish
4. Confirm publish to your environment
```

---

## 🔧 Environment Setup

### Create .env file in your project root:

```bash
REACT_APP_CONTENTSTACK_API_KEY=blt1234567890abcdef
REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=cs1234567890abcdef
REACT_APP_CONTENTSTACK_ENVIRONMENT=production
REACT_APP_CONTENTSTACK_REGION=us
```

### Get Your Credentials:

1. **API Key**: 
   - Settings → Stack → API Keys → Delivery Key
   
2. **Delivery Token**:
   - Settings → Stack → Tokens → Delivery Token

3. **Environment**:
   - Usually "production" or "development"

4. **Region**:
   - us (North America)
   - eu (Europe)
   - azure-na (Azure North America)

---

## 📊 Content Summary

### Total Items to Create:

| Content Type | Number of Entries |
|--------------|-------------------|
| Directors | 5 |
| Genres | 7 |
| Movies | 10 |
| Reviews | 4 (optional) |
| **Total Entries** | **26** |

### Total Assets to Upload:

| Asset Type | Quantity | Dimensions |
|------------|----------|------------|
| Director Photos | 5 | 400x400px |
| Movie Posters | 10 | 400x600px |
| Movie Banners | 10 | 1920x1080px |
| **Total Assets** | **25** | - |

---

## 🎯 Testing Your Setup

### After creating all content:

1. **Test API Access**:
```javascript
// In your browser console or API tool
fetch('https://cdn.contentstack.io/v3/content_types/movie/entries?environment=production', {
  headers: {
    'api_key': 'YOUR_API_KEY',
    'access_token': 'YOUR_DELIVERY_TOKEN'
  }
})
```

2. **Update Your App**:
```javascript
// In src/api/contentstack.js
const USE_MOCK_DATA = false;  // Switch to real data
```

3. **Restart Your App**:
```bash
npm start
```

4. **Check Console**:
```
Should see: "✅ Data loaded successfully in X.XXs"
With counts of all your entries
```

---

## 🚀 Quick Start Checklist

- [ ] Create Contentstack account
- [ ] Create new Stack
- [ ] Create Director content type (6 fields)
- [ ] Create Genre content type (4 fields)
- [ ] Create Movie content type (12 fields)
- [ ] Create Review content type (5 fields - optional)
- [ ] Upload 5 director photos
- [ ] Upload 10 movie posters
- [ ] Upload 10 movie banners
- [ ] Create 5 director entries
- [ ] Create 7 genre entries
- [ ] Create 10 movie entries
- [ ] Create 4 review entries (optional)
- [ ] Publish all entries
- [ ] Get API credentials
- [ ] Create .env file
- [ ] Update USE_MOCK_DATA to false
- [ ] Test the app!

---

## 📝 Notes

1. **Create IN ORDER**: Directors & Genres first, then Movies (because Movies reference them)
2. **Publish Everything**: Unpublished entries won't appear in your app
3. **Use Unique Slugs**: Every entry needs a unique slug
4. **Image Sizes**: Recommended sizes for best performance
5. **References**: Make sure to select references when creating movies
6. **Featured Flag**: Mark 5-6 movies as featured for homepage

---

## 🎬 Ready to Build!

After completing this setup, your CineVerse app will:
- ✅ Load real data from Contentstack
- ✅ Display all movies with genres and directors
- ✅ Show genre cards on homepage
- ✅ Enable AI chatbot searches
- ✅ Display reviews on movie pages
- ✅ Work perfectly with your app!

**Estimated setup time: 2-3 hours for complete setup** 🚀

