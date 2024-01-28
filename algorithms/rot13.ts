function rot13(message : string){
        return message.replace(/[a-zA-Z]/g, function(char) {
        const offset = char <= 'Z' ? 65 : 97; // Check if uppercase or lowercase
        return String.fromCharCode((char.charCodeAt(0) - offset + 13) % 26 + offset);
    });
}

function drot13(message : string){
    return rot13(message);
}

export {rot13 , drot13};
