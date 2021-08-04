
const handleAdditem = (req, res, db) => {
    const { description, hours, mins, details, user_id, category, due, list } = req.body;
    db('allitems')
    .insert({
        description: description,
        hours: hours,
        mins: mins,
        details: details,
        user_id: user_id,
        list: list,
        category: category,
        due: due
    })
    .then(() => res.json("Added item"))
    .catch(() => res.status(400).json("Unable to add item"));
 }

module.exports = {
    handleAdditem: handleAdditem
}