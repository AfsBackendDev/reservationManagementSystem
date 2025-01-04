import express from 'express';
import cors from 'cors';
import { setDocs } from './docs.js';
import { setUsersRoutes } from './usersRoutes.js'
import { setSpacesRoutes } from './spacesRoutes.js'

export const app = express();
const port = 3001;
app.use(cors({
    origin: '*'
}));
app.use(express.json());

setUsersRoutes();
setSpacesRoutes();
setDocs();

app.listen(port, () => console.log(`app deployed on port ${port}`));