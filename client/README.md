# Approach

1. Created a basic project folder structure, together with a dockerfile & updated docker-compose.yml
2. Added packages such as tailwind, tw-merge, classnames and configs
3. Added Router and the two pages, created reusable PageLayout
4. Implemented Search Page, created reusable hooks for debounce and react query
5. Refactorization - extracted code in reusable components (Input, LoadingSpinner (which actually is a text haha) etc.)
6. Moved on to the BigDataPage - created JSX structure to resemble the PNG example
7. Created a useGenericMutation hook also after realising that /big-data is a POST request
8. Read the specifications for the charts a few times to understand what should be displayed
9. Created methods to compute the data needed for charts
10. Created another method for the pieData to join the labels in case multiple characters had the same count
11. Refactored JSX into multiple reusable components (Slider, BarChart etc.)
12. Checked the page performance - it was bad (used no memoization until that point.) - the slider was sluggish.
13. Memoized the methods that computed the data (useMemo) - still bad
14. Memoized the charts and slider component (React.memo) - way better, but i noticed that when having multiple fields selected, it was still kind of sluggish
15. Memoized the selectHandler using useCallback and also created a reusable component for Select and wrapped it with React.memo - now it worked perfectly
16. General refactorization, moved all methods for computing data into bigDataUtils.ts
17. Added tests for each page and bigDataUtils.ts
