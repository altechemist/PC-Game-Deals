function isOnSale(game) {
  return game.isOnSale === "1" || Number(game.salePrice) < Number(game.normalPrice);
}

function calculateDiscount(game) {
  if (!isOnSale(game) || Number(game.normalPrice) === 0) {
    return 0;
  }

  return Math.round(
    ((Number(game.normalPrice) - Number(game.salePrice)) / Number(game.normalPrice)) * 100
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
  return `$${price.toFixed(2)}`;
}

function renderGame(game) {
  const discount = calculateDiscount(game);
  const onSale = isOnSale(game);

  return `
    <article class="game-card">
      ${game.thumb ? `<img class="game-thumb" src="${game.thumb}" alt="" loading="lazy">` : ""}
      <div class="game-content">
        ${onSale ? '<span class="sale-tag">ON SALE</span>' : ""}
        <h3 class="game-title">${game.title}</h3>
        <p class="price-label">Normal price: <span class="${onSale ? "normal-price" : ""}">${formatPrice(Number(game.normalPrice))}</span></p>
        ${onSale ? `<p class="price-label">Sale price: <span class="sale-price">${formatPrice(Number(game.salePrice))}</span></p>` : ""}
        ${discount > 0 ? `<p class="discount">${discount}% off</p>` : ""}
      </div>
    </article>
  `;
}

async function loadDeals() {
  const response = await fetch("https://www.cheapshark.com/api/1.0/deals?pageSize=10");

  if (!response.ok) {
    throw new Error(`Could not load CheapShark deals (${response.status})`);
  }

  let deals = await response.json();
  deals = deals.map((deal) => ({
    ...deal,
    title: deal.title,
    normalPrice: Number(deal.normalPrice),
    salePrice: Number(deal.salePrice)
  }));

  const searchInput = document.getElementById("search-input");
  const saleOnlyInput = document.getElementById("sale-only");

  function renderDeals() {
    const search = searchInput.value.trim().toLowerCase();
    const filteredDeals = deals.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(search);
      const matchesSaleFilter = !saleOnlyInput.checked || isOnSale(game);
      return matchesSearch && matchesSaleFilter;
    });

    document.getElementById("games-list").innerHTML = filteredDeals.length
      ? filteredDeals.map((game) => renderGame(game)).join("")
      : '<p class="empty-state">No matching games found.</p>';

    document.getElementById("cheapest-game").innerHTML =
      filteredDeals.length ? renderGame(findCheapestGame(filteredDeals)) : "";
  }

  searchInput.addEventListener("input", renderDeals);
  saleOnlyInput.addEventListener("change", renderDeals);
  renderDeals();

  const gamesOnSale = getGamesOnSale(deals);
  console.log("Games currently on sale:");
  gamesOnSale.forEach((game) => {
    console.log(`${game.title}: ${formatPrice(game.salePrice)} (${calculateDiscount(game)}% off)`);
  });

  const cheapestGame = findCheapestGame(deals);
  if (cheapestGame) {
    console.log(`Cheapest game: ${cheapestGame.title} — ${formatPrice(cheapestGame.salePrice)}`);
  }
}

loadDeals().catch((error) => {
  console.error(error);
  document.getElementById("games-list").innerHTML =
    '<p class="empty-state">Unable to load deals. Please check your connection and try again.</p>';
});
