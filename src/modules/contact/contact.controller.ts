import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ok } from "../../common/utils/response";
import * as s from "./contact.service";
export const create = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.create(req.body), 201, "Contact message received"),
);
export const list = asyncHandler(async (req: Request, res: Response) =>
  res.json({ success: true, ...(await s.list(req.query)) }),
);
export const get = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.get(req.params.id)),
);
export const update = asyncHandler(async (req: Request, res: Response) =>
  ok(res, await s.update(req.params.id, req.body.status)),
);
