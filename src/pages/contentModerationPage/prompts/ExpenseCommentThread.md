# Moderation Comment Thread (`ModerationCommentThread.js`)

**Objective:**
Create a React component to display a real-time thread of comments for any moderated item (expense, donation, campaign, post/story). The component should automatically fetch and update comments.

**Component Details:**

- **Props**:

  - `itemId` (string, required): The ID of the item to fetch comments for.
  - `type` (string, required): The type of the item (e.g., 'expense', 'donation', 'campaign', 'post', 'story').

- **State**:

  - `comments`: An array to store the comment objects.
  - `newComment`: A string to hold the content of the new comment being drafted.
  - `isLoading`: A boolean to indicate when comments are being fetched.
  - `error`: An object to store any errors during data fetching.

- **UI Elements**:
  - A list to display the comments. Each comment should show:
    - The author's name and profile picture (if available).
    - The comment text.
    - The timestamp of the comment.
    - The type of action (e.g., "commented," "approved," "rejected").
  - A form with a text input and a "Submit" button for adding a new comment.

**Functionality:**

1.  **Fetch Comments**: When the component mounts, use the `itemId` and `type` props to call a function (e.g., `moderationService.getComments(type, itemId)`) to fetch all comments for the item.
2.  **Display Comments**: Render the fetched comments in chronological order.
3.  **Add a Comment**:
    - When the user types in the input field, update the `newComment` state.
    - On form submission, call a function (e.g., `moderationService.addComment(type, itemId, newComment)`) to save the new comment.
    - After a successful submission, clear the `newComment` state and refresh the comment list to show the new comment.
4.  **Real-time Updates (Optional but Recommended)**:
    - Implement a subscription to real-time updates from your backend (e.g., using WebSocket or Firestore's real-time listeners) to automatically refresh the comment thread when new comments are added by other users.

**Styling:**

- Use a clean and readable layout for the comment thread.
- Differentiate comments from actions (like approvals or rejections) visually.
- Ensure the text input and submit button are user-friendly.

**Example Usage:**

```jsx
<ModerationCommentThread itemId={item.id} type="campaign" />
```
