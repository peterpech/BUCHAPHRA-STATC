const crops = []
module.exports = {
  create: async (data) => {
    crops.push(data)
    return data
  },
  all: async () => crops,
}
