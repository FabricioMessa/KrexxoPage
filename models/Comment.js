const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		parentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},
		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Comment", CommentSchema);
