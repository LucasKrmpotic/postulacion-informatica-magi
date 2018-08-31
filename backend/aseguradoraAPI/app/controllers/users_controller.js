import jwt from "jsonwebtoken";
import $config from '../../config/config.json';
import { POINT_CONVERSION_HYBRID } from "constants";
import request from 'request';
import User from "../models/user_model";

export default class UsersController {
    
    constructor(){
        this.user = new User();
        this.authenticate = this.authenticate.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
    }
    
    authenticate(req, res, next) {
        
        this.user.find(req.body.username, req.body.email)
            .then(user => {
                jwt.sign(user, $config.secret, function(err, token) {
                
                    const { password, ...userWithoutPassword } = user;
                    return res.json ({
                        ...userWithoutPassword,
                        token
                    });
                });                
            })
            .catch(err => {
                res.status(404)
                res.statusMessage ='User not found'
                res.send({ message: err.toString() })
            })
    }

    isAdmin(req, res, next){
            
        if (req.user.role != "admin"){
            return res.sendStatus(401);    
        } 
        next();

    }
}