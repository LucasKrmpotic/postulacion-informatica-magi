import $config from '../../config/config.json';
import request from 'request';
import Cliente from "../models/clientes_model";

export default class ClientesController {
    constructor(){
        this.cliente = new Cliente(); 
        this.listarClientes = this.listarClientes.bind(this);
        this.buscarCliente = this.buscarCliente.bind(this);
        this.listarPoliticasCliente = this.listarPoliticasCliente.bind(this);
    }

    listarClientes (req, res, next) {
        
        this.cliente.findAll()
            .then(clientes => { return res.json(clientes)})
            .catch(err => { return next(err)})

    };
    
    buscarCliente (req, res, next) {
        this.cliente.findById(req.params.id)
            .then(cliente => { return res.json(cliente)})
            .catch(err => {
                res.status(404)
                res.statusMessage ='Cliente not found'
                res.send({ message: err.toString() })
            })
    };
    
    listarPoliticasCliente (req, res, next) {
        
        this.cliente.findPolicies(req.params.id)
            .then(politicas => { return res.json(politicas) })
            .catch(err => { 
                return next(err) 
            })
    };

}