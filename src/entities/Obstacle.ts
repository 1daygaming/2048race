import { GameObject } from '../core/GameObject';
import { AssetLoader } from '../core/AssetLoader';
import { OBSTACLE_WIDTH, OBSTACLE_HEIGHT, OBSTACLE_COLOR, INITIAL_GAME_SPEED } from '../utils/constants';

export class Obstacle extends GameObject {
    private speed: number;
    private type: 'pothole' | 'barrier' | 'broken-car';

    constructor(x: number, y: number) {
        super(x, y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, OBSTACLE_COLOR);
        this.speed = INITIAL_GAME_SPEED;
        // Случайно выбираем тип препятствия
        const types: ('pothole' | 'barrier' | 'broken-car')[] = ['pothole', 'barrier', 'broken-car'];
        this.type = types[Math.floor(Math.random() * types.length)];
    }

    public override draw(ctx: CanvasRenderingContext2D): void {
        const obstacleImage = AssetLoader.getImage(this.type);
        
        if (obstacleImage) {
            ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback к простым фигурам
            super.draw(ctx);
        }
    }

    public update(deltaTime: number): void {
        this.y += this.speed * deltaTime;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }
} 