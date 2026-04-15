import { Inngest } from "inngest"
import { connectDB } from "./db.js"

import User from "../models/User.js"
export const inngest = new Inngest({ id: "intervue-Backend" });
const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {

            await connectDB();
            const userData = event.data;
            const { id } = userData;
            await User.findOneAndDelete({ clerkId: id });
        } catch (err) {
            console.log("Error deleting user from DB ", err);
        }
    }
)
const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            await connectDB();
            const userData = event.data;
            const { id, email_addresses, first_name, last_name, image_url } = userData;
            const newUser = {
                clerkId: id,
                email: email_addresses?.[0]?.email_address || "",
                name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                profileImage: image_url || ""
            }
            await User.create(newUser);
        } catch (err) {
            console.log("Error syncing user ", err);
        }
    })
export const functions = [syncUser, deleteUserFromDB];