import { Service, ServiceLocator } from '../src/main';

describe('Test #3', () => {
    it('should resolve complex DI', () => {
        @Service
        class AService { }

        @Service
        class BService {
            constructor(public aservice: AService) { }
        }

        @Service
        class CService {
            constructor(public bservice: BService) { }
        }

        @Service
        class DService {
            constructor(public cservice: CService, public bservice: BService) { }
        }

        const [dinstance, cinstance] = ServiceLocator.instance.getServices(DService, CService);

        expect(dinstance).toBeDefined();
        expect(dinstance).toBeInstanceOf(DService);
        expect(dinstance.cservice).toBeInstanceOf(CService);

        expect(dinstance.cservice).toBe(cinstance);
    });
});