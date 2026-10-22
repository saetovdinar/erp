const stamp = () => new Date().toISOString();

export const logger = {
    // no-console разрешает только error/warn — обычные логи пишем в stdout напрямую
    info: (...args: unknown[]) => {
        process.stdout.write(`${stamp()} ${args.map(String).join(' ')}\n`);
    },
    warn: (...args: unknown[]) => console.warn(stamp(), ...args),
    error: (...args: unknown[]) => console.error(stamp(), ...args)
};
