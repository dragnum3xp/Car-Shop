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
    try {
        const userId = new ObjectId(req.params.id);

        const db = mongodb.getDatabase();
        const user = await db.db().collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ message: 'Fetching user failed.', error: err });
    }
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
    try {
        const userId = new ObjectId(req.params.id);
        // Data Validation 
        const { email, username, name, ipaddress } = req.body;
        if (!email || !username || !name || !ipaddress) {
            return res.status(400).json({ message: "All fields are required." });
        }
        // Update 
        const response = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .updateOne(
                { _id: userId },
                {
                    $set: {
                        email,
                        username,
                        name,
                        ipaddress
                    }
                }
            );
        // --- Case: user not found ---
        if (response.matchedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user.",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags = ['Users']
    try {
        const userId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            // 成功刪除
            return res.status(204).send();
        } else {
            // 找不到 user
            return res.status(404).json({
                message: 'User not found.',
            });
        }
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: 'Some error occurred while deleting the user.',
            error: error.message,
        });
    }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };