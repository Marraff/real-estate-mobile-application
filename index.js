const db = require('./connect');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload'); //Win version: .. require('express-fileUpload');
require('dotenv').config()

//let http = require('http');
let crypto = require("crypto");
const res = require('express/lib/response');
let conn = db();
let allowedExtensions = /(\.jpg)$/i;
const errMsg = "Oops something went wrong!"
const salt = "MTAA je super predmet :)";

//
console.log(__dirname);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());
app.use(express.json());
let server = require('http').createServer(app);
const io = require('socket.io')(server);

//
/*
console.log(__dirname);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());
app.use(express.json());
*/
//
io.on("connection",socket => {

	

	// comment section

	socket.on("chat message", (msg, post_id, name) => {
		
		add_date = Date();
		let query = "INSERT INTO comments_socket (add_date, comment, like_status, parrent_id, posts_id, author_name) VALUES (?,?,?,?,?,?)"
		const result = conn.query(query, [add_date, msg, 0, 0, post_id, name ]);

		io.emit("chat message", msg);
		
	});

	socket.on("display comments", post_id=>{

		let query = "SELECT author_name, comment, add_date FROM comments_socket WHERE comments_socket.posts_id = ?";
		const result = conn.query(query, [post_id]).then(result => io.emit("display comments", result));
	})

	// user posts section

	socket.on("display my properties", user_id =>{

		let query = "SELECT * FROM property INNER JOIN location ON property.location_id = location.id INNER JOIN posts " +
					"ON posts.property_id = property.id WHERE posts.users_id = ?"
		const result = conn.query(query, [user_id]).then(result => io.emit("display my properties", result));
		
	} )

	// get by types section

	socket.on("display by type dom", type =>{
	
			let query = "SELECT * FROM posts INNER JOIN property ON property.id = posts.property_id INNER JOIN users ON users.id = posts.users_id " +
						"INNER JOIN location ON location.id = property.location_id WHERE property.type = ?";
			const result = conn.query(query, [type]).then(result => io.emit("display by type dom", result));;

	})

	socket.on("display by type byt", type =>{
	
		let query = "SELECT * FROM posts INNER JOIN property ON property.id = posts.property_id INNER JOIN users ON users.id = posts.users_id " +
					"INNER JOIN location ON location.id = property.location_id WHERE property.type = ?";
		const result = conn.query(query, [type]).then(result => io.emit("display by type byt", result));;

})

	// all posts

	socket.on("display all posts", () =>{

		let query = "SELECT * FROM posts INNER JOIN users ON posts.users_id = users.id ORDER BY posts.like_status DESC"
		const result = conn.query(query).then(result => io.emit("display all posts", result));
		
	} )



});

server.listen(8000, ()=>{				//spustenie servera     
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
	}
	//} finally {
	//	await conn.close();
	//}
}

function generateAccessToken(id){
	return jwt.sign({'id': id}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

function authenticateToken(req, res) {
	const { headers: { auth } } = req
	let token = auth
	if(typeof token === 'undefined' || token == null)
		return false;

 	const result = jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
 		if(err || !decoded){
			console.log(err)
			return false;
		}
		req.user_id = decoded.id;
	})
	return true;
}

function hash(string){
	return crypto.createHash('sha256').update(string).digest('hex');
}

/*
app.get('/', async(req,res) => {
    try{
        res.writeHead(200, { 'Content-Type': 'application/json' });        
        res.end(JSON.stringify('Server running'));
    } catch (err){
		console.log(err);
		return res.status(500).send("An error occured");
    }
});
*/

//mam
app.get('/offers',  async(req,res) => {      //zobrazenie vsetkych ponuk nehnutelnosti
	//authenticateToken(req, res);
	try {
		let query = "SELECT * FROM posts INNER JOIN users ON posts.users_id = users.id ORDER BY posts.like_status DESC"
		const result = await conn.query(query);
		//console.log(result)
		return res.status(200).json(result);
		//res.send(result).status(200)
	} catch (err) {
		console.log(err);
		return res.status(500).send(errMsg);
	}
});

//mam
app.put('/myOffers', async(req,res) => {    //najdenie vsetkych inzeratov pouzivatela
	if(!authenticateToken(req, res))
		return res.status(400).send("Invalid token")

	const user_id = req.user_id;	
	
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


app.put('/logCheck', async(req, res) => {
	if(authenticateToken(req,res))
		return res.status(200).send(req.user_id.toString());
	else
		return res.status(400).send("Token not valid");
}),


app.post('/register', async(req,res) => {       //zaregistrovanie pouzivatela
	const { name, surname, email, telephone, password } = req.body;
	const auth = hash(password + salt);
	let profile_picture = 0;
/*
    if(req.files && Object.keys(req.files).length !== 0 && allowedExtensions.exec(req.files.profile_picture.name)){
		try {
			profile_picture = req.files.profile_picture;
			profile_picture.name = crypto.randomBytes(20).toString('hex') + '.jpg';
			profile_picture.mv(__dirname + 'FrontEnd/assets/upload/' + profile_picture.name);
		} catch (err){
			console.log(err);
			return res.status(400).send("Unable to load image");
		}
    } 
	else{
		profile_picture.name = 'UnknownProfile.jpg';
		profile_picture.mv(__dirname + 'FrontEnd/assets/upload' + profile.picture.name);
	}
    */
	try {
        let query = "INSERT INTO users (name, surname, email, telephone, profile_picture_ref, auth) VALUES (?,?,?,?,?,?)"
		const result = await conn.query(query,[name, surname, email, telephone, profile_picture, auth]);
		return res.status(200).send("User " + name + " was created");

	} catch (err) {
		console.log(err);
		return res.status(400).send("Registration wasn't successfull");
	}
});

app.put('/login', async(req,res) => {       //prihlasenie pouzivatela do aplikacie
	console.log("som tu")
	const { email, password } = req.body;
	try{
		if(!email && !password)
			return res.status(400).send("Please enter email and password");

		let query = "SELECT id, name, auth FROM users WHERE email = ?";
		const result = await conn.query(query, [email]);

		if(typeof result[0] === 'undefined')
			return res.status(400).send("User nor registered");

		let db_auth = result[0].auth;
		if(hash(password + salt) !== db_auth)
			return res.status(400).send("Incorrect Password!");
		
		let token = generateAccessToken(result[0].id);
		if(hash(password + salt) == db_auth ){
			return res.status(200).json({'id': result[0].id, 'token': token})
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send(errMsg)
	}
});

app.put('/changePost', async(req, res) => {
	if(!authenticateToken(req, res))
		return res.status(400).send("Invalid token")

	const user_id = req.user_id;	
	console.log(user_id)
	const {post_id, title, text} = req.body;
	console.log(post_id,title,text)
    
    try {
		let user_query = "SELECT users_id FROM posts WHERE post_id = ?";
		let update_query = "UPDATE posts SET title = ?, text = ? WHERE post_id = ? ";

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
	if(!authenticateToken(req, res))
		return res.status(400).send("Invalid token")

	const user_id = req.user_id;	
	const { type, size, price, description, rooms, property_id } = req.body;
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
	if(!authenticateToken(req, res))
		return res.status(400).send("Invalid token")

    const user_id = req.user_id;
	const { property_id } = req.body;

	try{
		let user_query = "SELECT users_id FROM property WHERE id = ?";
		let del_query = "DELETE location, property, posts FROM posts INNER JOIN property ON posts.property_id = property.id" +
            			" INNER JOIN location ON location.id = property.location_id WHERE property.id = ? AND posts.users_id = ?"
			
		const user_result = await conn.query(user_query, [property_id]);
		console.log(user_id)
		console.log(user_result[0].users_id)
		if(!user_result[0].users_id  || user_result[0].users_id != user_id)
			return res.status(400).send("You're not allowed to delete this post");


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

//mam
app.post('/postLike', async(req,res) => {       //pridanie liku na post
	if(!authenticateToken(req, res))
		return res.status(400).send("Invalid token")

	const user_id = req.user_id;	
	console.log(user_id)
	const property_id = req.body.property_id;

	try {
		
		let query = "UPDATE posts SET like_status = like_status + 1 WHERE  property_id = ?";
		const result = await conn.query(query, [property_id]);
		
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

//mam
app.put('/getByType', async(req, res) => {
	//authenticateToken(req, res);
	//console.log("som tu")
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

//mam
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
					"INNER JOIN location ON location.id = property.location_id WHERE posts.post_id = ?";
		const result = await conn.query(query, [post_id]);
		
		return res.status(200).json("Post created");
	} catch(err) {
		console.log(err);
		return res.status(400).send(errMsg);
	}
}

//mam
app.post('/newPost', async(req,res) => {
	if(!authenticateToken(req, res))
		return res.status(400).send("Invalid token")
	//console.log(req)
	console.log(req.body.data)
	const data = JSON.parse(req.body.data)

	const user_id = req.user_id;	
	const { type, size, price, description, rooms } = data;
	const { state, city, street, postal_code } = data;
	const { title, text } = data;
	
	let image = 0, location_id, property_id, image_path;
	let like_status = 0, comments_status = 0;
	let add_date = Date();//.toISOString().slice(0,19).replace('T',' ');
	console.log(add_date)

	
	if(req.files && Object.keys(req.files).length !== 0 && allowedExtensions.exec(req.files.file.name)){
		try {
			console.log("vidim aobrazok")

			image = req.files.file;
			image.name = crypto.randomBytes(20).toString('hex') + '.jpg'
			//image.mv(__dirname + '/upload/' + image.name);

			image.mv(__dirname + "/FrontEnd/assets/upload/" + image.name);
			//image_path = __dirname + "\\FrontEnd\\assets\\upload\\" + image.name

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

