
const handleLoadcalendaritems = (req, res, db) => {
    const { user_id } = req.body;
    db
    .select('*')
    .where({
        user_id: user_id,
    })
    .from('calendaritems')
    .then(items => {
        res.json(items)
    })
    .catch((err) => {
        res.status(400).json("Unable to load calendar items")
    });
}

module.exports = {
    handleLoadcalendaritems: handleLoadcalendaritems
}