function caesarCipher(str: string, key: number): string {
    key = key % 26; // Ensure key is within the range 0-25
    let result = '';

    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char.match(/[a-z]/i)) {
            let code = str.charCodeAt(i);
            if (code >= 65 && code <= 90) { // Uppercase letters
                char = String.fromCharCode(((code - 65 + key) % 26) + 65);
            } else if (code >= 97 && code <= 122) { // Lowercase letters
                char = String.fromCharCode(((code - 97 + key) % 26) + 97);
            }
        }
        result += char;
    }
    return result;
}

function caesarDecrypt(str: string, key: number): string {
    // To decrypt with the same key, we need to shift in the opposite direction (subtract key)
    key = (26 - key) % 26; // Ensure key is within the range 0-25
    return caesarCipher(str, key); // Reuse the caesarCipher function to perform decryption
}

// Example usage
export  {caesarDecrypt};
export default caesarCipher;