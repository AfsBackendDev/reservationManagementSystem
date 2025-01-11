import {  app } from "../index.js";
import { createReservation, getReservations, editReservation, deleteReservation } from "../db/dbUtils.js";

export async function setReservationsRoutes(){
    /**
     * @swagger
     * /reservations:
     *   post:
     *     tags:
     *       - /reservations
     *     summary: this endpoint insert a new reservation in the DB!
     *     requestBody:
     *       content:
     *          application/json:
     *              schema:
     *                  $ref : '#/components/schemas/createReservationBody'
     *       required: true
     *     responses:
     *       200:
     *          description: (OK) succesfully reserved.
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'
     *       500:
     *          $ref: '#/components/responses/serverError'
     */
    app.post('/reservations', async (req, res) => {
        try {
            if (!req.body.userToken || !req.body.spaceName || !req.body.startDate || !req.body.endDate) {
                const error = new Error("BadRequest: Missing data");
                error.status = 400;
                throw error;
            }
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
            if (!dateRegex.test(req.body.startDate) || !dateRegex.test(req.body.endDate)) {
                const error = new Error('BadRequest: invalid date');
                error.status = 400;
                throw error;
            }
            await createReservation(req.body.userToken, req.body.spaceName, req.body.startDate, req.body.endDate);
            res.status(200).send('OK: successfully reserved');
        } catch (err) {
            const status = err.status || 500;
            res.status(status).send((status === 500) ? 'ServerError: ' + err.message : err.message);
        }
    });

    /**
     * @swagger
     * /reservations:
     *   get:
     *     tags:
     *       - /reservations
     *     summary: this endpoint return all reservations for a user!
     *     parameters:
     *       - in: header
     *         name: token
     *         schema:
     *           type: string
     *         required: true
     *         description: Token of the user 
     *     responses:
     *       200:
     *         description: Returns list with all reservations if the user is administrator. If not, returns a list with the user reservations.
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'
     *       500:
     *          $ref: '#/components/responses/serverError'   
     */
    app.get('/reservations', async (req, res) => {
        try {
            if (!req.headers.token){
                const error = new Error('BadRequest: missing token');
                error.status = 400;
                throw error;
            }
            const reservations = await getReservations(req.headers.token);
            res.status(200).json(reservations);
        } catch (err) {
            const status = err.status || 500;
            res.status(status).send((status == 500) ? 'ServerError: '+ err.message : err.message);
        }
    });
    /**
     * @swagger
     * /reservations:
     *   put:
     *     tags:
     *       - /reservations
     *     summary: this endpoint edit a the dates of a reservation in the db!
     *     requestBody:
     *       content:
     *          application/json:
     *              schema:
     *                  $ref : '#/components/schemas/editReservationBody'
     *       required: true 
     *     responses:
     *       200:
     *         description: reservation successfully edited.
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'
     *       500:
     *          $ref: '#/components/responses/serverError'   
     */
    app.put('/reservations', async (req, res) => {
        try {
            if (!req.body.userToken || !req.body.reservationId || !req.body.newStartDate || !req.body.newEndDate) {
                const error = new Error('BadRequest: missing data');
                error.status = 400;
                throw error;
            }
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
            if (!dateRegex.test(req.body.newStartDate) || !dateRegex.test(req.body.newEndDate)) {
                const error = new Error('BadRequest: invalid date');
                error.status = 400;
                throw error;
            }
            await editReservation(req.body.userToken, req.body.reservationId, req.body.newStartDate, req.body.newEndDate);
            res.status(200).send('OK: reservation successfully edited')
        } catch (err) {
            const status = err.status || 500;
            res.status(status).send((status == 500) ? 'ServerError: '+ err.message : err.message);
        }
    });
    /**
     * @swagger
     * /reservations:
     *   delete:
     *     tags:
     *       - /reservations
     *     summary: this endpoint edit a the dates of a reservation in the db!
     *     requestBody:
     *       content:
     *          application/json:
     *              schema:
     *                  $ref : '#/components/schemas/deleteReservationBody'
     *       required: true 
     *     responses:
     *       200:
     *         description: reservation successfully deleted.
     *       400:
     *          $ref: '#/components/responses/badRequest'
     *       401:
     *          $ref: '#/components/responses/unauthorized'
     *       404:
     *          $ref: '#/components/responses/notFound'
     *       500:
     *          $ref: '#/components/responses/serverError'   
     */
    app.delete('/reservations', async (req, res) => {
        try {
            if (!req.body.userToken || !req.body.reservationId) {
                const error = new Error('BadRequest: missing data');
                error.status = 400;
                throw error;
            }
            await deleteReservation(req.body.userToken, req.body.reservationId);
            res.status(200).send('OK: reservation successfully deleted')
        } catch (err) {
            const status = err.status || 500;
            res.status(status).send((status == 500) ? 'ServerError: '+ err.message : err.message);
        }
    });
}