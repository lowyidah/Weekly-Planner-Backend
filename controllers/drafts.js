const resItems = (db, res) => {
    db
    .select('*')
    .from('items')
    .orderBy('position', 'asc')
    .catch((err) => res.status(400).json(err))
    .then(items => res.json(items));
}

const swapPositions = (aboveItems, position, id, res, db) => {
    const swapPosition = aboveItems[0].position;
    console.log("swapPosition:", swapPosition);
    console.log("position:", position);
    db('items')
    .where('position', '=', swapPosition)
    .update({
        position: position
    })
    .then(() => {
        return db('items')
        .where('id', '=', id)
        .update({
            position: swapPosition
        })
    })
    .then(() => {
        resItems(db, res);
    })
    .catch((err) => res.status(400).json(err));
}

const handleReorderitems = (req, res, db) => {
    
    const { id, direction } = req.body;

    db('items')
    .select('position')
    .where("id", id)
    .then((positionArr) => {
        const position = positionArr[0].position;
        db('items')
        .min('position')
        .max('position')
        .catch((err) => res.status(400).json(err))
        .then(minMaxArr => {
            if(position === minMaxArr[0].min && direction === 'up'){
                resItems(db, res);
            }
            else if (position === minMaxArr[0].max && direction === 'down') {
                resItems(db, res)
            }
            else {
                if(direction === 'up'){
                    db('items')
                    .select('position')
                    .where('position', '<', position)
                    .orderBy('position', 'desc')
                    .catch((err) => res.status(400).json(err))
                    .then((aboveItems) => swapPositions(aboveItems, position, id, res, db))
                }
                else if (direction === 'down'){
                    db('items')
                    .select('position')
                    .where('position', '>', position)
                    .orderBy('position', 'asc')
                    .catch((err) => res.status(400).json(err))
                    .then((aboveItems) => swapPositions(aboveItems, position, id, res, db))
                }
            }
        })
    })    
}

module.exports = {
    handleReorderitems: handleReorderitems
}