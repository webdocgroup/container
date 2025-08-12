# Container

<img width="1280" height="640" alt="Webdoc container" src="https://github.com/user-attachments/assets/b7a5038a-0a31-4342-956a-7ccd8ab13b50" />

The Webdoc service container is a simple tool for managing class dependencies and performing dependency injection.

## Installation

```bash
npm install @webdocgroup/container
```

## Usage

### Simple Bindings

Use `bind` to register a factory function. The factory is called every time you resolve the key, returning a new instance each time.

```ts
type Application = {
    'command.createUser': CreateUserHandler;
    'query.getUser': GetUserQueryHandler;
    userRepository: UserRepository;
};

const container = new Container<Application>();

// Register a factory for 'command.createUser'.
// Each call to resolve will create a new instance.
container.bind('command.createUser', () => new CreateUserHandler());

// Resolving returns a new instance every time.
const handler = container.resolve('command.createUser');
```

### Binding Singletons

Use `singleton` to register a factory that is only called once. All future resolves return the same instance.

```ts
type Application = {
    'command.createUser': CreateUserHandler;
    'query.getUser': GetUserQueryHandler;
    userRepository: UserRepository;
};

const container = new Container<Application>();

// Register a singleton factory for 'userRepository'.
// Only one instance will ever be created and reused.
container.singleton('userRepository', () => new UserRepository());

// Factories can resolve other dependencies from the container.
container.bind(
    'query.getUser',
    () =>
        new GetUserHandler({
            userRepository: container.resolve('userRepository'),
        })
);
```
