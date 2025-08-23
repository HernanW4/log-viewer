export enum LogLevel{
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export interface LogMessage{
    timestamp: string;
    level: LogLevel;
    message: string;
}