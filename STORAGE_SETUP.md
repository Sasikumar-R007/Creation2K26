# Storage Bucket Setup Guide

## Payment Screenshots Bucket Configuration

To fix the "Bucket not found" error, you need to create and configure the `payment-screenshots` bucket in Supabase Storage.

### Steps to Create the Bucket:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `hqkrexlemuhgwbblbbkn`

2. **Open Storage Section**
   - Click on "Storage" in the left sidebar
   - Click "New bucket" button

3. **Create the Bucket**
   - **Name**: `payment-screenshots`
   - **Public bucket**: ✅ **Enable** (check this box)
   - Click "Create bucket"

4. **Configure Bucket Policies** (Important for uploads)

   Go to "Policies" tab for the `payment-screenshots` bucket and add:

   **Policy 1: Allow Public Uploads**
   - Policy name: `Allow public uploads`
   - Allowed operation: `INSERT`
   - Target roles: `anon`, `authenticated`
   - Policy definition:
   ```sql
   (bucket_id = 'payment-screenshots'::text)
   ```

   **Policy 2: Allow Public Reads**
   - Policy name: `Allow public reads`
   - Allowed operation: `SELECT`
   - Target roles: `anon`, `authenticated`
   - Policy definition:
   ```sql
   (bucket_id = 'payment-screenshots'::text)
   ```

5. **Set File Size Limit** (Required)
   - Go to bucket settings
   - Set maximum file size to: `2097152` (2MB)
   - This matches the frontend validation

6. **Allowed MIME Types** (Optional but recommended)
   - `image/jpeg`
   - `image/png`
   - `image/webp`

### Alternative: Use SQL to Create Bucket

If you have access to SQL Editor, you can run:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  true,
  2097152,  -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create policy for public uploads
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'payment-screenshots');

-- Create policy for public reads
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'payment-screenshots');
```

### Verification

After setup, test by:
1. Going to the registration page
2. Uploading a payment screenshot
3. Checking that the upload succeeds without errors

If you still see errors, check:
- Bucket name is exactly `payment-screenshots` (case-sensitive)
- Bucket is marked as public
- Policies are correctly configured
- File size is under 2MB
- File type is jpeg, png, or webp

