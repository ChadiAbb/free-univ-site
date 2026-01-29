const User = require("../models/User");
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const register = async (req, res) => {
    const {pseudo, password} = req.body;

    try {
        const userExists = await User.findOne({pseudo: pseudo})
        if (userExists) {
            return res.status(400).json({ message: "Ce pseudo existe déjà" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        
        const newUser = new User({
            pseudo: pseudo, 
            password: hashedPassword
        });

        await newUser.save();

        const payload = { id: newUser._id };
        const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, 
            {expiresIn: '14d'});

        res.status(201).json({ 
                message: "Connexion réussie", 
                token: token 
            });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

const login = async (req, res) => {
    const {pseudo, password} = req.body;

    try {
        const findUser = await User.findOne({pseudo: pseudo});
        if (!findUser) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        if (!await bcryptjs.compare(password, findUser.password)) {
            return res.status(400).json({message: "Identifiants invalides"});
        }

        const payload = { id: findUser._id };
        const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, 
            {expiresIn: '1d'});
        
        res.status(200).json({ 
                message: "Connexion réussie", 
                token: token 
            });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

module.exports = {register, login};
