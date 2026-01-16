const getFree = async (req, res) => {
    try {
        const answer = await fetch (process.env.FREE_URI);
        if(!answer.ok) {
            res.status(400).json({ message: "Erreur de l'api", error: error.message });
        }

        const data = await answer.json();

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

module.exports = {getFree};
