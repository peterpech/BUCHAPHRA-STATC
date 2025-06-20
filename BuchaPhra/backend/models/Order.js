const orders = []
module.exports = {
  create: async (data) => {
    orders.push(data)
    return data
  },
  all: async () => orders,
}
