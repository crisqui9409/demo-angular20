export function generateRandomNumber(min: number, max: number): number {
    // calculate the allowed range
    const range = max - min + 1;
    // genera un número aleatorio en un Uint8Array
    const randomBytes = new Uint8Array(Math.ceil(Math.log2(range) / 8));
    window.crypto.getRandomValues(randomBytes);
    // extract random number from Uint8Array
    let randomNumber = 0;
    for(let i = 0; i < randomBytes.length; i++){
        randomNumber += randomBytes[i] * Math.pow(256, i);
    }
    // Take that random number from the allowed range
    const index = min + (randomNumber % range);

    return index;
}
