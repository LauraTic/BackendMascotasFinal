import {registerAuthenticationStrategy} from '@loopback/authentication';
import {AuthenticationComponent} from '@loopback/authentication/dist/authentication.component';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {EstrategiaAdministrador} from './config/strategies/admin.strategy';
import {EstrategiaAsesor} from './config/strategies/asesor.strategy';
import {EstrategiaCliente} from './config/strategies/cliente.strategy';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class App extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };



    registerAuthenticationStrategy(this, EstrategiaAdministrador)
    registerAuthenticationStrategy(this, EstrategiaCliente)
    registerAuthenticationStrategy(this, EstrategiaAsesor)

    this.component(AuthenticationComponent)
  }
}
