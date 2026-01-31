import { portfolioHoldings } from "~/data/portfolio";
import type { AssetType } from "~/types";

interface UpdateHoldingBody {
  symbol?: string;
  name?: string;
  assetType?: AssetType;
  quantity?: number;
  averageCost?: number;
  currentPrice?: number;
  currency?: string;
  sector?: string | null;
  exchange?: string | null;
  notes?: string | null;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateHoldingBody>(event);

  const holdingIndex = portfolioHoldings.findIndex((h) => h.id === id);
  const existingHolding = portfolioHoldings[holdingIndex];

  if (holdingIndex === -1 || !existingHolding) {
    throw createError({
      statusCode: 404,
      message: "Holding not found",
    });
  }

  const updatedHolding = {
    ...existingHolding,
    symbol: body.symbol?.toUpperCase() ?? existingHolding.symbol,
    name: body.name ?? existingHolding.name,
    assetType: body.assetType ?? existingHolding.assetType,
    quantity: body.quantity ?? existingHolding.quantity,
    averageCost: body.averageCost ?? existingHolding.averageCost,
    currentPrice: body.currentPrice ?? existingHolding.currentPrice,
    currency: body.currency ?? existingHolding.currency,
    sector: body.sector !== undefined ? body.sector : existingHolding.sector,
    exchange: body.exchange !== undefined ? body.exchange : existingHolding.exchange,
    notes: body.notes !== undefined ? body.notes : existingHolding.notes,
    updatedAt: new Date(),
  };

  portfolioHoldings[holdingIndex] = updatedHolding;

  return updatedHolding;
});
