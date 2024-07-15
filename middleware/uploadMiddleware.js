const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.memoryStorage();

// Initialize multer with storage settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter: (req, file, cb) => {
        // Accept only specific mime types if needed
        const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Unsupported file type'));
    }
});

module.exports = upload;
