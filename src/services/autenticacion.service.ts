import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Llaves } from '../config/Llaves';
import { Usuario } from '../models';
import { UsuarioRepository } from '../repositories';
const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */
  
  @repository(UsuarioRepository)
  public usuarioRepository:UsuarioRepository
  ) {}

  GenerarClave(){
    let clave = generador(8, false);
    return clave;
  }

  CifrarClave(clave:string){
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarPersona(usuario:string,clave:string){

    try{
      let p = this.usuarioRepository.findOne({where:{correo:usuario, clave:clave}})

      if(p){
        return p;
      }
      return false;
    }
    catch{
      return false;
    }

    }

    GenerarTokenJWT(usuario:Usuario){

      let token = jwt.sign({
        data:{
          id: usuario.id,
          correo: usuario.correo,
          nombre: usuario.nombre + " " + usuario.apellido,
          rol: usuario.rol
        }
      },
        Llaves.claveJWT);
  
      return token;
    }

    ValidarTokenJWT(token:string){
      try{
        let datos = jwt.verify(token, Llaves.claveJWT);
        return datos;
  
      }catch{
        return false;
      }
  
  
    }



}
