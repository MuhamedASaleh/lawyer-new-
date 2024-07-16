const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => { // Corrected 'cd' to 'cb'
        cb(null, Date.now() +'-'+ file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');


module.exports = { upload };