// Canvas dimensions
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;

// Debug mode
export const DEBUG_MODE = true;
export const DEBUG_COLORS = {
    HITBOX: '#ff0000',
    PLAYER_HITBOX: '#00ff00',
    TRAILER_HITBOX: '#0000ff'
};

// Player constants
export const TRUCK_WIDTH = 40;
export const TRUCK_HEIGHT = 60;
export const TRAILER_WIDTH = 40;
export const TRAILER_HEIGHT = 30;
export const TRAILER_GAP = 5;

// Общая ширина хитбокса равна ширине машины, так как прицеп центрируется относительно неё
export const PLAYER_WIDTH = TRUCK_WIDTH;
export const PLAYER_HEIGHT = TRUCK_HEIGHT + TRAILER_GAP + TRAILER_HEIGHT;
export const PLAYER_SPEED = 300;
export const PLAYER_COLOR = '#3498db';

// Game object constants
export const NUMBER_SIZE = 40;
export const NUMBER_COLOR = '#2ecc71';
export const OBSTACLE_WIDTH = 60;
export const OBSTACLE_HEIGHT = 40;
export const OBSTACLE_COLOR = '#e74c3c';

// Game speed
export const INITIAL_GAME_SPEED = 200; // pixels per second
export const BASE_PLAYER_SPEED = 300; // базовая скорость игрока
export const SPEED_MULTIPLIER_PER_DOUBLE = 1.15; // увеличение скорости на 15% при удвоении

// Spawn rates
export const NUMBER_SPAWN_INTERVAL = 2000; // каждые 2 секунды
export const OBSTACLE_SPAWN_INTERVAL = 1500; // каждые 1.5 секунды 