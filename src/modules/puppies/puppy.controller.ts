import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ok } from "../../common/utils/response";
import * as s from "./puppy.service";
export const list = asyncHandler(async (req: Request, res: Response) => {
  const r = await s.list(req.query, req.baseUrl.includes("/admin/"));
  res.json({ success: true, ...r });
});
export const featured = asyncHandler(async (_req: Request, res: Response) =>
  ok(res, await s.featured()),
);
export const bySlug = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.bySlug(req.params.slug)),
);
export const adminById = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.adminById(req.params.id)),
);
export const create = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.create(req.body), 201, "Puppy created"),
);
export const update = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.update(req.params.id, req.body), 200, "Puppy updated"),
);
export const remove = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.remove(req.params.id), 200, "Puppy archived"),
);
