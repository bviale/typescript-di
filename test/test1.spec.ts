import { Service, ServiceLocator } from '../src/main';

describe('Test #1', () => {
    it('should instanciate the service', () => {
        @Service
        class LoginService { }

        const instance = ServiceLocator.instance.getService(LoginService) as LoginService;

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(LoginService);
    });
});