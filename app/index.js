import express from 'express';
import cors from 'cors';
import { setDocs } from './docs.js';
import { setUsersRoutes } from './routes/usersRoutes.js'
import { setSpacesRoutes } from './routes/spacesRoutes.js'
import { setReservationsRoutes } from './routes/reservationsRoutes.js';

export const app = express();
const port = 3001;
app.use(cors({
    origin: '*'
}));
app.use(express.json());

setUsersRoutes();
setSpacesRoutes();
setReservationsRoutes();
setDocs();

app.listen(port, () => console.log(`app deployed on port ${port}`));