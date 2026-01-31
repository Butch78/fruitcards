import { nanoid } from "nanoid";
import { portfolioHoldings } from "~/data/portfolio";
import type { PortfolioHolding, AssetType } from "~/types";

interface CreateHoldingBody {
  symbol: string;
  name: string;
  assetType: AssetType;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  currency?: string;
  sector?: string;
  exchange?: string;
  notes?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateHoldingBody>(event);

  if (!body.symbol || !body.name || !body.assetType || body.quantity === undefined || body.averageCost === undefined) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields: symbol, name, assetType, quantity, averageCost are required",
    });
  }

  const newHolding: PortfolioHolding = {
    id: `hold-${nanoid()}`,
    userId: "user-1",
    symbol: body.symbol.toUpperCase(),
    name: body.name,
    assetType: body.assetType,
    quantity: body.quantity,
    averageCost: body.averageCost,
    currentPrice: body.currentPrice || body.averageCost,
    currency: body.currency || "USD",
    sector: body.sector || null,
    exchange: body.exchange || null,
    notes: body.notes || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  portfolioHoldings.unshift(newHolding);

  return newHolding;
});
