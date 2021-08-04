
const handleDeleteitem = (req, res, db) => {
    const { id } = req.body;
    db('allitems')
    .where('id', id)
    .del()
    .then(() => {
        return db('calendaritems')
        .where({
            item_id: id,
            list: 'doingitems'
        })
        .del()
    })
    .then(() => res.json("Deleted item"))
    .catch(() => res.status(400).json("Unable to delete item"));
}


module.exports = {
    handleDeleteitem: handleDeleteitem
}