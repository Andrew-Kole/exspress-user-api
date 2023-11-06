import express from 'express';
import bodyParser from "body-parser";
import {UserController} from "./interfaces/controllers/user.conroller";
import {UserService} from "./domain/services/user.service";
import {UserRepositoryPostgres} from "./infrastructure/persistance/user.repository.postgres";
import {jwtAuth} from "./interfaces/middleware/auth.middleware";
import {roleCheck} from "./interfaces/middleware/role.middleware";
import {UserRoles} from "./domain/models/roles.enum";

const app = express();
app.use(bodyParser.json());

const userRepository = new UserRepositoryPostgres();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.post('/users', userController.createUser.bind(userController));
app.get('/users/:id', userController.getUserById.bind(userController));
app.put('/users/:id', jwtAuth, roleCheck([UserRoles.Moderator, UserRoles.Admin]), userController.updateUser.bind(userController));
app.delete('/users/:id', jwtAuth, roleCheck([UserRoles.Admin]), userController.deleteUser.bind(userController));
app.post('/login', userController.loginUser.bind(userController));

const PORT = 3000;
app.listen(PORT, () => {
   console.log('Server runs on port 3000.')
});