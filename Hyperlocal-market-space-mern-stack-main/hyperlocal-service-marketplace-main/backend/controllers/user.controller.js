import User from "../models/user.model.js";
import handleError from "../utils/handleError.js";
import ProviderProfile from "../models/providerProfile.model.js";
import bcrypt from "bcryptjs";
import pincodeValidator from "pincode-validator";

// Get all providers
export const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider", isActive: true }).select("-password -__v").lean();

    const providerProfiles = await ProviderProfile.find({
      userId: { $in: providers.map((p) => p._id) },
    }).lean();

    const profileMap = {};
    providerProfiles.forEach((profile) => {
      profileMap[profile.userId.toString()] = profile;
    });

    const mergedProviders = providers.map((provider) => {
      return {
        ...provider,
        providerProfile: profileMap[provider._id.toString()] || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: mergedProviders.length,
      data: mergedProviders,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch providers");
  }
};

// Get specific user/provider profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) return handleError(res, "User not found", 404);

    let providerProfileData = {};
    if (user.role === "provider") {
      const providerProfile = await ProviderProfile.findOne({ userId: user._id });

      if (providerProfile) {
        providerProfileData = {
          servicesOfferedIds: providerProfile.servicesOfferedIds,
          bio: providerProfile.bio,
          experience: providerProfile.experience,
          isVerified: providerProfile.isVerified,
          availability: providerProfile.availability,
          serviceAreas: providerProfile.serviceAreas,
        };
      }
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
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
    return handleError(res, error, 500, "Failed to fetch user profile");
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name: updates.name,
          profilePhoto: updates.profilePhoto,
          deliveryAddresses: updates.deliveryAddresses,
        },
      },
      { new: true, runValidators: true }
    ).select("-password -__v");

    let providerProfileData = {};
    if (updatedUser.role === "provider" && req.body.providerProfile) {
      providerProfileData = await ProviderProfile.findOneAndUpdate({ userId: updatedUser._id }, { $set: req.body.providerProfile }, { new: true, runValidators: true });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto,
        emailVerified: updatedUser.emailVerified,
        phoneVerified: updatedUser.phoneVerified,
        ...providerProfileData,
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to update profile");
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return handleError(res, "Current and new Password are required", 400);
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return handleError(res, "User not found", 404);

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) return handleError(res, "Incorrect current password", 401);

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to change password");
  }
};

// Deactivate user account
export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { isActive: false }, { new: true }).select("-password");
    return res.status(200).json({
      success: true,
      message: "Account deactivated",
      data: user,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to deactivate account");
  }
};

// Deactivate user account
export const reactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { isActive: true }, { new: true }).select("-password");
    return res.status(200).json({
      success: true,
      message: "Account reactivated",
      data: user,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to reactivate account");
  }
};

// Add new delivery address
export const addDeliveryAddress = async (req, res) => {
  try {
    const { label, street, city, state, pincode, location } = req.body;

    const hasManualAddress = label?.trim() && street?.trim() && city?.trim() && state?.trim() && pincode?.trim();
    const hasCoordinates = location?.coordinates && Array.isArray(location.coordinates) && location.coordinates.length === 2;

    if (!hasManualAddress && !hasCoordinates) {
      return handleError(res, "Either full address or location coordinates must be provided", 400);
    }
    if (pincode) {
      const isValidPincode = pincodeValidator.validate(String(pincode.trim() ?? ""));
      if (!isValidPincode) return handleError(res, "Pincode is not valid", 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) return handleError(res, "User not found", 404);

    user.deliveryAddresses.push({
      label: label.trim().toLowerCase(),
      street: street.trim().toLowerCase(),
      city: city.trim().toLowerCase(),
      state: state.trim().toLowerCase(),
      pincode: pincode.trim(),
      location,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added",
      data: user.deliveryAddresses,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to add delivery address");
  }
};

// Update delivery address
export const updateDeliveryAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return handleError(res, "User not found", 400);

    const address = user.deliveryAddresses.id(addressId);
    if (!address) return handleError(res, "Address not found", 404);

    Object.assign(address, updates);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated",
      data: address,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to update delivery address");
  }
};

// Delete delivery address
export const deleteDeliveryAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) return handleError(res, "User not found", 404);

    const address = user.deliveryAddresses.id(addressId);
    if (!address) return handleError(res, "Address not found", 404);

    // Use pull to remove subdocument in Mongoose
    user.deliveryAddresses.pull(addressId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted",
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to delete delivery address");
  }
};

// Verify a provider (admin only)
export const verifyProvider = async (req, res) => {
  try {
    const { id: providerUserId } = req.params;
    const { isVerified } = req.body;

    const providerProfile = await ProviderProfile.findOne({ userId: providerUserId });
    if (!providerProfile) {
      return handleError(res, "Provider profile not found", 404);
    }

    providerProfile.isVerified = isVerified !== undefined ? isVerified : true;
    await providerProfile.save();

    return res.status(200).json({
      success: true,
      message: `Provider verification status set to ${providerProfile.isVerified}`,
      data: providerProfile,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to verify provider");
  }
};
