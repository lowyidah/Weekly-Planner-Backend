const handleReorderallitems = (req, res, db) => {
    
    const { id, direction, user_id } = req.body;
    let position, swapPosition;

    db('allitems')
    .select('position')
    .where({
        id: id,
        list: 'items'
    })
    .then((positionArr) => {
        position = positionArr[0].position;
        return db('allitems')
        .where({
            user_id: user_id,
            list: 'items'
        })
        .min('position')
        .max('position');
    })  
    .then(minMaxArr => {
        if(position === minMaxArr[0].min && direction === 'up'){
            res.json("Item is already at the top of the list");
            throw new Error("Item is already at the top of the list");
        }
        else if (position === minMaxArr[0].max && direction === 'down') {
            res.json("Item is already at the bottom of the list");
            throw new Error("Item is already at the bottom of the list");
        }
        else {
            if(direction === 'up'){
                return db('allitems')
                .select('position')
                .where({
                    user_id: user_id,
                    list: 'items'
                })
                .where('position', '<', position)
                .orderBy('position', 'desc');
            }
            else if (direction === 'down'){
                return db('allitems')
                .select('position')
                .where({
                    user_id: user_id,
                    list: 'items'
                })
                .where('position', '>', position)
                .orderBy('position', 'asc');
            }
        }
    })  
    .then(aboveItems => {
        swapPosition = aboveItems[0].position;
        return db('allitems')
        .where({
            user_id: user_id,
            list: 'items',
            position: swapPosition
        })
        .update({
            position: position
        })
    })
    .then(() => {
        return db('allitems')
        .where({
            user_id: user_id,
            list: 'items',
            id: id
        })
        .update({
            position: swapPosition
        })
    })
    .then(() => {
        res.json("Swapped item position")
    })
    .catch(() => {
        res.status(400).json("Unable to swap item position");
    })
    .catch(() => {});
}

module.exports = {
    handleReorderallitems: handleReorderallitems
}