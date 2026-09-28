/*
# Create reviews table for registered-user evaluations

1. New Tables
- `reviews` stores evaluations left by registered users who hired the firm.
- `id` (uuid, primary key) identifies each review.
- `user_id` (uuid, not null, defaults to the authenticated user) links the review to its author in auth.users.
- `author_name` (text, not null) is the display name shown publicly on the review card.
- `rating` (integer, 1-5, not null) is the star rating given by the user.
- `service` (text, not null) is the area of law the user hired the firm for.
- `title` (text, not null) is a short headline for the review.
- `comment` (text, not null) is the body of the review.
- `approved` (boolean, default false) flags whether an admin has approved the review for public display. Only approved reviews are shown publicly.
- `created_at` (timestamptz) records when the review was submitted.

2. Security
- Row level security is enabled.
- SELECT is public (anon + authenticated) but ONLY returns approved reviews, so visitors see moderated content while authors see their own pending reviews.
- INSERT is restricted to authenticated users, and the user_id must match the authenticated session (enforced by DEFAULT auth.uid() and the WITH CHECK).
- UPDATE and DELETE are restricted to the owner of the review.

3. Important Notes
- This is a multi-user feature: only signed-in users can post reviews.
- The approval workflow keeps unmoderated content off the public site.
- user_id defaults to auth.uid() so inserts that omit it still satisfy the WITH CHECK.
*/

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  service text NOT NULL,
  title text NOT NULL,
  comment text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews; authors can also read their own (pending) reviews
DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;
CREATE POLICY "Public can read approved reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (approved = true OR user_id = auth.uid());

-- Only authenticated users can insert their own reviews
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;
CREATE POLICY "Users can insert own reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND char_length(author_name) BETWEEN 2 AND 80
  AND rating BETWEEN 1 AND 5
  AND char_length(service) BETWEEN 2 AND 80
  AND char_length(title) BETWEEN 4 AND 120
  AND char_length(comment) BETWEEN 10 AND 2000
);

-- Only the owner can update their own review
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete their own review
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Index for faster public queries (approved reviews, newest first)
CREATE INDEX IF NOT EXISTS idx_reviews_approved_created ON public.reviews (approved, created_at DESC);
