/**
 * Design of user
 * @export
 */
export interface IUserModel {
    id?: number;
    nickname: string;
    firstname: string;
    lastname: string;
    password: string;
    created_at?: Date;
    updated_at?:Date;
    deleted_at?:Date | null;
    is_deleted?:boolean;
}