/** Нарушение уникальности PostgreSQL (дубликат license_number, plate и т.п.). */
export function isUniqueViolation(err: unknown): boolean {
    return typeof err === 'object'
        && err !== null
        && (err as { code?: string; }).code === '23505';
}
