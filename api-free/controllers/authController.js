const connectDB = require("../config/db");
const User = require("../models/User");
const bcryptjs = require('bcryptjs');

const register = async (req, res) => {
    const {givenPseudo, givenPassword} = req.body;

    try {
        const userExists = await User.findOne({pseudo: givenPseudo})
        if (userExists) {
            return res.status(400).json({ message: "Ce pseudo existe déjà" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(givenPassword, salt);
        
        const newUser = new User({
            pseudo: givenPseudo, 
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "Compte créé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

module.exports = {register};
