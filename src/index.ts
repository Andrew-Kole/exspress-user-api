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
import { checkOwnership} from "./presentation/middleware/vote.ownership.middleware";
import {validate} from "./presentation/middleware/validation.middleware";
import {avatarUploadSchema, voteValueSchema} from "./application/validators/schemas/validation.schemas";
import {AvatarService} from "./domain/services/avatar.service";
import {AvatarRepository} from "./infrastructure/persistance/avatar.repository";
import {AvatarController} from "./presentation/controllers/avatar.controller";
import multer from "multer";
import {AwsAvatarService} from "./infrastructure/services/aws/aws.avatar.service";

const app = express();
app.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({storage: storage})

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const voteRepository = new VotesRepository();
const voteService = new VotesService(voteRepository, userRepository);
const voteController = new VotesController(voteService);
const avatarRepository = new AvatarRepository();
const awsAvatarService = new AwsAvatarService();
const avatarService = new AvatarService(avatarRepository, awsAvatarService);
const avatarController = new AvatarController(avatarService);


app.post('/users', userController.createUser.bind(userController));
app.get('/users/:id', userController.getUserById.bind(userController));
app.put('/users/:id', jwtAuth, rolesMiddleware([UserRoles.Moderator, UserRoles.Admin]), userController.updateUser.bind(userController));
app.delete('/users/:id', jwtAuth, rolesMiddleware([UserRoles.Admin]), userController.deleteUser.bind(userController));
app.post('/login', userController.loginUser.bind(userController));
app.post('/users/:id/vote', jwtAuth, validate(voteValueSchema), voteController.createVote.bind(voteController));
app.put('/vote/:vote_id', jwtAuth,validate(voteValueSchema), checkOwnership, voteController.updateVote.bind(voteController));
app.delete('/vote/:vote_id', jwtAuth, checkOwnership, voteController.deleteVote.bind(voteController));
app.get('/vote/:vote_id', voteController.getVoteById.bind(voteController))
app.post('/users/:id/avatar', upload.single('file'), validate(avatarUploadSchema), avatarController.uploadAvatar.bind(avatarController));
app.get('/avatar/:avatar_id', avatarController.getAvatarById.bind(avatarController));

const PORT = 3000;
app.listen(PORT, () => {
   console.log('Server runs on port 3000.')
});