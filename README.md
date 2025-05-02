![alt text](https://github.com/LucasMacchi/sexp-client/blob/main/public/final_logo.png?raw=true)

# SISTEMA DE GESTION DE PEDIDOS

Este es el servidor de la aplicacion de seguimiento de expedientes, dieñado para INSUDENT, SAMAB y SOLUCIONES & SERVICIOS.
Este se encarga de la comunicacion entre la aplicacion y la base de datos postgresql, siguiendo un esquema de API y rutas.
Las rutas estan portegidas por un token que lo autentica.

## TECNOLOGIAS USADAS
- NEST JS
- MYSQL
- TYPESCRIPT
- SQL

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## ENDPOINTS

### USUARIO
- AUTH - GET user/all --> Devuelve todos los usuarios
- POST user/login --> Devuelve un token que autentica al usuario e inicia sesion en la aplicacion
- AUTH - POST user/register --> Crea un usuario desactivado
- AUTH - PATCH user/activate/:user --> Activa un usuario
- AUTH - PATCH user/desactivate/:user --> Desactiva un usuario
- AUTH - POST user/credential/:user/:empresa --> Agrega una credencial a usuario
- AUTH - DELETE user/credential/:id --> Elimina una credencial

### EXPEDIENTE
- AUTH - GET expediente/all --> Devuelve todos los expedientes
- AUTH - POST expediente/add --> Crea un nuevo expediente
- AUTH - PATCH expediente/edit/:id --> modifica un expediente con los datos correspondientes

### DATA
- AUTH - GET data/tipos --> Trae todos los tipos
- AUTH - GET data/ubicaciones --> Trae todos las ubicaciones
- AUTH - GET data/services --> Trae todos los servicios
- AUTH - GET data/empresas --> Trae todas las emprsas con sus servicios relacionados
- AUTH - GET data/estados --> Trae todos los estados
- AUTH - POST data/estado/:estado --> Crea un nuevo estado
- AUTH - POST data/empresa/:empresa/:service --> Crea una nueva empresa con su servicio relacionado
- AUTH - POST data/service/:service --> Crea un nuevo servicio


