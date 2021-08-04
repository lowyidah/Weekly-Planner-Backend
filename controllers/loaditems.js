
const handleLoaditems = (req, res, db) => {
    const { user_id, list, category } = req.body;
    if (category === undefined) {
        db
        .select('*')
        .where({
            user_id: user_id,
            list: list
        })
        .from('allitems')
        .orderBy('position', 'asc')
        .then(items => {
            res.json(items)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json("Unable to load " + list)
        });
    }
    else{
        db
        .select('*')
        .where({
            user_id: user_id,
            list: list,
            category: category
        })
        .from('allitems')
        .orderBy('position', 'asc')
        .then(items => {
            res.json(items)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json("Unable to load " + list)
        });
    }
}


module.exports = {
    handleLoaditems: handleLoaditems
}