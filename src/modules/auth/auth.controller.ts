import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ok } from "../../common/utils/response";
import * as service from "./auth.service";
import { Admin } from "./admin.model";
export const login = asyncHandler(async (req: Request, res: Response) =>
  ok(
    res,
    await service.login(req.body.email, req.body.password),
    200,
    "Login successful",
  ),
);
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await Admin.findById(req.user!.id).select(
    "name email role isActive",
  );
  return ok(res, user);
});
export const logout = asyncHandler(async (_req: Request, res: Response) =>
  ok(
    res,
    { loggedOut: true },
    200,
    "Logout successful. Discard the access token on the client.",
  ),
);
