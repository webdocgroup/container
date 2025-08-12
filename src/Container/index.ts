import { ulid } from 'ulid';

type Factory<ResolvedServices, ReturnType> = (
    container: Container<ResolvedServices>
) => ReturnType;

type ServiceFactories<ResolvedServices> = {
    [ServiceName in keyof ResolvedServices]: Factory<
        ResolvedServices,
        ResolvedServices[ServiceName]
    >;
};

export class Container<ResolvedServices> {
    private providers: Partial<ServiceFactories<ResolvedServices>>;

    private instances: Partial<ResolvedServices>;

    public readonly containerInstanceId: string;

    constructor() {
        this.containerInstanceId = ulid();
        this.providers = {};
        this.instances = {};
    }

    public bind<ServiceName extends keyof ResolvedServices>(
        name: ServiceName,
        factory: Factory<ResolvedServices, ResolvedServices[ServiceName]>
    ) {
        this.providers[name] = factory;
    }

    public singleton<ServiceName extends keyof ResolvedServices>(
        name: ServiceName,
        factory: Factory<ResolvedServices, ResolvedServices[ServiceName]>
    ) {
        if (this.instances[name]) {
            throw new Error(
                `Singleton "${String(name)}" has already been instantiated`
            );
        }

        this.bind(name, (container) => {
            if (!this.instances[name]) {
                try {
                    this.instances[name] = factory(container);
                } catch (error) {
                    const err = new Error(
                        `Error during singleton instantiation (${String(name)})`
                    );

                    // Assign cause manually for compatibility
                    (err as any).cause = error;

                    console.error(err, (err as any).cause);

                    throw err;
                }
            }

            return this.instances[name] as ResolvedServices[ServiceName];
        });
    }

    public resolve<ServiceName extends keyof ResolvedServices>(
        name: ServiceName
    ): ResolvedServices[ServiceName] {
        if (!this.providers[name]) {
            throw new Error(`${String(name)} is not bound to the container`);
        }

        const factory = this.providers[name];

        return factory(this);
    }

    public drop() {
        this.providers = {};
        this.instances = {};
    }
}
