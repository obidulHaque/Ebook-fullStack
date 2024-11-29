import express from "express";
import multer from "multer";
import path from "node:path";
import {
  createBook,
  allBook,
  singleBook,
  updateBook,
  deleteBook,
} from "./bookController";
import authenticate from "../middlewares/authenticate";

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  // fileFilter: (req, file, cb) => {
  //   // Type the req.files property safely
  //   const files = req.files as
  //     | { [fieldname: string]: Express.Multer.File[] }
  //     | undefined;

  //   console.log(files);
  //   // Check if both 'coverImage' and 'file' are present in the upload request
  //   const coverImage = files?.coverImage;
  //   const fileField = files?.file;

  //   // If either 'coverImage' or 'file' is missing, reject the upload
  //   if (!coverImage || !fileField) {
  //     cb(new Error("Both coverImage and file must be uploaded.") as any, false);
  //   } else {
  //     cb(null, true); // Accept the file if the condition passes
  //   }
  // },
});

const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);
router.get("/", allBook);
router.get("/:postId", singleBook);
router.patch(
  "/:Id",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
router.delete("/:Id", authenticate, deleteBook);

export default router;
