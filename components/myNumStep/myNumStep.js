// components/myNumStep/myNumStep.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String | Number,
      value: 0
    },
    inputWidth: {
      type: String,
      value: '115rpx'
    },
    buttonSize: {
      type: String,
      value: '60rpx'
    },
    min: {
      type: Number,
      value: 0
    },
    step: {
      type: Number,
      value: 0.01
    },
    decimalLength: {
      type: Number,
      value: 2
    }
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
    // stepperChange(e) {
    //   let value = e.detail;

    //   this.triggerEvent('change', e.detail);
    // },
    numChangePlus(e) {
      let value = Number(JSON.parse(JSON.stringify(this.properties.value)));
      value += Number(this.properties.step);
      this.triggerEvent('change',  value.toFixed(this.properties.decimalLength));
    },
    numChangeMinus(e) {
      let value = Number(JSON.parse(JSON.stringify(this.properties.value)));
      value -= Number(this.properties.step);
      if (value < Number(this.properties.min)) value = Number(this.properties.min);
      this.triggerEvent('change', value.toFixed(this.properties.decimalLength));
    }
  }
})