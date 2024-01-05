// components/myTable/myTable.js
import { add } from '../../utils/math';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    prop: {
      type: Array,
      value: []
    },
    data: {
      type: Array,
      value: []
    },
    // 是否显示合计
    showSummary: {
      type: Boolean,
      value: false
    },
    // 底部合计的粘性定位高度
    stickyBottomHeight: {
      type: String,
      value: '0rpx'
    }
  },
  observers: {
    data: function (newVal) {
      let fixed_num = 0;
      let sumWidth = 0;
      for (let i = 0; i < this.properties.prop.length; i++) {
        let item = this.properties.prop[i];
        if (item.fixed) {
          fixed_num++;
        }
        sumWidth += Number(item.width || 250);
      }
      if (fixed_num > 1) {
        console.warn('fixed只能给一个配置列设置')
        return false
      }

      if (this.properties.showSummary) {
        // 如果需要合计 就先计算合计再赋值
        this.data.totalRow = {};
        const { prop } = this.properties;
        prop.forEach(item => {
          this.data.totalRow[item.key] = 0;
        })
        newVal.forEach(item => {
          prop.forEach(propitem => {
            let value = item[propitem.key];
            if (Number(value)) {
              this.data.totalRow[propitem.key] = add(this.data.totalRow[propitem.key], Number(value));
            }
          })
        })
      }
      this.setData({
        sumWidth,
        dateData: newVal,
        totalRow: this.data.totalRow
      })
    }
  },
  lifetimes: {
    // ready() {
    //   console.warn('数据异常')
    // }
  },
  /**
   * 组件的初始数据
   */
  data: {
    dateData: [

    ],
    totalRow: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toRecord(e) {
      // console.log(e);
      const { flag } = e.currentTarget.dataset;
      console.log(flag);
      if (flag) {
        console.log('跳转到上课记录');
      }
    }
  }
})
