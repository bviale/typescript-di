# Dependency Injection decorators for Typescript
A very light library to handle dependency injection with Typescript decorators using the Angular `@Service` way.

Resolves the dependencies between services and allow the decorated services to be retrieved using the `ServiceLocator` singleton.

Can be used in all kinds of Typescript projects such as React.

## Install

`npm i --save @bviale/typescript-di`

## Configuration
Enable `experimentalDecorators` and `emitDecoratorMetadata` in your `tsconfig.json` :
```
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

## Usage

```typescript
@Service
class LoginService {

}

@Service
class AuthenticationService {
    // Will be automatically injected
    constructor (private loginService: LoginService) { }
}

const instance = ServiceLocator.instance.getService(AuthenticationService) as AuthenticationService;
```
