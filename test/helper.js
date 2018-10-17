'use strict'

// supporto nativo per le promises

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')

const clean = require('mongo-clean')
const { MongoClient } = require('mongodb')
const { beforeEach, tearDown } = require('tap')
const url = 'mongodb://localhost:27017'
const database = 'tests'

let client

beforeEach(async function () {
  if (!client) {
    client = await MongoClient.connect(url, {
      w: 1,
      useNewUrlParser: true
    })
  }
  await clean(client.db(database))
})

tearDown(async function () {
  if (client) {
    await client.close()
    client = null
  }
})

function config () {
  return {
    mongodb: {
      client,
      database
    }
  }
}

function build (t) {
  const app = Fastify()
  app.register(fp(App), config())
  t.tearDown(app.close.bind(app))
  return app
}

module.exports = {
  config,
  build
}
