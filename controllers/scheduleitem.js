
const handleScheduleitem = (req, res, db) => {
    const { id, startTime, endTime, hours, mins } = req.body;
    let returnId;
    db('allitems')
    .where("id", id)
    .then(items => items[0])
    .then((item) => {
        return db('calendaritems')
        .returning('id')
        .insert({
        user_id: item.user_id,
        item_id: item.id,
        details: item.details,
        description: item.description,
        hours: hours,
        mins: mins,
        endtime: endTime,
        starttime: startTime,
        category: item.category,
        list: 'doingitems'
        })
    })
    .then(idArr => {
        returnId = idArr[0];
    })
    .then(() => {
        return db('allitems')
        .where("id", id)
        .update({
            starttime: startTime,
            endtime: endTime,
            list: 'doingitems',
            // hours: hours,
            // mins: mins
        })
    })
    .then(() => res.json(returnId))
    .catch(() => {
        res.status(400).json("Unable to edit item time")
    });
}

module.exports = {
    handleScheduleitem: handleScheduleitem
}