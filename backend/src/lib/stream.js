import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
    throw new Error("Stream API key or secret not found");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        return userData;
    } catch (err) {
        console.log("Error upserting user ", err);
    }
}
export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUsers([userId]);
        return userId;
    } catch (err) {
        console.log("Error deleting user ", err);
    }
}