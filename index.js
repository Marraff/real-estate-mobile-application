const db = require('./connect');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload'); //Win version: .. require('express-fileUpload');
require('dotenv').config()

let http = require('http');
let crypto = require("crypto");
let conn = db();
let allowedExtensions = /(\.jpg)$/i;
const errMsg = "Oops something went wrong!"
const salt = "MTAA je super predmet :)";

console.log(__dirname);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());
app.use(express.json());

app.listen(8000, ()=>{                          //spustenie servera               
    console.log('Server running at port 8000');
});

async function withTransaction(callback) {
	try{
		await conn.beginTransaction();
		await callback();
		await conn.commit();
	} catch (err) {
		await conn.rollback();
		throw(err);
	} finally {
		await conn.close();
	}
}

function generateAccessToken(email){
	return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

function authenticateToken(req, res) {
	const { headers: { auth } } = req
	let token = auth
 	jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
 		if(err || !decoded){
 			return res.json({success: false, message: `Not valid token`});
		}
	})
}

function hash(string){
	return crypto.createHash('sha256').update(string).digest('hex');
}


app.get('/', async(req,res) => {
    try{
        res.writeHead(200, { 'Content-Type': 'application/json' });        
        res.end(JSON.stringify('Server running'));
    } catch (err){
		console.log(err);
		return res.status(500).send("An error occured");
    }
});


app.get('/offers',  async(req,res) => {      //zobrazenie vsetkych ponuk nehnutelnosti
	//authenticateToken(req, res);
	try {
		let query = "SELECT * FROM posts INNER JOIN users ON posts.users_id = users.id"
		const result = await conn.query(query);
		return res.status(200).json(result);
		//res.send(result).status(200)
	} catch (err) {
		console.log(err);
		return res.status(500).send(errMsg);
	}
});


app.put('/myOffers', async(req,res) => {    //najdenie vsetkych inzeratov pouzivatela
	//authenticateToken(req, res);
    const user_id = req.body.user_id;
	
	try {
		let query = "SELECT * FROM property INNER JOIN location ON property.location_id = location.id INNER JOIN posts " +
					"ON posts.property_id = property.id WHERE posts.users_id = ?"
		const result = await conn.query(query, [user_id]);
		return res.status(200).json(result);

	} catch (err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
});


app.post('/register', async(req,res) => {       //zaregistrovanie pouzivatela

	console.log(req.body)
	const { name, surname, email, telephone, password } = req.body;
	const auth = hash(password + salt);
	let profile_picture = 0;

    if(req.files && Object.keys(req.files).length !== 0 && allowedExtensions.exec(req.files.profile_picture.name)){
		try {
			profile_picture = req.files.profile_picture;
			profile_picture.name = crypto.randomBytes(20).toString('hex') + '.jpg';
			//profile_picture.mv(__dirname + '/upload/' + profile_picture.name);
			profile_picture.mv(__dirname + 'FrontEnd/assets/upload/' + profile_picture.name);
		} catch (err){
			console.log(err);
			return res.status(400).send("Unable to load image");
		}
    } 
    
	try {
        let query = "INSERT INTO users (name, surname, email, telephone, profile_picture_ref, auth) VALUES (?,?,?,?,?,?)"
		const result = await conn.query(query,[name, surname, email, telephone, profile_picture.name, auth]);
		return res.status(200).send("User " + name + " was created");

	} catch (err) {
		console.log(err);
		return res.status(400).send("Registration wasn't successfull");
	}
});


app.put('/login', async(req,res) => {       //prihlasenie pouzivatela do aplikacie

	const { email, password } = req.body;
	console.log(email,password)
	try{
		if(!email && !password)
			return res.send("Please enter email and password");

		let query = "SELECT id, name, auth FROM users WHERE email = ?";
		const result = await conn.query(query, [email]);

		if(result[0].name == 0 || !result[0].name || !result){
			console.log("user not registered")
			return res.status(400).send("User nor registered");
		}
		let db_auth = result[0].auth;
		if(hash(password + salt) !== db_auth){

			console.log("incorect password")
			return res.status(400).send("Incorrect Password!");
		}
		let token = generateAccessToken({ email: email });
		res.set('auth', token);
		console.log(token)
		//res.redirect('/offers') - Redirect to homepage, depends on frontend (i.e cookies to get token)
		if(hash(password + salt) == db_auth ){
			console.log("hesla sa rovnaju")
			//return res.status(200).send("Successfully logged in");
			console.log(result[0].id)
			return res.status(200).json(result[0].id);
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send(errMsg)
	}
});


app.put('/changePost', async(req, res) => {
	authenticateToken(req, res);
	const {post_id, user_id, title, text} = req.body;
    
    try {
		let user_query = "SELECT users_id FROM posts WHERE id = ?";
		let update_query = "UPDATE posts SET title = ?, text = ? WHERE id = ? ";

		const user_result = await conn.query(user_query, [post_id]);


		if(!user_result[0].users_id || user_result[0].users_id != user_id)
		return res.send("You're not allowed to change this post");

		await withTransaction( async() => {
			const update_result = await conn.query(update_query,[title, text, post_id]);
			return res.status(200).send("Post edited");	
		});

	}catch (err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
});

app.put('/changeProperty', async(req,res) => {      //zmenie udajov o nehnutelnosti
	authenticateToken(req, res);
	const { type, size, price, description, rooms, user_id, property_id } = req.body;
	let image = 0;

	if(req.files && Object.keys(req.files).length !== 0 && allowedExtensions.exec(req.files.image_link.name)){
		try {
			image = req.files.image_link;
			image.name = crypto.randomBytes(20).toString('hex') + '.jpg'
			image.mv(__dirname + '/upload/' + image.name);
		} catch (err) {
			console.log(err);
			return res.status(400).send("Unable to load image");
		}
	}

	try {
		let user_query = "SELECT users_id FROM property WHERE id = ?";
		let update_query = "UPDATE property SET type = ?, size = ?, price = ?, description = ?, rooms = ?, image_link = ? " +
						   "WHERE id = ? AND users_id = ?"; 
		const user_result = await conn.query(user_query, [property_id]);
		
		if(!user_result[0].users_id || user_result[0].users_id != user_id)
			return res.send("You're not allowed to change this post");
		
		await withTransaction( async() => {
			const update_result = await conn.query(update_query,[type, size, price, description, rooms, image.name, property_id, user_id ]);
			return res.status(200).send("Property edited");	
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("Unable to edit post");
	}
});


app.delete('/delete', async(req,res) => {     // zmazanie danej nehnuteľnosti
	authenticateToken(req,res);
	const { property_id, user_id } = req.body;
    
	try{
		let user_query = "SELECT users_id FROM property WHERE id = ?";
		let del_query = "DELETE location, property, posts FROM posts INNER JOIN property ON posts.property_id = property.id" +
            			" INNER JOIN location ON location.id = property.location_id WHERE property.id = ? AND posts.users_id = ?"
			
		const user_result = await conn.query(user_query, [property_id]);
		if(!user_result[0].users_id  || user_result[0].users_id != user_id)
			return res.send("You're not allowed to delete this post");

		const set_fk_0 = await conn.query("SET FOREIGN_KEY_CHECKS = 0");
		const del_result = await conn.query(del_query, [property_id, user_id]);
        const set_fk_1 = await conn.query("SET FOREIGN_KEY_CHECKS = 1");
		return res.status(200).send("Property deleted");

	} catch(err) {
		console.log(err);
		return res.status(500).send("Unable to delete property");
	}
});


app.put('/comments', async(req,res) => {    //vypísanie vsetkých komentárov danej nehnutelnosti
	authenticateToken(req,res);
    const post_id = req.body.posts_id;
	
	try {
		let query = "SELECT * FROM comments WHERE comments.posts_id = ?";
		const result = await conn.query(query, [post_id]);
		return res.status(200).json(result);

	} catch(err) {
		console.log(err);
		return res.status(500).send("Unable to load comments");
	}
});


app.post('/addComment', async(req,res) => {       //pridanie komentára
	authenticateToken(req, res);
	const { posts_id, users_id, comment, parrent_id } = req.body;
	let like_status = 0;
	add_date = Date();

	try {
		let query = "INSERT INTO comments (posts_id, users_id, comment, like_status,add_date) VALUES (?,?,?,?,?)"
		const result = await conn.query(query, [posts_id, users_id, comment, like_status, parrent_id, add_date]);
		return res.status(200).send("Comment added!");

	} catch (err) {
		console.log(err);
		return res.status(400).send("Comment wasn't added");
	}
});


app.post('/postLike', async(req,res) => {       //pridanie liku na post
	authenticateToken(req, res);
    const user_id = req.body.user_id;
	const property_id = req.body.property_id;

	try {
		let query = "UPDATE posts SET like_status = like_status + 1 WHERE users_id = ? AND property_id = ?";
		const result = await conn.query(query, [user_id,property_id]);
		return res.status(200).send("Like added!");
	} catch (err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
});


app.post('/commentLike', async(req,res) => {       //pridanie liku na koment
	authenticateToken(req, res);
    const comment_id = req.body.comment_id;
	try {
		let query = "UPDATE comments SET like_status = like_status + 1 WHERE id = ?"
		const result = await conn.query(query, [comment_id]);
		return res.status(200).send("Like added!");

	} catch (err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
});


app.put('/getByType', async(req, res) => {
	//authenticateToken(req, res);
	console.log("som tu")
	const type = req.body.type;	
	
	try {
		let query = "SELECT * FROM posts INNER JOIN property ON property.id = posts.property_id INNER JOIN users ON users.id = posts.users_id " +
					"INNER JOIN location ON location.id = property.location_id WHERE property.type = ?";
		const result = await conn.query(query, [type]);
		return res.status(200).json(result);
	} catch (err){
		console.log(err);
		return res.status(400).send(errMsg);
	}

});


app.put('/getByPrice', async(req, res) => {
	authenticateToken(req, res);
	const { state, city } = req.body;

	try {
		let query = "SELECT * FROM posts INNER JOIN property ON property.id = posts.property_id INNER JOIN users ON users.id = property.users_id " +
					"INNER JOIN location ON location.id = property.location_id WHERE location.state = ? AND location.city = ?";
		const result = await conn.query(query, [state, city]);
		return res.status(200).json(result);
	} catch (err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
});

app.put('/getData', async(req,res) => {
	//authenticateToken(req, res);
	//const property_id = req.params.property_id;
	const property_id = req.body.property_id;
	try {
		let query = "SELECT users_id, type, size, price, description, rooms FROM property  WHERE id = ?"
		const result = await conn.query(query, [property_id]);
		return res.status(200).json(result);
	} catch (err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
});


async function check(req, res, post_id){
	try {
		let query = "SELECT * FROM posts INNER JOIN users ON users.id = posts.users_id INNER JOIN property ON property.id = posts.property_id " +
					"INNER JOIN location ON location.id = property.location_id WHERE posts.id = ?";
		const result = await conn.query(query, [post_id]);
		
		return res.status(200).json("Post created");
	} catch(err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
}


app.post('/newPost', async(req,res) => {
	authenticateToken(req, res);
	const { type, size, price, description, rooms, user_id } = req.body;
	const { state, city, street, postal_code } = req.body;
	const { title, text } = req.body;
	let image = 0, location_id, property_id;
	let like_status = 0, comments_status = 0, add_date = Date();

	if(req.files && Object.keys(req.files).length !== 0 && allowedExtensions.exec(req.files.image_link.name)){
		try {
			image = req.files.image_link;
			image.name = crypto.randomBytes(20).toString('hex') + '.jpg'
			image.mv(__dirname + '/upload/' + image.name);
		} catch (err) {
			console.log(err);
			return res.status(400).send("Unable to load image");
		}
	}

	try{
		let location_query = "INSERT INTO location (state, city, street, postal_code) VALUES (?,?,?,?)";
		let property_query = "INSERT INTO property (type, size, price, description, rooms, image_link, location_id, users_id) VALUES (?,?,?,?,?,?,?,?)"
		let post_query = "INSERT INTO posts (add_date, title, text, users_id, property_id, like_status, comments_status) VALUES (?,?,?,?,?,?,?)"
		await withTransaction( async() => {
			const set_fk_0 = await conn.query("SET FOREIGN_KEY_CHECKS = 0");
			const location_result = await conn.query(location_query, [state, city, street, postal_code])
			location_id = location_result.insertId;
			const property_result = await conn.query(property_query, [type, size, price, description, rooms, image.name, location_id, user_id])
			property_id = property_result.insertId;
			const post_result = await conn.query(post_query, [add_date, title, text, user_id, property_id, like_status, comments_status]);
			const set_fk_1 = await conn.query("SET FOREIGN_KEY_CHECKS = 1");
			
			await check(req, res, post_result.insertId);
			//return res.status(200).send("Post created");
		});
	}
	catch (err){
		console.log(err);
		return res.status(400).send(errMsg);
	}
});

