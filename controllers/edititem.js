
const handleEdititem = (req, res, db) => {
    
    const { editedItem } = req.body;
    db('allitems')
    .where('id', '=', editedItem.id)
    .update({
        description: editedItem.description,
        hours: editedItem.hours,
        mins: editedItem.mins,
        details: editedItem.details,
        due: editedItem.due
    })
    .then(() => {
        return db('calendaritems')
        .where({
            item_id: editedItem.id
        })
        .update({
            description: editedItem.description,
            hours: editedItem.hours,
            mins: editedItem.mins,
            details: editedItem.details,
        })
    })
    .then(() => res.json("Edited item"))
    .catch(() => res.status(400).json("Unable to edit item"));

}

module.exports = {
    handleEdititem: handleEdititem
}