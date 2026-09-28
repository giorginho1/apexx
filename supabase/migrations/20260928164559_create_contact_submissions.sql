/*
# Create contact submissions table

1. New Tables
- `contact_submissions` stores messages sent through the public contact form.
- `id` (uuid, primary key) identifies each message.
- `name`, `email`, `phone`, `interest`, and `message` capture the visitor's contact details.
- `created_at` records when the message was submitted.

2. Security
- Row level security is enabled.
- Public visitors may insert new submissions and may not read, update, or delete submissions from the browser.

3. Important Notes
- This is a single-tenant public website without sign-in.
- The insert policy is intentionally limited to the contact form use case; no public read policy is granted.
*/

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;
CREATE POLICY "Public can submit contact forms"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 254
  AND char_length(interest) BETWEEN 2 AND 120
  AND char_length(message) BETWEEN 10 AND 5000
);

DROP POLICY IF EXISTS "No public access to contact submissions" ON public.contact_submissions;
CREATE POLICY "No public access to contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "No public updates to contact submissions" ON public.contact_submissions;
CREATE POLICY "No public updates to contact submissions"
ON public.contact_submissions
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "No public deletes of contact submissions" ON public.contact_submissions;
CREATE POLICY "No public deletes of contact submissions"
ON public.contact_submissions
FOR DELETE
TO anon, authenticated
USING (false);
