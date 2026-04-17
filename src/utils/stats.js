export function computeStats(articles) {
  const sold = articles.filter((a) => a.status === 'sold');
  const listed = articles.filter((a) => a.status === 'listed');
  const unlisted = articles.filter((a) => a.status === 'unlisted');

  const totalRevenue = sold.reduce((s, a) => s + (a.soldPrice || 0), 0);
  const totalCost = sold.reduce((s, a) => s + (a.buyPrice || 0), 0);
  const totalFees = sold.reduce((s, a) => s + (a.fees || 0), 0);
  const totalShipping = sold.reduce((s, a) => s + (a.shippingCost || 0), 0);
  const totalProfit = totalRevenue - totalCost - totalFees - totalShipping;

  const inventoryValue = listed.reduce((s, a) => s + (a.buyPrice || 0), 0);
  const potentialRevenue = listed.reduce((s, a) => s + (a.listPrice || 0), 0);

  const avgMargin =
    sold.length > 0
      ? ((totalProfit / totalRevenue) * 100).toFixed(1)
      : 0;

  return {
    totalArticles: articles.length,
    soldCount: sold.length,
    listedCount: listed.length,
    unlistedCount: unlisted.length,
    totalRevenue,
    totalCost,
    totalFees,
    totalShipping,
    totalProfit,
    inventoryValue,
    potentialRevenue,
    avgMargin,
  };
}

export function getProfitOverTime(articles) {
  const sold = articles
    .filter((a) => a.status === 'sold' && a.soldDate)
    .sort((a, b) => new Date(a.soldDate) - new Date(b.soldDate));

  const byMonth = {};
  sold.forEach((a) => {
    const month = a.soldDate.slice(0, 7); // YYYY-MM
    if (!byMonth[month]) byMonth[month] = { revenue: 0, cost: 0, profit: 0, count: 0 };
    const profit = (a.soldPrice || 0) - (a.buyPrice || 0) - (a.fees || 0) - (a.shippingCost || 0);
    byMonth[month].revenue += a.soldPrice || 0;
    byMonth[month].cost += a.buyPrice || 0;
    byMonth[month].profit += profit;
    byMonth[month].count += 1;
  });

  return Object.entries(byMonth).map(([month, data]) => ({
    month,
    ...data,
  }));
}

export function getCategoryBreakdown(articles) {
  const sold = articles.filter((a) => a.status === 'sold');
  const cats = {};
  sold.forEach((a) => {
    const cat = a.category || 'Other';
    if (!cats[cat]) cats[cat] = { count: 0, profit: 0 };
    cats[cat].count += 1;
    cats[cat].profit +=
      (a.soldPrice || 0) - (a.buyPrice || 0) - (a.fees || 0) - (a.shippingCost || 0);
  });
  return Object.entries(cats).map(([name, data]) => ({ name, ...data }));
}
