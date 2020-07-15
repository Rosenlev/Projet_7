const Like = require('../models/like');

exports.getPostLikes = async (req, res) => {
    try {
        const like = await Like.findOne({ where: {
            postId: req.params.id,
            userIdLiked: req.user.id
        }})
        if (!like) {
            return res.status(200).send({ message: 'Aimez vous ce post ?'})
        }
        res.status(200).send(like)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.createLike = async (req, res) => {
    try {
        await Like.create({
            like: req.body.like,
            postId: req.params.id,
            userIdLiked: req.user.id
        })
        // }
        res.status(201).send({ message: "You like this message!"})
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.deleteLike = async (req, res) => {
    try {
        await Like.destroy({
            where: {
                userIdLiked: req.user.id,
                postId: req.params.id
            }
        })
        res.status(200).send({ message: "You don't like this message anymore!"})
    } catch (err) {
        res.status(500).send(err)
    }
}