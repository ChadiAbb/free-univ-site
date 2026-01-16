const User = require("../models/User");

const getCalendar = async (req, res) => {
    const userId = req.user.id;

    try {
        const {group, preferences} = await User.findById(userId);

        // TODO : récupéré les valeurs de uniduler
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}