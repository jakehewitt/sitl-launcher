const { merge, omitBy, isNull } = require('lodash')

module.exports = class DataStore {
  constructor(initialState = {}) {
    this.state = initialState
    this.subscribers = []
  }

  getState = () => JSON.parse(JSON.stringify(this.state))

  setState = (newState) => new Promise((resolve, reject) => {
    this.state = merge(this.state, newState)
    this.state.instances = omitBy(this.state.instances, isNull);
    this.subscribers.forEach(fn => fn(this.getState()))
    resolve()
  })

  subscribe = (fn) => {
    this.subscribers.push(fn)
    return () => { this.subscribers = this.subscribers.filter((value) => value === fn) }
  }

  unsubscribe = (fn) => {
    this.subscribers = this.subscribers.filter((value) => value === fn)
  }
}
