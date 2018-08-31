# Aseguradora

## Rutas de la aplicación

```javascript
{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
{ path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
{ path: 'cliente/:id', component: ClienteComponent, canActivate: [AuthGuard] },
{ path: 'politicas', component: PoliticasComponent, canActivate: [AuthGuard] },
{ path: 'politica/:id', component: PoliticaComponent, canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent },
{ path: '**', pathMatch:'full', redirectTo: '' }
```

Las rutas se encuentran protegidas por una guarda (interceptor) que determina si el usuario se encuentra logueado o no (redirige a la ruta 'login').


```javascript
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (localStorage.getItem('currentUser')) {
          return true;
      }
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
```
## Comunicación con la API
### Servicios e interceptores

Se programaron 3 servicios que proveen la comunicación con el backend.

```javascript
services
├── authentication.service.ts
├── clientes.service.ts
└── politicas.service.ts
```

```javascript
guards
└── auth.guard.ts
interceptors
├── error.interceptor.ts
└── jwt.interceptor.ts
```
#### AuthenticationService, JWT Interceptor

La autenticación se resolvió vía Json Web Tokens.

Por la estructura de los conjuntos de datos, para el login se requiere nombre de usuario e email.

La función principal del servicio de autenticación realiza la petición **post** al endpoint de la api y setea la propiedad *currentUser* en localstorage
```javascript
login(username: string, email: string) {
    return this.http.post<any>(this.url, { username, email })
        .pipe(map(user => {
            if (user && user.token) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            return user;
        }));
}
```
El logout se resuelve con un clear al localstorage (en el servidor el tiempo de vida del token es configurable).


```javascript
logout() {
    localStorage.removeItem('currentUser');
}
```
Luego se usan otras 2 funciones para determinar si el usuario está logeado y si es administrador.

Estas funciones consultan a localstorage ya que las rutas (tanto para autenticación como para autorización) están protegidas en el servidor. Con lo cual estas propiedades solo se usan a los efectos de ocultar o mostrar elementos en el DOM.


```javascript
isLoggedIn() {
    if (localStorage.getItem('currentUser')) {
        return true;
    }
    return false;
}

isAdmin(){
    return (JSON.parse(localStorage.getItem('currentUser')).role === "admin");
}
```

Finalmente se utiliza el patrón arquitectónico *Interceptor* para el seteo de las cabeceras Http.


```javascript
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}
```


#### ClientesService

El servicio clientes consta de 3 métodos:

```javascript
/* Recupera todos los clientes */
ClientesService.getClientes(){
    ...
}
/* Recupera un cliente */
ClientesService.getCliente(id:string){
    // donde id es el id del cliente
    ...
}
/* Recupera las politicas asociadas a un cliente */
ClientesService.getPoliticas(id:string){
    // donde id es el id del cliente
    ...
}
```

#### PoliticasService

El servicio politicas consta de 3 métodos:

```javascript
/* Recupera todas las politicas */
PoliticasService.getPoliticas(){
    ...
}
/* Recupera una política*/
PoliticasService.getPolitica(id:string){
    // donde id es el id de la politica
    ...
}

/* Recupera el cliente vinculado a la*/
PoliticasService.getPolitica(id:string){
    // donde id es el id del cliente
    ...
}
```

**Nota:** la recuperación de un cliente asociado a una politica se resuelve en el componente, que hace uso del **ClientesService** al cual le pasa el id del cliente referenciado en la política.


### Componentes principales de la aplicación

```javascript
components
├── cliente
│   ├── cliente.component.html
│   └── cliente.component.ts
├── clientes
│   ├── clientes.component.html
│   └── clientes.component.ts
├── home
│   ├── home.component.html
│   └── home.component.ts
├── login
│   ├── login.component.html
│   └── login.component.ts
├── navbar
│   ├── navbar.component.html
│   └── navbar.component.ts
├── politica
│   ├── politica.component.html
│   └── politica.component.ts
└── politicas
    ├── politicas.component.html
    └── politicas.component.ts
```
#### LoginComponent

El componente login es el más extenso por la lógica de validación del formulario y la necesidad de redirecciones de rutas. 

Para lo anterior se hace uso de las clases *FormBuilder* así como de *Router* y *ActivatedRoute*
```javascript
constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {}
```
En el método *ngOnInit* se inicializa el formulario y se llama al método *logout()* de la clase **AuthenticationService**. De este modo la navegación a la ruta */login* con un usuario logueado produce el *logout* sin necesidad de una ruta específica para ello en el frontend.

#### ClientesComponent

El componente clientes realiza la petición *get* al endpoint */clientes* y los almacena en la propiedad *clientes* para el databinding en el template. 

Además tiene una propiedad *filtro* de tipo string para la búsqueda por nombre o por id (para el filtrado se usa un **Pipe** personalizado)

```javascript
  filtro:string;
  clientes: any[] = [];

  constructor( private _clientesService: ClientesService) {
    this._clientesService.getClientes()
      .subscribe( data => {
        this.clientes = data;
      });
  }
```

#### ClienteComponent

El componente cliente resuelve las peticiones a los endpoints */cliente/:id* y */cliente/politicas/:id* 

La petición get a la primera de las rutas mencionadas se realiza inmediatamente a partir de la navegación. La segunda en cambio depende de si el usuario es administrador, por lo cual este componente hace uso del método *isAdmin()* de la clase **AuthenticationService** para decidir si mostrar o no el botón que despliega la lista de políticas vinculadas al cliente (ruta protegida también en el servidor). 

```javascript
constructor(private _clientesService: ClientesService,
            private _authenticationService: AuthenticationService,
            private router:Router,
            private route:ActivatedRoute) {

    this.route.params
    .subscribe(parametros=>{
        this.id = parametros['id']
        this._clientesService.getCliente( this.id )
        .subscribe(data => {
            this.cliente = data;
            this.isDataAvailable = true;
        })
        this.isAdmin = this._authenticationService.isAdmin();
    });
}
```

En caso de que el usuario sea administrador, se le muestra el botón que dispara el método *verPolíticas()* que llama al método *getPoliticas(id)*  de la clase **ClientesService**


#### PoliticasComponent

Análogo a **ClientesComponent**

#### PoliticaComponent

Este componente obtiene una política llamando al método *getPolitica(id)* de la clase **PoliticaService**. En el caso de los usuarios administradores se debe obtener al cliente asociado a la política. Por lo tanto, cuando se resuelve la promesa se hace uso del método *isAdmin()* de la clase **AuthenticationService** y si éste retorna verdadero se hace la petición para obtener el cliente.

```javascript
this.route.params
.subscribe(parametros=>{

    this.id = parametros['id']
    this._politicasService.getPolitica( this.id )
    .subscribe(data => {
        this.politica = data;
        this.isAdmin = this._authenticationService.isAdmin();
        this.isDataAvailable = true;

        if (this.isAdmin){
        this._politicasService.getCliente( this.politica.clientId )
            .subscribe(cliente => {
            this.cliente = cliente;
            })
        }
    })
});
```

