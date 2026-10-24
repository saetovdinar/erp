// Типы для css-modules: webpack (css-loader) подставляет объект локальных классов.
declare module '*.module.css' {
    const classes: Record<string, string>;

    export default classes;
}
