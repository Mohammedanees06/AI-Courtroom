import multer from "multer";
import path from "path";
import fs from "fs";


const storageFolder = "server/storage/uploads";
if (!fs.existsSync(storageFolder)) {
  fs.mkdirSync(storageFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storageFolder),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

export const upload = multer({ storage });
