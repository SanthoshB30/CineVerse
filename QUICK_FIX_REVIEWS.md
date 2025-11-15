# 🔄 Quick Fix: Reviews Not Showing

## Problem
Published reviews in Contentstack don't appear in the app immediately.

## Why?
The app caches data on startup for performance. New content needs a manual refresh.

## ✅ SOLUTION (3 Steps)

### 1. Publish Review in Contentstack
- Open Contentstack
- Go to your review entry
- Click **"Publish"** (not just Save!)
- Wait 5 seconds

### 2. Click Refresh Button
- In the CineVerse app
- Click your username (top-right)
- Click **"🔄 Refresh Data"**
- Wait for success message

### 3. Check Movie Page
- Navigate to the movie
- Scroll to Reviews section
- Your review should appear!

## 📍 Where is the Refresh Button?

```
Top Right Corner → Click Your Name → 🔄 Refresh Data
```

**Note:** Only visible in development mode (`npm start`)

## 🚨 Still Not Working?

Try these in order:

1. **Hard refresh browser:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Check Contentstack:** Is the review actually published?
3. **Check environment:** Does `.env` match where you published?
4. **Restart dev server:** Stop (`Ctrl+C`) and run `npm start` again

## 📖 More Help

- `HOW_TO_REFRESH_REVIEWS.md` - Complete guide
- `TROUBLESHOOTING_REVIEWS.md` - Detailed troubleshooting
- `CONTENTSTACK_SETUP_GUIDE.md` - Setup instructions

## ⏱️ Expected Time

- Publish in Contentstack: 5 seconds
- Click refresh: 1-2 seconds  
- Navigate to page: Instant
- **Total: ~6-7 seconds**

---

**That's it!** Simple and fast. 🎉
