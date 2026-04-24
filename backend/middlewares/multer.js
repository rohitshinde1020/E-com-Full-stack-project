const multer = require('multer');

// Use memoryStorage so files are kept as in-memory Buffers.
// This is required for Vercel (read-only filesystem) and allows
// us to stream the buffer directly to Cloudinary without touching disk.
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const extOk = allowed.test(file.originalname.toLowerCase());
        const mimeOk = allowed.test(file.mimetype);
        if (extOk && mimeOk) return cb(null, true);
        cb(new Error('Only image files are allowed (jpeg, jpg, png, webp, gif).'));
    },
});

module.exports = upload;