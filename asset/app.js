new Vue({
  el: '#app',
  data: {
    sum: 0,
    num: 0,
    evalText: '0',
    historyText: '0',
    justAnswer: false,
    errorCount: 0,
    fadeIn: false
  },
  methods: {
    flash() {
      this.fadeIn = true
      setTimeout(() => {
        this.fadeIn = false
      }, 100)
    },
    eval(text) {
      let sum = 0
      sum = eval(text)
      if (!Number.isInteger(sum)) {
        sum = sum.toFixed(2)
      }
      return sum
    },
    answer() {
      const calText = this.evalText.substr(0, this.evalText.length - 1)
      this.sum = this.eval(calText)
      this.evalText = this.sum
      this.justAnswer = true
      this.historyText = '0'
      this.flash()
    },
    ignoreLastInput() {
      this.evalText = this.evalText.substr(0, this.evalText.length - 1)
      this.historyText = this.historyText.substr(0, this.historyText.length - 1)
    },
    invalidCharAfterOperator() {
      return this.evalText.match(/[\*\-\+\/][\=\.]/)
    },
    doubleZero() {
      return this.evalText.match(/[\*\-\+\/]0{2}/) || this.evalText.match(/[\*\-\+\/]0\d/)
    },
    invalidDotNatation() {
      return this.evalText.split(/[\*\-\+\/]/g).some((i)  => {
        const greaterOneDot = i.match(/\.*\./g)
        return i.match(/\.{2}/g) || (greaterOneDot != null && greaterOneDot.length >= 2)
      })
    },
    duplicatedOperator() {
      return this.evalText.match(/[\*\-\+\/]{2}$/g)
    },
    isOperator(value) {
      return value.match(/[\*\-\+\/]/g)
    },
    clear() {
      this.evalText = '0'
      this.historyText = '0'
      this.sum = 0
      this.justAnswer = false
    },
    calculate(value) {
      if (value) {
        if (value === 'x') value = '*'
        if (value === '÷') value = '/'
        const exceedText = 'Exceed The Digit Limit'
        
        if (this.evalText == exceedText) {
          this.evalText = ''
        }
        
        if (this.justAnswer && value.match(/\d/)) {
          this.clear()
        }
        
        if (this.justAnswer && this.isOperator(value)){
          this.justAnswer = false
        }

        if (value.match(/\d/g)){
          if (this.evalText == '0') {
            this.evalText = ''
            this.historyText = ''
          }
        }
        this.evalText += value
        this.historyText += value
        
        if (this.invalidCharAfterOperator() || this.invalidDotNatation() || this.doubleZero()|| this.evalText.match(/\.[\*\-\+\/]/) ) {
          this.ignoreLastInput()
          return
        }
        
        if (this.sum.length > 8) {
          this.historyText = exceedText
          this.sum = 0
        }
        
        if (value.match(/\d/g)){
          this.sum = this.evalText.match(/\d*$/)[0]
        }
        
        const formulaLength = this.evalText.length
        if (value === 'ac') {
          this.clear()
        }
        

        if (this.isOperator(value)) {
          const countOperator = this.evalText.match(/[\*\-\+\/]/g).length
          if (this.duplicatedOperator()) {
            this.evalText = this.evalText.substr(0, this.evalText.length - 2) + value
            this.historyText = this.historyText.substr(0, this.historyText.length - 2) + value
          }
          if (countOperator > 1 && countOperator % 2 == 0) {
            const calText = this.evalText.substr(0, this.evalText.length - 1)
            this.sum = this.eval(calText)
            this.evalText = this.sum + value
            this.flash()
          }
        }
        if (value === '=') {
          this.answer()
        }
        if (this.sum.length > 8) {
          this.historyText = exceedText
          this.evalText = '0'
          this.sum = 0
        }
      }
    } 
  }
})