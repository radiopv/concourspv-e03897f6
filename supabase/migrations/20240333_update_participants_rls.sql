-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."participants";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."participants";
DROP POLICY IF EXISTS "Enable update for users based on id" ON "public"."participants";

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON "public"."participants"
FOR SELECT
USING (true);

CREATE POLICY "Enable insert for admins"
ON "public"."participants"
FOR INSERT
TO authenticated
WITH CHECK (
  auth.email() = 'renaudcanuel@me.com'
);

CREATE POLICY "Enable update for admins"
ON "public"."participants"
FOR UPDATE
TO authenticated
USING (auth.email() = 'renaudcanuel@me.com')
WITH CHECK (auth.email() = 'renaudcanuel@me.com');

CREATE POLICY "Enable delete for admins"
ON "public"."participants"
FOR DELETE
TO authenticated
USING (auth.email() = 'renaudcanuel@me.com');