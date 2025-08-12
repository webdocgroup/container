# Container

## Installation

```bash
npm install @webdocgroup/container
```

## Usage

### Bind

```ts
type Application = {
    'command.createUser': CreateUserHandler;
    'query.getUser': GetUserQueryHandler;
    userRepository: UserRepository;
};

const container = new Container<Application>();

// Bind a factory that instantiates your create user handler
// the factory will be run each time you resolve an instance
container.bind('command.createUser', () => {
    return new CreateUserHandler();
});

const handler = container.resolve('command.createUser');
```

### Bind Singleton

```ts
type Application = {
    'command.createUser': CreateUserHandler;
    'query.getUser': GetUserQueryHandler;
    userRepository: UserRepository;
};

const container = new Container<Application>();

// Bind a factory that instantiates your create user handler
// the factory will only be invoked once and you will be given
// the same instance on each resolve
container.singleton('userRepository', () => {
    return new UserRepository();
});

// You can resolve other bound services within factories
container.bind('query.getUser', () => {
    return new GetUserHandler({
        realm: container.resolve('userRepository'),
    });
});
```
