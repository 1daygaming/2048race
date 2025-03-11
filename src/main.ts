import { Game } from './core/Game'
import { AssetLoader } from './core/AssetLoader';

// Получаем элементы DOM
const startScreen = document.getElementById('startScreen') as HTMLDivElement;
const startButton = document.getElementById('startButton') as HTMLButtonElement;
const rulesButton = document.getElementById('rulesButton') as HTMLButtonElement;
const rulesModal = document.getElementById('rulesModal') as HTMLDivElement;
const closeRules = document.getElementById('closeRules') as HTMLButtonElement;
const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const startScreenBackground = document.getElementById('startScreenBackground') as HTMLImageElement;

// Инициализируем игру
const game = new Game('gameCanvas');

// Устанавливаем фоновое изображение после загрузки
AssetLoader.waitForLoad().then(() => {
    const backgroundImage = AssetLoader.getImage('background');
    if (backgroundImage) {
        startScreenBackground.src = backgroundImage.src;
    }
});

// Обработчики событий для кнопок
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameCanvas.style.display = 'block';
    game.start();
});

rulesButton.addEventListener('click', () => {
    rulesModal.style.display = 'flex';
});

closeRules.addEventListener('click', () => {
    rulesModal.style.display = 'none';
});

// Скрываем канвас изначально
gameCanvas.style.display = 'none';
