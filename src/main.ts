import 'reflect-metadata';

// Internal object to store retrieved dependencies
let dependencies: { identifier: any, parameters: any[] }[] = [];

// Represents an instanciated service and its class identifier
interface ServiceModel {
    identifier: any;
    instance: any;
}

/**
 * The decorator to identify an injectable service.
 * It will be instanciated and stored to be available later through the [[ServiceLocator]].
 * 
 * Usage :
 * ```
 * @Service
 * class LoginService {
 *
 * }
 * ```
 
 */
export function Service(target: any) {
    if (!dependencies) {
        dependencies = [];
    }
    const types = Reflect.getMetadata('design:paramtypes', target);
    dependencies.push({ identifier: target, parameters: types });
}

/**
 * Singleton class used to retrieve [[Service]] instances.
 * 
 * Usage :
 * 
 * ```
 * const service = ServiceLocator.instance.getService(LoginService);
 * ```
 
 */
export class ServiceLocator {
    private static _instance: ServiceLocator;

    private _services: ServiceModel[];

    private constructor() {
        this._services = this.loadServices();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private loadServices(): ServiceModel[] {
        const services: ServiceModel[] = [];

        const fillServices = () => {
            const haveMissingDependencies = [];
            for (const currentService of dependencies) {
                if (services.find(s => s.identifier === currentService.identifier)) {
                    continue;
                }
                // Find the parameters required for this service that are already instanciated
                const foundDependenciesInstances = [];
                let missingDependency = false;

                if (currentService.parameters) {
                    for (const parameter of currentService.parameters) {
                        const foundDependency = services.find(d => d.identifier === parameter);

                        if (!foundDependency) {
                            missingDependency = true;
                            break;
                        }

                        foundDependenciesInstances.push(foundDependency.instance);
                    }
                }

                // All the required dependencies have been found, the service can now be instanciated
                if (!missingDependency) {
                    services.push({
                        identifier: currentService.identifier,
                        instance: new currentService.identifier(...foundDependenciesInstances)
                    });
                } else {
                    haveMissingDependencies.push(currentService.identifier);
                }
            }
            return haveMissingDependencies;
        };

        let previousMissingDependencies = [];
        let newMissingDependencies = [];
        do {
            previousMissingDependencies = newMissingDependencies;
            newMissingDependencies = fillServices();
        } while (newMissingDependencies.length !== previousMissingDependencies.length);

        if (newMissingDependencies.length > 0) {
            throw new Error('MISSING_DEPENDENCIES');
        }

        return services;
    }

    public getService(identifier: any) {
        for (const service of this._services) {
            if (service.identifier === identifier) {
                return service.instance;
            }
        }
    }

    public getServices(...identifiers: any[]) {
        return identifiers.map(i => this._services.find(s => s.identifier === i)?.instance);
    }
}
