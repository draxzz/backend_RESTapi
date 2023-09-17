import crpyto from 'crypto';

/**
 * Generates a random string.
 * @returns {string} A random string.
 */
/**
   * Use the crypto library to generate random bytes and convert them to base64.
   * @type {Buffer}
*/
export const random = () => crpyto.randomBytes(128).toString('base64');

/**
 * Generates an authentication hash.
 * @param {string} salt - The salt for hashing.
 * @param {string} password - The password to hash.
 * @returns {string} The authentication hash.
 */
export const authentication = (salt:string, password:string) => {
    /**
   * Create an HMAC hash using the provided salt and password,
   * then update it with the SECRET and convert the result to hex.
   * @type {string}
   */
    return crpyto.createHmac('sha256',[salt,password].join('/')).update(process.env.SECRET_KEY).digest('hex')
};
