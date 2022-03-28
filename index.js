const express = require('express');
const app = express();
const db = require('./connect.js');
const cors = require('cors');
var http = require('http');
const fileUpload = require('express-fileUpload');
var crypto = require("crypto");
const bodyParser = require('body-parser');


console.log(__dirname);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());
app.use(express.json());

var allowedExtensions = /(\.jpg)$/i;

app.listen(8080, ()=>{                          //spustenie servera               
    console.log('Server running at port 8080');
});

app.get('/', async(req,res) => {

    try{
        
        res.writeHead(200, { 'Content-Type': 'application/json' });        
        res.end(JSON.stringify('Server running'));
   
    }
    catch{
        console.error(err.message);         // v pripade chyby vypise chybovu hlasku
    }
    
});

app.get('/offers', async(req,res) => {      //zobrazenie vsetkych ponuk nehnutelnosti

    db.query("SELECT * FROM posts INNER JOIN users ON posts.users_id = users.id", (err,result) => {
            if (err){
                res.status(400).send("oops something went wrong!");
                console.log(err);
            }
            else{
                res.status(200).send(result,2,null);
            }
         }
    );
});


app.put('/myOffers', async(req,res) => {    //najdenie vsetkych inzeratov pouzivatela

    const user_id = req.body.user_id;

    db.query("SELECT * FROM property INNER JOIN location ON property.location_id = location.id INNER JOIN posts ON posts.property_id = property.id WHERE posts.users_id = ?",
    [user_id],
    (err,result) => {
        if (err){
            res.status(400).send("oops something went wrong!");
            console.log(err);
        }
        else{
            res.status(200).send(result);
        }
     });
});


app.post('/register', async(req,res) => {       //zaregistrovanie pouzivatela
    
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const telephone = req.body.telephone;
    //const profile_picture = req.body.profile_picture;
    var profile_picture;
    var uploadPath;

    if(!req.files || Object.keys(req.files).lenth === 0 || !allowedExtensions.exec(req.files.profile_picture.name)){
        profile_picture = 0;
    }
    else{
        var profile_picture_name = crypto.randomBytes(20).toString('hex')+'.jpg';  // vygenerovanie nahodneho mena suboru
        profile_picture = req.files.profile_picture;
        profile_picture.name = profile_picture_name;
        uploadPath = __dirname + '/upload/' + profile_picture.name;
        profile_picture.mv(uploadPath, function(err){
            if(err){
                return res.status(400).send(err);
            }
        })
    }
    
    db.query(
        "INSERT INTO users (name, surname, email, telephone, profile_picture_ref) VALUES (?,?,?,?,?)",
         [name, surname, email, telephone, profile_picture.name], 
         (err,result) => {
            if (err){
                res.status(400).send("Registration wasn't successfull");
                console.log(err)
            }
            else{
                res.status(200).send("User was created");
            }
         }
    );


});


app.put('/login', async(req,res) => {       //prihlasenie pouzivatela do aplikacie

    const email = req.body.email;
    const name = req.body.name;

    db.query("SELECT * FROM users WHERE email = ? AND name = ?",
    [email,name],
    (err,result) => {
        if (err){
            res.status(400).send("Invalid name or email");
            console.log(err);
        }
        if(result.length == 0){
            res.status(400).send("Invalid name or email");
        }
        else{
            res.status(200).send(result);
        }
    })
});


app.put('/change', async(req,res) => {      //zmenie udajov o nehnutelnosti

    const property_id = req.body.property_id;
    const user_id = req.body.user_id;
    
    const type = req.body.type;
    const size = req.body.size;
    const price = req.body.price;
    const description = req.body.description;
    const rooms = req.body.rooms;
    //const image_link = req.body.image_link;
    var image_link;
    var uploadPath;

    if(!req.files || Object.keys(req.files).lenth === 0 || !allowedExtensions.exec(req.files.image_link.name)){
        image_link = 0;
    }
    else{
        
        var image_link_name = crypto.randomBytes(20).toString('hex')+'.jpg';  // vygenerovanie nahodneho mena suboru
        image_link = req.files.image_link;
        image_link.name = image_link_name;
        uploadPath = __dirname + '/upload/' + image_link.name;
        image_link.mv(uploadPath, function(err){
            if(err){
                return res.status(400).send(err);
            }
        })
    }

    db.query(`UPDATE property SET type = ?, size = ?, price = ?, description = ?, rooms = ?, image_link = ? WHERE id = ${property_id} AND users_id = ${user_id} `,
    [type, size, price, description, rooms, image_link.name ],
    (err,result) => {
        if (err){
            res.status(400).send("Oops semething went wrong");
            console.log(err);
        }
        else{
            res.status(200).send("Change was successfull! ");
        }
    })

});


app.delete('/zmaz', async(req,res) => {     // zmazanie danej nehnuteľnosti

    const property_id = req.body.property_id;
    const user_id = req.body.user_id;
    
    db.query(` SET FOREIGN_KEY_CHECKS=0`,
            (err,result) => {
                if (err){
                    res.status(400).send("Invalid");
                    console.log(err)
                }
            });
                
    db.query(`DELETE location, property, posts 
            FROM posts INNER JOIN property ON posts.property_id = property.id 
            INNER JOIN location ON location.id = property.location_id 
            WHERE property.id = ? AND posts.users_id = ?`,
            [property_id,user_id],
            (err,result) => {
                if (err){
                    res.status(400).send("Invalid ID of the property");
                    console.log(err)
                }
            });
                            
    db.query(` SET FOREIGN_KEY_CHECKS=1`,
            (err,result) => {
                if (err){
                    res.status(400).send("Invalid");
                    console.log(err)
                }
                else{
                    res.status(200).send("property was deleted");
                }
            });         
});


///////
app.get('/byty', async(req,res) => {
    
});

app.get('/domy', async(req,res) => {
    
});

app.get('/getData', async(req,res) => {
    
});

app.get('/check', async(req,res) => {
    
});

app.post('/newOffer', async(req,res) => {

});


