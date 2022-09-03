import moment from "moment";
import processes from "../classes/Processes";
import ApiHandler from "./ApiHandler";

export default class Batch {

  static processesTemplate = processes;
  static processIdSequence = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ]

  constructor(init = undefined) {
    if (init) {
      this.id = init.id || null
      this.date = init.date || null
      this.qty = init.qty || null
      this.ingredients = init.ingredients || []
      this.invoices = init.invoices || []
      this.processes = init.processes || []
    }
  }

  isNew = () => Boolean(!this.createdAt)

  static isIdExists = async (id, date) => {
    return await ApiHandler.readBatch(id, [{ key: 'date', value: date }])
      .then(response => response.json())
      .then(response => {
        return Boolean(response.data) && !response.message?.includes(id + ' does not exist')
      })
  }

  static find = (id, date) => new Promise(async resolve => {
    return ApiHandler.readBatch(id, [{ key: 'date', value: date }])
      .then(response => response.json())
      .then(response => resolve(new Batch(response.data)))
  })

  save = async () => {
    if (this.isNew()) {
      this.createdAt = moment().format()
      return await ApiHandler.createBatch(this)
    }

    this.updatedAt = moment().format()
    return await ApiHandler.updateBatch(this)
  }

  getNReceived = () => this.getReceiveProcess()?.qtyEstimated || 0;
  getNfail = () => this.processes?.reduce((a, b) => a + (parseInt(b.nFail) || 0), 0);
  getChickenQty = () => this.getNReceived() - this.getNfail();
  getProducts = () => this.getPackingProcess()?.products || []
  getProductQty = productId => {
    const product = this.processes[12]?.products.find(product => productId === product.id)
    const nPackFail = this.processes[13]?.nPackFails.find(nPackFail => productId === nPackFail.productId)

    return (product?.nPack || 0) - (nPackFail?.nPackFail || 0);
  }

  getUpcomingProcess = () => Batch.processesTemplate[this.processes.length]
  getLastProcess = () => Batch.processes[this.processes.length - 1]
  getPrevProcess = processId => this.getProcess(Batch.processIdSequence[Batch.processIdSequence.findIndex(id => id === processId) - 1])
  getProcess = processId => this.processes.find(process => process.id === processId)
  getProcessIndex = processId => this.processes.findIndex(process => process.id === processId)
  setProcess = process => this.getProcessIndex(process.id) === -1 ? false : this.processes[this.getProcessIndex(process.id)] = process

  getProcessTemplate = processId => Batch.processesTemplate.find(process => process.id === processId)


  isFinished = () => Boolean(this.getStoringProcess()?.createdAt)
  getFinishedAt = () => moment(this.getStoringProcess()?.datetime).format('YYYY-MM-DD HH:mm')

  getReceiveProcess = () => this.getProcess(1)
  getPackingProcess = () => this.getProcess(13)
  getStoringProcess = () => this.getProcess(14)
}