# 🔗 Content Relationships & Architecture

## Visual Content Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CINEVERSE CONTENT MODEL                 │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐                  ┌──────────────┐
│   DIRECTOR   │                  │    GENRE     │
├──────────────┤                  ├──────────────┤
│ • name       │                  │ • name       │
│ • slug       │                  │ • slug       │
│ • bio        │                  │ • description│
│ • birth_year │                  └──────┬───────┘
│ • photo      │                         │
└──────┬───────┘                         │
       │                                 │
       │ Referenced by (Multiple)        │ Referenced by (Multiple)
       │                                 │
       ▼                                 ▼
┌─────────────────────────────────────────────────┐
│                    MOVIE                        │
├─────────────────────────────────────────────────┤
│ • title                                         │
│ • slug                                          │
│ • description                                   │
│ • release_year                                  │
│ • duration                                      │
│ • rating                                        │
│ • featured (boolean)                            │
│ • poster_image                                  │
│ • banner_image                                  │
│ • trailer_url                                   │
│ • genre[] ─────────► References Genre (Multiple)│
│ • director[] ──────► References Director (Multi)│
└──────┬──────────────────────────────────────────┘
       │
       │ Referenced by (Single)
       │
       ▼
┌──────────────────┐
│     REVIEW       │
├──────────────────┤
│ • reviewer_name  │
│ • rating (1-5)   │
│ • review_text    │
│ • review_date    │
│ • movie ────────► References Movie (Single)
└──────────────────┘
```

## Relationship Types

### 1. Movie → Director (Many-to-Many)
```
One Movie can have multiple Directors
One Director can have multiple Movies

Example:
- "Inception" → Christopher Nolan
- "The Dark Knight" → Christopher Nolan
- "Interstellar" → Christopher Nolan
```

### 2. Movie → Genre (Many-to-Many)
```
One Movie can have multiple Genres
One Genre can have multiple Movies

Example:
- "Inception" → [Sci-Fi, Action, Thriller]
- "Dune" → [Sci-Fi, Adventure, Drama]
- "Get Out" → [Horror, Thriller]
```

### 3. Review → Movie (Many-to-One)
```
One Review belongs to one Movie
One Movie can have multiple Reviews

Example:
- Review #1 → "Inception"
- Review #2 → "Inception"
- Review #3 → "Get Out"
```

## Data Flow Diagram

```
┌────────────────────────┐
│  CONTENTSTACK CMS      │
│  (Cloud Storage)       │
└───────────┬────────────┘
            │
            │ API Request (get-all-entries)
            ▼
┌────────────────────────┐
│  DataService.js        │
│  (Client-Side Cache)   │
│                        │
│  Stores:               │
│  • movies[]            │
│  • genres[]            │
│  • directors[]         │
│  • reviews[]           │
└───────────┬────────────┘
            │
            │ Query Functions
            ▼
┌────────────────────────────────────────┐
│         REACT COMPONENTS               │
│                                        │
│  • HomePage (genre selection)          │
│  • MovieDetailPage (full info)         │
│  • DirectorPage (director movies)      │
│  • GenrePage (genre movies)            │
│  • ChatBot (AI search)                 │
│  • ReviewSection (movie reviews)       │
└────────────────────────────────────────┘
```

## Field Dependencies

### Movie Entry Dependencies
```
Before creating a Movie, you MUST have:
✅ At least 1 Director entry
✅ At least 1 Genre entry
✅ Poster image uploaded
✅ Banner image uploaded

Movie creation order:
1. Upload assets (images)
2. Create Director entries
3. Create Genre entries
4. Create Movie entry
5. Select Director reference
6. Select Genre reference(s)
7. Select image assets
8. Publish
```

### Review Entry Dependencies
```
Before creating a Review, you MUST have:
✅ At least 1 Movie entry (published)

Review creation order:
1. Create Movie entry first
2. Publish Movie
3. Create Review entry
4. Select Movie reference
5. Publish
```

## API Endpoints Used

### Contentstack CDA Endpoints:

```javascript
// Get all entries of a content type
GET /v3/content_types/{content_type_uid}/entries
Headers:
  - api_key: YOUR_API_KEY
  - access_token: YOUR_DELIVERY_TOKEN
  - environment: YOUR_ENVIRONMENT

// Get single entry
GET /v3/content_types/{content_type_uid}/entries/{entry_uid}

// Get all entries (used by DataService)
GET /v3/content_types/{content_type_uid}/entries?include_count=true&include_fallback=true
```

### How References Work:

```javascript
// Movie entry with references
{
  "title": "Inception",
  "slug": "inception",
  "genre": [
    {
      "uid": "genre_sci_fi",
      "name": "Sci-Fi",
      "_content_type_uid": "genre"
    },
    {
      "uid": "genre_action",
      "name": "Action",
      "_content_type_uid": "genre"
    }
  ],
  "director": [
    {
      "uid": "dir_nolan",
      "name": "Christopher Nolan",
      "_content_type_uid": "director"
    }
  ]
}
```

## Query Patterns

### 1. Get Movies by Genre
```javascript
// Frontend queries DataService
const movies = getMoviesByGenre('sci-fi');

// Filters movies where:
movie.genre.some(g => g.slug === 'sci-fi')
```

### 2. Get Director's Movies
```javascript
// Frontend queries DataService
const director = getDirectorBySlug('christopher-nolan');

// Returns director with all movies where:
movie.director.some(d => d.uid === director.uid)
```

### 3. Get Movie Reviews
```javascript
// Frontend queries DataService
const reviews = getReviewsByMovie(movie.uid);

// Filters reviews where:
review.movie.uid === movie.uid
// OR
review.movie_uid === movie.uid
```

## Content Hierarchy

```
Level 1: Independent Content Types
├── Director (no dependencies)
└── Genre (no dependencies)

Level 2: Dependent Content Types
└── Movie (depends on Director & Genre)

Level 3: Child Content Types
└── Review (depends on Movie)
```

## Important Notes

### 🔑 Key Rules:

1. **Creation Order Matters**: Always create Directors and Genres before Movies
2. **References Must Be Published**: Referenced entries must be published to appear
3. **Slugs Must Be Unique**: Each slug must be unique within its content type
4. **Multiple References**: Movies can have multiple Directors and Genres
5. **Single Reference**: Reviews can only reference ONE Movie

### ⚠️ Common Mistakes:

❌ Creating Movie before Directors/Genres exist
❌ Not publishing referenced entries
❌ Using duplicate slugs
❌ Referencing unpublished content
❌ Forgetting to select multiple genres

### ✅ Best Practices:

✅ Create all Directors first
✅ Create all Genres second
✅ Upload all images before creating Movies
✅ Publish everything after creation
✅ Use consistent slug naming (lowercase-with-hyphens)
✅ Test with a few entries before bulk creation
✅ Mark 5-6 movies as "featured" for homepage

## Content Type UIDs Reference

```javascript
// Use these UIDs when making API calls
const CONTENT_TYPES = {
  DIRECTOR: 'director',
  GENRE: 'genre',
  MOVIE: 'movie',
  REVIEW: 'review'
};

// Reference fields
const REFERENCE_FIELDS = {
  MOVIE_GENRE: 'genre',      // Multiple references
  MOVIE_DIRECTOR: 'director', // Multiple references
  REVIEW_MOVIE: 'movie'       // Single reference
};
```

## Testing Relationships

### Verify Movie References:
```javascript
// Check if movie has proper references
const movie = await getMovieBySlug('inception');
console.log('Genres:', movie.genre.map(g => g.name));
console.log('Directors:', movie.director.map(d => d.name));
```

### Verify Review References:
```javascript
// Check if reviews are linked to movies
const reviews = await getReviewsByMovie(movie.uid);
console.log('Review count:', reviews.length);
console.log('Reviews:', reviews.map(r => r.reviewer_name));
```

### Verify Director's Movies:
```javascript
// Check if director has movies
const director = await getDirectorBySlug('christopher-nolan');
console.log('Movies count:', director.movies_directed.length);
console.log('Movies:', director.movies_directed.map(m => m.title));
```

---

## Quick Reference Card

| Action | Requires | Result |
|--------|----------|--------|
| Create Director | Assets (photo) | Independent entry |
| Create Genre | Nothing | Independent entry |
| Create Movie | Directors, Genres, Assets | Referenced entry |
| Create Review | Published Movie | Child entry |
| Query by Genre | Published Movies | Filtered list |
| Query by Director | Published Movies | Filtered list |

---

**This architecture ensures data consistency and enables powerful querying capabilities for your CineVerse application! 🎬**

