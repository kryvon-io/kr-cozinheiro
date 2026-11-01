import { getRecipeImage } from "@/lib/recipes";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/receitas/[id]/foto">
) {
  const { id } = await ctx.params;
  const dataUrl = await getRecipeImage(id);
  const match = dataUrl?.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) return new Response("Foto não encontrada", { status: 404 });

  const body = Buffer.from(match[2], "base64");
  return new Response(body, {
    headers: {
      "Content-Type": match[1],
      "Content-Length": String(body.length),
      // A URL leva a versão (?v=updatedAt), então pode ficar em cache.
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
