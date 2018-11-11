const express = require('express');
const router = express.Router();
const fs = require('fs')
const connector = require('./mongo.connector')


//GET
router.get('/', (req, res) => {

    connector.db.collection("item").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });

});


//GET by ID
router.get('/:itemId', (req, res) => {

    //On récupère l'id
    let id = parseInt(req.params.itemId);
    
    //On va chercher l'user qui correspond
    connector.db.collection("item").find({ "_id" : id }).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });

});


//DELETE
router.delete('/:itemId', (req, res) => {

    //On récupère l'id
    let id = parseInt(req.params.itemId);

    //Ligne pour supprimer une ligne
    connector.db.collection("item").deleteOne( { "_id" : id } );

    //On sélectionne tous les item pour vérifier la suppression
    connector.db.collection("item").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });

});


//PUT
router.put('/', (req, res) => {
    let updateItemName = req.body.name
    let updateItemPrice = req.body.price
    let updateItemId = req.body.id
    
    //On modifie la liste
    connector.db.collection("item").updateOne(
        { "_id" : updateItemId },
        { $set: { "name" : updateItemName, "price" : updateItemPrice}
    });

    //On sélectionne toutes les listes pour vérifier la modification
    connector.db.collection("list").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });
    
})


//POST
router.post('/', (req, res) => {
    let newItemName = req.body.name
    let newItemPrice = req.body.price
    
    
    //Init de l'id de l'user à créer
    var newItemId = 0;

    //Variables du while
    let end = false
    let i = 0;

    connector.db.collection("item").find({}).toArray((err, result)=> {

        while(end == false){

            //Si l'emplacement dans la liste est dispo
            if(result[i] == null){
                newItemId = i
                end = true
            }
            
            //Sinon
            else{
                i++
            }
        }

        //On créé la nouvelle liste a ajouter en suivant le model du JSON qui contient tout
        var newItem = {
            _id: newItemId,
            "name" : newItemName,
            "price" : newItemPrice
        }

        //On ajoute la liste précédemment créée
        connector.db.collection('item').insertOne(newItem)
        .catch((err)=>{
            throw err
        });

        //On affiche la liste après ajout
        connector.db.collection("item").find({}).toArray((err, result)=> {
            if (err) throw err;
            res.send(result)
        });

    });
})

module.exports = router;