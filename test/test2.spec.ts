import { Service, ServiceLocator } from '../src/main';

describe('Test #2', () => {
    it('should resolve simple DI', () => {
        @Service
        class AService { }

        @Service
        class BService {
            constructor(public aservice: AService) { }
        }

        const instance = ServiceLocator.instance.getService(BService) as BService;

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(BService);
        expect(instance.aservice).toBeInstanceOf(AService);
    });
});