import expressJwt from "express-jwt";
import $config from '../../config/config.json';

export default function jwt() {
    
    return expressJwt( { "secret":$config.secret } ).unless({
        path: [
            '/authenticate'
        ]
    });
}
