
type LogArgs = [string, ...unknown[]];

type LogStylingOrString = string | LogStyling;
type Loggable = LogStylingOrString | (LogStylingOrString | LogStylingOrString[])[];

const concat = <T>(accum: T[], val: T | ConcatArray<T>): T[] => accum.concat(val);

export class LogStyling {
    protected constructor(protected msg: string, protected sub: unknown) {}
    private static _fit(stylingable: LogStylingOrString): LogStyling {
        return stylingable instanceof LogStyling
            ? stylingable
            : LogStyling.string(stylingable)
    }
    protected static fitLogStylingArray(loggable: Loggable): LogStyling[] {
        return Array.isArray(loggable)
            ? loggable.reduce<LogStylingOrString[]>(concat, []).map(LogStyling._fit)
            : [LogStyling._fit(loggable)];
    }
    /**
     * Outputs a string.
     */
    static string(string: string) {
        return new LogStyling("%s", string);
    }
    /**
     * Outputs a floating point number.
     */
    static float(float: number, digit = 0) {
        return new LogStyling(`%.${digit | 0}f`, float);
    }
    /**
     * Outputs an integer.
     */
    static int(int: number, digit = 0) {
        return new LogStyling(`%.${digit | 0}i`, int);
    }
    /**
     * Output the log using `optimally useful formatting`.
     */
    static object(object: unknown) {
        return new LogStyling("%o", object);
    }
    /**
     * Output the log using `generic JavaScript object formatting`.
     */
    static generic(object: unknown) {
        return new LogStyling("%O", object);
    }
    /**
     * Applies the style to the letters output to the console.
     * Styles previously applied in `LogStyling.style` will be invalid.
     * @param css The style to be applied.
     * @see https://developer.mozilla.org/docs/Web/API/console#styling_console_output
     */
    static style(css: string) {
        return new LogStyling("%c", css);
    }
    /**
     * Resets the style specified in {@link LogStyling.style}.
     */
    static readonly resetStyle = LogStyling.style("");
    /**
     * Apply the style to the inner log.
     */
    static styled(css: string, loggable: Loggable): LogStyling[] {
        return [
            LogStyling.style(css),
            ...LogStyling.fitLogStylingArray(loggable).map(styling =>
                styling.msg === "%c" ? LogStyling.style(css + ";" + styling.sub) : styling
            ),
            LogStyling.resetStyle,
        ];
    }
    static toLog(loggable: Loggable): LogArgs {
        const stylings = LogStyling.fitLogStylingArray(loggable);
        return [
            stylings.reduce((accum, styling) => accum + styling.msg, ""),
            ...stylings.map(styling => styling.sub)
        ];
    }
    static log(logfn: (...subs: LogArgs) => void, loggable: Loggable): void {
        logfn(...LogStyling.toLog(loggable));
    }
}
