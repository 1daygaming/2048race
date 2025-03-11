import { Player } from '../entities/Player';
import { NumberObject } from '../entities/NumberObject';
import { Obstacle } from '../entities/Obstacle';
import { AssetLoader } from './AssetLoader';

// Импорт SVG ассетов
import truckSvg from '../assets/svg/truck.svg';
import trailerSvg from '../assets/svg/trailer.svg';
import numberSvg from '../assets/svg/number.svg';
import potholeSvg from '../assets/svg/pothole.svg';
import barrierSvg from '../assets/svg/barrier.svg';
import brokenCarSvg from '../assets/svg/broken-car.svg';
import backgroundPng from '../assets/background.png';

import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    NUMBER_SIZE,
    INITIAL_GAME_SPEED,
    NUMBER_SPAWN_INTERVAL,
    OBSTACLE_SPAWN_INTERVAL,
    SPEED_MULTIPLIER_PER_DOUBLE
} from '../utils/constants';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private gameObjects: (NumberObject | Obstacle)[];
    private lastTime: number;
    private gameSpeed: number;
    private score: number;
    private maxNumber: number; // Максимальное достигнутое число
    private numberSpawnTime: number;
    private obstacleSpawnTime: number;
    private isGameOver: boolean;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        
        // Загружаем ассеты
        this.loadAssets();
        
        this.player = new Player();
        this.gameObjects = [];
        this.lastTime = 0;
        this.gameSpeed = INITIAL_GAME_SPEED;
        this.score = 0;
        this.maxNumber = 2; // Начальное максимальное число
        this.numberSpawnTime = 0;
        this.obstacleSpawnTime = 0;
        this.isGameOver = false;

        this.gameLoop = this.gameLoop.bind(this);
    }

    private loadAssets(): void {
        AssetLoader.loadImage('truck', truckSvg);
        AssetLoader.loadImage('trailer', trailerSvg);
        AssetLoader.loadImage('number', numberSvg);
        AssetLoader.loadImage('pothole', potholeSvg);
        AssetLoader.loadImage('barrier', barrierSvg);
        AssetLoader.loadImage('broken-car', brokenCarSvg);
        AssetLoader.loadImage('background', backgroundPng);
    }

    public async start(): Promise<void> {
        // Ждем загрузки всех ассетов
        await AssetLoader.waitForLoad();
        
        this.isGameOver = false;
        this.score = 2;
        this.maxNumber = 2;
        this.gameSpeed = INITIAL_GAME_SPEED;
        this.gameObjects = [];
        this.player = new Player();
        requestAnimationFrame(this.gameLoop);
    }

    private gameLoop(timestamp: number): void {
        if (this.isGameOver) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop);
    }

    private getCurrentGameSpeed(): number {
        const playerNumber = this.player.getCurrentNumber();
        // Вычисляем, сколько раз число удвоилось от начального значения 2
        const doublings = Math.log2(playerNumber) - 1;
        // Увеличиваем скорость на 15% за каждое удвоение
        return INITIAL_GAME_SPEED * Math.pow(SPEED_MULTIPLIER_PER_DOUBLE, doublings);
    }

    private update(deltaTime: number): void {
        // Update player
        this.player.update(deltaTime);

        // Обновляем текущую скорость игры
        this.gameSpeed = this.getCurrentGameSpeed();

        // Update game objects
        this.gameObjects = this.gameObjects.filter(obj => {
            obj.setSpeed(this.gameSpeed); // Обновляем скорость каждого объекта
            obj.update(deltaTime);
            return obj.getPosition().y <= CANVAS_HEIGHT;
        });

        // Check collisions
        this.checkCollisions();

        // Spawn new objects
        this.numberSpawnTime += deltaTime * 1000;
        this.obstacleSpawnTime += deltaTime * 1000;

        if (this.numberSpawnTime >= NUMBER_SPAWN_INTERVAL) {
            this.spawnNumber();
            this.numberSpawnTime = 0;
        }

        if (this.obstacleSpawnTime >= OBSTACLE_SPAWN_INTERVAL) {
            this.spawnObstacle();
            this.obstacleSpawnTime = 0;
        }
    }

    private draw(): void {
        // Очищаем канвас и рисуем тёмный фон
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Рисуем пиксельную сетку
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < CANVAS_WIDTH; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, CANVAS_HEIGHT);
            this.ctx.stroke();
        }

        // Рисуем игровые объекты
        this.gameObjects.forEach(obj => obj.draw(this.ctx));
        this.player.draw(this.ctx);

        // Рисуем неоновый счёт и максимальное число
        this.ctx.font = 'bold 24px "Press Start 2P", monospace';
        this.ctx.textAlign = 'left';
        
        // Неоновый эффект для текста
        this.ctx.shadowColor = '#00ff00';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`MAX: ${this.score}`, 10, 30);
        
        // Сбрасываем эффекты тени
        this.ctx.shadowBlur = 0;
    }

    private checkCollisions(): void {
        this.gameObjects.forEach(obj => {
            if (this.player.collidesWith(obj)) {
                if (obj instanceof NumberObject) {
                    this.handleNumberCollision(obj);
                } else if (obj instanceof Obstacle) {
                    this.handleObstacleCollision();
                }
                // Remove collided object
                this.gameObjects = this.gameObjects.filter(o => o !== obj);
            }
        });
    }

    private handleNumberCollision(numberObj: NumberObject): void {
        const playerNumber = this.player.getCurrentNumber();
        const collidedNumber = numberObj.getValue();

        if (playerNumber === collidedNumber) {
            // Correct number collected - double the player's number
            const newNumber = playerNumber * 2;
            this.player.updateNumber(newNumber);
            
            // Обновляем максимальное число и счет
            if (newNumber > this.maxNumber) {
                this.maxNumber = newNumber;
                this.score = this.maxNumber;
            }
        } else {
            // Wrong number collected - divide by 4
            this.player.updateNumber(Math.max(2, Math.floor(playerNumber / 4)));
        }
    }

    private handleObstacleCollision(): void {
        const playerNumber = this.player.getCurrentNumber();
        // Divide by 8 when hitting obstacle
        this.player.updateNumber(Math.max(2, Math.floor(playerNumber / 8)));
    }

    private spawnNumber(): void {
        const playerNumber = this.player.getCurrentNumber();
        const possibleNumbers = [
            playerNumber / 2,
            playerNumber,
            playerNumber * 2
        ].filter(n => n >= 2);

        const value = possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
        const x = Math.random() * (CANVAS_WIDTH - NUMBER_SIZE);
        const numberObj = new NumberObject(x, -NUMBER_SIZE, value);
        numberObj.setSpeed(this.gameSpeed);
        this.gameObjects.push(numberObj);
    }

    private spawnObstacle(): void {
        // Случайное количество препятствий (1-3)
        const obstacleCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < obstacleCount; i++) {
            // Добавляем случайное смещение по X для каждого препятствия
            const xOffset = Math.random() * 100 - 50; // случайное смещение от -50 до 50
            const x = Math.min(Math.max(
                Math.random() * (CANVAS_WIDTH - NUMBER_SIZE) + xOffset,
                0
            ), CANVAS_WIDTH - NUMBER_SIZE);
            
            const obstacle = new Obstacle(x, -NUMBER_SIZE - (i * 20)); // Разные начальные позиции по Y
            obstacle.setSpeed(this.gameSpeed);
            this.gameObjects.push(obstacle);
        }
    }
} 