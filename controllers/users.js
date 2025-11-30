const { response } = require("express");
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async(req, res) => {
    //#swagger.tags = ['Users']
    const db = mongodb.getDatabase();
    const usersCollection = db.db().collection('users');

    usersCollection.find().toArray()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            res.status(500).json({ message: 'Fetching users failed.' });
        });
};

const getSingle = async (req, res) => {
    //#swagger.tags = ['Users']
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection("users").findOne({_id: userId});
    result.toArray().then((user) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(users[0]);
    }).catch((err) => {
        res.status(500).json({message: "An error occurred", error: err});
    });
};

const createUser = async (req, res) => {
    //#swagger.tags = ['Users']
    const user  = {
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        ipaddress: req.body.ipaddress,
    };
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
    if (response.acknowledge) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the user.');
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags = ['Users']
    const userId = new ObjectId(req.params.id);
    const user = {
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        ipaddress: req.body.ipaddress,
    };
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, (user));
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags = ['Users']
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the user.');
    }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };