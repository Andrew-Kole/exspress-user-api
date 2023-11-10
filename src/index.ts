import express from 'express';
import bodyParser from "body-parser";
import {UserController} from "./presentation/controllers/user.controller";
import {UserService} from "./domain/services/user.service";
import {UserRepository} from "./infrastructure/persistance/user.repository";
import {jwtAuth} from "./presentation/middleware/auth.middleware";
import {rolesMiddleware} from "./presentation/middleware/roles.middleware";
import {UserRoles} from "./domain/models/roles.enum";
import {VotesRepository} from "./infrastructure/persistance/votes.repository";
import {VotesService} from "./domain/services/votes.service";
import {VotesController} from "./presentation/controllers/votes.controller";
import { checkOwnership} from "./presentation/middleware/service/vote.ownership.middleware";
import {validateVoteValueMiddleware} from "./presentation/middleware/validation/votevalue.middleware";

const app = express();
app.use(bodyParser.json());

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const voteRepository = new VotesRepository();
const voteService = new VotesService(voteRepository, userRepository);
const voteController = new VotesController(voteService);

app.post('/users', userController.createUser.bind(userController));
app.get('/users/:id', userController.getUserById.bind(userController));
app.put('/users/:id', jwtAuth, rolesMiddleware([UserRoles.Moderator, UserRoles.Admin]), userController.updateUser.bind(userController));
app.delete('/users/:id', jwtAuth, rolesMiddleware([UserRoles.Admin]), userController.deleteUser.bind(userController));
app.post('/login', userController.loginUser.bind(userController));
app.post('/users/:id/vote', jwtAuth, validateVoteValueMiddleware, voteController.createVote.bind(voteController));
app.put('/vote/:vote_id', jwtAuth,validateVoteValueMiddleware, checkOwnership, voteController.updateVote.bind(voteController));
app.delete('/vote/:vote_id', jwtAuth, checkOwnership, voteController.deleteVote.bind(voteController));
app.get('/vote/:vote_id', voteController.getVoteById.bind(voteController))

const PORT = 3000;
app.listen(PORT, () => {
   console.log('Server runs on port 3000.')
});