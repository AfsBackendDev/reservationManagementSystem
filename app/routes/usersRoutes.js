import { app } from "../index.js";
import { userRegister, userLogin, getUsers, userDelete } from "../db/dbUtils.js";

export function setUsersRoutes() {
    /**
     * @swagger
     * /users/register:
     *   post:
     *     tags:
     *       - /users
     *     summary: This endpoint inserts a new user in the DB
     *     requestBody:
     *      content:
     *          application/json:
     *              schema: 
     *                  $ref: '#/components/schemas/userRegisterBody'
     *      required: true   
     *     responses:
     *       200:
     *         description: (OK) successfully registered.
     * 
     *       400:
     *          $ref: '#/components/responses/badRequest' 
     *       500:
     *          $ref: '#/components/responses/serverError' 
     */
    app.post('/users/register', async (req, res) => {
        try {
            if (!req.body.first_name || !req.body.first_last_name || !req.body.email || !req.body.password) {
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            const first_name = req.body.first_name;
            const second_name = req.body.second_name;
            const first_last_name = req.body.first_last_name;
            const second_last_name = req.body.second_last_name;
            const email = req.body.email;
            const password = req.body.password;
            const administrator = req.body.administrator;
            await userRegister(first_name, second_name, first_last_name, second_last_name, email, password, administrator);
            res.status(200).send('OK: successfully registered');
        } catch (err) {
            console.log(err);
            res.status(err.status).send(err.message);   
        }
    })
    /**
     * @swagger
     * /users/login:
     *   post:
     *     tags:
     *       - /users
     *     summary: This endpoint compares the user information obtained with the information in the DB
     *     requestBody:
     *      content:
     *          application/json:
     *              schema: 
     *                  $ref: '#/components/schemas/userLoginBody'
     *      required: true   
     *     responses:
     *       200:
     *         description: (OK) successfully logged in
     *         content:
     *            application/json:
     *                schema:
     *                    $ref: '#/components/schemas/successUserLogin'
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       500:
     *          $ref: '#/components/responses/serverError'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'   
     */
    app.post('/users/login', async(req, res) => {
        try {
            if (!req.body.email || !req.body.password) {
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            const email = req.body.email;
            const password = req.body.password;
            const token = await userLogin(email, password);
            res.status(200).json({ token });
        } catch (err) {
            res.status(err.status).send(err.message);
        }
    })
    /**
     * @swagger
     * /users:
     *   get:
     *     tags:
     *       - /users
     *     summary: This endpoint return all the users in the DB
     *     parameters:
     *       - in: header
     *         name: token
     *         schema:
     *           type: string
     *         required: true
     *         description: Token for the administrator user   
     *     responses:
     *       200:
     *         description: (OK) a list with all the users in the DB
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'  
     */
    app.get('/users', async (req, res) => {
        try {
            if(!req.headers.token){
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            const list = await getUsers(req.headers.token);
            res.status(200).json(list);
        } catch (err) {
            res.status(err.status).send(err.message);
        }
    });
    /**
     * @swagger
     * /users/delete:
     *   delete:
     *     tags:
     *       - /users
     *     summary: This endpoint deletes a user in the DB
     *     requestBody:
     *      content:
     *          application/json:
     *              schema: 
     *                  $ref: '#/components/schemas/userDeleteBody'
     *      required: true   
     *     responses:
     *       200:
     *         description: (OK) successfully deleted user
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'   
     */
    app.delete('/users/delete', async (req, res) => {
        try {
            if(!req.body.token || !req.body.emailOfUserToDelete){
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            const token = req.body.token;
            const emailOfUserToDelete = req.body.emailOfUserToDelete;
            await userDelete(token, emailOfUserToDelete);
            res.status(200).send('OK: successfully deleted user');
        } catch (err) {
            res.status(err.status).send(err.message);
        }
    });
}