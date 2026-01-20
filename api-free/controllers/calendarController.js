const User = require("../models/User");
const Subject = require("../models/Subject");

const getUserCalendar = async (req, res) => {
    const userId = req.user.id;

    try {
        const {group, preferences} = await User.findById(userId);
        
        const results = await Promise.all(preferences.subjects.map(async subjectId => {
            const subject = await Subject.findById(subjectId.toString());
            if (!subject) throw new Error(`Subject ${subjectId} not found`);
            const url = `${process.env.CALENDAR_URI}/events?name=${subject.name}&year=${subject.year}&groups=${subject.groups}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`Calendar API error ${resp.status}`);
            return resp.json();
        }));

        const merged = results.reduce((acc, cur) => {
            if (Array.isArray(cur)) return acc.concat(cur);
            if (cur && typeof cur === 'object') acc.push(cur);
            return acc;
        }, []);

        res.json({ events: merged });
        
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

module.exports = {getUserCalendar};
