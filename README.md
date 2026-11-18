# PC Game Deals

A simple web page for browsing current PC game deals. It displays the game title, normal price, sale price,
discount, thumbnails, and a cheapest-game result. The page includes live search and an on-sale-only filter.

## Setup

How do we run the project? Follow these steps:

1. Open a terminal in the project folder.
2. Run `python3 -m http.server 4173`.
3. Open `http://127.0.0.1:4173` in your browser.
4. Allow the page to load deals from the CheapShark API.

You can also open `index.html` directly, but using a local server is more reliable.

## Choices

Why did you build it the way you did?

I kept the project simple by using only HTML, CSS, and JavaScript. A small vanilla JavaScript app is enough
for this brief and avoids unnecessary setup. I used a dark gamer-style theme to make the deals visually
easy to scan.

The project can use live data from the free CheapShark API, and the interface includes a search box and an
on-sale-only checkbox so the user can quickly filter the list.

## Obstacles

What was tricky, and how did you work through it?

I had trouble loading `deals.json`, mainly because fetching local files can behave differently depending on
how the page is served. I worked around this by adding the deal data directly to `app.js` instead of relying
on a separate JSON file.

I later integrated the CheapShark API and needed to adapt its string prices and `isOnSale` value into values
the JavaScript functions could compare and display.

## Resources

What did you look up or use to help you — tutorials, docs, AI tools, a friend?

- CheapShark API: `https://www.cheapshark.com/api/1.0/deals?pageSize=10`
- MDN-style JavaScript documentation and browser APIs such as `fetch`, `Array.filter`, and DOM events
- AI assistance for implementation and debugging

## Time

Roughly how long did the whole thing take you?

About 2 to 3 hours, including setup, API integration, filtering, styling, and testing.

## Next time

If I had another full day, what would I add or do differently?

I would probably build the project in React or Next.js for better component structure and interactivity.
I would also add pagination, sorting, more advanced filters, loading skeletons, favorites, and better
error handling for API requests.