# HomePage.js AI Prompts for Improvement (Numbered & Enhanced)

## 1. UI/UX Enhancements

1. Refactor the HeroSection and stats grid in HomePage.js to ensure full responsiveness on all device sizes, including mobile and tablet. Use CSS-in-JS or Tailwind classes as appropriate, and provide code examples.
2. Update the hero image in HomePage.js to use `srcSet` and next-gen formats (WebP/AVIF) for improved loading speed. Show how to implement this in a React component.
3. Add a secondary call-to-action button (such as 'Learn More' or 'Volunteer') to the HeroSection in HomePage.js, styled to complement the primary donation button. Ensure both CTAs are visually distinct and accessible.
4. Replace the hardcoded stats in the ImpactStatisticsSection of HomePage.js with dynamic data fetched from Firestore. Provide the full React code for fetching and displaying the stats, including loading and error states.
5. Audit HomePage.js for accessibility. Add descriptive `alt` text for all images, ensure color contrast meets WCAG standards, and use semantic HTML elements such as <main>, <section>, and <nav>. Provide code examples for each fix.
6. Refine the animations in HomePage.js, making the scroll-down icon and stats animation more subtle and context-aware. Suggest animation libraries or techniques and provide code samples for smooth, accessible animations.

## 2. Code Structure & Maintainability

7. Extract the AnimatedNumber, ImpactStatisticsSection, and FacebookLink components from HomePage.js into separate files in src/components/. Refactor HomePage.js to import and use these components. Provide the new file structures and code.
8. Create a reusable StatsCard component for displaying individual stats in the ImpactStatisticsSection. Ensure it is flexible and well-typed.
9. Refactor HomePage.js to use MUI's theme for all colors and spacing instead of hardcoded Tailwind classes. Show before-and-after code snippets for at least two components.
10. Move the emergency alert state from HomePage.js to a global context or store, making it accessible throughout the app. Provide the context/store setup and usage example.

## 3. Performance

12. Implement lazy-loading for all images in HomePage.js, including the hero image and SVG icons. Show how to do this in React and explain the benefits.
13. Compress SVG icons used in HomePage.js and explain how to optimize SVGs for web performance. Provide before-and-after file size comparisons if possible.
14. Wrap stateless components in HomePage.js with React.memo to prevent unnecessary re-renders. Show the updated code and explain when memoization is beneficial.
15. Ensure the AnimatedNumber component in HomePage.js only re-renders when its value prop changes. Provide the optimized code and explain the logic.

## 4. Accessibility

16. Test all interactive elements in HomePage.js for keyboard accessibility. Add necessary aria-labels and ensure buttons/links are focusable. Provide code examples for improvements.
17. Add visually hidden text for icons and important actions in HomePage.js to improve screen reader support. Show how to implement this using accessible techniques.

## 5. Content & Localization

18. Fetch emergency alerts and impact stats from Firestore or a CMS in HomePage.js, replacing hardcoded content. Provide the full implementation, including error handling and loading states.
19. Integrate a translation library (such as react-i18next) into HomePage.js to support multiple languages. Show how to set up and use translations in the component, including dynamic content.

## 6. Testing

20. Write unit and integration tests for all components in HomePage.js, focusing on alert logic and stat animation. Provide example test cases using Jest and React Testing Library.
21. Use accessibility testing tools like axe or Lighthouse to audit HomePage.js. List the steps and show how to fix any issues found, with code examples for common fixes.

---

**How to Use:**

- Copy any numbered prompt above and provide it to an AI assistant or code generation tool to receive detailed code, guidance, or implementation for that specific improvement area.
