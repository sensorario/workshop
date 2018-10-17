'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('create and get ticket', async (t) => {
  const savedTitle = 'A support ticket';
  const savedBody = 'this is a long body';
  const jsonData = {
    title: savedTitle,
    body: savedBody,
  };
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: jsonData
  })
  t.equal(res1.statusCode, 201) // Created
  const firstTocket = JSON.parse(res1.body)

  t.ok(firstTocket._id) // t.true // t.assert

  // within same variables
  t.ok(firstTocket.title, savedTitle)
  t.ok(firstTocket.body, savedBody)

  // within same object
  t.ok(firstTocket.title, jsonData.title)
  t.ok(firstTocket.body, jsonData.body)

  // createa a route within same record's id
  const url = `/tickets/${firstTocket._id}`

  t.equal(res1.headers.location, url)

  const res2 = await app.inject({
    method: 'GET',
    url
  })

  t.equal(res2.statusCode, 200)

  // ridondante se faccio 
  // within same variables
  // t.ok(firstTocket.title, savedTitle)
  // t.ok(firstTocket.body, savedBody)
  t.deepEqual(JSON.parse(res2.body), {
    _id: firstTocket._id,
    title: 'A support ticket',
    body: 'this is a long body'
  })
})

test('get missing id', async (t) => {
  const url = `/tickets/5bc707b93db50705356c53c4`
  const app = build(t)
  const res2 = await app.inject({
    method: 'GET',
    url
  })
  t.equal(res2.statusCode, 404)
  t.deepEqual(JSON.parse(res2.body), {
    status: 'not ok'
  })
})

test('create and get all', async (t) => {
  // tiro su l'applicazione
  const app = build(t)

  // injecto la POST a /tickets
  const res1 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket',
      body: 'this is a long body'
    }
  })

  // inserisco un secondo ticket
  const res2 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'Another support ticket',
      body: 'this is a long body'
    }
  })

  // recupero tutti i tickets
  const resAll = await app.inject({
    method: 'GET',
    url: '/tickets'
  })

  const firstTocket = JSON.parse(res1.body)
  const secondTicket = JSON.parse(res2.body)

  t.equal(resAll.statusCode, 200)

  t.deepEqual(JSON.parse(resAll.body), {
    tickets: [{
      _id: secondTicket._id,
      title: 'Another support ticket',
      body: 'this is a long body'
    }, {
      _id: firstTocket._id,
      title: 'A support ticket',
      body: 'this is a long body'
    }]
  })
})

test('cant create tickets without title', async (t) => {
  const url = `/tickets`
  const app = build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      body: 'this is a long body'
    }
  })
  t.equal(response.statusCode, 400) // Created
})

test('cant create tickets without body', async (t) => {
  const url = `/tickets`
  const app = build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'this is a long body'
    }
  })
  t.equal(response.statusCode, 400) // Created
})
