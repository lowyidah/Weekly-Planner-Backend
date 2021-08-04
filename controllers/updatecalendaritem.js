
const handleUpdatecalendaritem = (req, res, db) => {
    const { id, starttime, endtime, hours, mins } = req.body;

    db('calendaritems')
    .where('id', '=', id)
    .update({
        starttime: starttime,
        endtime: endtime,
        hours: hours,
        mins: mins
    })
    .then(() => res.json("Edited item"))
    .catch((err) => {
        console.log(err);
        res.status(400).json("Unable to edit item")
    });
}

module.exports = {
    handleUpdatecalendaritem: handleUpdatecalendaritem
}