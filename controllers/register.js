
const handleRegister = (req, res, db, bcrypt) => {

    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);

    const { username, email, password } = req.body;

    if(!username || !email || !password){
        res.status(400).json('Not all fields are filled up');
        return;
    }

    const hash = bcrypt.hashSync(password, 10);

    db('users')
    .select('*')
    .where('email', email)
    .then((user) => {
        if(user.length !== 0) {
            res.status(400).json("An account with this email already exist");
            throw new Error("An account with this email already exist");
        }
        else {
            return db('users')
            .insert({
                username: username,
                email: email,
                password: hash
            })
        }
    })
    .then(() => {
        return db('users')
        .select('id', 'username')
        .where('email', email)
    })
    .then((userDetails) => {
        req.session.user = userDetails[0];   
        res.json(userDetails[0]);
    })
    .catch((err) => {
        console.log("Error:", err)
        res.status(400).json("Unable to register")
    })
}

module.exports = {
    handleRegister: handleRegister
}