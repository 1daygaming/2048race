export abstract class GameObject {
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    protected color: string;

    constructor(x: number, y: number, width: number, height: number, color: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    public abstract update(deltaTime: number): void;

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public getBounds(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    public collidesWith(other: GameObject): boolean {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();

        return bounds.x < otherBounds.x + otherBounds.width &&
               bounds.x + bounds.width > otherBounds.x &&
               bounds.y < otherBounds.y + otherBounds.height &&
               bounds.y + bounds.height > otherBounds.y;
    }
} 