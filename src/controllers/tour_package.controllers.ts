import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Tour_Package from "../models/tour_packages.models";
import CustomError from "../middlewares/error-handler.middleware";
import { deleteFile, uploadFile } from "../utils/cloudinary.utils";
import { getPagination } from "../utils/pagination.utils";

const tour_package_folder = "/tour_package";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const {
    destinations,
    title,
    start_date,
    end_date,
    total_seats,
    total_charge,
    cost_type,
    description,
  } = req.body;

  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (!cover_image) {
    throw new CustomError("cover image is required", 400);
  }
  console.log(images);

  const tour_package = new Tour_Package({
    destinations: destinations ? JSON.parse(destinations ?? "") : null,
    title,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    seats_available: parseInt(total_seats),
    total_seats: parseInt(total_seats), 
    total_charge,
    cost_type,
    description,
  });

  if (!tour_package) {
    throw new CustomError("Someting went wrong.Try again later", 500);
  }

  tour_package.cover_image = await uploadFile(
    cover_image[0].path,
    tour_package_folder
  );

  if (images && images.length > 0) {
    const imagePath = await Promise.all(
      images.map(async (img) => await uploadFile(img.path, tour_package_folder))
    );
    tour_package.set("images", imagePath);
  }

  await tour_package.save();
  res.status(201).json({
    message: "Package added successfully.",
    succes: true,
    status: "success",
    data: tour_package,
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const {
    query,
    start_date,
    end_date,
    min_price,
    max_price,
    seats_available,
    limit,
    page,
  } = req.query;
  const page_limit = Number(limit) || 8;
  const current_page = Number(page) || 1;

  const skip = (current_page - 1) * page_limit;

  let filter: Record<string, any> = {};

  if (query) {
    filter.$or = [
      {
        title: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  if (start_date || end_date) {
    if (start_date) {
      filter.start_date = {
        $gte: start_date,
      };
    }

    if (end_date) {
      filter.end_date = {
        $lte: end_date,
      };
    }
  }

  if (min_price || max_price) {
    if (min_price) {
      filter.total_charge = {
        $gte: min_price,
      };
    }

    if (max_price) {
      filter.total_charge = {
        $lte: max_price,
      };
    }
  }

  if (seats_available) {
    filter.seats_available = {
      $gte: seats_available,
    };
  }

  const tour_packages = await Tour_Package.find(filter)
    .limit(page_limit)
    .skip(skip);

  const total = await Tour_Package.countDocuments(filter);

  res.status(200).json({
    message: "Packages fetched successfully.",
    succes: true,
    status: "success",
    data: {
      data: tour_packages,
      pagination: getPagination(total, page_limit, current_page),
    },
  });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const tour_package = await Tour_Package.findOne({ _id: id });

  if (!tour_package) {
    throw new CustomError("Tour plan is not found", 404);
  }

  res.status(200).json({
    message: "Package fetched successfully.",
    succes: true,
    status: "success",
    data: tour_package,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const {
    destinations,
    title,
    start_date,
    end_date,
    seats_available,
    total_charge,
    cost_type,
    description,
    deletededImage,
  } = req.body;

  const tour_package = await Tour_Package.findByIdAndUpdate(
    id,
    {
      title,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      seats_available,
      total_charge,
      cost_type,
      description,
    },
    { new: true, reValidate: true }
  );

  if (!tour_package) {
    throw new CustomError("Tour plan is not found", 404);
  }

  if (destinations) {
    tour_package.destinations = JSON.parse(destinations);
    // await tour_package.save();
  }

  if (cover_image) {
    // !__________
    if (tour_package.cover_image) {
      await deleteFile([tour_package?.cover_image?.public_id]);
    }

    tour_package.cover_image = await uploadFile(
      cover_image[0].path,
      tour_package_folder
    );
  }

  if (
    deletededImage &&
    deletededImage.length > 0 &&
    tour_package.images.length > 0
  ) {
    //! delete images form cloudinary
    await deleteFile(deletededImage);

    const oldImages = tour_package.images.filter(
      (img) => !deletededImage.includes(img.public_id)
    );

    tour_package.set("images", oldImages);
  }

  if (images && images.length > 0) {
    const imagePath = await Promise.all(
      images.map(async (img) => await uploadFile(img.path, tour_package_folder))
    );
    tour_package.set("images", [...tour_package.images, ...imagePath]);
  }

  await tour_package.save();

  res.status(200).json({
    message: "Tour plan updated",
    success: true,
    status: "success",
    data: tour_package,
  });
});

// ! delete tour package
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const tour_package = await Tour_Package.findById(id);

  if (!tour_package) {
    throw new CustomError("Package not found", 404);
  }

  if (tour_package.cover_image) {
    await deleteFile([tour_package.cover_image?.public_id]);
  }

  if (tour_package.images.length > 0) {
    await deleteFile(
      tour_package.images.map((image) => image?.public_id as string)
    );
  }

  await tour_package.deleteOne();

  res.status(200).json({
    message: "Package deleted",
    data: tour_package,
    success: true,
    status: "success",
  });
});