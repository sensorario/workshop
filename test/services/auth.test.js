'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('cant create tickets without body', async (t) => {
  const url = `/signup`
  const app = build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'matteo',
      password: 'matteo'
    }
  })
  t.ok(response.statusCode, 200);
  console.log(response.body);
})

test('get cose', async (t) => {
  const url = `/foo`
  const app = build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/foo'
  })
})
