import $ from '../plugins/jquery-3.5.1.min';

let data = {
  headerBoxHeight: 0, // 头部的高度
  isAutoScroll: false, // 是自动滚动
  clickScrollBtnId: undefined, // 用户多次点击顶部滚动按钮时，每一次的点击id
  scrollTop: 0, // 距离顶部的距离
  topSpaceArr: [],
  $headBox: null,
  doms: null,
  $tipBox: null, // 临时悬浮通知窗的dom
  tipBoxSpaceTop: 300, // 临时悬浮通知窗向下滚动的距离 (px)
  headDomClassName: '.headBox', // 头部的选择器
  menuBtns: '.headBox button[targetclassname]', // 菜单按钮们的选择器
  lineDomClassName: '.flagLine', // 下面横线的选择器
}

$(() => {
  // 设置头部高度
  setHeaderBoxHeight()

  // 绑定头部的点击事件 + 监听window滚动，设置头部按钮高亮
  setScrollBtn()
})

// 设置头部高度
function setHeaderBoxHeight() {
  data.headerBoxHeight = Math.ceil($(data.headDomClassName).height() || 0)
}

// 绑定头部的点击事件 + 监听window滚动，设置头部按钮高亮
function setScrollBtn() {
  data.doms = document.querySelectorAll(data.menuBtns)
  data.$headBox = $(data.headDomClassName)
  $(window).off('scroll', windowScroll)
  $(window).on('scroll', windowScroll)
  if (!data.doms || !data.doms.length) return
  data.topSpaceArr = [] // 存放着按钮和目标dom位置对象的数组
  for (let i = 0; i < data.doms.length; i++) {
    let dom = data.doms[i], $dom = $(dom)
    let targetClassName = dom.getAttribute('targetclassname')
    if (!targetClassName) continue
    let targetDom = document.querySelector('.' + targetClassName)
    if (!targetDom) continue
    let widthOut = $dom.outerWidth()
    let spaceLeft = $dom.position().left
    if (spaceLeft < 0) spaceLeft = 0
    data.topSpaceArr.push({
      width: Math.ceil(widthOut),
      spaceLeft: Math.ceil(spaceLeft),
      btnDom: dom,
      targetSpace: $dom.attr('first') ? 0 : targetDom.offsetTop - data.headerBoxHeight,
    })
    let targetclassname = dom.getAttribute('targetclassname')
    let inDoms = $(`[targetclassname=${targetclassname}]`)
    for (let i = 0; i < inDoms.length; i++) {
      inDoms[i].onclick = judge
    }
    // 绑定点击后跳转事件
    function judge() {
      let targetClassName = this.getAttribute('targetclassname')
      if (!targetClassName) return
      let targetDom = document.querySelector('.' + targetClassName)
      if (!targetDom) return
      let clickScrollBtnId = +new Date()
      data.clickScrollBtnId = clickScrollBtnId
      scrollSmoothTo($dom.attr('first') ? 0 : targetDom.offsetTop - data.headerBoxHeight, data.doms, this, clickScrollBtnId, data.topSpaceArr[i])
    }
  }
  windowScroll()
}
// window滚动事件
function windowScroll() {
  data.scrollTop = (document.documentElement.scrollTop || document.body.scrollTop)
  var scrollTop = data.scrollTop + 1
  if (data.isAutoScroll) return // 是自动滚动的，不计算
  if (data.topSpaceArr && data.topSpaceArr.length) {
    for (var i = 0; i < data.topSpaceArr.length; i++) {
      var obj = data.topSpaceArr[i]
      var targetSpace = obj.targetSpace
      if (targetSpace <= scrollTop) { // 滚动的超过了当前按钮目标
        if (!data.topSpaceArr[i + 1] || data.topSpaceArr[i + 1].targetSpace > scrollTop) { // 当前是最后一个目标，或者还没有到下一个目标，生效
          if (!obj.btnDom.classList.contains('active')) {
            for (var i = 0; i < data.doms.length; i++) {
              data.doms[i].classList.remove('active')
            }
            obj.btnDom.classList.add('active')
          }
          let $flagLine = $(data.lineDomClassName)
          if ($flagLine.attr('data_width') != obj.width || $flagLine.attr('data_left') != obj.spaceLeft) {
            $flagLine.css({width: obj.width, left: obj.spaceLeft})
            $flagLine.attr({data_width: obj.width, data_left: obj.spaceLeft})
          }
          break
        }
      }
    }
  }
}

// 滚动到某个高度 (这里当时为了符合业务需求,是自己封装的方法,可以改为使用jquery的滚动效果)
function scrollSmoothTo(position, doms, btnDom, clickScrollBtnId, obj) {
  if (clickScrollBtnId !== data.clickScrollBtnId) return
  // 先点亮按钮
  for (var i = 0; i < doms.length; i++) {
    doms[i].classList.remove('active')
  }
  btnDom.classList.add('active')
  let $flagLine = $(data.lineDomClassName)
  if ($flagLine.attr('data_width') != obj.width || $flagLine.attr('data_left') != obj.spaceLeft) {
    $flagLine.css({width: obj.width, left: obj.spaceLeft})
    $flagLine.attr({data_width: obj.width, data_left: obj.spaceLeft})
  }
  data.isAutoScroll = true
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      setTimeout(callback, 20)
    }
  }
  // 当前滚动高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // 滚动step方法
  var step = function() {
    if (clickScrollBtnId !== data.clickScrollBtnId) return
    // 距离目标滚动距离
    var distance = position - scrollTop
    // 目标滚动位置
    var space = distance / 10
    space > 0 && space < 3 ? space = 3 : ''
    space < 0 && space > -3 ? space = -3 : ''
    scrollTop = scrollTop + space
    if (Math.abs(distance) < 4) {
      data.isAutoScroll = false
      window.scrollTo(0, position)
    } else {
      window.scrollTo(0, scrollTop)
      requestAnimationFrame(step)
    }
  }
  step()
}