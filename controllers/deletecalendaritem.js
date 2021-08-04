
const handleDeletecalendaritem = (req, res, db) => {
    const { id } = req.body;
  
    let itemId, calItems, calItemsDoing;
    db('calendaritems')
    .select('item_id')
    .where('id', '=', id)
    .then(idObjArr => {
        itemId = idObjArr[0].item_id;
    })
    .then(() => {
        return db('calendaritems')
        .where('id', id)
        .del()
    })
    .then(() => {
        return db('calendaritems')
        .select('*')
        .where({
        item_id: itemId
        })
    })
    .then(items => {
        calItems = items;
    })
    .then(() => {
        return db('calendaritems')
        .select('*')
        .where({
        item_id: itemId,
        list: 'doingitems'
        })
    })
    .then(items => {
        calItemsDoing = items;
    })
    .then(() => {
        if (calItems.length === 0) {
        return db('allitems')
        .where('id', itemId)
        .update({
            starttime: null,
            endtime: null
        })
        }
        else if (calItemsDoing.length === 0 && calItems.length !== 0) {
        return db('allitems')
        .where('id', itemId)
        .update({
            list: 'doneitems'
        })
        }
        else if (calItemsDoing.length !== 0){
        return db('allitems')
        .where('id', itemId)
        .update({
            list: 'doingitems'
        })
        }
    })
    .then(() => res.json("Deleted item"))
    .catch(() => res.status(400).json("Unable to delete item"));
}

module.exports = {
    handleDeletecalendaritem: handleDeletecalendaritem
}