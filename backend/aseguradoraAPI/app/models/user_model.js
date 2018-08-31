import request from 'request';
import $config from '../../config/config.json';

export default class User {
    constructor(){
        this.find = this.find.bind(this);
    }

    find(username, email){

        return new Promise(function(resolve, reject){
            request.get($config.urlClientes, (error, response, body) => {
                
                if(error) {
                    return reject(error);

                } else {
                    let result = JSON.parse(body);
                    // buscamos al usuario
                    const user = result.clients.find(
                        u => u.name === username && u.email === email
                    );
                    
                    if (user){
                        return resolve(user); 
                    } else{
                        return reject(new Error("Usuario no registrado"));
                    }               
     
                }
            });
        }); 
    }
}