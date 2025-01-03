import express from 'express';
import cors from 'cors';
import { setDocs } from './docs.js';
import { setUsersRoutes } from './usersRoutes.js'

export const app = express();
const port = 3001;
app.use(cors({
    origin: '*'
}));
app.use(express.json());

setUsersRoutes();
setDocs();

app.listen(port, () => console.log(`app deployed on port ${port}`));