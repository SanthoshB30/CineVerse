# Contentstack Setup Guide

This guide will help you set up your Contentstack CMS for the Movie Review Platform.

## Step 1: Create a Contentstack Account

1. Go to [Contentstack](https://www.contentstack.com/)
2. Sign up for a free account
3. Create a new stack for your movie review platform

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Contentstack credentials:
   - `REACT_APP_CONTENTSTACK_API_KEY`: Your stack API key
   - `REACT_APP_CONTENTSTACK_DELIVERY_TOKEN`: Your delivery token
   - `REACT_APP_CONTENTSTACK_ENVIRONMENT`: Your environment name (e.g., "development")
   - `REACT_APP_CONTENTSTACK_REGION`: Your region (e.g., "us", "eu", "azure-na")

### Finding Your Credentials

- **API Key**: Settings → Stack → API Key
- **Delivery Token**: Settings → Tokens → Create/View Delivery Token
- **Environment**: Settings → Environments

## Step 3: Create Content Types

Create the following content types in your Contentstack dashboard:

### 1. Genre Content Type

**UID**: `genre`

| Field Name | Field Type | UID | Required | Multiple | Notes |
|------------|-----------|-----|----------|----------|-------|
| Name | Single Line Textbox | `name` | Yes | No | Genre name (e.g., Action, Drama) |
| Slug | Single Line Textbox | `slug` | Yes | No | Auto-generate from title, unique |
| Description | Rich Text Editor | `description` | No | No | Brief description of genre |
| Featured Image | File | `featured_image` | No | No | Banner image for genre page |

### 2. Director Content Type

**UID**: `director`

| Field Name | Field Type | UID | Required | Multiple | Notes |
|------------|-----------|-----|----------|----------|-------|
| Name | Single Line Textbox | `name` | Yes | No | Director's full name |
| Slug | Single Line Textbox | `slug` | Yes | No | Auto-generate from name, unique |
| Biography | Rich Text Editor | `biography` | No | No | Director's background and career |
| Profile Image | File | `profile_image` | No | No | Photo of the director |
| Birth Year | Number | `birth_year` | No | No | Year of birth |

### 3. Movie Content Type

**UID**: `movie`

| Field Name | Field Type | UID | Required | Multiple | Notes |
|------------|-----------|-----|----------|----------|-------|
| Title | Single Line Textbox | `title` | Yes | No | Movie title |
| Slug | Single Line Textbox | `slug` | Yes | No | Auto-generate from title, unique |
| Description | Rich Text Editor | `description` | Yes | No | Movie synopsis/overview |
| Release Year | Number | `release_year` | Yes | No | Year of release |
| Duration | Single Line Textbox | `duration` | No | No | e.g., "2h 28m" |
| Genre | Reference | `genre` | No | Yes | Reference to Genre content type |
| Director | Reference | `director` | No | Yes | Reference to Director content type |
| Poster Image | File | `poster_image` | Yes | No | Movie poster (recommended: 2:3 ratio) |
| Banner Image | File | `banner_image` | No | No | Background/hero image (16:9 ratio) |
| Rating | Number | `rating` | No | No | Average rating (1-5 scale) |
| Trailer URL | Link | `trailer_url` | No | No | YouTube or Vimeo trailer link |
| Featured | Boolean | `featured` | No | No | Show in homepage hero carousel |

### 4. Review Content Type

**UID**: `review`

| Field Name | Field Type | UID | Required | Multiple | Notes |
|------------|-----------|-----|----------|----------|-------|
| Movie | Reference | `movie` | Yes | No | Reference to Movie content type |
| Reviewer Name | Single Line Textbox | `reviewer_name` | Yes | No | Display name of reviewer |
| Rating | Number | `rating` | Yes | No | Rating (1-5 scale) |
| Review Text | Multi Line Textbox | `review_text` | Yes | No | Review content |
| Date | Date | `date` | Yes | No | Review date |

### 5. Chatbot Prompts Content Type (Optional)

**UID**: `chatbot_prompts`

| Field Name | Field Type | UID | Required | Multiple | Notes |
|------------|-----------|-----|----------|----------|-------|
| Movie | Reference | `movie` | Yes | No | Reference to Movie content type |
| Prompt | Single Line Textbox | `prompt` | Yes | No | Example question |
| Response | Multi Line Textbox | `response` | Yes | No | Pre-written response |

## Step 4: Add Sample Content

### Sample Genres
- Action
- Drama
- Comedy
- Sci-Fi
- Thriller
- Romance
- Horror
- Documentary

### Sample Movies

Here's an example movie entry structure:

**Inception**
- Title: Inception
- Slug: inception
- Description: A thief who steals corporate secrets through the use of dream-sharing technology...
- Release Year: 2010
- Duration: 2h 28m
- Genre: [Sci-Fi, Thriller]
- Director: [Christopher Nolan]
- Rating: 4.8
- Featured: true

**The Dark Knight**
- Title: The Dark Knight
- Slug: the-dark-knight
- Description: When the menace known as the Joker wreaks havoc and chaos...
- Release Year: 2008
- Duration: 2h 32m
- Genre: [Action, Thriller]
- Director: [Christopher Nolan]
- Rating: 4.9
- Featured: true

### Sample Directors

**Christopher Nolan**
- Name: Christopher Nolan
- Slug: christopher-nolan
- Biography: British-American film director, producer, and screenwriter...
- Birth Year: 1970

## Step 5: Configure References

When setting up Reference fields:

1. **Movie → Genre**: 
   - Set to "Multiple"
   - Allow selecting multiple genres per movie

2. **Movie → Director**: 
   - Set to "Multiple" or "Single" based on your needs
   - Typically single for simplicity

3. **Review → Movie**: 
   - Set to "Single"
   - Each review links to one movie

## Step 6: Set Up Display Settings

For each content type:
1. Go to Settings → Display
2. Set the display field (usually Title or Name)
3. Configure preview URLs if needed

## Step 7: Publishing Workflow

1. Create entries in this order:
   - Genres first (no dependencies)
   - Directors second (no dependencies)
   - Movies third (references genres and directors)
   - Reviews fourth (references movies)
   - Chatbot Prompts last (references movies)

2. Publish all entries to your environment

## Step 8: Test Your Setup

1. Make sure your `.env` file is configured correctly
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Visit http://localhost:3000

## Troubleshooting

### Common Issues

**Movies not showing:**
- Check if movies are published to the correct environment
- Verify that referenced genres and directors are also published
- Check console for API errors

**Images not loading:**
- Ensure images are uploaded and published
- Check if image URLs are accessible
- Verify CORS settings in Contentstack

**API Connection Failed:**
- Double-check your API credentials in `.env`
- Verify the region is correct
- Ensure delivery token has read permissions

### Debugging Tips

1. Open browser console to see API errors
2. Check Network tab for failed requests
3. Verify Contentstack entry UIDs match your code
4. Ensure all referenced entries are published

## Content Management Best Practices

1. **Use meaningful slugs**: Keep them short and descriptive
2. **Optimize images**: Compress images before uploading
3. **Write clear descriptions**: Use rich text formatting
4. **Maintain consistency**: Follow naming conventions
5. **Regular backups**: Export your content periodically

## Advanced Features

### Webhooks
Set up webhooks to trigger builds when content changes:
- Settings → Webhooks → Create Webhook
- URL: Your build trigger URL
- Events: Entry Publish, Entry Unpublish

### Localization
To add multiple language support:
1. Enable localization in stack settings
2. Add language fields to content types
3. Update API calls to include locale parameter

### Custom Fields
Add custom fields as needed:
- IMDb Rating
- Box Office Revenue
- Awards Won
- Streaming Platforms
- Age Rating

## Resources

- [Contentstack Documentation](https://www.contentstack.com/docs)
- [Contentstack React SDK](https://www.contentstack.com/docs/developers/sdks/react-sdk)
- [Content Delivery API](https://www.contentstack.com/docs/developers/apis/content-delivery-api/)

## Support

If you encounter issues:
1. Check the Contentstack documentation
2. Review browser console logs
3. Verify your content model structure matches the guide
4. Ensure all entries are published

