const Comment = require('../models/comment');

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({ where : {
            postId: req.params.id
        }})
        if (!comments) {
            return res.status(200).send({ message: "There is no comment currently"})
        }
        res.status(200).send(comments)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.createComment = async (req, res) => {
    try {
        await Comment.create({
            userId: req.user.id,
            avatar: req.user.imageUrl,
            username: req.user.username,
            postId: req.params.id,
            content: req.body.content
        })
        res.status(201).send({ message: "Comment has been created!"})
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({ where: {
            id: req.body.id
        }})
        if (!(req.user.id === comment.userId)) {
            return res.status(401).send({ message: 'You are not authorised'})
        }
        await Comment.destroy({ where: {
            userId: req.user.id,
            id: req.body.id
        }})
        res.status(200).send({ message: "Comment has been deleted!"})
    } catch (err) {
        res.status(500).send(err)
    }
}