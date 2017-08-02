export default class Tx {
  constructor(
    hash, from, gas, gasPrice, nonce, status,
    type, data, address) {
    this.hash = hash
    this.from = from
    this.gas = gas
    this.gasPrice = gasPrice
    this.nonce = nonce
    this.status = status
    this.type = type
    this.data = data // data can be used to store wallet name
    this.address = address
    this.threw = false
    this.error = null
    this.errorInfo = null
  }

  shallowClone() {
    return new Tx(
    this.hash, this.from, this.gas, this.gasPrice, this.nonce,
    this.status, this.type, this.data, this.address, this.threw,
    this.error, this.errorInfo)
  }

  sync = (ethereum, callback) => {
    ethereum.txMined(this.hash, (mined, receipt) => {
      var newTx = this.shallowClone()
      if (mined) {
        newTx.status = "mined"
      }
      else {
        newTx.status = "pending"
      }
      newTx.address = receipt.contractAddress
      var logs = receipt.logs
      if (newTx.type == "send" || newTx.type == "exchange") {
        if (logs.length == 0) {
          newTx.threw = true
        } else {
          var data = logs[0].data
          console.log(data)
        }
      }
      callback(newTx)
    })
  }
}
