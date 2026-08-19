import { Router } from "express";
import { authenticateToken } from "../../common/utils/jwt.js";
import { upload } from "../../common/middleware/multer.js";
import { uploadFileController, getFileController, listAllFilesController, deleteFileController, fetchFileCategoryController, getFileSummaryController } from "./files.controller.js";

const filesRouter = Router();

filesRouter.get("/", authenticateToken, listAllFilesController);
filesRouter.get("/:fileId/category", authenticateToken, fetchFileCategoryController);
filesRouter.get("/:fileId/summary", authenticateToken, getFileSummaryController);
filesRouter.get("/:fileId", authenticateToken, getFileController);
filesRouter.delete("/:fileId", authenticateToken, deleteFileController);
filesRouter.post("/", authenticateToken, upload.single("name"), uploadFileController);

export default filesRouter;