// const ps = new Promise(function(resolve, reject) {
//     setTimeout(() => {
//         resolve(1)
//     })
// })

// ps.then(
//     value => {

//     },
//     err => {

//     }
// )

const isFn = (fn) => typeof fn === 'function'

class Promise {
    constructor(handler) {
        this.value = null
        this.status = 'pending'
        this.onFulFilledArr = []
        this.onRejectedArr = []
        if (isFn(handler)) {
            handler(this._resolve.bind(this), this._reject.bind(this))
        }
    }
    _resolve (val) {
        if (this.status === 'pending') {
            this.status = 'fulFilled'
            this.value = val
            let cb
            while(cb = this.onFulFilledArr.shift()) {
                cb(val)
            }
        }
    }
    _reject (err) {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.value = err
            let cb
            while(cb = this.onRejectedArr.shift()) {
                cb(val)
            }
        }
    }
    _then (onFulFilled, onRejected) {

        return new Promise((nextFulFilled, nextRejected) => {
            const resolve = () => {
                if (!isFn(onFulFilled)) {
                    nextFulFilled(this.value)
                } else {
                    try {
                        let res = onFulFilled(this.value)
                        if (res instanceof Promise) {
                            res.then(nextFulFilled, nextRejected)
                        } else {
                            nextFulFilled(res)
                        }
                    } catch (e) {
                        nextRejected(e)
                    }
                }
            }

            const reject = () => {
                if (!isFn(onRejected)) {
                    nextRejected(this.value)
                } else {
                    try {
                        let res = nextRejected(this.value)
                        if (res instanceof Promise) {
                            res.then(nextFulFilled, nextRejected)
                        } else {
                            nextRejected(this.value)
                        }
                    } catch (e) {
                        nextRejected(this.value)
                    }
                }
            }
            if (this.status === 'pending') {
                this.onFulFilledArr.push(onFulFilled)
                this.onRejectedArr.push(onRejected)
            }
            else if (this.status === 'fulFilled'){
                resolve(this.value)
            } else {
                reject(this.value)
            }
        })

    }   
}
