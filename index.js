const express = require('express');
const app = express();
const db = require('./connect.js');
const cors = require('cors')
var http = require('http');
const { getMaxListeners } = require('process');

app.use(cors());
app.use(express.json())


app.get('/', async(req,res) => {

    try{
        
        res.writeHead(200, { 'Content-Type': 'application/json' });        
        res.end(JSON.stringify('Server running'));
   
    }
    catch{
        console.error(err.message);         // v pripade chyby vypise chybovu hlasku
    }
    
});

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

app.get('/offers', async(req,res) => {      //zobrazenie vsetkych ponuk nehnutelnosti

    db.query("SELECT * FROM property  INNER JOIN location ON property.id = location.property_id INNER JOIN posts ON posts.property_id = property.id", (err,result) => {
            if (err){
                //res.writeHead(400, { 'Content-Type': 'application/json' }); 
                console.log(err)
            }
            else{
                //res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.send(result,2,null);
            }
         }
    );
});

app.get('/myOffers', async(req,res) => {    //najdenie vsetkych inzeratov pouzivatela

    const user_id = req.body.user_id;

    db.query("SELECT * FROM property INNER JOIN location ON property.location_id = location.id INNER JOIN posts ON posts.users_id = property.users_id ", (err,result) => {
        if (err){
            //res.writeHead(400, { 'Content-Type': 'application/json' }); 
            console.log(err)
        }
        else{
            //res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.send(result);
        }
     }
);

});

app.post('/register', async(req,res) => {       //zaregistrovanie pouzivatela
    /*
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const telephone = req.body.cislo;
    const profile_picture = req.body.profile_picture;
    */

    const name = "Peter" 
    const surname = "Rychly"
    const email = "peter.rychly@gmail.com"
    const telephone = "0945222333"
    const profile_picture = null

    db.query(
        "INSERT INTO users (name, surname, email, telephone, profile_picture) VALUES (?,?,?,?,?)",
         [name, surname, email, telephone,profile_picture], 
         (err,result) => {
            if (err){
                //res.writeHead(400, { 'Content-Type': 'application/json' }); 
                res.send("Registration wasn't successfull");
                console.log(err)
            }
            else{
                //res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.send("User was created");
            }
         }
    );


});

app.put('/login', async(req,res) => {       //prihlasenie pouzivatela do aplikacie

    const email = "mraffac@gmail.com"//req.body.email;
    const name = "Martin"//req.body.name;

    db.query("SELECT * FROM users WHERE email = ?",
    [email],
    (err,result) => {
        if (err){
            //res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.send("Invalid name or email");
            console.log(err);
        }
        else{
            //res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.send(result);
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

    db.query("UPDATE property SET (type, size, price, description, rooms) VALUES (?,?,?,?,?) WHERE id = ? AND users_id = ? ",
    [type, size, price, description, rooms, property_id, user_id],
    (err,result) => {
        if (err){
            //res.writeHead(400, { 'Content-Type': 'application/json' }); 
            res.send("Oops semething went wrong");
            console.log(err);
        }
        else{
            //res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.send(result);
        }
    })

});

app.delete('/zmaz', async(req,res) => {     // zmazanie danej nehnuteľnosti

    const property_id = req.body.property_id;
    const user_id = req.body.user_id;

    db.query(
        "DELETE FROM property WHERE id = ? AND users_id = ?",
        [property_id,user_id],
         (err,result) => {
            if (err){
                //res.writeHead(400, { 'Content-Type': 'application/json' }); 
                res.send("Invalid ID of the property");
                console.log(err)
            }
            else{
                //res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.send("Property was deleted");
            }
         }
    );

});
///////////

app.put('/find',(req,res) =>{
    const email = "mraffac@gmail.com";
    console.log(email)
    db.query("SELECT * FROM customers WHERE email = ?",
    [email],
    (err,result) => {
        if (err){
            console.log(err);
        }
        else{
            res.send(result);
            console.log(result);
        }
        }
    )
});


app.listen(8080, ()=>{                          //spustenie servera               
    console.log('Server running at port 8080');
});