import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutenticacionService} from '../../services';

export class EstrategiaAsesor implements AuthenticationStrategy {
  name: string = "asesor";

  constructor(
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }


  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token) {
      let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
      if (datos) {
        if (datos.data.rol == "Asesor") {
          let perfil: UserProfile = Object.assign({
            nombre: datos.data.nombre
          });
          return perfil;

        } else {
          throw new HttpErrors[401]("El rol debe ser de un asesor")
        }

      } else {
        throw new HttpErrors[401]("Recuerde ingresar un token válido")
      }

    } else {
      throw new HttpErrors[401]("Recuerda incluir un token para proceder")
    }

  }

}
