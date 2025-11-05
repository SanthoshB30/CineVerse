# 🚀 Quick Start - Demo Mode

## Run Your MovieHub Application

### Step 1: Start the Application
```bash
cd /Users/santhosh.baskaran/Web_Page
npm start
```

The app will open at: **http://localhost:3000**

### Step 2: Login
You'll see a beautiful login page. Use these credentials:

| Username | Password  |
|----------|-----------|
| demo     | demo123   |
| admin    | admin123  |
| user     | password  |

### Step 3: Explore!

## 🎬 What You'll See

### 1️⃣ **Login Page**
- Animated gradient background
- Modern login form
- Demo credentials helper

### 2️⃣ **Home Page** (After Login)
- **Hero Banner** - Rotating featured movies (Inception, Get Out, Dune, The Dark Knight, Interstellar)
- **Genre Carousels**:
  - Horror → Get Out, Us, A Quiet Place
  - Comedy → Lady Bird, Thor: Ragnarok, Jojo Rabbit
  - Sci-Fi → Inception, Dune, Interstellar, A Quiet Place
  - Action → Inception, The Dark Knight, Thor: Ragnarok
  - Drama → Dune, Lady Bird, The Dark Knight, Interstellar, Jojo Rabbit
  - Thriller → Inception, Get Out, The Dark Knight, Us, A Quiet Place
  - Adventure → Dune, Thor: Ragnarok, Interstellar

### 3️⃣ **Navigation Bar**
- 🏠 Home
- 🎭 Genres dropdown (all 7 genres)
- 🎬 Directors
- 🔍 Search bar
- 👤 User menu (shows your username)

### 4️⃣ **AI Chatbot** 💬
Click the floating chat button (bottom-right corner)

**Try these commands:**
```
"Tell me about Inception"
"Recommend a horror movie"
"What genres are available?"
"Show me Christopher Nolan movies"
"Suggest a sci-fi film"
```

### 5️⃣ **Movie Detail Pages**
Click any movie card to see:
- Large hero banner
- Movie poster
- Full description
- Rating (⭐)
- Director link
- Genre tags
- User reviews
- Trailer link

### 6️⃣ **Director Pages**
Click "Directors" or any director name to see:
- Director profile photo
- Biography
- Birth year
- All movies they directed

### 7️⃣ **Genre Pages**
Click any genre to see:
- All movies in that genre
- Sort options
- Grid view of movie cards

### 8️⃣ **Search**
Type in the search bar:
- Search by movie title
- Search by description
- See results page

## 📱 Responsive Design

The app works perfectly on:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px+)
- 📱 Tablet (768px)
- 📱 Mobile (375px+)

## 🎨 Design Features

✨ **Animations**:
- Smooth page transitions
- Hover effects on cards
- Carousel scrolling
- Chatbot slide-in
- Login form animation

🎨 **Modern UI**:
- Dark theme (Netflix-style)
- Red accent color (#e50914)
- Glassmorphism effects
- Beautiful gradients
- Shadow effects

## 🎯 Key Pages to Test

1. **Home** → See all genre carousels
2. **Movie: Inception** → `/movie/inception` - Full details + reviews
3. **Movie: Get Out** → `/movie/get-out` - Horror thriller
4. **Director: Christopher Nolan** → `/director/christopher-nolan` - See his filmography
5. **Genre: Horror** → `/genre/horror` - All horror movies
6. **Search: "dark"** → Find "The Dark Knight"
7. **Directors Page** → `/directors` - All 5 directors

## 💡 Tips

1. **Try the chatbot first** - It's the coolest feature!
2. **Hover over movie cards** - They have nice zoom effects
3. **Check the hero banner** - It auto-rotates every 5 seconds
4. **Use genre carousels** - Scroll left/right to see more movies
5. **Read reviews** - Go to Inception or Dune to see user reviews

## 🔄 What's Different from Real Version?

| Feature | Demo (Mock Data) | Real (Contentstack) |
|---------|------------------|---------------------|
| Movies | 10 hardcoded | Unlimited from CMS |
| Images | Unsplash placeholders | Your actual posters |
| Content | Fixed | Editable in Contentstack |
| Load time | Instant (+ 300ms delay) | API response time |

## 🎬 Sample Data Summary

- **10 Movies** across all genres
- **7 Genres** (Horror, Comedy, Sci-Fi, Action, Drama, Thriller, Adventure)
- **5 Directors** (Nolan, Peele, Gerwig, Villeneuve, Waititi)
- **4 Reviews** on featured movies
- **Beautiful placeholder images** from Unsplash

---

**Ready to explore?** Run `npm start` and login with `demo` / `demo123`! 🍿

