import $config from '../../config/config.json';
import request from 'request';
import User from "../models/user_model";

export default class Cliente{
    constructor(){
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.findPolicies = this.findPolicies.bind(this)
    }

    findAll(){
        return new Promise(function(resolve, reject){
            request.get($config.urlClientes, (error, response, body) => {
                if(error) {
                    return reject(error);
                }
                let result = JSON.parse(body);        
                return resolve(result.clients); 
            });
        });
    }

    findById(id){
        return new Promise(function(resolve, reject){
            request.get($config.urlClientes, (error, response, body) => {
                if(error) {
                    return reject(error);
                } else {
                    let result = JSON.parse(body);                
                    const cliente = result.clients.find(
                        c => c.id === id
                    );
                    if(cliente){
                        return resolve(cliente)            
                    } else {
                        return reject(new Error("No se ha encontrado el cliente"))
                    }
                }
            });
        });
    }

    findPolicies(clientId){
        return new Promise(function(resolve, reject){
            request.get($config.urlPoliticas, (error, response, body) => {
                if(error) {
                    return reject(error);
                }
                let result = JSON.parse(body);
                let politicas = [];      
                result.policies.forEach(politica => {
                    if (politica.clientId == clientId) {
                        politicas.push(politica)
                    } 
                });
                return resolve(politicas)            
            });
        });
    }

    
}