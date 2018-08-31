# AseguradoraAPI

## Rutas de la aplicación

```javascript
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
```

## Modelos

Los modelos de la aplicación resuelven las peticiones a los servicios remotos y retornan promesas.

Debido a los tipos de petición disponibles existe un retardo no despreciable que afecta a todo el sistema. Esto podría mitigarse con una chaché pero por el momento no se ha implementado.

### User

El modelo usuario tiene 2 métodos, uno para la autenticación y otro para determinar si se trara de un usuario administrador.

Por la estructura del conjunto de datos la autenticación es por nombre de usuario e email.

El método find busca al usuario y retorna una promesa (con el usuario o un new Error()). Es el controlador el que se encargará de llamar a jwt para resolver el token.

```javascript
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
```

### Cliente

El modelo cliente consta de 3 métodos

```javascript
findAll(){
    ...
}
findById(id){
    ...
const cliente = result.clients.find(
        c => c.id === id
    );
    if(cliente){
        return resolve(cliente)
    } else {
        return reject(
            new Error("No se ha encontrado el cliente")
        )
    }
}
findPolicies(clientId){
    ...
    let result = JSON.parse(body);
    let politicas = [];
    result.policies.forEach(politica => {
        if (politica.clientId == clientId) {
            politicas.push(politica)
        }
    });
    return resolve(politicas)
}
```

El método *findAll()* es trivial

### Politica

El modelo **Politica** consta de 2 métodos análogos a los del modelo **Cliente**

```javascript
findAll(){
    ...
}
findById(id){
    ...
}
```

## Controladores de la aplicación

### UsersController

El controlador de usuarios es el encargado de instanciar un usuario y llamar al método *authenticate*. En función del valor de retorno (si existe el usuario o no), se resuelve la creación del token de autenticación.

```javascript
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
```

### ClientesController

El controlador clientes implementa 3 métodos para realizar las llamadas a los métodos *find()*, *findById()* y *findPolicies()* del modelo **Cliente**.

```javascript
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
```

### PoliticasController

Análogo a **ClientesController**

## Middeleware

En la capa middleware se implementaron 3 funciones, para excluir rutas que requieren token (*/authenticate*), para manejar errores globales y para setear cabeceras de la aplicación de modo que solo nuestra aplicación cliente pueda hacer peticiones a la API.

### Http Headers

```javascript
// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});
```

### ErrorHandler

```javascript
export default function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }
  return res.status(500).json({ message: err.message });
};
```

### jwt

```javascript
export default function jwt() {
    return expressJwt( { "secret":$config.secret } ).unless({
        path: [
            '/authenticate'
        ]
    });
}
```
