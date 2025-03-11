import { GameObject } from '../core/GameObject';
import { AssetLoader } from '../core/AssetLoader';
import { 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT, 
    PLAYER_WIDTH, 
    PLAYER_HEIGHT, 
    PLAYER_SPEED,
    PLAYER_COLOR,
    DEBUG_MODE,
    DEBUG_COLORS,
    TRUCK_WIDTH,
    TRUCK_HEIGHT,
    TRAILER_WIDTH,
    TRAILER_HEIGHT,
    TRAILER_GAP
} from '../utils/constants';

export class Player extends GameObject {
    private speed: number;
    private currentNumber: number;
    private moving: { left: boolean; right: boolean };

    constructor() {
        const x = (CANVAS_WIDTH - PLAYER_WIDTH) / 2;
        const y = CANVAS_HEIGHT - PLAYER_HEIGHT - 20;
        super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR);
        
        this.speed = PLAYER_SPEED;
        this.currentNumber = 2;
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
            // Рисуем машину, выравнивая её по левому краю хитбокса
            ctx.drawImage(truckImage, this.x, this.y, TRUCK_WIDTH, TRUCK_HEIGHT);
            
            // Центрируем прицеп относительно машины
            const trailerX = this.x + (TRUCK_WIDTH - TRAILER_WIDTH) / 2;
            const trailerY = this.y + TRUCK_HEIGHT + TRAILER_GAP;
            
            // Рисуем прицеп
            ctx.drawImage(trailerImage, trailerX, trailerY, TRAILER_WIDTH, TRAILER_HEIGHT);
            
            // Рисуем число в прицепе
            ctx.fillStyle = 'white';
            ctx.font = '16px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this.currentNumber.toString(),
                trailerX + TRAILER_WIDTH / 2,
                trailerY + TRAILER_HEIGHT / 2
            );

            // Отрисовка хитбоксов в отладочном режиме
            if (DEBUG_MODE) {
                // Хитбокс всего объекта
                this.drawHitbox(ctx, DEBUG_COLORS.PLAYER_HITBOX);
                
                // Хитбокс машины
                ctx.save();
                ctx.strokeStyle = DEBUG_COLORS.HITBOX;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(this.x, this.y, TRUCK_WIDTH, TRUCK_HEIGHT);
                ctx.restore();
                
                // Хитбокс прицепа
                ctx.save();
                ctx.strokeStyle = DEBUG_COLORS.TRAILER_HITBOX;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(trailerX, trailerY, TRAILER_WIDTH, TRAILER_HEIGHT);
                ctx.restore();
            }
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