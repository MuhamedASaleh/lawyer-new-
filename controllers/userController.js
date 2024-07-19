  // controllers/userController.js
  const User  = require('../models/userModel');
  const userValidator = require('../Validations/userValidator');

  exports.getUserById = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = userValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const updatedUser = await User.update(req.body, {
        where: { userID: id },
        returning: true,
      });

      res.json(updatedUser[1][0]); // Return the updated user
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;

      await User.destroy({ where: { userID: id } });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.getProfile = async (req, res) => {
    try {
        console.log('req.userID:', req.userID);
        const user = await User.findByPk(req.userID); // req.userID is set by the middleware
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Check user role and respond accordingly
        if (user.role === 'customer') {
            // Display customer-specific data
            res.json({
                firstName: user.first_name,
                lastName: user.last_name,
                phoneNumber: user.phone_number,
                personalImage: user.personal_image,
                // Add other customer-specific fields if needed
            });
        } else if (user.role === 'lawyer') {
            // Display lawyer-specific data
            res.json({
                firstName: user.first_name,
                lastName: user.last_name,
                phoneNumber: user.phone_number,
                personalImage: user.personal_image,
                lawyerPrice: user.lawyer_price,
                specializations: user.specializations,
                certification: user.certification,
                // Add other lawyer-specific fields if needed
            });
        } else {
            res.status(400).json({ error: 'Invalid role' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


  // Update User Profile
  exports.updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, phone_number, personal_image } = req.body;
        const user = await User.findByPk(req.userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.first_name = first_name;
        user.last_name = last_name;
        user.phone_number = phone_number;
        user.personal_image = personal_image;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
  };