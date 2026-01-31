import { portfolioHoldings } from "~/data/portfolio";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  const holdingIndex = portfolioHoldings.findIndex((h) => h.id === id);

  if (holdingIndex === -1) {
    throw createError({
      statusCode: 404,
      message: "Holding not found",
    });
  }

  const deletedHolding = portfolioHoldings.splice(holdingIndex, 1)[0];

  return { success: true, deleted: deletedHolding };
});
