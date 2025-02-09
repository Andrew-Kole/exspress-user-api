import {Request, Response} from "express";
import {AwsAvatarService} from "../../infrastructure/services/aws/aws.avatar.service";
import {AvatarService} from "../../domain/services/avatar.service";
import {HttpMessage, HttpOperationEnums, RequestHeaders} from "../../application/enums/http.operation.enums";


export class AvatarController {
    private awsAvatarService: AwsAvatarService;
    constructor(private avatarService: AvatarService) {
        this.awsAvatarService = new AwsAvatarService();
    }
    async uploadAvatar(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);
        try {
            //@ts-ignore
            const key = await this.avatarService.uploadAvatar(userId, req.file);
            res.status(HttpOperationEnums.CREATED).json(key);
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpOperationEnums.INTERNAL_SERVER_ERROR).json({error: error.message, data: req.file});
        }
    }

    async getAvatarById(req: Request, res: Response) {
        const avatarId = parseInt(req.params.avatar_id, 10);
        try {
            const key = await this.avatarService.getAvatarById(avatarId);
            if (!key) {
                return res.status(HttpOperationEnums.NOT_FOUND).json(HttpMessage.NOT_FOUND);
            }
            const imageData = await this.awsAvatarService.getAvatar(key);

            if (!imageData) {
                return res.status(HttpOperationEnums.NOT_FOUND).json(HttpMessage.NOT_FOUND);
            }

            res.setHeader(RequestHeaders.ContentType, 'image/jpeg');
            res.send(imageData);
        }
        catch (error) {
            res.status(HttpOperationEnums.INTERNAL_SERVER_ERROR).json(HttpMessage.NOT_FOUND);
        }
    }
}