const User = require("../models/User");


const updatePreferences = async (req, res) => {
    const userId = req.user.id;
    const {group, options} = req.body;

    try {
        const newUser = await User.findByIdAndUpdate(userId, 
            {preferences: {group : group, options: options}}, {new : true})

        res.json({ message: "Préférences mises à jour", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
    
}

module.exports = {updatePreferences};