const News = require('../models/newsModel');

// Create a news
const createNews = async (req, res) => {
    try {
        const { description, image } = req.body;
        const news = await News.create({ description, image });
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all news
const getAllNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Current page number, defaulting to 1
        const limit = parseInt(req.query.limit) || 10;  // Number of records per page, defaulting to 10

        const offset = (page - 1) * limit;  // Calculate offset for skipping records

        const { count, rows } = await News.findAndCountAll({
            offset,
            limit
        });

        const totalPages = Math.ceil(count / limit);  // Calculate total pages

        res.status(200).json({
            totalItems: count,
            totalPages,
            currentPage: page,
            news: rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get news by ID
const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a news
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, image } = req.body;

        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        news.description = description;
        news.image = image;
        await news.save();

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a news
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        await news.destroy();
        res.status(200).json({ message: 'News deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews
};


// const News = require('../models/newsModel');
// const Admin = require('../models/adminModel');

// // Create a news
// const createNews = async (req, res) => {
//     try {
//         const { description, image, adminID } = req.body;
        
//         // Verify admin exists
//         const admin = await Admin.findByPk(adminID);
//         if (!admin) {
//             return res.status(404).json({ message: 'Admin not found' });
//         }

//         const news = await News.create({ description, image });
//         res.status(201).json(news);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get all news
// const getAllNews = async (req, res) => {
//     try {
//         const news = await News.findAll({
//             include: [{
//                 model: Admin,
//                 attributes: ['phoneNumber']
//             }]
//         });
//         res.status(200).json(news);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get news by ID
// const getNewsById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const news = await News.findByPk(id, {
//             include: [{
//                 model: Admin,
//                 attributes: ['phoneNumber']
//             }]
//         });
//         if (!news) {
//             return res.status(404).json({ message: 'News not found' });
//         }
//         res.status(200).json(news);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update a news
// const updateNews = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { description, image } = req.body;

//         const news = await News.findByPk(id);
//         if (!news) {
//             return res.status(404).json({ message: 'News not found' });
//         }

//         news.description = description;
//         news.image = image;
//         await news.save();

//         res.status(200).json(news);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Delete a news
// const deleteNews = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const news = await News.findByPk(id);
//         if (!news) {
//             return res.status(404).json({ message: 'News not found' });
//         }

//         await news.destroy();
//         res.status(200).json({ message: 'News deleted' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = {
//     createNews,
//     getAllNews,
//     getNewsById,
//     updateNews,
//     deleteNews
// };
