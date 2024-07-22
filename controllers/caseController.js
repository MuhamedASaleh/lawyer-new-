const Case = require('../models/caseModel')
const User = require("../models/userModel")

exports.createCase = async (req, res) => {
    try {
        const { files } = req.body;
        const userId = req.user.id;

        // Check if the user is a customer
        const user = await User.findByPk(userId);
        if(!user) return res.status(404).json({msg:`user with id ${userId} not exist in user table `})
        // if (user.role !== 'customer') {
        //     return res.status(403).json({ message: 'Only customers can create cases' });
        // }
        

        const newCase = await Case.create({
            files,
            status: 'pending', // Default status
            userId
        });

        res.status(201).json(newCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
