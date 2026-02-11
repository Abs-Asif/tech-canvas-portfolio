

## Plan: Admin Profile Policy + Custom Domain API URL

### 1. Database Migration: Admin Profile Viewing Policy

Add the RLS policy so admins can see all user profiles (needed for the admin dashboard user dropdown):

```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
```

### 2. Custom Domain Proxy for Font API

Currently, the premium font embed URL exposes the backend function URL directly. We can route it through `abdullah.ami.bd` by adding a Vercel rewrite rule that proxies `/api/fonts/:path*` to the backend function.

**Update `vercel.json`** to add a rewrite rule:
- `/api/validate-font-key` will proxy to the backend edge function

This means the embed URL changes from:
```
https://<backend-url>/functions/v1/validate-font-key?key=YOUR_API_KEY
```
to:
```
https://abdullah.ami.bd/api/validate-font-key?key=YOUR_API_KEY
```

### 3. Update All URL References

Replace the Supabase function URL with the custom domain URL in these files:

- **`src/pages/FontSimplified.tsx`** (lines 551-552, 558-559): Change embed popup URLs
- **`src/pages/FontDocumentation.tsx`** (lines 180-181, 190): Change documentation URLs  
- **`src/pages/FontUserDashboard.tsx`** (line 127): Change usage example URL
- **`supabase/functions/validate-font-key/index.ts`** (line 60): Update error message URL

All instances of `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-font-key` become `https://abdullah.ami.bd/api/validate-font-key`.

### 4. Summary of Changes

| File | Change |
|------|--------|
| Migration SQL | Add "Admins can view all profiles" SELECT policy |
| `vercel.json` | Add rewrite for `/api/validate-font-key` to proxy to backend |
| `FontSimplified.tsx` | Update premium embed URLs to custom domain |
| `FontDocumentation.tsx` | Update premium embed URLs to custom domain |
| `FontUserDashboard.tsx` | Update usage example URL to custom domain |
| `validate-font-key/index.ts` | Update error message URL |

