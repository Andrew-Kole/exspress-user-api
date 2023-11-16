import {IAvatarRepository} from "../repositories/avatar.repository";

export class AvatarService {
    constructor(private avatarRepository: IAvatarRepository) {}

    async uploadAvatar(userId: number, key: string): Promise<void> {
        await this.avatarRepository.uploadAvatar(userId, key);
    }

    async getAvatarById(avatarId: number): Promise<string | null> {
        return await this.avatarRepository.getAvatarById(avatarId);
    }
}