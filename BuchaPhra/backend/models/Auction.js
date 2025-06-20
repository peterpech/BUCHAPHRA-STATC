const auctions = []

module.exports = {
  create: async (data) => {
    auctions.push(data)
    return data
  },
  all: async () => auctions,
}
