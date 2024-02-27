// components/myNumInput/myNumInput.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: ''
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputBlur(e) {
      const { value } = e.detail;
      e.detail.value = Number(value);
      this.triggerEvent('blur', e.detail);
    },
    input(e) {
      let { value } = e.detail;
      let filteredStr = "";
      let hasDecimalPoint = false;
      // 保留数字和一个小数点
      for (let i = 0; i < value.length; i++) {
        const char = value[i];

        if (char === ".") {
          if (!hasDecimalPoint) {
            filteredStr += char;
            hasDecimalPoint = true;
          }
        } else if (/\d/.test(char)) {
          filteredStr += char;
        }
      }
      value = filteredStr;
      // 小数点后只要有两个
      const regex = /^(\d*\.?\d{0,2})?$/;
      if (!regex.test(value)) {
        let integer = String(value).split('.')[0];
        let decimals = String(value).split('.')[1] || '';
        value = integer + '.' + decimals.slice(0, 2);
        wx.showToast({
          title: '小数最多输入两位',
          icon: 'none'
        })
      }

      e.detail.value = value;
      this.triggerEvent('input', e.detail);
    }
  }
})