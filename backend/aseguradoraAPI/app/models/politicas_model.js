import $config from '../../config/config.json';
import request from 'request';

export default class Politica {

    constructor(){
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
    }

    findAll(){
        return new Promise(function(resolve, reject){
            request.get($config.urlPoliticas, (error, response, body) => {
                if(error) {
                    return reject(error);
                }
                let result = JSON.parse(body);
                return resolve(result.policies); 
            });
        })
    }

    findById(id){
        return new Promise(function(resolve, reject){

            request.get($config.urlPoliticas, (error, response, body) => {
                if(error) {
                    return reject(error);
                }

                let result = JSON.parse(body);
                const politica = result.policies.find(
                    p => p.id === id
                )     

                if (politica){
                    return resolve(politica)
                } else {
                    return reject(new Error("No existe política con ese id"))
                }

            });           
        })
    }

} 