# Dynamic Theme Configuration

This document explains how the CineVerse app dynamically loads theme colors and background images from Contentstack app_settings.

## Overview

The app now supports dynamic theming through Contentstack's `app_settings` content type. Theme colors and background images are fetched at startup and applied throughout the application.

## How It Works

### 1. App Settings Structure in Contentstack

The `app_settings` content type should have the following fields:

```json
{
  "title": "App Settings",
  "theme_colors": {
    "primary_color": "#6C5CE7",
    "accent_color": "#00D9FF"
  },
  "background_image": {
    "url": "https://example.com/background.jpg"
  }
}
```

### 2. Data Fetching

**File**: `src/services/dataService.js`

The `DataStore` class fetches app_settings during initialization:

```javascript
async _fetchAppSettings() {
  const Query = Stack.ContentType('app_settings').Query();
  const result = await Query.toJSON().find();
  // Returns the first entry (singleton pattern)
}
```

### 3. Theme Initialization

**File**: `src/components/ThemeInitializer.js`

This component runs on app startup and:
- Fetches app_settings from the data store
- Applies CSS custom properties to the document body:
  - `--primary-color`: Primary brand color
  - `--accent-color`: Accent/highlight color
- Stores background image URL globally for use in login/signup pages

```javascript
document.body.style.setProperty('--primary-color', settings.theme_colors.primary_color);
document.body.style.setProperty('--accent-color', settings.theme_colors.accent_color);
window.__CINEVERSE_BG_IMAGE__ = settings.background_image.url;
```

### 4. Background Image Usage

**Files**: 
- `src/pages/LoginPage.js`
- `src/pages/SignUpPage.js`

Both pages dynamically apply the background image:

```javascript
useEffect(() => {
  const bgImage = window.__CINEVERSE_BG_IMAGE__;
  if (bgImage) {
    setBackgroundImage(bgImage);
  }
}, []);
```

The background is applied with inline styles:

```jsx
<div 
  className="login-background" 
  style={backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {}}
>
  <div className="background-overlay"></div>
</div>
```

## Setting Up in Contentstack

### Step 1: Create Content Type

1. Go to Contentstack Dashboard
2. Navigate to Content Models
3. Create a new content type named `app_settings`
4. Add the following fields:
   - **Title** (Single Line Text) - Required
   - **Theme Colors** (Group)
     - **Primary Color** (Single Line Text)
     - **Accent Color** (Single Line Text)
   - **Background Image** (File - Image)

### Step 2: Create Entry

1. Go to Entries
2. Create a new `app_settings` entry
3. Fill in the fields:
   - Title: "App Settings"
   - Primary Color: Your hex color (e.g., `#6C5CE7`)
   - Accent Color: Your hex color (e.g., `#00D9FF`)
   - Background Image: Upload your background image
4. **Save and Publish** the entry

### Step 3: Verify

1. Start the app: `npm start`
2. Check the browser console for theme initialization logs:
   ```
   🎨 Applying theme colors from Contentstack...
      Primary color: #6C5CE7
      Accent color: #00D9FF
      Background image: https://...
   ✅ Theme colors applied successfully
   ```
3. Navigate to `/login` or `/signup` to see the background image

## Fallback Behavior

If app_settings is not found or has missing fields:
- **Colors**: CSS defaults are used (defined in `App.css`)
- **Background**: Gradient background is shown (defined in CSS)
- No errors are thrown; the app continues to work normally

## CSS Custom Properties

The following CSS custom properties are set dynamically:

| Property | Usage | Default |
|----------|-------|---------|
| `--primary-color` | Primary brand color used throughout the app | `#6C5CE7` |
| `--accent-color` | Accent color for highlights and CTAs | `#00D9FF` |

These properties are used in:
- Buttons
- Links
- Logo gradients
- Hover effects
- Active states

## Testing

To test the dynamic theme:

1. **With Contentstack data**:
   - Ensure `USE_MOCK_DATA = false` in `src/api/contentstack.js`
   - Create app_settings entry in Contentstack
   - Start the app and verify theme is applied

2. **Without Contentstack data**:
   - The app will use CSS defaults
   - Check console for warning: "⚠️ No theme colors found in app settings, using defaults"

## Troubleshooting

### Theme colors not applying?

1. Check browser console for errors
2. Verify app_settings entry is published in Contentstack
3. Verify environment matches (`REACT_APP_CONTENTSTACK_ENVIRONMENT`)
4. Check that field names match exactly (case-sensitive)

### Background image not showing?

1. Verify the image is uploaded and published
2. Check that the image URL is accessible
3. Check browser Network tab for 404 errors
4. Verify `background_image.url` is being set in the data fetch

### Data not loading?

1. Check Contentstack credentials in `.env` file
2. Verify API key and delivery token are correct
3. Check the environment setting matches your Contentstack setup
4. Look for errors in the browser console during initialization

## Files Modified

- ✅ `src/services/dataService.js` - Added app_settings fetching
- ✅ `src/components/ThemeInitializer.js` - New component for theme initialization
- ✅ `src/App.js` - Added ThemeInitializer component
- ✅ `src/pages/LoginPage.js` - Dynamic background image
- ✅ `src/pages/SignUpPage.js` - Dynamic background image
- ✅ `src/api/contentstack.js` - Exported getAppSettings function
- ✅ `src/styles/App.css` - Updated background overlay styles

## Future Enhancements

Potential improvements for the theming system:

1. **More color options**: Add secondary, tertiary colors
2. **Font customization**: Allow custom fonts from Contentstack
3. **Multiple themes**: Support light/dark mode switching
4. **Per-page backgrounds**: Different backgrounds for different pages
5. **Animation settings**: Customize transition speeds and effects

