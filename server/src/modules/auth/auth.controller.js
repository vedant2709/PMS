import { registerSchema } from "./auth.schema.js";
import { registerUser, verifyEmail } from "./auth.service.js";

export const registerController = async (req, res) => {
  const body = registerSchema.parse(req.body);

  const verificationToken = await registerUser(
    body.name,
    body.email,
    body.password
  );

  res.status(201).json({
    message: "Verification email sent",
  });
};

export const verifyEmailController = async (req, res) => {
  await verifyEmail(req.query.token);
  res.json({ message: "Email verified successfully" });
};
