import { ulid } from 'ulid';

import { Container } from '.';

describe('Container', () => {
    it('should resolve a class using the bound factory and an interface', () => {
        interface Log {
            info(value: string): void;
        }

        const container = new Container<{ logger: Log; unique: string }>();

        container.bind('logger', () => {
            return new (class implements Log {
                public info(): void {
                    //
                }
            })();
        });

        const logger = container.resolve('logger');

        expect(true).toBeTruthy();
        expect(logger.info).toBeDefined();
    });

    it('should resolve a subclass', () => {
        class Repository {
            //
        }

        class UserRepository extends Repository {
            public get() {
                return [];
            }
        }

        const container = new Container<{ userRepository: Repository }>();

        container.bind('userRepository', () => {
            return new UserRepository();
        });

        const userRepository = container.resolve('userRepository');

        expect(userRepository).toBeInstanceOf(Repository);
        expect(userRepository).toBeInstanceOf(UserRepository);
    });

    it('should resolve the same instance when bound as a singleton', () => {
        class Unique {
            public readonly value: string;
            constructor() {
                this.value = ulid();
            }
        }

        const container = new Container<{ Unique: Unique }>();

        container.singleton('Unique', () => {
            return new Unique();
        });

        const instanceA = container.resolve('Unique');
        const instanceB = container.resolve('Unique');

        expect(instanceA.value).toBe(instanceB.value);
    });

    it('should resolve a fresh instance when bound normally', () => {
        class Unique {
            public readonly value: string;
            constructor() {
                this.value = ulid();
            }
        }

        const container = new Container<{ Unique: Unique }>();

        container.bind('Unique', () => {
            return new Unique();
        });

        const instanceA = container.resolve('Unique');
        const instanceB = container.resolve('Unique');

        expect(instanceA.value).not.toBe(instanceB.value);
    });

    it('should discriminate return types based on the service name', () => {
        interface ServiceA {
            a: string;
        }

        interface ServiceB {
            b: number;
        }

        const container = new Container<{
            serviceA: ServiceA;
            serviceB: ServiceB;
        }>();

        container.bind('serviceA', () => {
            return { a: 'a' };
        });

        container.bind('serviceB', () => {
            return { b: 1 };
        });

        const serviceA = container.resolve('serviceA');
        const serviceB = container.resolve('serviceB');

        expect(serviceA.a).toBe('a');
        expect(serviceB.b).toBe(1);
    });
});
