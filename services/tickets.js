'use strict'

module.exports = async function (app, opts) {
  const tickets = app.mongo.db.collection('tickets')
  const { ObjectId } = app.mongo

  app.post('/', async function (req, reply) {

    const data = await tickets.insertOne(req.body)

    const _id = data.ops[0]._id

    reply
      .code(201)
      .header('location', `${this.basePath}/${_id}`)

    return Object.assign({
      _id
    }, req.body)
  })

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