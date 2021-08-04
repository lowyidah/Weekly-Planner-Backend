
const handleSignout = (req, res) => {
    req.session.destroy();
    res.json("You are logged out");
}

module.exports = {
    handleSignout: handleSignout
}