// components/myTree/myTree.js
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
    'alldata': function (val) {
      let objArr = [];
      function FlattenArray(objArr, allArr) {
        for (let item of allArr) {
          objArr.push(item);
          if (item.children && item.children.length > 0) {
            FlattenArray(objArr, item.children)
          }
        }
      }

      FlattenArray(objArr, val);
      this.setData({
        alldataObjArray: objArr
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    activeNames: [],
    alldataObjArray: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkList(e) {
      this.triggerEvent('checkList', e.detail)
    },
    disCheckList(e) {
      this.triggerEvent('disCheckList', e.detail)
    },
    addList(checkarr, arr) {
      for (let item of arr) {
        checkarr.push(item[this.data.nodeKey])
        if (item.children && item.children.length > 0) {
          this.addList(checkarr, item.children)
        }
      }
    },
    addParentID(checkList, alldata, pid) {
      if (pid === 0) return checkList;
      const idSet = new Set(checkList);

      let pid_arr = alldata.filter(item => item[this.data.nodeKey] === pid);
      pid_arr.forEach(item => idSet.add(item[this.data.nodeKey]));

      let new_pid = pid_arr[0][this.data.nodePKey];
      if (new_pid !== 0) {
        return this.addParentID(idSet, alldata, new_pid);
      }
      return Array.from(idSet);
    },
    // 取消选择权限
    treeItemDisCheck(e) {
      let checkList = [];
      const { children, item } = e.currentTarget.dataset;
      checkList.push(item[this.data.nodeKey]);

      if (children.length > 0) {
        // 如果长度大于0，则都选择上
        this.addList(checkList, children);
      }

      this.triggerEvent('disCheckList', checkList)
    },
    // addParentID(checkList, alldata, pid) {
    //   if (pid == 0) return checkList;
    //   let pid_arr = alldata.filter(item => {
    //     return item[this.data.nodeKey] == pid
    //   })
    //   let pids = pid_arr.map(item => item.id);

    //   checkList = [...new Set([...checkList, ...pids])];

    //   let new_pid = pid_arr[0].pid;
    //   if (new_pid != 0) {
    //     return this.addParentID(checkList, alldata, new_pid)
    //   }
    //   return checkList
    // },

    // 选择权限
    treeItemCheck(e) {
      let checkList = [];

      const { children, item } = e.currentTarget.dataset;
      checkList.push(item[this.data.nodeKey]);

      checkList = this.addParentID(checkList, this.data.alldataObjArray, item[this.data.nodePKey])

      // 添加父级权限
      // this.addParentID(checkList, this.properties.alldata, item[this.data.nodeKey]);

      if (children.length > 0) {
        // 如果长度大于0，则都选择上
        this.addList(checkList, children);
      }

      this.triggerEvent('checkList', checkList)
    },
    onChange(event) {
      // 从权限数组中判断是否有children，如果有则展开，没有则不展开
      this.setData({
        activeNames: event.detail,
      });
    },
  }
})