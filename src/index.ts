
type LogArgs = [text: string, ...subs: unknown[]];

type LogStylingOrString = string | LogStyling;
type Loggable = LogStylingOrString | LogStylingOrString[];

export class LogStyling {
    protected constructor(protected msg: string, protected sub: unknown) {}
    private static _fit(stylingable: LogStylingOrString): LogStyling {
        return typeof stylingable === "string" ? LogStyling.string(stylingable) : stylingable
    }
    protected static fitLogStylingArray(loggable: Loggable): LogStyling[] {
        return Array.isArray(loggable)
            ? loggable.map(LogStyling._fit)
            : [LogStyling._fit(loggable)];
    }
    static string(string: string) {
        return new LogStyling("%s", string);
    }
    static float(float: number, digit = 0) {
        return new LogStyling(`%.${digit | 0}f`, float);
    }
    static int(int: number, digit = 0) {
        return new LogStyling(`%.${digit | 0}i`, int);
    }
    static object(object: unknown) {
        return new LogStyling("%o", object);
    }
    /**
     * Applies the style to the letters displayed on the console.
     * @param css The style to be applied.
     * @see https://developer.mozilla.org/docs/Web/API/console#styling_console_output
     */
    static style(css: string) {
        return new LogStyling("%c", css);
    }
    /**
     * Resets the style specified in `LogStyling.style`.
     * @see {@link LogStyling.style}
     */
    static readonly resetStyle = LogStyling.style("");
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
