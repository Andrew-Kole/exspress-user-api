export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    PRECONDITION_FAILED = 412,
    INTERNAL_SERVER_ERROR = 500,
}

export enum HttpMessage {
    NOT_FOUND = 'User not found',
    FORBIDDEN = 'You have no right for this action',
    PRECONDITION_FAILED = 'Precondition failed',
    UNAUTHORIZED = 'You have to authorize.',
}