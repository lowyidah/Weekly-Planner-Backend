
const handleProfile = (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);

    console.log("req.session:", req.session)
        console.log("req.session.user1:", req.session.user)

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