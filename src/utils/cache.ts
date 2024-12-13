export class Cache {
    private static instance: Cache;
    private cache: Map<string, { data: any; timestamp: number }>;
    private ttl: number;

    private constructor(ttl = 5 * 60 * 1000) { // 5 минут по умолчанию
        this.cache = new Map();
        this.ttl = ttl;
    }

    static getInstance(): Cache {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }

    set(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }
}
