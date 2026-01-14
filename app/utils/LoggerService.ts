import AsyncStorage from '@react-native-async-storage/async-storage';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  OFF = 4,
}

export type LoggerOptions = {
  level?: LogLevel;
  enableConsole?: boolean;
  persist?: boolean;
  persistKey?: string;
  maxPersisted?: number;
};

const DEFAULT_OPTIONS: LoggerOptions = {
  level: LogLevel.DEBUG,
  enableConsole: true,
  persist: false,
  persistKey: '@cyclesync:logs',
  maxPersisted: 1000,
};

function nowIso() {
  return new Date().toISOString();
}

function formatEntry(level: string, message: any, meta?: any) {
  const ts = nowIso();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `${ts} | ${level} | ${message}${metaStr}`;
}

class LoggerService {
  private opts: LoggerOptions;

  constructor(opts?: LoggerOptions) {
    this.opts = { ...DEFAULT_OPTIONS, ...(opts || {}) };
  }

  init(opts: LoggerOptions) {
    this.opts = { ...this.opts, ...opts };
  }

  private async persist(entry: string) {
    if (!this.opts.persist) return;
    try {
      const key = this.opts.persistKey || DEFAULT_OPTIONS.persistKey!;
      const raw = await AsyncStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(entry);
      const max = this.opts.maxPersisted ?? DEFAULT_OPTIONS.maxPersisted!;
      if (arr.length > max) arr.splice(0, arr.length - max);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
    } catch (err) {
      // don't crash the app for logging failures
      if (this.opts.enableConsole) console.warn('Logger persist failed', err);
    }
  }

  private shouldLog(level: LogLevel) {
    return (this.opts.level ?? LogLevel.DEBUG) <= level;
  }

  debug(message: any, meta?: any) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = formatEntry('DEBUG', message, meta);
    if (this.opts.enableConsole) console.debug(entry);
    void this.persist(entry);
  }

  info(message: any, meta?: any) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = formatEntry('INFO', message, meta);
    if (this.opts.enableConsole) console.info(entry);
    void this.persist(entry);
  }

  warn(message: any, meta?: any) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = formatEntry('WARN', message, meta);
    if (this.opts.enableConsole) console.warn(entry);
    void this.persist(entry);
  }

  error(message: any, meta?: any) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = formatEntry('ERROR', message, meta);
    if (this.opts.enableConsole) console.error(entry);
    void this.persist(entry);
  }

  async getPersisted(): Promise<string[]> {
    if (!this.opts.persist) return [];
    try {
      const raw = await AsyncStorage.getItem(this.opts.persistKey || DEFAULT_OPTIONS.persistKey!);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      if (this.opts.enableConsole) console.warn('Logger getPersisted failed', err);
      return [];
    }
  }

  async clearPersisted(): Promise<void> {
    if (!this.opts.persist) return;
    try {
      await AsyncStorage.removeItem(this.opts.persistKey || DEFAULT_OPTIONS.persistKey!);
    } catch (err) {
      if (this.opts.enableConsole) console.warn('Logger clearPersisted failed', err);
    }
  }
}

const loggerService = new LoggerService();
export default loggerService;
