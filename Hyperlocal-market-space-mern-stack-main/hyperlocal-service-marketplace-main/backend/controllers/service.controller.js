import Service from "../models/service.model.js";
import handleError from "../utils/handleError.js";

/* Get all services */
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).select("-__v").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch services");
  }
};

/* Get all service arranged by category */
export const getGroupedServices = async (req, res) => {
  try {
    const groupedServices = await Service.aggregate([
      {
        $match: { isActive: true, category: { $exists: true, $ne: "" } },
      },
      {
        $group: {
          _id: "$category",
          services: {
            $push: {
              _id: "$_id",
              name: "$name",
              basePrice: "$basePrice",
              description: "$description",
              icon: "$icon",
            },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          services: 1,
          _id: 0,
        },
      },
      {
        $sort: { category: 1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: groupedServices.length,
      data: groupedServices,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to group services");
  }
};

/* Get specific serive using id */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true,
    }).select("-__v");

    if (!service) {
      return handleError(res, `Service not found with id of ${req.params.id}`, 404);
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch service");
  }
};

/* Create a new service (admin only) */
export const createService = async (req, res) => {
  try {
    const { name, description, category, basePrice, icon } = req.body;
    if (!name || !basePrice || !category) {
      return handleError(res, "Missing required fields", 400);
    }

    if (basePrice == null || basePrice < 0) {
      return handleError(res, "Base price must be greater than 0", 400);
    }

    if (typeof basePrice !== "number") {
      return handleError(res, "Base price must be a number", 400);
    }

    const existingService = await Service.findOne({ name });
    if (existingService) {
      return handleError(res, "Service name already exists", 409);
    }

    const service = await Service.create({
      name,
      description: description || "",
      category,
      basePrice,
      icon,
    });

    return res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to create service");
  }
};

/* Update a service (admin only) */
export const updateService = async (req, res) => {
  try {
    const updates = { ...req.body };

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.name) {
      const existingServiceName = await Service.findOne({
        name: updates.name,
        _id: { $ne: req.params.id },
      });

      if (existingServiceName) {
        return handleError(res, "Service name already exists", 409);
      }
    }

    if (updates.basePrice && (updates.basePrice == null || updates.basePrice < 0)) {
      return handleError(res, "Base price must be greater than 0", 400);
    }

    if (updates.basePrice && typeof updates.basePrice !== "number") {
      return handleError(res, "Base price must be a number", 400);
    }

    const service = await Service.findById(req.params.id);
    if (!service || !service.isActive) {
      return handleError(res, `Service not found with id of ${req.params.id}`, 404);
    }

    Object.assign(service, updates);
    await service.save();

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to update service");
  }
};

/* Delete a serice (admin only) */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return handleError(res, `Service not found with id of ${req.params.id}`, 404);
    }

    if (!service.isActive) {
      return handleError(res, "Service is already deactivated", 400);
    }

    service.isActive = false;
    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service '${service.name}' deactivated successfully`,
      data: {},
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to delete service");
  }
};
