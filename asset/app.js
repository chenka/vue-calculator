new Vue({
  el: '#app',
  data: {
    sum: 0,
    num: 0,
    formulaText: '0',
    justAnswer: false,
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
      const calText = this.formulaText.substr(0, this.formulaText.length - 1)
      this.sum = this.eval(calText)
      this.formulaText = this.sum
      this.justAnswer = true
      this.flash()
    },
    ignoreLastInput() {
      this.formulaText = this.formulaText.substr(0, this.formulaText.length - 1)
    },
    invalidCharAfterOperator() {
      return this.formulaText.match(/[\*\-\+\/][\=0\.]/)
    },
    duplicatedOperator() {
      return this.formulaText.match(/[\*\-\+\/]{2}$/g)
    },
    isOperator(value) {
      return value.match(/[\*\-\+\/]/g)
    },
    clear() {
      this.formulaText = '0'
      this.sum = 0
      this.justAnswer = false
    },
    calculate(value) {
      if (value) {
        if (value === 'x') value = '*'
        if (value === '÷') value = '/'
        const exceedText = 'Exceed The Digit Limit'
        
        if (this.formulaText == exceedText) {
          this.formulaText = ''
        }
        
        if (this.justAnswer && value.match(/\d/)) {
          this.clear()
        }
        
        if (this.justAnswer && this.isOperator(value)){
          this.justAnswer = false
        }


        if (value.match(/\d/g)){
          if (this.formulaText == '0') this.formulaText = ''
        }
        this.formulaText += value
        
        if (this.invalidCharAfterOperator()) {
          this.ignoreLastInput()
          return
        }
        
        if (this.formulaText.length > 9) {
          this.formulaText = exceedText
          this.sum = 0
          return 
        }
        
        if (value.match(/\d/g)){
          this.sum = this.formulaText.match(/\d*$/)[0]
        }
        
        const formulaLength = this.formulaText.length
        if (value === 'ac') {
          this.clear()
        }
        

        if (this.isOperator(value)) {
          const countOperator = this.formulaText.match(/[\*\-\+\/]/g).length
          if (this.duplicatedOperator()) {
            this.formulaText = this.formulaText.substr(0, this.formulaText.length - 2) + value
          }
          if (countOperator > 1 && countOperator % 2 == 0) {
            const calText = this.formulaText.substr(0, this.formulaText.length - 1)
            this.sum = this.eval(calText)
            this.formulaText = this.sum + value
            this.flash()
          }
        }
        if (value === '=') {
          this.answer()
        }
      }
    } 
  }
})