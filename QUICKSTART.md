# Quick Start Guide

Get your Movie Review Platform up and running in minutes!

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Contentstack account

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Contentstack

Create a `.env` file in the root directory:

```env
REACT_APP_CONTENTSTACK_API_KEY=your_api_key_here
REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
REACT_APP_CONTENTSTACK_ENVIRONMENT=development
REACT_APP_CONTENTSTACK_REGION=us
```

Replace the placeholder values with your actual Contentstack credentials.

### 3. Set Up Content Models

Follow the detailed instructions in `CONTENTSTACK_SETUP.md` to create:
- Genre content type
- Director content type
- Movie content type
- Review content type
- Chatbot Prompts content type (optional)

### 4. Add Sample Content

Create at least:
- 3-5 genres (Action, Drama, Comedy, etc.)
- 2-3 directors
- 5-10 movies with genres and directors assigned
- A few reviews for your movies
- Mark 2-3 movies as "Featured" for the homepage carousel

### 5. Publish Your Content

Make sure all your entries are published to the environment you specified in your `.env` file.

### 6. Run the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── api/
│   └── contentstack.js          # All Contentstack API integration
├── components/
│   ├── ChatBot.js               # AI chatbot widget
│   ├── GenreCarousel.js         # Movie carousel by genre
│   ├── MovieCard.js             # Movie card component
│   ├── Navigation.js            # Main navigation bar
│   ├── ReviewSection.js         # Reviews display
│   └── SearchBar.js             # Search functionality
├── pages/
│   ├── AllDirectorsPage.js      # All directors listing
│   ├── DirectorPage.js          # Single director profile
│   ├── GenrePage.js             # Movies by genre
│   ├── HomePage.js              # Main landing page
│   ├── MovieDetailPage.js       # Movie details with reviews
│   └── SearchResultsPage.js     # Search results
├── styles/
│   └── App.css                  # All application styles
├── App.js                       # Main app with routing
└── index.js                     # Entry point
```

## Key Features

### 🎬 Homepage
- Hero banner with featured movies (auto-rotating carousel)
- Genre-based movie carousels
- Responsive design

### 🎥 Movie Details
- Full movie information
- Director link
- Genre tags
- User reviews
- Trailer link (if available)

### 🎭 Director Profiles
- Director biography
- Profile picture
- Complete filmography
- Movies directed by them

### 🎪 Genre Pages
- All movies in a specific genre
- Sorting options (by title, year, rating)
- Genre description and banner

### 🔍 Search
- Search movies by title
- Real-time results
- Redirects to search results page

### 🤖 Chatbot
- Ask about specific movies: "Tell me about Inception"
- Get recommendations: "Recommend a Drama movie"
- List available genres: "What genres are available?"
- Floating widget in bottom-right corner

## Using the Chatbot

The chatbot understands several types of queries:

1. **Movie Information**
   - "Tell me about [movie name]"
   - "What is [movie name]"
   - "About [movie name]"

2. **Recommendations**
   - "Recommend a [genre] movie"
   - "Suggest a good [genre] film"

3. **Browse Genres**
   - "What genres are available?"
   - "List all genres"

4. **General Search**
   - Just type a movie name to search

## Customization

### Change Colors
Edit CSS variables in `src/styles/App.css`:

```css
:root {
  --primary-color: #e50914;      /* Main brand color */
  --background-dark: #141414;    /* Dark background */
  --text-primary: #ffffff;       /* Primary text */
}
```

### Add New Content Types
1. Create the content type in Contentstack
2. Add API functions in `src/api/contentstack.js`
3. Create components and pages as needed

### Modify Navigation
Edit `src/components/Navigation.js` to add or remove menu items.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Deployment

### Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

### Vercel
1. Import your project
2. Framework preset: Create React App
3. Add environment variables
4. Deploy

### Other Platforms
Upload the contents of the `build/` folder to any static hosting service.

## Troubleshooting

### Blank Screen
- Check browser console for errors
- Verify `.env` file exists and has correct values
- Ensure content is published in Contentstack

### Movies Not Appearing
- Check that movies are published
- Verify referenced genres/directors are published
- Check API credentials

### Images Not Loading
- Ensure images are uploaded to Contentstack
- Check image URLs in browser console
- Verify CORS settings

### Chatbot Not Working
- Check if movies exist in Contentstack
- Verify API connection
- Check browser console for errors

## Next Steps

1. **Add More Content**: Create more movies, directors, and reviews
2. **Customize Design**: Modify colors and styling to match your brand
3. **Add Features**: Implement user ratings, comments, or watchlists
4. **Optimize Performance**: Implement lazy loading and caching
5. **Add Analytics**: Track user behavior and popular content

## Support

- See `CONTENTSTACK_SETUP.md` for detailed CMS setup
- See `README.md` for complete documentation
- Check Contentstack documentation for API questions

## Tips

- **SEO**: Add meta tags and update page titles
- **Performance**: Optimize images before uploading
- **UX**: Test on different devices and screen sizes
- **Content**: Keep descriptions concise and engaging
- **Updates**: Regularly add new movies and reviews

Happy building! 🎬

