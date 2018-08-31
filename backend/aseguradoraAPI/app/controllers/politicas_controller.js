import Politica from "../models/politicas_model";

export default class PoliticasController {
    constructor(){
        this.politica = new Politica();
        this.listarPoliticas = this.listarPoliticas.bind(this);
        this.buscarPolitica = this.buscarPolitica.bind(this);
    }
    
    listarPoliticas (req, res, next) {
        this.politica.findAll()
            .then(politicas =>{
                return res.json(politicas)
            })
            .catch(err => { return next(err) })
    };
    
    buscarPolitica (req, res, next) {
        this.politica.findById(req.params.id)
            .then(politica => { return res.json(politica)})
            .catch(err => {
                res.status(404)
                res.statusMessage ='Politica not found'
                res.send({ message: err.toString() })
            })
    };
}

