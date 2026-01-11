-- Enable DELETE policy for requests
-- Allow users to delete their own requests (as borrower)
CREATE POLICY "Users can delete their own requests"
ON requests
FOR DELETE
TO authenticated
USING (auth.uid() = borrower_id);

-- Also allow deleting if you are the owner (optional, depending on business logic)
-- CREATE POLICY "Owners can delete requests"
-- ON requests
-- FOR DELETE
-- TO authenticated
-- USING (auth.uid() = owner_id);

-- Fix Foreign Key Constraints for Messages
-- This ensures that when a request is deleted, its messages are also deleted automatically.
ALTER TABLE messages
DROP CONSTRAINT IF EXISTS messages_request_id_fkey;

ALTER TABLE messages
ADD CONSTRAINT messages_request_id_fkey
FOREIGN KEY (request_id)
REFERENCES requests(id)
ON DELETE CASCADE;

-- Fix Foreign Key Constraints for Notifications (if linked strict)
-- (Assuming notifications might link to requests via related_id which is loose, 
-- but if there is a strict FK, we should fix it too. 
-- Usually notifications are loosely coupled in this schema, so we might skip.)

-- Verify the policy
SELECT * FROM pg_policies WHERE tablename = 'requests';
