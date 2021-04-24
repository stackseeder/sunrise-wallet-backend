const ObjectID = require('mongodb').ObjectID
const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
  isObjectID,
  isDateString
} = require('./utils')

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {}
  sortBy[sort] = order
  return sortBy
}

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = result => {
  if (result && result.docs) {
    result.docs.map(element => delete element.id)
  }
  return result
}

/**
 * Builds initial options for query
 * @param {Object} req - query object
 */
const listInitOptions = async req => {
  return new Promise(resolve => {
    const order = req.query.order || -1
    const sort = req.query.sort || 'createdAt'
    const pagination = !(req.query.pagination && req.query.pagination === '0')
    const sortBy = buildSort(sort, order)
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 5

    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit,
      pagination
    }

    resolve(options)
  })
}

const getExpression = search => {
  let expression = {}
  switch (search.opt) {
    case 'in':
      expression = {
        $regex: new RegExp(search.value, 'i')
      }
      break
    case 'eq':
      expression = {
        $eq: isObjectID(search.value)
          ? new ObjectID(search.value)
          : search.value
      }
      break
    case 'gt':
      expression = {
        $gt: isDateString(search.value) ? new Date(search.value) : search.value
      }
      break
    case 'gte':
      expression = {
        $gte: isDateString(search.value) ? new Date(search.value) : search.value
      }
      break
    case 'lt':
      expression = {
        $lt: isDateString(search.value) ? new Date(search.value) : search.value
      }
      break
    case 'lte':
      expression = {
        $lte: isDateString(search.value) ? new Date(search.value) : search.value
      }
      break
    case 'ne':
      expression = {
        $ne: search.value
      }
      break
    case 'ex':
      expression = {
        $exists: Boolean(search.value)
      }
      break
    default:
      expression = {
        $regex: new RegExp(search.value, 'i')
      }
      break
  }

  return expression
}

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
  async checkQueryString(query) {
    return new Promise((resolve, reject) => {
      try {
        if (query.filter && typeof query.filter === 'string') {
          const filter = JSON.parse(query.filter)

          const data = {}
          const temp = {}

          if (filter.or && filter.or.length) {
            temp.$or = []
            filter.or.forEach(search => {
              if (search.key && search.opt) {
                temp.$or.push({
                  [search.key]: getExpression(search)
                })
              }
            })
          }

          if (filter.and && filter.and.length) {
            temp.$and = []
            filter.and.forEach(search => {
              if (search.key && search.opt) {
                temp.$and.push({
                  [search.key]: getExpression(search)
                })
              }
            })
          }

          if (temp.$or && temp.$or.length) {
            data.$or = temp.$or
          }
          if (temp.$and && temp.$and.length) {
            data.$and = temp.$and
          }

          resolve(data)
        } else {
          resolve({})
        }
      } catch (err) {
        reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
      }
    })
  },

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} model
   * @param {Object} query - query object
   */
  async getItems(req, model, query) {
    const options = await listInitOptions(req)
    return new Promise((resolve, reject) => {
      model.paginate(query, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(cleanPaginationID(items))
      })
    })
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   * @param {Object} model
   */
  async getItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(item)
      })
    })
  },

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} model
   * @param {Object} query - query object
   */
  async getAggregateItems(req, model, query) {
    const options = await listInitOptions(req)
    return new Promise((resolve, reject) => {
      model.aggregatePaginate(query, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(cleanPaginationID(items))
      })
    })
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   * @param {Object} model
   * @param {Object} query - query object
   */
  async getAggregateItem(id, model, query) {
    return new Promise((resolve, reject) => {
      model.aggregate(
        [
          {
            $match: {
              _id: ObjectID(id)
            }
          }
        ].concat(query),
        (err, items) => {
          itemNotFound(err, items, reject, 'NOT_FOUND')
          if (items.length > 0) {
            resolve(items[0])
          } else {
            itemNotFound(new Error('Not found'), items, reject, 'NOT_FOUND')
          }
        }
      )
    })
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   * @param {Object} model
   */
  async createItem(req, model) {
    return new Promise((resolve, reject) => {
      model.create(req, (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(item)
      })
    })
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} model
   * @param {Object} req - request object
   */
  async updateItem(id, model, req) {
    return new Promise((resolve, reject) => {
      model.findByIdAndUpdate(
        id,
        req,
        {
          new: true,
          runValidators: true
        },
        (err, item) => {
          itemNotFound(err, item, reject, 'NOT_FOUND')
          resolve(item)
        }
      )
    })
  },

  /**
   * Deletes an item from database by id
   * @param {Object} model
   * @param {string} id - id of item
   */
  async deleteItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findByIdAndRemove(id, (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(buildSuccObject('DELETED'))
      })
    })
  }
}
