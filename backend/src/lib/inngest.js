import { Inngest } from "inngest"
import { connectDB } from "./db.js"

import User from "../models/User.js"
import { upsertStreamUser, deleteStreamUser } from "./stream.js"
export const inngest = new Inngest({ id: "intervue-Backend" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "user.created" },
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
            await upsertStreamUser({
                id: newUser.clerkId.toString(),
                name: newUser.name,
                image: newUser.profileImage
            })
        } catch (err) {
            console.log("Error syncing user ", err);
        }
    })

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "user.deleted" },
    async ({ event }) => {
        try {

            await connectDB();
            const userData = event.data;
            const { id } = userData;
            await deleteStreamUser(id.toString());
            await User.findOneAndDelete({ clerkId: id });
        } catch (err) {
            console.log("Error deleting user from DB ", err);
        }
    }
)
export const functions = [syncUser, deleteUserFromDB];