
const handleSignin = (req, res, db, bcrypt) => {

        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header('Access-Control-Allow-Credentials', true);

        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json("Not all fields are filled up");
            return;
        }

        db('users')
        .select('password')
        .where('email', email)
        .then(user => {
            if (user.length === 0) {
                res.status(400).json("Email does not exist in user database");
                throw new Error("Email does not exist in user database");
            }
            else {
                const isValid = bcrypt.compareSync(password, user[0].password);
                if(!isValid) {
                    res.status(400).json("Wrong password");
                    throw new Error("Wrong password");
                }
                else{
                    return db('users')
                    .select('id', 'username')
                    .where('email', email);
                }
            }
        })
        .then((userDetails) => {
            req.session.user = userDetails[0];   
            res.json(userDetails[0]);
        })
        .catch(() => res.status(400).json("Unable to sign in"))
        .catch(() => {});
    
}

module.exports = {
    handleSignin: handleSignin
}