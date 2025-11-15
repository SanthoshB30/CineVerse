# How to Add Movies Field to Actor Content Type

## 🎯 Goal
Add a "movies" reference field to the Actor content type so you can link actors to the films they've appeared in.

## 📋 Steps to Add the Field in Contentstack

### 1. Navigate to Actor Content Type
1. Log in to your Contentstack dashboard
2. Go to **Content Models** in the sidebar
3. Find and click on **Actor** content type

### 2. Add New Reference Field
1. Click **Edit** on the Actor content type
2. Scroll to the bottom of the field list
3. Click **+ Add Field**
4. Select **Reference** as the field type

### 3. Configure the Field

**Field Settings:**
- **Display Name**: `Movies`
- **UID**: `movies` (automatically generated)
- **Help Text**: `Select movies the actor has appeared in`
- **Multiple**: ✅ **Enable** (to allow selecting multiple movies)
- **Content Type**: Select **Movie** from the dropdown
- **Required**: ❌ Leave unchecked (optional field)

### 4. Save Changes
1. Click **Save** at the top right
2. The field is now added to your Actor content type!

## 📝 How to Use the New Field

### Adding Movies to Actor Entries

1. Go to **Content** → **Actor** in Contentstack
2. Open an existing actor entry or create a new one
3. Scroll down to the **Movies** field
4. Click **Add Reference**
5. Select movies from the list (you can select multiple)
6. Click **Done**
7. **Save** and **Publish** the entry

### Example Entry
```
Name: Tom Hanks
Slug: tom-hanks
Bio: Thomas Jeffrey Hanks is an American actor and filmmaker...
Birth Year: 1956
Profile Image: [Upload photo]
Movies: 
  - Forrest Gump
  - Cast Away
  - Saving Private Ryan
  - The Terminal
  - Catch Me If You Can
```

## 🔄 Two-Way Linking Options

You now have options for linking actors and movies:

### Option A: Link from Actor to Movie
- ✅ **Actor** content type has **movies** reference field
- Each actor entry references the movies they appeared in
- **Best for**: Actor-centric management

### Option B: Link from Movie to Actor (Future Enhancement)
- Add an **actors** reference field to the **Movie** content type
- Each movie entry references its cast members
- **Best for**: Movie-centric management

### Option C: Both Directions (Recommended for Complete Data)
- Have **both** reference fields:
  - Actor → Movies
  - Movie → Actors
- Provides flexibility in content management
- **Best for**: Comprehensive movie database

## 📊 How to Display Actor's Movies in the App

The app can now fetch and display an actor's filmography. Here's what happens:

1. **Actor Page**: Shows list of movies the actor appeared in
2. **Data Fetching**: The app includes the movies reference when fetching actor data
3. **Movie Cards**: Each movie is displayed as a card with poster, title, and rating

### API Usage Example
```javascript
// Fetch actor with their movies
const actor = await getActorBySlug('tom-hanks');

// The actor object will include:
{
  name: "Tom Hanks",
  slug: "tom-hanks",
  bio: "...",
  birth_year: 1956,
  profile_image: { url: "..." },
  movies: [
    { title: "Forrest Gump", slug: "forrest-gump", ... },
    { title: "Cast Away", slug: "cast-away", ... },
    ...
  ]
}
```

## ✅ Checklist

- [ ] Add **movies** reference field to Actor content type
- [ ] Configure field as **Multiple** reference
- [ ] Link to **Movie** content type
- [ ] Save Actor content type
- [ ] Update existing actor entries with their movies
- [ ] Publish updated actor entries
- [ ] Test in the app - actor pages should show filmography

## 🎬 Next Steps

After adding the field, consider:

1. **Update Existing Actors**: Go through your actor entries and add their movies
2. **Add More Actors**: Create entries for more actors and link them to movies
3. **Movie Cast**: Consider adding an **actors** field to Movies too for complete cast information
4. **Featured Actors**: Add a **featured** boolean field to highlight popular actors on homepage

## 💡 Pro Tips

- **Bulk Updates**: Use Contentstack's bulk actions to update multiple actors at once
- **Import Tool**: If you have many actors, use Contentstack's import feature with a CSV
- **Publishing**: Remember to publish both actor entries AND movie entries for changes to appear
- **Caching**: The app caches data, so you might need to refresh after making changes

## 🔍 Data Relationships After This Change

```
Genre ←→ Movie ←→ Director
         ↑
         ↓
       Actor
         ↑
         ↓
      Review
```

Now actors are connected to the movie data model, enabling:
- Actor filmography pages
- Cast listings on movie pages (if you add actors field to Movie too)
- Actor search and filtering
- "More from this actor" recommendations

---

**You're all set!** Go add that movies field to your Actor content type and start building filmographies! 🎬⭐

