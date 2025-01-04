import mongoose from "mongoose";
import { User, Space } from "./models.js";
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

//SPACES FUNCTIONS

    export async function createSpace(userToken = String, name = String, description = String, capacity = Number) {
        try {
            const decoded = verifyToken(userToken);
            if (decoded.administrator == false) {
                const error = new Error("Unauthorized: Only administrators can create spaces");
                error.status = 401;
                throw error;
            }
            if (capacity <= 0) {
                const error = new Error("BadRequest: Capacity must be greater than 0");
                error.status = 400;
                throw error;
            }
            if (await Space.findOne({ name }) != null) {
                const error = new Error("BadRequest: Space already exists");
                error.status = 400;
                throw error;
            }
            try {
                await Space.create({ name, description, capacity });
            } catch (err) {
                const error = new Error("Server error: Error in the database");
                error.status = 500;
                throw error;    
            }
            return 'successfully created';
        } catch (err) {
            throw err;
        }
    }

    export async function getSpaces() {
        try {
            const spaces = await Space.find({});
            if (spaces.length == 0) {
                const error = new Error("NotFound: No spaces found");
                error.status = 404;
                throw error;
            }
            return spaces;
        } catch (err) {
            throw err;
        }
    }

    export async function editSpace(userToken = String, spaceId = String, name = String, description = String, capacity = Number) {
        try {
            const decoded = verifyToken(userToken);
            if (decoded.administrator == false) {
                const error = new Error("Unauthorized: Only administrators can edit spaces");
                error.status = 401;
                throw error;
            }
            if (capacity <= 0) {
                const error = new Error("BadRequest: Capacity must be greater than 0");
                error.status = 400;
                throw error;
            }
            try {
                await Space.findById(spaceId);
            } catch (err) {
                const error = new Error("NotFound: Space not found");
                error.status = 404;
                throw error;
            }
            await Space.findByIdAndUpdate(spaceId, { name: name, description: description, capacity: capacity });
        }catch (err) {
            throw err;
        }
    }

    export async function deleteSpace(userToken = String, spaceId = String) {
        try {
            const decoded = verifyToken(userToken);
            if (decoded.administrator == false) {
                const error = new Error("Unauthorized: Only administrators can delete spaces");
                error.status = 401;
                throw error;
            }
            try {
                await Space.findByIdAndDelete(spaceId);
            } catch (err) {
                const error = new Error("NotFound: Space not found");
                error.status = 404;
                throw error;
            }
        } catch (err) {
            throw err;   
        }
    }