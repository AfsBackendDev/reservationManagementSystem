import { app } from "../index.js";
import { createSpace, getSpaces, editSpace, deleteSpace } from "../db/dbUtils.js";

export async function setSpacesRoutes() {
    /**
     * @swagger
     * /spaces:
     *   post:
     *     tags:
     *       - /spaces
     *     summary: This endpoint create a new a space in the DB
     *     requestBody:
     *      content:
     *          application/json:
     *              schema: 
     *                  $ref: '#/components/schemas/spaceCreateBody'
     *      required: true   
     *     responses:
     *       200:
     *         description: (OK) the space was created successfully
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       500:
     *          $ref: '#/components/responses/serverError'
     *       401:
     *          $ref: '#/components/responses/unauthorized'  
     */
    app.post('/spaces', async (req, res) => {
        try {
            if (!req.body.userToken || !req.body.name || !req.body.description || !toString(req.body.capacity) ) {
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            await createSpace(req.body.userToken, req.body.name, req.body.description, req.body.capacity);
            res.status(200).send('OK: the space was created successfully');
        } catch (error) {
            const status = error.status || 500;
            res.status(status).send((status == 500) ?  "ServerError: "+error.message : error.message);
        };
    });
    /**
     * @swagger
     * /spaces:
     *   get:
     *     tags:
     *       - /spaces
     *     summary: This endpoint list al the spaces in the DB   
     *     responses:
     *       200:
     *         description: (OK) a list with the spaces in the db
     *       404:
     *          $ref: '#/components/responses/notFound'
     *       500:
     *          $ref: '#/components/responses/serverError'
     */
    app.get('/spaces', async (req, res) => {
        try {
            const spaces = await getSpaces();
            res.status(200).send(spaces);
        } catch (error) {
            const status = error.status || 500;
            res.status(status).send((status == 500) ?  "ServerError: "+error.message : error.message);
        };
     });
    /**
     * @swagger
     * /spaces:
     *   put:
     *     tags:
     *       - /spaces
     *     summary: This endpoint edit a space in the DB
     *     requestBody:
     *      content:
     *          application/json:
     *              schema: 
     *                  $ref: '#/components/schemas/spaceEditBody'
     *      required: true   
     *     responses:
     *       200:
     *         description: (OK) the space was edited successfully
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'
     *       500:
     *          $ref: '#/components/responses/serverError'
     */
    app.put('/spaces', async (req, res) => {
        try {
            if (!req.body.userToken || !req.body.spaceId || !req.body.name || !req.body.description || !toString(req.body.capacity) ) {
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            await editSpace(req.body.userToken, req.body.spaceId, req.body.name, req.body.description, req.body.capacity);
            res.status(200).send('OK: the space was edited successfully');
        } catch (error) {
            const status = error.status || 500;
            res.status(status).send((status == 500) ?  "ServerError: "+error.message : error.message);
        };
    });
    /**
     * @swagger
     * /spaces:
     *   delete:
     *     tags:
     *       - /spaces
     *     summary: This endpoint delete a space in the DB
     *     requestBody:
     *      content:
     *          application/json:
     *              schema: 
     *                  $ref: '#/components/schemas/spaceDeleteBody'
     *      required: true   
     *     responses:
     *       200:
     *         description: (OK) the space was deleted successfully
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'
     *       500:
     *          $ref: '#/components/responses/serverError'  
     */
    app.delete('/spaces', async (req, res) => {
        try {
            if (!req.body.userToken || !req.body.spaceId) {
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            await deleteSpace(req.body.userToken, req.body.spaceId);
            res.status(200).send('OK: the space was deleted successfully');
        } catch (error) {
            const status = error.status || 500;
            res.status(status).send((status == 500) ?  "ServerError: "+error.message : error.message);
        };
    });
}
