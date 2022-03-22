const express = require('express');
const app = express();
const db = require('./connect.js');

app.use(express.json());


app.get('/', async(req,res) => {

    try{
        
        res.writeHead(200, { 'Content-Type': 'application/json' });        
        res.end(JSON.stringify('Server running'));
   
    }
    catch{
        console.error(err.message);         // v pripade chyby vypise chybovu hlasku
    }
    
});

app.get('/offers', async(req,res) => {
    
});

app.get('/byty', async(req,res) => {
    
});

app.get('/domy', async(req,res) => {
    
});

app.get('/getData', async(req,res) => {
    
});

app.get('/myOffers', async(req,res) => {
    
});

app.get('/check', async(req,res) => {
    
});

app.post('/register', async(req,res) => {
    
});

app.post('/newOffer', async(req,res) => {
    
});

app.put('/login', async(req,res) => {
    
});

app.get('/change', async(req,res) => {
    
});

app.delete('/zmaz', async(req,res) => {

    const property_id = req.body.property_id;
    const user_id = req.body.user_id;

    db.query(
        "DELETE FROM property WHERE id = ? AND users_id = ?",
        [property_id,user_id],
         (err,result) => {
            if (err){
                res.writeHead(400, { 'Content-Type': 'application/json' }); 
                res.send("PInvalid ID of the property");
            }
            else{
                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.send("Property was deleted");
            }
         }
    );

});

app.listen(8080, ()=>{                          //spustenie servera               
    console.log('Server running at port 8080');
})