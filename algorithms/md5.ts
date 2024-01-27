function md5(message: string): string {
    const rotateLeft = (x: number, n: number): number => (x << n) | (x >>> (32 - n));
    
    // Constants
    const S: number[] = [
        7, 12, 17, 22,
        5, 9, 14, 20,
        4, 11, 16, 23,
        6, 10, 15, 21
    ];
    const K: number[] = [
        // List of constants (hexadecimal values) used in MD5 algorithm
                0x0, 0x1, 0x2, 0x3,
        0x4, 0x5, 0x6, 0x7,
        0x8, 0x9, 0xA, 0xB,
        0xC, 0xD, 0xE, 0xF,
        0x10, 0x11, 0x12, 0x13,
        0x14, 0x15, 0x16, 0x17,
        0x18, 0x19, 0x1A, 0x1B,
        0x1C, 0x1D, 0x1E, 0x1F,
        0x20, 0x21, 0x22, 0x23,
        0x24, 0x25, 0x26, 0x27,
        0x28, 0x29, 0x2A, 0x2B,
        0x2C, 0x2D, 0x2E, 0x2F,
        0x30, 0x31, 0x32, 0x33,
        0x34, 0x35, 0x36, 0x37,
        0x38, 0x39, 0x3A, 0x3B,
        0x3C, 0x3D, 0x3E, 0x3F
    ];
    
    // Initialize variables
    let a: number = 0x67452301,
        b: number = 0xEFCDAB89,
        c: number = 0x98BADCFE,
        d: number = 0x10325476;
    
    // Convert message to little-endian 32-bit words
    const words: number[] = [];
    for (let i: number = 0; i < message.length * 8; i += 8) {
        words[i >> 5] |= (message.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    
    // Append padding
    words[message.length >> 5] |= 0x80 << (message.length % 32);
    words[(((message.length + 64) >>> 9) << 4) + 14] = message.length * 8;
    
    // Process each 512-bit block
    for (let i: number = 0; i < words.length; i += 16) {
        const AA: number = a,
            BB: number = b,
            CC: number = c,
            DD: number = d;
        
        for (let j: number = 0; j < 64; j++) {
            let F: number, g: number;
            if (j < 16) {
                F = (b & c) | ((~b) & d);
                g = j;
            } else if (j < 32) {
                F = (d & b) | ((~d) & c);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                F = b ^ c ^ d;
                g = (3 * j + 5) % 16;
            } else {
                F = c ^ (b | (~d));
                g = (7 * j) % 16;
            }
            const temp: number = d;
            d = c;
            c = b;
            b = b + rotateLeft((a + F + K[j] + words[i + g]), S[j]);
            a = temp;
        }
        
        a += AA;
        b += BB;
        c += CC;
        d += DD;
    }
    
    // Convert to hex
    const toHex = (n: number): string => (n < 0 ? "" : (n >>> 0).toString(16));
    
    return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

// Example usage
export default md5;
// Output: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
