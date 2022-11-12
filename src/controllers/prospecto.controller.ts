import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import fetch from 'node-fetch';
import {Llaves} from '../config/Llaves';
import {Prospecto, Usuario} from '../models';
import {ProspectoRepository} from '../repositories';

export class ProspectoController {
  constructor(
    @repository(ProspectoRepository)
    public prospectoRepository : ProspectoRepository,
  ) {}

  @post('/prospectos')
  @response(200, {
    description: 'Prospecto model instance',
    content: {'application/json': {schema: getModelSchemaRef(Prospecto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospecto, {
            title: 'NewProspecto',
            exclude: ['id'],
          }),
        },
      },
    })
    prospecto: Omit<Prospecto, 'id'>,
  ): Promise<Prospecto> {

    let p = await this.prospectoRepository.create(prospecto);


    let destino = Llaves.correoAdministrador;
    let asunto = 'Nuevo comentario en contáctenos';
    let mensaje = `Hola administrador. Hubo un nuevo comentario de ${prospecto.nombre}, el correo de esta persona es ${prospecto.correo} y su comentario fue: ${prospecto.comentario}`

    //fetch(`${Llaves.urlServicioNotificaciones}/correo?correo_destino=${destino}&asunto=${asunto}&cuerpo_correo=${mensaje}`)
    fetch(`${Llaves.urlServicioNotificaciones}/correo?correo_destino=${destino}&asunto=${asunto}&cuerpo_correo=${mensaje}`)
      .then((data: any) => {
        console.log(data);
      })
      return p;
  }

  @get('/prospectos/count')
  @response(200, {
    description: 'Prospecto model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Prospecto) where?: Where<Prospecto>,
  ): Promise<Count> {
    return this.prospectoRepository.count(where);
  }

  @get('/prospectos')
  @response(200, {
    description: 'Array of Prospecto model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Prospecto, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Prospecto) filter?: Filter<Prospecto>,
  ): Promise<Prospecto[]> {
    return this.prospectoRepository.find(filter);
  }

  @patch('/prospectos')
  @response(200, {
    description: 'Prospecto PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospecto, {partial: true}),
        },
      },
    })
    prospecto: Prospecto,
    @param.where(Prospecto) where?: Where<Prospecto>,
  ): Promise<Count> {
    return this.prospectoRepository.updateAll(prospecto, where);
  }

  @get('/prospectos/{id}')
  @response(200, {
    description: 'Prospecto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prospecto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Prospecto, {exclude: 'where'}) filter?: FilterExcludingWhere<Prospecto>
  ): Promise<Prospecto> {
    return this.prospectoRepository.findById(id, filter);
  }

  @patch('/prospectos/{id}')
  @response(204, {
    description: 'Prospecto PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospecto, {partial: true}),
        },
      },
    })
    prospecto: Prospecto,
  ): Promise<void> {
    await this.prospectoRepository.updateById(id, prospecto);
  }

  @put('/prospectos/{id}')
  @response(204, {
    description: 'Prospecto PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() prospecto: Prospecto,
  ): Promise<void> {
    await this.prospectoRepository.replaceById(id, prospecto);
  }

  @del('/prospectos/{id}')
  @response(204, {
    description: 'Prospecto DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.prospectoRepository.deleteById(id);
  }
}
