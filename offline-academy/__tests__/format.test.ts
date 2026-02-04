import { formatBytes } from '@/lib/format';

describe('formatBytes Utility', () => {
    it('returns "0 Bytes" for 0', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('formats KB correctly', () => {
        expect(formatBytes(1024)).toBe('1 KB');
    });

    it('formats MB correctly', () => {
        expect(formatBytes(1024 * 1024)).toBe('1 MB');
    });

    it('handles decimals', () => {
        expect(formatBytes(1536)).toBe('1.5 KB');
    });
});
