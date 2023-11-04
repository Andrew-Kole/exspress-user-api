import express from 'express';
import bodyParser from "body-parser";
import { UserController } from "./interfaces/controllers/user.conroller";
import { UserService } from "./domain/services/user.service";
import { UserRepositoryPostgres } from "./infrastructure/persistance/user.repository.postgres";
import { basicAuth } from "./interfaces/middleware/auth.middleware";

const app = express();
app.use(bodyParser.json());

const userRepository = new UserRepositoryPostgres();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.post('/users', userController.createUser.bind(userController));
app.get('/users/:id', userController.getUserById.bind(userController));
app.put('/users/:id',basicAuth, userController.updateUser.bind(userController));

const PORT = 3000;
app.listen(PORT, () => {
   console.log('Server runs on port 3000.')
});