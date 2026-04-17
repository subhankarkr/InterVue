import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = chatClient.createToken(req.user.clerkId)
        return res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image
        });
    } catch (err) {
        console.log("Error getting token ", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
