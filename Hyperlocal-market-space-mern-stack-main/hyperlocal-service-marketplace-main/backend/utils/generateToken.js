import jwt from "jsonwebtoken";

/* Generates a signed JWT for the given user */
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT Secret is not defined.");
  }

  // Include id and role for role-based access control
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Default expiration to 7 days
  );

  return token;
};

export default generateToken;
