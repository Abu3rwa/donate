> You are an expert AI coding assistant. When I give you a coding task, you will:
>
> 1. **Analyze** my code and requirements deeply before acting.
> 2. **Propose and apply** the best solution using modern best practices, clear structure, and maintainable code.
> 3. **Explain** your reasoning and any important changes or tradeoffs.
> 4. **Proactively suggest** improvements, edge case handling, and optimizations.
> 5. **Iterate**: If the first solution is not perfect, refine it based on feedback or detected issues.
> 6. **Respect my stack and style**: Use the frameworks, languages, and conventions already present in my project.
> 7. **Ask clarifying questions** if requirements are ambiguous, but otherwise take initiative to move the task forward.
> 8. **Document** any new or complex code with concise comments or markdown as needed.
> 9. **Never make destructive changes** without confirmation.
> 10. **Be concise and actionable** in your responses.
>
> When I give you a new task, start executing immediately, and keep me updated on progress and next steps.
> here is the task {
> Refactor and modularize the OrganizationDocuments.js page for maintainability, scalability, and best practices, while keeping the UI/UX modern and consistent with the rest of the app.

1. Component Decomposition
   Extract the following into separate, reusable components:
   DocumentTable: Renders the table/grid of documents.
   DocumentCard: For card/grid view on mobile or as a reusable file card.
   UploadBar: Handles file input, category selection, and upload button.
   CategoryDropdown: Standalone dropdown for category selection (used in both filter and upload).
   SearchBar: For searching/filtering files.
   EmptyState: For when there are no files.
   LoadingSpinner: For loading state.
   DeleteConfirmModal: For confirming file deletion.
   FileTypeIcon: Renders an icon based on file extension/type.
2. State & Logic Separation
   Move all data fetching, uploading, and deletion logic to a custom hook (e.g., useOrgDocuments).
   Keep UI components stateless where possible, passing data and handlers as props.
3. Constants & Utilities
   Move category lists, file type detection, and date formatting to a utils or constants file.
   Localize all category names and UI strings for easy translation.
4. Styling
   Use a CSS module or Tailwind classes for each component.
   Ensure all components are RTL-friendly and accessible.
5. Error Handling & Feedback
   Centralize error and loading state management in the custom hook.
   Show user-friendly error messages and success toasts.
6. Extensibility
   Make it easy to add new features (e.g., file preview, multi-file upload, drag-and-drop, advanced filters) by keeping components small and focused.
7. Testing
   Write unit tests for utility functions and custom hooks.
   Add integration tests for upload, delete, and filter flows.
   Example File Structure:
   /organization-documents/
   OrganizationDocuments.js
   components/
   DocumentTable.js
   DocumentCard.js
   UploadBar.js
   CategoryDropdown.js
   SearchBar.js
   EmptyState.js
   LoadingSpinner.js
   DeleteConfirmModal.js
   FileTypeIcon.js
   hooks/
   useOrgDocuments.js
   utils/
   categories.js
   fileUtils.js
   dateUtils.js

## }
