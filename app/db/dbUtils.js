import mongoose from "mongoose";
import { User } from "./models.js";
import { createToken, verifyToken } from "../tokens/tokenUtils.js";

mongoose.connect('mongodb://root:password@mongodb_container:27017/miapp?authSource=admin');

//USER FUNCTIONS
    export async function userRegister(first_name = String, second_name = String, first_last_name = String, second_last_name = String, email = String, password = String, administrator = Boolean) {
        if (await User.findOne({ email }) != null) {
            const error = new Error("BadRequest: Email already exists");
            error.status = 400;
            throw error;
        }
        try {
            await User.create({ first_name, second_name, first_last_name, second_last_name, email, password, administrator });
            return 'successfully registered';
        } catch (err) {
            console.log(err);
            const error = new Error("Server error: Error in the database");
            error.status = 500;
            throw error;
        }
    }

    export async function userLogin(email = String, password = String) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error("NotFound: User not found");
                error.status = 404;
                throw error;
            }
            if(password != user.password) {
                const error = new Error("Unauthorized: Invalid password");
                error.status = 401;
                throw error;
            }
            const userWithoutPassword = {
                _id: user._id,
                first_name: user.first_name,
                second_name: user.second_name,
                first_last_name: user.first_last_name,
                second_last_name: user.second_last_name,
                email: user.email,
                administrator: user.administrator
            };
            const token = createToken(userWithoutPassword);
            return token;
        } catch (err) {
            throw err;   
        }
    }

    export async function getUsers(token) {
        try {
            const decoded = verifyToken(token);
            if (decoded.administrator == false) {
                const error = new Error("Unauthorized: Only administrators can get users");
                error.status = 401;
                throw error;
            }else{
                const users = await User.find({});
                return users;
            }
        } catch (err) {
            throw err;
        }
    }

    export async function userDelete(token = String, emailOfUserToDelete = String) {
        try {
            const decoded = verifyToken(token);
            if (decoded.administrator == false && decoded.email != emailOfUserToDelete) {
                const error = new Error("Unauthorized: Only administrators can delete users");
                error.status = 401;
                throw error;
            }
            const status = await User.findOneAndDelete({ email: emailOfUserToDelete });
            if (!status) {
                const error = new Error("NotFound: User not found");
                error.status = 404;
                throw error;
            }                
        } catch (err) {
            throw err;
        }
    }