'use strict'

const ticketSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    body: {
      type: 'string'
    }
  },
  required: ['title', 'body']
}

module.exports = async function (app, opts) {
  const tickets = app.mongo.db.collection('tickets')
  const { ObjectId } = app.mongo

  app.addHook("preHandler", async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  app.post('/', {
    schema: {
      body: ticketSchema,
      response: {
        '2xx': ticketSchema
      }
    }
  }, async function (req, reply) {

    const data = await tickets.insertOne(req.body)

    const _id = data.ops[0]._id

    reply
      .code(201)
      .header('location', `${this.basePath}/${_id}`)

    return Object.assign({
      _id
    }, req.body)
  })

  // @todo add validation within a pattern
  app.get('/:id', async function (req, reply) {
    const id = req.params.id

    // se id = null, ... allora mostro tutto?

    const data = await tickets.findOne({
      _id: new ObjectId(id)
    })

    if (!data) {
      reply.code(404)
      return { status: 'not ok' }
    }

    return data
  })

  app.get('/', async function (req, reply) {
    const tick = await tickets.find().sort({
      _id: -1 // newest firdst
    }).toArray()

    return {
      tickets: tick
    }
  })
}

module.exports.autoPrefix = '/tickets'
