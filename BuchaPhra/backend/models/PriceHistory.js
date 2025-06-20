const records = []
module.exports = {
  create: async (data) => {
    records.push(data)
    return data
  },
  all: async () => records,
}
