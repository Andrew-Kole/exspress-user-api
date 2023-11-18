import {IAvatarRepository} from "../repositories/avatar.repository";
import {AwsAvatarService} from "../../infrastructure/services/aws/aws.avatar.service";
import axios from "axios";
import {UploadError} from "../../application/exceptions";

export class AvatarService {
    constructor(private avatarRepository: IAvatarRepository, private awsAvatarService: AwsAvatarService) {}

    async uploadAvatar(userId: number, file: Express.Multer.File): Promise<string> {
        try {
            const { mimetype, originalname, buffer} = file;
            const key = `avatars/${originalname}`;
            const presignedUrl = await this.awsAvatarService.generatePresignedUrl(key);
            await axios.put(presignedUrl, buffer, {
                headers: {
                    'Content-Type': mimetype,
                },
            });
            await this.avatarRepository.uploadAvatar(userId, key);
            return key;
        }
        catch (error) {
            throw new UploadError();
        }
    }

    async getAvatarById(avatarId: number): Promise<string | null> {
        return await this.avatarRepository.getAvatarById(avatarId);
    }
}