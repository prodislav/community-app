import { injectable } from 'inversify';

@injectable()
export class TimerService {
    public start(
        onInterval: (distance: number) => void,
        onComplete: () => void,
        ms: number,
        interval: number = 1000
    ): number {
        ms *= 60000;
        const countDownDate = new Date((new Date()).getTime() + ms).getTime();

        onInterval(ms);

        const newInterval: number = window.setInterval(
            () => {
                const now = new Date().getTime();

                const distance = countDownDate - now;

                onInterval(distance);

                if (distance < 0) {
                    clearInterval(newInterval);
                    onComplete();
                }
            },
            interval);

        return newInterval;
    }

    public end(timer: number): void {
        clearInterval(timer);
    }
}
