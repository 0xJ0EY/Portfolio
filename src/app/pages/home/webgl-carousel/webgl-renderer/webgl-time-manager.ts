export class WebGLTimeManager {
    private currentTime = 0;
    private timeScale = 1;

    get time() {
        return this.currentTime;
    }

    public add(deltaTime: number): void {
        this.currentTime += deltaTime * this.timeScale;
    }

    public setTimeScale(timeScale: number): void {
        this.timeScale = timeScale;
    }
}
