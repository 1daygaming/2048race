import { Game } from './core/Game'


// Start the game when the page loads
window.addEventListener('load', async () => {
    const game = new Game('gameCanvas')
    try {
        await game.start()
    } catch (error) {
        console.error('Failed to start game:', error)
    }
})
