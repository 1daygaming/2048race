import { GameObject } from '../core/GameObject';
import { AssetLoader } from '../core/AssetLoader';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, PLAYER_COLOR } from '../utils/constants';

export class Player extends GameObject {
    private speed: number;
    private currentNumber: number;
    private moving: { left: boolean; right: boolean };

    constructor() {
        const x = (CANVAS_WIDTH - PLAYER_WIDTH) / 2;
        const y = CANVAS_HEIGHT - PLAYER_HEIGHT - 20 - 45;
        super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR);
        
        this.speed = PLAYER_SPEED;
        this.currentNumber = 2; // Starting number
        this.moving = { left: false, right: false };
        
        this.setupControls();
    }

    private setupControls(): void {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') this.moving.left = true;
            if (e.key === 'ArrowRight') this.moving.right = true;
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') this.moving.left = false;
            if (e.key === 'ArrowRight') this.moving.right = false;
        });

        // Touch controls
        let touchStartX = 0;
        window.addEventListener('touchstart', (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
        });

        window.addEventListener('touchmove', (e: TouchEvent) => {
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            
            this.moving.left = diff < -10;
            this.moving.right = diff > 10;
            
            e.preventDefault();
        });

        window.addEventListener('touchend', () => {
            this.moving.left = false;
            this.moving.right = false;
        });
    }

    public update(deltaTime: number): void {
        if (this.moving.left) {
            this.x -= this.speed * deltaTime;
        }
        if (this.moving.right) {
            this.x += this.speed * deltaTime;
        }

        // Keep player within canvas bounds
        this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));
    }

    public override draw(ctx: CanvasRenderingContext2D): void {
        const truckImage = AssetLoader.getImage('truck');
        const trailerImage = AssetLoader.getImage('trailer');
        
        if (truckImage && trailerImage) {
            // Сначала рисуем машину
            ctx.drawImage(truckImage, this.x, this.y, this.width, this.height);
            
            // Размеры прицепа
            const trailerWidth = 30;
            const trailerHeight = 40;
            
            // Центрируем прицеп под машиной
            const trailerX = this.x + (this.width - trailerWidth) / 2;
            const trailerY = this.y + this.height + 5;
            
            // Рисуем прицеп
            ctx.drawImage(trailerImage, trailerX, trailerY, trailerWidth, trailerHeight);
            
            // Рисуем число в прицепе
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this.currentNumber.toString(),
                trailerX + trailerWidth / 2,
                trailerY + trailerHeight / 2
            );
        } else {
            // Fallback к простым фигурам, если изображения не загружены
            super.draw(ctx);
        }
    }

    public getCurrentNumber(): number {
        return this.currentNumber;
    }

    public updateNumber(newNumber: number): void {
        this.currentNumber = Math.max(2, newNumber);
    }
} 