import { isNullOrWhitespace } from "../src/utilities";

describe('Utilites', () => {
    it('string should return false', () => {
        const rs = isNullOrWhitespace('fred');
        expect(rs).toBeFalsy();
    });

    it('string should return true', () => {
        const rs = isNullOrWhitespace(' ');
        expect(rs).toBeTruthy();
    });

    it('string should return true', () => {
        const rs = isNullOrWhitespace('\t');
        expect(rs).toBeTruthy();
    });

    it('string should return true', () => {
        const rs = isNullOrWhitespace(undefined);
        expect(rs).toBeTruthy();
    });
    
    it('string should return true', () => {
        const rs = isNullOrWhitespace(null);
        expect(rs).toBeTruthy();
    });
});
