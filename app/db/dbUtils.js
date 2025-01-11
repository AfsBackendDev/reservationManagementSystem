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
            return createToken(userWithoutPassword); 
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

//RESERVATION FUNCTIONS

    async function verifyOverlapping(spaceName, newStartDate, newEndDate, reservationId) {
        if (newStartDate < new Date()) {
            const error = new Error('BadRequest: the date cannot be less than the current date');
            error.status = 400;
            throw error;
        }
        if (newEndDate < newStartDate) {
            const error = new Error('BadRequest: the end date cannot be less tha the start date');
            error.status = 400;
            throw error;
        }
        const space = await Space.findOne({ name: spaceName });
        space.reservations.forEach(reservation => {
            if (reservation._id != reservationId) {
                const isOverlapping = (
                    (newStartDate < reservation.startDate && newEndDate > reservation.startDate) ||
                    (newEndDate > reservation.endDate && newStartDate < reservation.endDate) ||
                    (newStartDate >= reservation.startDate && newEndDate <= reservation.endDate)
                );
                if (isOverlapping){
                    const error = new Error('BadRequest: the selected date is overlapping with another reservation');
                    error.status = 400;
                    throw error;
                }   
            }
        });
    }

    export async function createReservation(token = String, spaceName = String, startDate = String, endDate = String) {
        try {
            const decoded = verifyToken(token);
            const space = await Space.findOne({ name: spaceName });
            if (!space) {
                const error = new Error("NotFound: Space not found");
                error.status = 404;
                throw error;
            }
            const newStartDate = new Date(startDate);
            const newEndDate = new Date(endDate);
            await verifyOverlapping(spaceName, newStartDate, newEndDate);
            const newReservation = {
                reservationHolder: `${decoded.first_name} ${decoded.second_name} ${decoded.first_last_name} ${decoded.second_last_name}`,
                reservationHolderEmail: decoded.email,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
            space.reservations.push(newReservation);
            await space.save();
        } catch (err) {
            throw err;
        }
    }

    export async function getReservations(token){
        try {
            const decoded = verifyToken(token);
            const pipeline = [
                { $unwind: "$reservations" },
                { $project: {
                    _id: "$reservations._id",
                    name: 1,
                    reservationHolder: "$reservations.reservationHolder",
                    reservationHolderEmail: "$reservations.reservationHolderEmail",
                    startDate: "$reservations.startDate",
                    endDate: "$reservations.endDate" 
                }}
            ];
            (!decoded.administrator) ? pipeline.push({ $match: { "reservations.reservationHolderEmail": decoded.email }}) : null;
            const reservations = await Space.aggregate(pipeline);
            if(reservations.length == 0){
                const error = new Error('NotFound: no reservations found');
                error.status = 404;
                throw error;
            }
            return reservations;
        } catch (err) {
            throw err
        }
    }

    export async function editReservation(token, reservationId, newStartDate, newEndDate) {
        try {
            const decoded = verifyToken(token);
            const space = await Space.findOne({"reservations._id": reservationId});
            if (!space) {
                const error = new Error('NotFound: reservation not found');
                error.status = 404;
                throw error;
            };
            const reservation = space.reservations.id(reservationId);
            if (!decoded.administrator && reservation.reservationHolderEmail != decoded.email) {
                const error = new Error('Unauthorized: only administrators or reservation holders can edit');
                error.status = 401;
                throw error;
            };
            const startDate = new Date(newStartDate);
            const endDate = new Date(newEndDate);
            await verifyOverlapping(space.name, startDate, endDate, reservationId);
            reservation.startDate = startDate;
            reservation.endDate = endDate;
            await space.save();
        } catch (err) {
            throw err
        }
    };

    export async function deleteReservation(token, reservationId) {
        try {
            const decoded = verifyToken(token);
            const space = await Space.findOne({ "reservations._id": reservationId });
            if (!space) {
                const error = new Error('NotFound: reservation not found');
                error.status = 404;
                throw error;
            }
            const reservation = space.reservations.id(reservationId);
            if (!decoded.administrator && reservation.reservationHolderEmail != decoded.email) {
                const error = new Error('Unauthorized: only administrators or reservation holders can delete a reservation');
                error.status = 401;
                throw error; 
            };
            await Space.updateOne(
                { "reservations._id": reservationId },
                { $pull: { reservations: { _id: reservationId } } }
            );
        } catch (err) {
            throw err
        }
    }