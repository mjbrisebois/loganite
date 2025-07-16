export enum LogLevel {
    FATAL = 0,
    ERROR = 1,
    WARN = 2,
    NORMAL = 3,
    INFO = 4,
    DEBUG = 5,
    TRACE = 6,
}

const TERMINAL_COLOR_RESET = '\x1b[0m';
const LEVEL_TERMINAL = {
    fatal: '\x1b[91;1m',
    error: '\x1b[31m',
    warn: '\x1b[33;1m',
    normal: '\x1b[35;1m',
    info: '\x1b[36;1m',
    debug: '\x1b[1m',
    trace: '\x1b[2;1m',

    fatal_message: '\x1b[91;1m',
    error_message: '\x1b[31m',
    warn_message: '\x1b[22;33m',
    normal_message: '\x1b[37m',
    info_message: TERMINAL_COLOR_RESET,
    debug_message: TERMINAL_COLOR_RESET,
    trace_message: '\x1b[0;2m',
};

export const isBrowser = typeof window !== 'undefined';

function getLocalSetting(key: string): string | null {
    if (isBrowser && window.localStorage) {
        return window.localStorage.getItem(key);
    } else if (typeof process !== 'undefined' && process.env[key]) {
        return process.env[key];
    }
    return null;
}

function getColorSetting(): boolean | null {
    const colorSetting = getLocalSetting('LOG_COLOR');
    if (colorSetting === null) return null;

    return ['true', '1', 'yes', 'on'].includes(colorSetting.toLowerCase().trim());
}

function getLevelOverride(key: string): number | null {
    const levelOverride = getLocalSetting(key);
    if (levelOverride === null) return null;

    const level = LogLevel[levelOverride.toUpperCase() as keyof typeof LogLevel];
    if (level === undefined) throw new Error(`Invalid log level override: ${levelOverride}`);

    return level;
}

let $console: Console = console;

export class Logger {
    public logLevel: LogLevel = LogLevel.NORMAL;
    public name: string;
    public color: boolean;
    public truncateNameLength: number = 30;

    constructor(name: string = 'default', level?: LogLevel | string | number) {
        this.name = name;
        this.color = true;

        if (level) this.setLevel(level);
    }

    public setLevel(level: LogLevel | string | number): this {
        if (typeof level === 'string') {
            this.logLevel = LogLevel[level.toUpperCase() as keyof typeof LogLevel];
        } else if (typeof level === 'number') {
            this.logLevel = level as LogLevel;
        } else {
            this.logLevel = level;
        }
        return this;
    }

    public setLogLevel(level: LogLevel): void {
        if (this.getLogLevelOverride())
            throw new Error(
                `Cannot set log level for ${this.name} as it is overridden by environment variable`
            );
        this.logLevel = level;
    }

    public getLogLevel(): LogLevel {
        return this.getLogLevelOverride() || this.logLevel;
    }

    public getLogLevelOverride(): LogLevel | null {
        return getLevelOverride(`LOG_LEVEL.${this.name}`) || getLevelOverride('LOG_LEVEL');
    }

    public getColorSetting(): boolean {
        return getColorSetting() ?? this.color;
    }

    // Adding getter for level rank as expected by tests
    public get level_rank(): number {
        return this.logLevel;
    }

    // Adding getter for level name as expected by tests
    public get level_name(): string {
        return LogLevel[this.logLevel].toLowerCase();
    }

    // Legacy support
    public get level(): number {
        return this.logLevel;
    }

    private log(level: keyof typeof LogLevel, message: string, ...args: any[]): boolean {
        const levelOverride = this.getLogLevelOverride();

        if (LogLevel[level] > (levelOverride || this.logLevel)) return false;

        const colorSetting = this.getColorSetting();
        if (!colorSetting) {
            $console.log(message, args);
            return true;
        }

        const timestamp = new Date().toISOString();
        const name = (this.name + ' '.repeat(this.truncateNameLength)).substring(0, this.truncateNameLength);

        if (isBrowser) {
            $console.log(`${timestamp} [ ${name} ] ${level}: ${message}`, ...args);
        } else {
            $console.log(
                `${timestamp} [ \x1b[35m${name}\x1b[0m ] %s${level}\x1b[0m: %s${message}\x1b[0m`,
                LEVEL_TERMINAL[level.toLowerCase() as keyof typeof LEVEL_TERMINAL],
                LEVEL_TERMINAL[
                    (level.toLowerCase() + '_message') as keyof typeof LEVEL_TERMINAL
                ],
                ...args
            );
        }

        return true;
    }

    public fatal(message: string, ...args: any[]): boolean {
        return this.log('FATAL', message, ...args);
    }

    public error(message: string, ...args: any[]): boolean {
        return this.log('ERROR', message, ...args);
    }

    public warn(message: string, ...args: any[]): boolean {
        return this.log('WARN', message, ...args);
    }

    public normal(message: string, ...args: any[]): boolean {
        return this.log('NORMAL', message, ...args);
    }

    public info(message: string, ...args: any[]): boolean {
        return this.log('INFO', message, ...args);
    }

    public debug(message: string, ...args: any[]): boolean {
        return this.log('DEBUG', message, ...args);
    }

    public trace(message: string, ...args: any[]): boolean {
        return this.log('TRACE', message, ...args);
    }
}

export default Logger;

export function overrideConsole(console: Console) {
    $console = console;
}
