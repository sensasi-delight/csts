import { processes } from "./Processes"

export default class Batch {
    constructor(init, _setState) {
        this.id = init.id || null
        this.product = init.product || {}
        this.qty = init.qty || null
        this.ingredients = init.ingredients || []
        this.invoices = init.invoices || []
		this.processes = init.processes || processes

        this._setState = _setState
    }

    isNew() {
        return this.id === null
    }

    setThis(obj) {
        this._setState(obj)
    }
}