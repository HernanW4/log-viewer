// Same as server/types.ts (Because its the same style of data)
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

export function getLogLevels(): LogLevel[] {
  return Object.values(LogLevel);
}