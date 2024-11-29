import { Request, Response, NextFunction } from "express";
import cloudinary from "../cloudinary/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthType } from "../types/authTypes";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const fileMimtype = files.coverImage[0].mimetype.split("/").at(-1);
    const imgaeName = files.coverImage[0].filename;
    const imagePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      imgaeName
    );
    const coverImageResult = await cloudinary.uploader.upload(imagePath, {
      filename_override: imgaeName,
      folder: "coverImage",
      format: fileMimtype,
    });
    const pdfName = files.file[0].filename;
    const pdfPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      pdfName
    );
    const fileResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
      filename_override: pdfName,
      folder: "Pdfs",
      format: "pdf",
    });
    const _req = req as AuthType;

    const newBook = await bookModel.create({
      title,
      description,
      author: _req.userId,
      genre,
      coverImage: coverImageResult.secure_url,
      file: fileResult.secure_url,
    });
    try {
      await fs.promises.unlink(imagePath);
      await fs.promises.unlink(pdfPath);
    } catch (error) {
      return next(createHttpError(501, "Fs  Error"));
    }

    res.json({ message: "Book creation successfully done", id: newBook._id });
  } catch (error) {
    return next(createHttpError(501, "Book create Error"));
  }
};

export const allBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await bookModel.find();
    res.status(201).json({ allbook: books });
  } catch (error) {
    return next(createHttpError(501, "No posts exite"));
  }
};

export const singleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.postId;
    const singleBook = await bookModel.findOne({ _id: bookId });
    res.json(singleBook);
  } catch (error) {
    return next(createHttpError(501, "this post doesn't exite"));
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.Id;
    const { title, description, genre } = req.body;
    const _req = req as AuthType;
    const userId = _req.userId;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(501, "Book does't exite for update"));
    }
    const bookOwner = book.author.toString() === userId;
    if (!bookOwner) {
      return next(createHttpError(501, "You can't update that book "));
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let updateCoverImage = "";
    if (files.coverImage) {
      const imageName = files.coverImage[0].filename;
      const imageFormat = files.coverImage[0].mimetype.split("/").at(-1);
      const coverImagePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        imageName
      );
      const uploadResult = await cloudinary.uploader.upload(coverImagePath, {
        filename_override: imageName,
        format: imageFormat,
        folder: "coverImage",
      });
      await fs.promises.unlink(coverImagePath);
      updateCoverImage = uploadResult.secure_url;
      const previousImage = book.coverImage.split("/").slice(7, 9).join("/");
      const destroyImage = previousImage.split(".").at(-2);
      // console.log(destroyImage);

      await cloudinary.uploader.destroy(destroyImage as string);
    }
    let updateFile = "";
    if (files.file) {
      const fileName = files.file[0].filename;
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );
      const fileUploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        format: "pdf",
        folder: "Pdfs",
        resource_type: "raw",
      });
      updateFile = fileUploadResult.secure_url;
      await fs.promises.unlink(filePath);
      const priviousFile = book.file.split("/").slice(7, 9).join("/");
      // console.log(priviousFile);
      await cloudinary.uploader.destroy(priviousFile, { resource_type: "raw" });
    }
    const updateBookInfo = await bookModel.findByIdAndUpdate(
      { _id: bookId },
      {
        title,
        description,
        genre,
        coverImage: updateCoverImage ? updateCoverImage : book.coverImage,
        file: updateFile ? updateFile : book.file,
      },
      { new: true }
    );
    res.status(201).json(updateBookInfo);
  } catch (error) {
    return next(createHttpError(401, "Book update Error"));
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.Id;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(401, "book does't existe for deleting"));
    }
    const _req = req as AuthType;
    const bookOwner = book.author.toString() === _req.userId;
    if (!bookOwner) {
      return next(createHttpError(401, "you can't delete this Book "));
    }
    /// for Image
    const cloudImage = book.coverImage.split("/").slice(7, 9).join("/");
    const destroyImage = cloudImage.split(".").at(-2);
    await cloudinary.uploader.destroy(destroyImage as string);
    /// for file
    const cloudFile = book.file.split("/").slice(7, 9).join("/");
    await cloudinary.uploader.destroy(cloudFile, { resource_type: "raw" });

    await bookModel.findByIdAndDelete(bookId);
    res.json("book delete successfully done ");
  } catch (error) {
    return next(createHttpError(501, "Delete Book Problem "));
  }
};
