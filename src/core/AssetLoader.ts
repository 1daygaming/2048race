export class AssetLoader {
    private static images: Map<string, HTMLImageElement> = new Map();
    private static loadPromises: Promise<void>[] = [];

    public static loadImage(name: string, path: string): void {
        const img = new Image();
        const promise = new Promise<void>((resolve, reject) => {
            img.onload = () => {
                this.images.set(name, img);
                resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
        });
        img.src = path;
        this.loadPromises.push(promise);
    }

    public static getImage(name: string): HTMLImageElement | undefined {
        return this.images.get(name);
    }

    public static async waitForLoad(): Promise<void> {
        await Promise.all(this.loadPromises);
    }
} 