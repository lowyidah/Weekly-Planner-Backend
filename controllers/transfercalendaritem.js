
const handleTransfercalendaritem = (req, res, db) => {
    const { id, list } = req.body;

    let itemId;
    db('calendaritems')
    .where('id', '=', id)
    .update({
        list: list
    })
    .then(() => {
        return db('calendaritems')
        .select('*')
        .where('id', '=', id)
    })
    .then(items => {
        itemId = items[0].item_id;
        return db('calendaritems')
        .select('*')
        .where({
        item_id: items[0].item_id,
        list: 'doingitems'
        })
    })
    .then(items => {
        if (items.length === 0) {
        return db('allitems')
        .where('id', itemId)
        .update({
            list: 'doneitems'
        })
        }
        else {
        return db('allitems')
        .where('id', itemId)
        .update({
            list: 'doingitems'
        })
        }
    })
    .then(() => res.json("Edited item"))
    .catch((err) => {
        console.log(err);
        res.status(400).json("Unable to edit item")
    });
}

module.exports = {
    handleTransfercalendaritem: handleTransfercalendaritem
}