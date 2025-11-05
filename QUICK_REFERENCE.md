# ⚡ Quick Reference Card

## 🔄 Switch Data Source

**File:** `src/api/contentstack.js` (Line 29)

```javascript
// DEMO MODE (Mock Data)
const USE_MOCK_DATA = true;

// PRODUCTION MODE (Real Contentstack)
const USE_MOCK_DATA = false;
```

---

## 🚀 Start App

```bash
npm start
```

---

## 🔐 Login Credentials

| Username | Password  |
|----------|-----------|
| demo     | demo123   |
| admin    | admin123  |
| user     | password  |

---

## 📦 Data Service Files

| File | Purpose |
|------|---------|
| `src/services/dataService.js` | Main data store & cache |
| `src/api/contentstack.js` | API wrapper with mock/real toggle |
| `src/components/DataInitializer.js` | Loading screen |

---

## 🎯 Quick Tasks

### Use Mock Data (Current)
```javascript
// src/api/contentstack.js
const USE_MOCK_DATA = true;
```
Then: `npm start`

### Use Real Contentstack
1. Create `.env`:
   ```
   REACT_APP_CONTENTSTACK_API_KEY=your_key
   REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=your_token
   REACT_APP_CONTENTSTACK_ENVIRONMENT=production
   ```

2. Update flag:
   ```javascript
   const USE_MOCK_DATA = false;
   ```

3. Restart: `npm start`

### Refresh Data
```javascript
import { refreshData } from '../api/contentstack';
await refreshData();
```

---

## 📊 Mock Data Included

- **10 Movies**: Inception, Get Out, Dune, The Dark Knight, etc.
- **7 Genres**: Horror, Comedy, Sci-Fi, Action, Drama, Thriller, Adventure
- **5 Directors**: Nolan, Peele, Gerwig, Villeneuve, Waititi
- **4 Reviews**: Sample reviews on featured movies

---

## 🎨 Home Page Flow

1. Login → Genre selection screen
2. Click genre → View movies in that genre
3. Click movie → Movie details
4. Use chatbot → Get recommendations

---

## 📝 Common Imports

```javascript
// Movies
import {
  getAllMovies,
  getFeaturedMovies,
  getMovieBySlug,
  getMoviesByGenre,
  searchMovies
} from '../api/contentstack';

// Genres
import {
  getAllGenres,
  getGenreBySlug
} from '../api/contentstack';

// Directors
import {
  getAllDirectors,
  getDirectorBySlug
} from '../api/contentstack';

// Reviews
import {
  getReviewsByMovie,
  getAllReviews
} from '../api/contentstack';

// Initialization
import {
  initializeData,
  refreshData,
  isDataReady
} from '../api/contentstack';
```

---

## 📖 Documentation

- `DATA_SERVICE_GUIDE.md` - Full guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `NEW_HOME_PAGE_FLOW.md` - Home page design
- `DEMO_MODE.md` - Demo features
- `QUICK_START_DEMO.md` - Getting started

---

## 🐛 Troubleshooting

### App won't load data?
1. Check `.env` has correct credentials
2. Verify `USE_MOCK_DATA` setting
3. Check browser console for errors

### Want to see data stats?
```javascript
import { getDataStats } from '../api/contentstack';
console.log(getDataStats());
```

### Data seems old?
```javascript
import { refreshData } from '../api/contentstack';
await refreshData();
```

---

## 📂 Project Structure

```
src/
├── api/
│   └── contentstack.js         ← Toggle mock/real data
├── services/
│   └── dataService.js          ← Data store & cache
├── components/
│   ├── DataInitializer.js      ← Loading screen
│   ├── ChatBot.js              ← AI chatbot
│   ├── Navigation.js           ← Top nav bar
│   └── ...
├── pages/
│   ├── HomePage.js             ← Genre selection
│   ├── MovieDetailPage.js      ← Movie details
│   └── ...
├── context/
│   └── AuthContext.js          ← Login system
└── styles/
    └── App.css                 ← All styles
```

---

## 🎯 Key Features

✅ Login with username/password
✅ Genre-first home page
✅ AI chatbot for recommendations
✅ Client-side data caching
✅ Mock and real data support
✅ Beautiful animations
✅ Fully responsive
✅ Fast performance

---

**Need help?** Check the full guides in the project root! 🎬✨

