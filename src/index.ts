import express from 'express';
import bodyParser from "body-parser";
import {UserController} from "./interfaces/controllers/user.controller";
import {UserService} from "./domain/services/user.service";
import {UserRepositoryPostgres} from "./infrastructure/persistance/user.repository.postgres";
import {jwtAuth} from "./interfaces/middleware/auth.middleware";
import {roleCheck} from "./interfaces/middleware/validators/role.validator";
import {UserRoles} from "./domain/models/roles.enum";
import {VotesRepositoryPostgres} from "./infrastructure/persistance/votes.repository.postgres";
import {VotesService} from "./domain/services/votes.service";
import {VotesController} from "./interfaces/controllers/votes.controller";
import {checkOwnership, votesValidator} from "./interfaces/middleware/validators/votes.validator";

const app = express();
app.use(bodyParser.json());

const userRepository = new UserRepositoryPostgres();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const voteRepository = new VotesRepositoryPostgres();
const voteService = new VotesService(voteRepository, userRepository);
const voteController = new VotesController(voteService);

app.post('/users', userController.createUser.bind(userController));
app.get('/users/:id', userController.getUserById.bind(userController));
app.put('/users/:id', jwtAuth, roleCheck([UserRoles.Moderator, UserRoles.Admin]), userController.updateUser.bind(userController));
app.delete('/users/:id', jwtAuth, roleCheck([UserRoles.Admin]), userController.deleteUser.bind(userController));
app.post('/login', userController.loginUser.bind(userController));
app.post('/users/:id/vote', jwtAuth, votesValidator, voteController.createVote.bind(voteController));
app.put('/vote/:vote_id', jwtAuth, checkOwnership, votesValidator, voteController.updateVote.bind(voteController));
app.delete('/vote/:vote_id', jwtAuth, checkOwnership, voteController.deleteVote.bind(voteController));
app.get('/vote/:vote_id', voteController.getVoteById.bind(voteController))

const PORT = 3000;
app.listen(PORT, () => {
   console.log('Server runs on port 3000.')
});