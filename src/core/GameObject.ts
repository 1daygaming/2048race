import { DEBUG_MODE, DEBUG_COLORS } from '../utils/constants';

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
        // Рисуем основной объект
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Отрисовка хитбокса в отладочном режиме
        if (DEBUG_MODE) {
            this.drawHitbox(ctx);
        }
    }

    protected drawHitbox(ctx: CanvasRenderingContext2D, color: string = DEBUG_COLORS.HITBOX): void {
        // Сохраняем текущие настройки контекста
        ctx.save();
        
        // Настраиваем стиль для хитбокса
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Пунктирная линия
        
        // Рисуем прямоугольник хитбокса
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Восстанавливаем настройки контекста
        ctx.restore();
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