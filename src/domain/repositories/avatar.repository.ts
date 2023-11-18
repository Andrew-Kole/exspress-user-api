export interface IAvatarRepository {
    uploadAvatar(userId: number, key: string): Promise<void>;
    getAvatarById(avatarId: number): Promise<string | null>
}