# Quick Guide: Add Movies to Actor Content Type

## 🎯 5-Minute Setup

### Step 1: Open Actor Content Type (2 min)

1. Go to Contentstack Dashboard
2. Click **Content Models** (left sidebar)
3. Find **Actor** in the list
4. Click **Edit** button

### Step 2: Add Movies Field (2 min)

1. Scroll to bottom of fields
2. Click **+ Add Field** button
3. Click **Reference** tile
4. Fill in:
   ```
   Display Name: Movies
   UID: movies (auto-generated)
   Help Text: Select movies the actor has appeared in
   ```
5. Under "Reference To":
   - Click **Multiple** toggle (enable it)
   - Select **movie** from dropdown
6. Click **Save** (top right)
7. Click **Save** again to save content type

### Step 3: Link Movies to Actors (1 min per actor)

1. Go to **Content** (left sidebar)
2. Click **Actor**
3. Open an actor entry (e.g., "Tom Hanks")
4. Scroll to **Movies** field (new field at bottom)
5. Click **Add References**
6. Select movies from the list (check boxes)
7. Click **Done**
8. Click **Save**
9. Click **Publish**
10. Select environment
11. Click **Publish**

### Step 4: See Results in Your App

1. Refresh your web application
2. Navigate to `/actor/[slug]` (e.g., `/actor/tom-hanks`)
3. See the filmography! 🎬

---

## ✅ Checklist

- [ ] Actor content type has "movies" reference field
- [ ] Field is set to "Multiple"
- [ ] Field references "movie" content type
- [ ] At least 1 actor has movies linked
- [ ] Actor entry is saved
- [ ] Actor entry is **published**
- [ ] Linked movies are **published**
- [ ] App refreshed

---

## 📸 What to Look For

### In Contentstack (Actor Content Type Edit Mode)
```
Fields:
  ☑ Name (Single Line Textbox)
  ☑ Slug (Single Line Textbox)
  ☑ Bio (Rich Text Editor)
  ☑ Birth Year (Number)
  ☑ Profile Image (File)
  ☑ Movies (Reference) ← NEW!
```

### In Contentstack (Actor Entry Edit Mode)
```
Movies:
  [Add References]
  
  After clicking "Add References":
  ☑ Forrest Gump
  ☑ Cast Away
  ☑ Saving Private Ryan
  ☐ Inception
  ☐ The Dark Knight
```

### In Your App (Actor Page)
```
┌──────────────────────────────────────────┐
│  [Actor Profile Photo]                   │
│                                          │
│  Tom Hanks                               │
│  Born: 1956                              │
│                                          │
│  Biography text here...                  │
│                                          │
│  Filmography                             │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │Movie1│ │Movie2│ │Movie3│            │
│  │ ⭐4.5 │ │ ⭐4.8 │ │ ⭐4.2 │            │
│  └──────┘ └──────┘ └──────┘            │
└──────────────────────────────────────────┘
```

---

## 🚨 Common Mistakes

❌ **Mistake 1**: Forget to enable "Multiple"
✅ **Fix**: Edit field, toggle "Multiple" ON

❌ **Mistake 2**: Link movies but don't publish
✅ **Fix**: Click Publish after saving

❌ **Mistake 3**: Link unpublished movies
✅ **Fix**: Make sure movies are published first

❌ **Mistake 4**: Wrong content type selected
✅ **Fix**: Field should reference "movie" not "director" or "genre"

---

## 🎯 Expected Result

### Before
```
Actor Page
└── "Filmography coming soon!" message
```

### After
```
Actor Page
└── Grid of movie cards with:
    - Movie poster
    - Movie title
    - Star rating
    - Click → Goes to movie detail page
```

---

## 📞 Need Help?

See these files for more details:
- **Detailed Guide**: `ACTOR_MOVIES_SETUP.md`
- **Implementation Details**: `ACTOR_MOVIES_IMPLEMENTATION_SUMMARY.md`
- **Full Setup Guide**: `CONTENTSTACK_SETUP_GUIDE.md`

---

**That's it! 5 minutes and you're done.** 🚀

