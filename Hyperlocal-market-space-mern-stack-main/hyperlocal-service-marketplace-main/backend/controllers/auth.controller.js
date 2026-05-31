import User from "../models/user.model.js";
import ProviderProfile from "../models/providerProfile.model.js";
import generateToken from "../utils/generateToken.js";
import handleError from "../utils/handleError.js";
import bcrypt from "bcryptjs";

/* Handles user, provider and admin registration */
export const register = async (req, res) => {
  try {
    const { name, email, phone, profilePhoto, password, role, bio, experience, availability, serviceAreas, servicesOfferedIds } = req.body;

    if (!name || !email || !phone || !role || !password) {
      return handleError(res, "Missing required fields", 400);
    }
    if (role === "provider" && (!experience || experience < 0 || !availability || !Array.isArray(availability) || !serviceAreas || !Array.isArray(serviceAreas))) {
      return handleError(res, "Missing required fields for Provider", 400);
    }
    if (role === "provider" && (!Array.isArray(servicesOfferedIds) || servicesOfferedIds.length === 0)) {
      return handleError(res, "At least one service must be selected by the provider", 400);
    }

    // Check if user already exists with same email or phone
    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (userExists) return handleError(res, "User already exists", 400);

    // Hash provided password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
      profilePhoto: profilePhoto || "",
    });

    // If role is provider, create provider profile
    let providerProfileData = {};
    if (role === "provider") {
      const newProviderProfile = await ProviderProfile.create({
        userId: newUser._id,
        bio: bio || "",
        experience,
        availability,
        serviceAreas,
        servicesOfferedIds,
      });

      providerProfileData = {
        bio: newProviderProfile.bio,
        experience: newProviderProfile.experience,
        availability: newProviderProfile.availability,
        serviceAreas: newProviderProfile.serviceAreas,
        servicesOfferedIds: newProviderProfile.servicesOfferedIds,
        isVerified: newProviderProfile.isVerified,
      };
    }

    // Generate JWT token using helper method
    const token = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        profilePhoto: newUser.profilePhoto,
        emailVerified: newUser.emailVerified,
        phoneVerified: newUser.phoneVerified,
        ...providerProfileData,
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to register user");
  }
};

/* Handles login via email or phone */
export const login = async (req, res) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return handleError(res, "Email or phone and password are required", 400);
  }

  try {
    // Validate user and password
    const user = await User.findOne(email ? { email: email.toLowerCase() } : { phone }).select("+password");
    if (!user) return handleError(res, "User does not exists", 404);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return handleError(res, "Invalid credentials", 401);

    // If user is provider, fetch and include their profile
    let providerProfileData = {};
    if (user.role === "provider") {
      const providerProfile = await ProviderProfile.findOne({ userId: user._id });

      if (providerProfile) {
        providerProfileData = {
          bio: providerProfile.bio,
          experience: providerProfile.experience,
          availability: providerProfile.availability,
          serviceAreas: providerProfile.serviceAreas,
          servicesOfferedIds: providerProfile.servicesOfferedIds,
          isVerified: providerProfile.isVerified,
        };
      }
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        ...providerProfileData,
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to login user");
  }
};

/* Fetch the logged in user */
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    let providerProfileData = {};
    if (user.role === "provider") {
      const providerProfile = await ProviderProfile.findOne({ userId: user._id });

      if (providerProfile) {
        providerProfileData = {
          bio: providerProfile.bio,
          experience: providerProfile.experience,
          availability: providerProfile.availability,
          serviceAreas: providerProfile.serviceAreas,
          servicesOfferedIds: providerProfile.servicesOfferedIds,
          isVerified: providerProfile.isVerified,
        };
      }
    }

    return res.status(200).json({
      success: true,
      message: "Fetched logged in user successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        ...providerProfileData,
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch user");
  }
};

/* Handles Google OAuth authentication */
export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return handleError(res, "Google credential token is required", 400);
  }

  try {
    // Verify Google ID token using Google's tokeninfo API
    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const response = await fetch(verifyUrl);
    if (!response.ok) {
      return handleError(res, "Invalid Google credential token", 401);
    }

    const payload = await response.json();
    const { email, name, picture, email_verified } = payload;

    if (!email) {
      return handleError(res, "Email not returned by Google OAuth", 400);
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Register new user
      user = await User.create({
        name: name || "Google User",
        email: email.toLowerCase(),
        role: "user", // Default role
        profilePhoto: picture || "",
        emailVerified: email_verified === "true" || email_verified === true,
      });
    }

    // If provider, fetch and include their profile
    let providerProfileData = {};
    if (user.role === "provider") {
      const providerProfile = await ProviderProfile.findOne({ userId: user._id });
      if (providerProfile) {
        providerProfileData = {
          bio: providerProfile.bio,
          experience: providerProfile.experience,
          availability: providerProfile.availability,
          serviceAreas: providerProfile.serviceAreas,
          servicesOfferedIds: providerProfile.servicesOfferedIds,
          isVerified: providerProfile.isVerified,
        };
      }
    }

    const token = generateToken(user);

    return res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? "User registered and logged in with Google" : "Login successful with Google",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        profilePhoto: user.profilePhoto,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        ...providerProfileData,
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to authenticate with Google");
  }
};
