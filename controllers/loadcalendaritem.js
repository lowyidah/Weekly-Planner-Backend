const handleLoadcalendaritem = (req, res, db) => {
    const { id } = req.body;

    let event;
    db('calendaritems')
    .select('*')
    .where({
        id: id,
    })
    .then(items => {
        res.json(items[0])
    })
    .catch((err) => {
        res.status(400).json("Unable to load calendar item")
    });
}

module.exports = {
    handleLoadcalendaritem: handleLoadcalendaritem
}