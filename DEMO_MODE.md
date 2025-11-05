# 🎬 MovieHub - Demo Mode Active

## Current Status: Using Mock Data

The application is now running with **mock data** instead of connecting to Contentstack. This allows you to see the full UI and functionality without setting up a backend.

## 🎯 What's Included

### Mock Data:
- **10 Featured Movies** including:
  - Inception (Sci-Fi, Action, Thriller)
  - Get Out (Horror, Thriller)
  - Dune (Sci-Fi, Adventure, Drama)
  - The Dark Knight (Action, Thriller, Drama)
  - Interstellar (Sci-Fi, Drama, Adventure)
  - And 5 more!

- **7 Genres**:
  - Horror
  - Comedy
  - Sci-Fi
  - Action
  - Drama
  - Thriller
  - Adventure

- **5 Famous Directors**:
  - Christopher Nolan
  - Jordan Peele
  - Greta Gerwig
  - Denis Villeneuve
  - Taika Waititi

- **Movie Reviews** with ratings and user feedback

## 🚀 How to Run

1. **Start the application:**
   ```bash
   npm start
   ```

2. **Login with demo credentials:**
   - Username: `demo`
   - Password: `demo123`
   
   Or use:
   - `admin` / `admin123`
   - `user` / `password`

3. **Explore the features:**
   - Browse movies by genre (Horror, Comedy, Sci-Fi, etc.)
   - Use the AI chatbot to ask about movies
   - Click on movie cards to see details
   - View director pages
   - Use the search functionality

## 💬 AI Chatbot Features

The chatbot can:
- Recommend movies by genre
- Search for specific movies
- Tell you about movie details
- List available genres

**Try asking:**
- "Tell me about Inception"
- "Recommend a horror movie"
- "What genres are available?"
- "Show me sci-fi movies"

## 🎨 What You Can See

### Home Page
- Hero banner with rotating featured movies
- Genre carousels (scroll through movies in each genre)
- Beautiful movie cards with posters and ratings

### Movie Detail Pages
- Large hero banner
- Movie poster and description
- Genre tags and director info
- User reviews with ratings

### Navigation
- Search bar for finding movies
- Genre dropdown menu
- Directors page
- User menu with logout

### AI Chatbot
- Floating chat button (bottom-right corner)
- Natural language movie queries
- Smart recommendations

## 🔄 To Switch Back to Contentstack

When you're ready to use real data from Contentstack:

1. Open `src/api/contentstack.js`
2. Follow the instructions at the top of the file
3. Uncomment the Contentstack import
4. Replace mock functions with original API calls
5. Add your Contentstack credentials to `.env`

## 📸 Mock Images

All images are sourced from Unsplash for demo purposes. In production, these would be your actual movie posters and banners from Contentstack.

## 🎯 All Features Working

✅ Login/Logout System
✅ Genre-based browsing
✅ Movie search
✅ Director profiles
✅ Movie details with reviews
✅ AI-powered chatbot
✅ Responsive design (mobile & desktop)
✅ Beautiful animations and transitions

---

**Enjoy exploring your MovieHub application!** 🍿🎬

