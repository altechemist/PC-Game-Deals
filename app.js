function isOnSale(game) {
  return game.salePrice < game.normalPrice;
}

function calculateDiscount(game) {
  if (!isOnSale(game) || game.normalPrice === 0) {
    return 0;
  }

  return Math.round(
    ((game.normalPrice - game.salePrice) / game.normalPrice) * 100
  );
}

function getGamesOnSale(games) {
  return games.filter(isOnSale);
}

function findCheapestGame(games) {
  if (games.length === 0) {
    return null;
  }

  return games.reduce((cheapest, game) => {
    const currentPrice = isOnSale(game) ? game.salePrice : game.normalPrice;
    const cheapestPrice = isOnSale(cheapest)
      ? cheapest.salePrice
      : cheapest.normalPrice;

    return currentPrice < cheapestPrice ? game : cheapest;
  });
}

function formatPrice(price) {
  return `R${price.toFixed(2)}`;
}

const deals = [
  { id: 1, title: "Hollow Knight", normalPrice: 14.99, salePrice: 7.49, store: "Steam" },
  { id: 2, title: "Stardew Valley", normalPrice: 13.99, salePrice: 13.99, store: "GOG" },
  { id: 3, title: "Celeste", normalPrice: 19.99, salePrice: 4.99, store: "Steam" },
  { id: 4, title: "Hades", normalPrice: 24.99, salePrice: 12.49, store: "Epic Games" },
  { id: 5, title: "Portal 2", normalPrice: 9.99, salePrice: 0.99, store: "Steam" },
  { id: 6, title: "Terraria", normalPrice: 9.99, salePrice: 9.99, store: "GOG" },
  { id: 7, title: "Disco Elysium", normalPrice: 39.99, salePrice: 9.99, store: "GOG" },
  { id: 8, title: "Cuphead", normalPrice: 19.99, salePrice: 14.99, store: "Steam" }
];

function renderGame(game) {
  const discount = calculateDiscount(game);
  const onSale = isOnSale(game);

  return `
    <article class="game-card">
      ${onSale ? '<span class="sale-tag">ON SALE</span>' : ""}
      <h3>${game.title}</h3>
      <p class="store">${game.store}</p>
      <p class="price-label">Normal price: <span class="${onSale ? "normal-price" : ""}">${formatPrice(game.normalPrice)}</span></p>
      ${onSale ? `<p class="price-label">Sale price: <span class="sale-price">${formatPrice(game.salePrice)}</span></p>` : ""}
      ${discount > 0 ? `<p class="discount">${discount}% off</p>` : ""}
    </article>
  `;
}

async function loadDeals() {
  const games = deals;
  const gamesOnSale = getGamesOnSale(games);
  const cheapestGame = findCheapestGame(games);

  document.getElementById("games-list").innerHTML = games
    .map((game) => renderGame(game))
    .join("");

  document.getElementById("sales-list").innerHTML = gamesOnSale
    .map((game) => renderGame(game))
    .join("");

  document.getElementById("cheapest-game").innerHTML =
    cheapestGame ? renderGame(cheapestGame) : "<p>No games available.</p>";

  console.log("Games currently on sale:");
  gamesOnSale.forEach((game) => {
    console.log(
      `${game.title}: ${formatPrice(game.salePrice)} (${calculateDiscount(game)}% off)`
    );
  });

  if (cheapestGame) {
    console.log(
      `Cheapest game: ${cheapestGame.title} — ${formatPrice(
        isOnSale(cheapestGame) ? cheapestGame.salePrice : cheapestGame.normalPrice
      )}`
    );
  }
}

loadDeals().catch((error) => {
  console.error(error);
  document.getElementById("sales-list").innerHTML =
    "<p>Unable to load game deals.</p>";
});
