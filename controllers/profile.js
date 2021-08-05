
const handleProfile = (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);

    if(req.session.user) {
      res.json(req.session.user);
    }
    else {
      res.json("You are not logged in");
    }
}

module.exports = {
handleProfile: handleProfile
}