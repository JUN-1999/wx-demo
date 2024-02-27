// components/myTreeBox/myTreeBox.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: []
    },
    alldata: {
      type: Array,
      value: []
    },
    defaultCheckedKeys: {
      type: Array,
      value: []
    },
    nodePKey: {
      type: String,
      value: 'pid'
    },
    nodeKey: {
      type: String,
      value: 'id'
    },
    nodeValue: {
      type: String,
      value: 'value'
    }
  },
  observers: {
    'data': function (val) {
      this.setData({
        powerList: val
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    powerList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 树结构改动事件(选择)
    checkList(e) {
      this.triggerEvent('check', [...new Set([...this.data.defaultCheckedKeys, ...e.detail])])
    },
    // 树结构改动事件(取消选择)
    disCheckList(e) {
      const dis_check_list = e.detail;
      let { defaultCheckedKeys } = this.data;

      defaultCheckedKeys = defaultCheckedKeys.filter(item => {
        return !dis_check_list.includes(item)
      })
 
      this.triggerEvent('check', defaultCheckedKeys)
    },
  }
})