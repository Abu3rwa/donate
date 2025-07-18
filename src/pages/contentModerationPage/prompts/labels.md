# Labels and Constants (`labels.js`)

**Objective:**
Create a JavaScript file to store constant values and labels that are used across the content moderation feature. This helps in maintaining consistency and makes the codebase easier to manage.

**File Content:**

1.  **`TYPES`**: An object or enum that defines the possible content types for moderation.

    ```javascript
    export const TYPES = {
      EXPENSE: "expense",
      DONATION: "donation",
      CAMPAIGN: "campaign",
      POST: "post",
      STORY: "story",
    };
    ```

2.  **`STATUSES`**: An object or enum that defines the possible statuses for any moderated item.

    ```javascript
    export const STATUSES = {
      PENDING: "pending",
      APPROVED: "approved",
      REJECTED: "rejected",
    };
    ```

3.  **`STATUS_LABELS`**: A map that associates each status with a user-friendly label (can be reused for all types).

    ```javascript
    export const STATUS_LABELS = {
      [STATUSES.PENDING]: "Pending Review",
      [STATUSES.APPROVED]: "Approved",
      [STATUSES.REJECTED]: "Rejected",
    };
    ```

4.  **`CATEGORY_LABELS`**: Maps for each content type, e.g.:

    ```javascript
    export const EXPENSE_CATEGORY_LABELS = {
      travel: "Travel and Transportation",
      supplies: "Office Supplies",
      food: "Food and Dining",
      other: "Other",
    };
    export const DONATION_CATEGORY_LABELS = {
      general: "General",
      campaign: "Campaign",
      zakat: "Zakat",
      sadaqah: "Sadaqah",
    };
    export const CAMPAIGN_CATEGORY_LABELS = {
      education: "Education",
      health: "Health",
      relief: "Relief",
      other: "Other",
    };
    export const POST_CATEGORY_LABELS = {
      announcement: "Announcement",
      story: "Story",
      update: "Update",
      other: "Other",
    };
    ```

**Usage:**

- Import these constants and labels into any component that needs them. For example, the `StatusBadge` component would use `STATUS_LABELS` to get the display text, and the `Filters` component would use it to populate the status filter options.
- Use the appropriate category label map for the content type being moderated.

**Benefits:**

- **Single Source of Truth**: All labels and constants are in one place, making updates easy.
- **Consistency**: Ensures that the same labels and status keys are used everywhere.
- **Readability**: Improves code readability by using named constants instead of magic strings.

**Example:**

```javascript
import { TYPES, STATUS_LABELS, EXPENSE_CATEGORY_LABELS } from "./labels";

const type = TYPES.EXPENSE;
const status = STATUS_LABELS["pending"];
const category = EXPENSE_CATEGORY_LABELS["travel"];
```
