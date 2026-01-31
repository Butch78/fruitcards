import { portfolioHoldings, assetTypeColors } from "~/data/portfolio";
import type { PortfolioSummary, AssetType } from "~/types";

export default defineEventHandler(() => {
  const holdings = [...portfolioHoldings];

  // Calculate totals
  let totalValue = 0;
  let totalCost = 0;

  holdings.forEach((h) => {
    const value = h.quantity * h.currentPrice;
    const cost = h.quantity * h.averageCost;
    totalValue += value;
    totalCost += cost;
  });

  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  // Simulate day change (in production, this would come from market data)
  const dayChange = totalValue * 0.012; // ~1.2% daily change
  const dayChangePercent = 1.2;

  // Group by asset type
  const assetTypeTotals = new Map<AssetType, number>();
  holdings.forEach((h) => {
    const value = h.quantity * h.currentPrice;
    const current = assetTypeTotals.get(h.assetType) || 0;
    assetTypeTotals.set(h.assetType, current + value);
  });

  const byAssetType = Array.from(assetTypeTotals.entries()).map(([assetType, value]) => ({
    assetType,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    color: assetTypeColors[assetType],
  }));

  // Group by sector
  const sectorTotals = new Map<string, number>();
  holdings.forEach((h) => {
    const sector = h.sector || "Other";
    const value = h.quantity * h.currentPrice;
    const current = sectorTotals.get(sector) || 0;
    sectorTotals.set(sector, current + value);
  });

  const bySector = Array.from(sectorTotals.entries())
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate gains per holding for top gainers/losers
  const holdingsWithGains = holdings.map((h) => {
    const gain = h.currentPrice - h.averageCost;
    const gainPercent = h.averageCost > 0 ? (gain / h.averageCost) * 100 : 0;
    return {
      symbol: h.symbol,
      name: h.name,
      gainPercent,
    };
  });

  const sortedByGain = [...holdingsWithGains].sort((a, b) => b.gainPercent - a.gainPercent);
  const topGainers = sortedByGain.slice(0, 3);
  const topLosers = sortedByGain.slice(-3).reverse();

  const summary: PortfolioSummary = {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent,
    dayChange,
    dayChangePercent,
    holdingsCount: holdings.length,
    byAssetType,
    bySector,
    topGainers,
    topLosers,
  };

  return summary;
});
