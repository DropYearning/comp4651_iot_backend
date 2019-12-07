'use strict'
import { MongoClient } from 'mongodb'
import HttpError from 'standard-http-error'

const MongoURL = 'mongodb://mongodb.mongodb.svc.cluster.local'
const MongoDBName = 'iot_backend'

module.exports = async (event, context) => {
  try {
    // input validation
    const user = event.body.user
    if (!user) { throw new HttpError(400, 'User is empty') }
    if (!user.email) { throw new HttpError(400, 'User email is empty') }

    // upsert record on db
    const client = await MongoClient.connect(MongoURL)
    const collection = client.db(MongoDBName).collection('users')
    const result = await collection.update(
      { email: user.email },
      user,
      { upsert: true }
    )
    client.close()

    // success response
    return context
      .status(200)
      .success({
        success: true,
        result
      })
  } catch (e) {
    // error response
    return context
      .status(500)
      .fail({
        success: false,
        error: e.toString()
      })
  }
}
