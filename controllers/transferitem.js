
const handleTransferitem = (req, res, db) => {

    const { id, startTime, endTime, listTo, hours, mins } = req.body;
    let listFrom;
    db('allitems')
    .where("id", id)
    .then(item => listFrom = item[0].list)
    .then(() =>{
    
        if (listTo === 'doingitems') {
            db('allitems')
                .where('id', '=', id)
                .update({
                    starttime: startTime,
                    endtime: endTime,
                    list: listTo,
                    hours: hours,
                    mins: mins
                })
                .then(() => res.json("Edited item time"))
                .catch(() => res.status(400).json("Unable to edit item time"));
        }
        else if (listTo === 'doneitems') {
            db('calendaritems')
            .where('item_id', '=', id)
            .update({
                list: 'doneitems'
            })
            .then(() => {
                return db('allitems')
                .where('id', '=', id)
                .update({
                list: 'doneitems'
                })
            })
            .then(() => {
                return db('calendaritems')
                .select('id')
                .where('item_id', '=', id)
            })
            .then((ids) => res.json(ids))
            .catch((err) => {
                console.log(err);
                res.status(400).json("Unable to finish item")
            });
        }
        else if (listTo === 'items') {
            db('allitems')
                .where("id", id)
                .update({
                    list: listTo,
                    starttime: null,
                    endtime: null
                })
                .then(() => {
                    return db('calendaritems')
                    .where({
                        item_id: id,
                        list: 'doingitems'
                    })
                    .del();
                })
                .then(() => res.json('Switched from items to doneitems on the backend'))
                .catch(() => res.status(400).json("Unable to transfer item to other list"));
        }
    })
}

module.exports = {
    handleTransferitem: handleTransferitem
}