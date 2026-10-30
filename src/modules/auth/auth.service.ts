import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "./admin.model";
import { env } from "../../config/env";
import { AuthenticationError } from "../../common/errors/AppError";
export async function login(email: string, password: string) {
  const user = await Admin.findOne({
    email: email.toLowerCase(),
    isActive: true,
  }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    throw new AuthenticationError("Invalid email or password");
  const accessToken = jwt.sign(
    { role: user.role, email: user.email },
    env.jwtSecret,
    { subject: user.id, expiresIn: env.jwtExpires as any },
  );
  return {
    accessToken,
    tokenType: "Bearer",
    expiresIn: env.jwtExpires,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
