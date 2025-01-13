declare module 'cron' {
    export class CronJob {
        constructor(cronTime: string, onTick: () => void, onComplete?: () => void)
        start(): void
        stop(): void
    }
}
