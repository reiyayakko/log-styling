
type LogNode = string | LogElement | LogNode[];

export class LogElement {
    constructor(readonly msg: string, readonly sub: unknown) {}
    static fitLogElements(logNode: LogNode): LogElement[] {
        return Array.isArray(logNode)
            ? logNode.flatMap(LogElement.fitLogElements)
            : [logNode instanceof LogElement
                ? logNode
                : string(logNode)
            ];
    }
    static toLog(logNode: LogNode): LogArgs {
        const elements = LogElement.fitLogElements(logNode);
        return [
            elements.reduce((accum, logEl) => accum + logEl.msg, ""),
            ...elements.map(logEl => logEl.sub)
        ];
    }
}

/**
 * Outputs a string.
 */
export const string = (string: string) => new LogElement("%s", string);

/**
 * Outputs a floating point number.
 */
export const float = (float: number, digit = 0) => new LogElement(`%.${digit | 0}f`, float);

/**
 * Outputs an integer.
 */
export const int = (int: number, digit = 0) => new LogElement(`%.${digit | 0}i`, int);

/**
 * Output the log using `optimally useful formatting`.
 */
export const object = (object: unknown) => new LogElement("%o", object);

/**
 * Output the log using `generic JavaScript object formatting`.
 */
export const generic = (object: unknown) => new LogElement("%O", object);

/**
 * Applies the style to the letters output to the console.
 * Styles previously applied in `style` will be invalid.
 * @see https://developer.mozilla.org/docs/Web/API/console#styling_console_output
 */
export const style = (css: string) => new LogElement("%c", css);

/**
 * Resets the style specified in {@link style}.
 */
export const resetStyle = style("");

/**
 * Apply the style to the inner log.
 */
export const styled = (css: string, logNode: LogNode): LogElement[] => {
    return [
        style(css),
        ...LogElement.fitLogElements(logNode).map(logEl =>
            logEl.msg === "%c" ? style(css + ";" + logEl.sub) : logEl
        ),
        resetStyle,
    ];
};

type LogArgs = [string, ...unknown[]];

export const log = (logfn: (...args: LogArgs) => void, logNode: LogNode): void => {
    logfn(...LogElement.toLog(logNode));
};
