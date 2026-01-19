const User = require("../models/User");
const Subject = require("../models/Subject");
const options = require("../res/mathinfo/options.json");
const crossed = require("../res/mathinfo/crossed.json");


const updatePreferences = async (req, res) => {
    const userId = req.user.id;
    const {group, names, choices} = req.body;

    try {
        // Validation des entrées
        if (!Array.isArray(names) || !Array.isArray(choices) || names.length !== choices.length) {
            return res.status(400).json({ message: "Payload invalide : names et choices doivent être des tableaux de même longueur" });
        }
        if (group === null || group === undefined) {
            return res.status(400).json({ message: "Payload invalide : 'group' est requis" });
        }

        // Récupére l'utilisateur actuel
        const currentUser = await User.findById(userId);
        if (!currentUser) return res.status(404).json({ message: "Utilisateur introuvable" });

        // Initialise un tableau pour stocker les IDs des matières
        const subjectIds = [];

        for (let idx = 0; idx < names.length; idx++) {
            const name_given = names[idx];
            const choice_given = choices[idx];

            // Vérifie le type de choice_given
            if (!(typeof choice_given === 'string' || Array.isArray(choice_given))) {
                return res.status(400).json({ message: `Choice invalide pour '${name_given}' : doit être string ou [string]` });
            }

            // Si la matière est une option
            const opt = options[name_given];
            if (opt) {
                // Récupération des choix valides pour cette matière
                const optAllowed = new Set();
                (opt.choice || []).forEach(c => {
                    if (Array.isArray(c)) c.forEach(x => optAllowed.add(x));
                    else optAllowed.add(c);
                });

                // Initialise un tableau pour stocker les choix sélectionnés // renvoie une erreur si un choix invalide est trouvé
                let selectedChoice = [];
                if (typeof choice_given === 'string') {
                    if (!optAllowed.has(choice_given)) {
                        return res.status(400).json({ message: `Choice invalide '${choice_given}' pour '${name_given}'` });
                    }
                    selectedChoice = [choice_given];
                } else if (Array.isArray(choice_given)) {
                    if (!choice_given.every(ch => typeof ch === 'string' && optAllowed.has(ch))) {
                        return res.status(400).json({ message: `Un des éléments de choices est invalide pour '${name_given}'` });
                    }
                    selectedChoice = choice_given;
                }

                // Crée l'objet Subject à insérer
                const subjectData = {
                    name: opt.name || name_given,
                    year: opt.year || 'L3',
                    groups: opt.groups != null ? opt.groups : currentUser.group,
                    choice: selectedChoice
                };

                // Crée ou récupére le Subject depuis la base de données
                let subject = await Subject.findOneAndUpdate(
                    { name: subjectData.name, year: subjectData.year, groups: subjectData.groups },
                    subjectData,
                    { upsert: true, new: true }
                );
                
                // Ajoute l'ID du Subject au tableau
                subjectIds.push(subject._id);
                continue;
            }

            // Si la matière est une matière croisée
            const crossedList = (crossed && crossed.MathInfo && crossed.MathInfo.L3) || [];
            
            let targetGroups = [];
            if (typeof choice_given === 'string') {
                targetGroups = [choice_given];
            } else if (Array.isArray(choice_given)) {
                targetGroups = choice_given;
            }

            // Recherche une entrée correspondante dans la liste des matières croisées
            const crossEntry = crossedList.find(e => 
                e.name === name_given && targetGroups.includes(e.groups)
            );
            
            if (crossEntry) {
                // Crée ou récupére le Subject depuis la base de données
                const subjectData = {
                    name: crossEntry.name,
                    year: crossEntry.year || 'L3',
                    groups: crossEntry.groups,
                    choice: null
                };

                let subject = await Subject.findOneAndUpdate(
                    { name: subjectData.name, year: subjectData.year, groups: subjectData.groups },
                    subjectData,
                    { upsert: true, new: true }
                );
                
                subjectIds.push(subject._id);
                continue;
            }

            // Si la matière n'est ni une option ni une matière croisée, renvoie une erreur
            return res.status(400).json({ message: `Sujet introuvable : ${name_given}` });
        }

        const newUser = await User.findByIdAndUpdate(userId,
            { preferences: { group: group, subjects: subjectIds } }, { new: true }).populate('preferences.subjects');

        res.json({ message: "Préférences mises à jour", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

const getPreferences = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const user = await User.findById(userId).populate('preferences.subjects');

        res.json({ message : "Préférences envoyées", 
            group: user.group,
            preferences: user.preferences 
        })
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

module.exports = {updatePreferences, getPreferences};