import PoliticasController from "./controllers/politicas_controller";
import ClientesController from "./controllers/clientes_controller";
import UsersController from "./controllers/users_controller";

export default (app) => {

    let usersController = new UsersController();
    app.post('/authenticate', usersController.authenticate);

    let clientesController = new ClientesController();
    app.get('/clientes', clientesController.listarClientes);
    app.get('/cliente/:id', clientesController.buscarCliente);
    app.get('/cliente/politicas/:id', 
                    usersController.isAdmin, 
                    clientesController.listarPoliticasCliente);

    let politicasController = new PoliticasController();
    app.get('/politicas', politicasController.listarPoliticas);
    app.get('/politica/:id', politicasController.buscarPolitica);
    app.get('/politica/cliente/:id', 
                            usersController.isAdmin,
                            clientesController.buscarCliente);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}