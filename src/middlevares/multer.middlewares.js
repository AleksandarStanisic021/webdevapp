import multer from "multer";

/**
 * Multer disk storage configuration
 * @type {import('multer').StorageEngine}
 */
const storage = multer.diskStorage({
    /**
     * @param {import('express').Request} req
     * @param {import('multer').File} file
     * @param {(error: Error | null, destination: string) => void} cb
     */
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    /**
     * @param {import('express').Request} req
     * @param {import('multer').File} file
     * @param {(error: Error | null, filename: string) => void} cb
     */
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

/**
 * Multer upload middleware instance
 * @type {import('multer').Multer}
 */
export const upload = multer({ storage: storage });


