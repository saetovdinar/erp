// значения отсортированы по алфавиту — правило typescript-sort-keys/string-enum
export enum ErrorCode {
    Conflict = 'CONFLICT',
    Forbidden = 'FORBIDDEN',
    Internal = 'INTERNAL_ERROR',
    InvalidToken = 'INVALID_TOKEN',
    NotFound = 'NOT_FOUND',
    RateLimited = 'RATE_LIMITED',
    TokenExpired = 'TOKEN_EXPIRED',
    Unauthorized = 'UNAUTHORIZED',
    Validation = 'VALIDATION_ERROR'
}
