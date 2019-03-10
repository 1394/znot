const { object: mO } = require('@dmitri.leto/manipula')

const keys = map => Object.keys(map)
const vals = map => Object.values(map)
const entries = map => Object.entries(map)
const get = (map, prop, defValue) => map.hasOwnProperty(prop) ? (map[prop] || defValue) : defValue
const getIn = (map, path, defValue) => mO.get(map, path, defValue)
const assocIn = (map, path, defValue) => mO.concat(map, path, defValue)

module.exports = {
  keys,
  vals,
  get,
  getIn,
  assocIn,
  'get-in': getIn,
  'assoc-in': assocIn,
  entries
}
