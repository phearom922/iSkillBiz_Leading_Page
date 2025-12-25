# Fix: Language Constraint Violation Error

## Problem

When editing sections in the admin dashboard, the following error occurred:

```
new row for relation "section_content" violates check constraint "section_content_language_check"
```

The error showed that the system was trying to insert `language` values of `'primary'` and `'secondary'` instead of the valid values `'km'` or `'en'`.

## Root Cause

The issue was in `SectionEditor.tsx` where the code was parsing the content key incorrectly:

1. **Field names with underscores**: The database contains field names like:
   - `cta_primary`
   - `cta_primary_link`
   - `cta_secondary`
   - `cta_secondary_link`

2. **Incorrect parsing**: The code was creating keys like `cta_primary_en` and then splitting by `_`:
   ```typescript
   const [fieldName, language] = key.split("_");
   // This splits "cta_primary_en" into ["cta", "primary", "en"]
   // So fieldName = "cta", language = "primary" (WRONG!)
   ```

3. **Database constraint**: The database only allows `'km'` or `'en'` as language values:
   ```sql
   language TEXT NOT NULL DEFAULT 'km' CHECK (language IN ('km', 'en'))
   ```

## Solution

### Frontend Fix (`components/admin/SectionEditor.tsx`)

Changed the parsing logic to split from the end, taking the last part as the language:

```typescript
// Split from the end: language is always the last part after the last underscore
const lastUnderscoreIndex = key.lastIndexOf("_");
const fieldName = key.substring(0, lastUnderscoreIndex);
const language = key.substring(lastUnderscoreIndex + 1);

// Validate language
if (!['km', 'en'].includes(language)) {
  throw new Error(`Invalid language: ${language}. Must be 'km' or 'en'`);
}
```

Now:
- `"cta_primary_en"` → fieldName: `"cta_primary"`, language: `"en"` ✅
- `"cta_secondary_km"` → fieldName: `"cta_secondary"`, language: `"km"` ✅
- `"headline_km"` → fieldName: `"headline"`, language: `"km"` ✅

### Backend Fix (`backend/src/sections/sections.service.ts`)

Added validation to provide a clear error message if an invalid language is sent:

```typescript
// Validate language
if (!['km', 'en'].includes(language)) {
  throw new Error(`Invalid language: ${language}. Must be 'km' or 'en'`);
}
```

## Testing

1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `npm run dev`
3. Log in to the admin dashboard
4. Navigate to Sections
5. Edit a section (especially Hero Section with `cta_primary` and `cta_secondary` fields)
6. Save changes - should work without errors

## Files Changed

- `components/admin/SectionEditor.tsx` - Fixed key parsing logic
- `backend/src/sections/sections.service.ts` - Added language validation

