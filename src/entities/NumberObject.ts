import { GameObject } from '../core/GameObject';
import { AssetLoader } from '../core/AssetLoader';
import { NUMBER_SIZE, NUMBER_COLOR, INITIAL_GAME_SPEED } from '../utils/constants';

export class NumberObject extends GameObject {
    private value: number;
    private speed: number;

    constructor(x: number, y: number, value: number) {
        super(x, y, NUMBER_SIZE, NUMBER_SIZE, NUMBER_COLOR);
        this.value = value;
        this.speed = INITIAL_GAME_SPEED;
    }

    public update(deltaTime: number): void {
        this.y += this.speed * deltaTime;
    }

    public override draw(ctx: CanvasRenderingContext2D): void {
        const numberImage = AssetLoader.getImage('number');
        
        if (numberImage) {
            ctx.drawImage(numberImage, this.x, this.y, this.width, this.height);
            
            // Рисуем число
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this.value.toString(),
                this.x + this.width / 2,
                this.y + this.height / 2
            );
        } else {
            // Fallback к простым фигурам
            super.draw(ctx);
        }
    }

    public getValue(): number {
        return this.value;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }
} 