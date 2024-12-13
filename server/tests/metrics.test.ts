// server/tests/metrics.test.ts
import { calculateHealthScore, predictHarvestDate } from '../utils/metrics';

describe('Metrics Utils', () => {
    describe('calculateHealthScore', () => {
        it('should return 100 for optimal conditions', () => {
            const score = calculateHealthScore(23, 70, 90, 6.5);
            expect(score).toBe(100);
        });

        it('should return lower score for suboptimal conditions', () => {
            const score = calculateHealthScore(30, 50, 60, 7.0);
            expect(score).toBeLessThan(100);
        });
    });

    describe('predictHarvestDate', () => {
        it('should correctly predict harvest date based on growth rate', () => {
            const plantedDate = new Date('2024-01-01');
            const currentHeight = 10;
            const targetHeight = 20;
            const growthRate = 2; // 2cm per day

            const harvestDate = predictHarvestDate(
                plantedDate,
                currentHeight,
                targetHeight,
                growthRate
            );

            expect(harvestDate).toEqual(new Date('2024-01-06'));
        });
    });
});
