(function (undefined) {
    "use strict"
    var _global

    function Popover(options) {
        /*接收传入参数 */
        this.element = options.element
        this.placement = options.placement
        this.content = options.content
        this.triggle = options.triggle
        this.show = options.show
        this.time = Number(options.time.split("s")[0])

        this.init()
        this.event(this.element, this.triggle)
    }

    Popover.prototype = {
        /**初始化 */
        init: function () {
            this.divDom = document.createElement("div")
            this.element.appendChild(this.divDom)
            this.divDom.style.opacity = '0'
            this.divDom.style.padding = '0.1rem 0'
            this.divDom.style.border = '1px solid #666'
            this.divDom.style.borderRadius = '0.25rem'
            this.divDom.style.boxShadow = '0 0 1rem #ccc'
            this.divDom.style.cursor = 'pointer'
            this.divDom.style.overflow = 'hidden'
            this.divDom.innerHTML = this.content
            /*设置弹窗样式*/
            if (this.divDom.children[0].children !== "underfined") {
                for (var k = 0; k < this.divDom.children[0].children.length; k++) {
                    this.divDom.children[0].children[k].style.display = 'flex'
                    this.divDom.children[0].children[k].style.justifyContent = 'flex-start'
                    this.divDom.children[0].children[k].style.padding = '0.5rem'
                    //鼠标移入事件
                    this.divDom.children[0].children[k].onmouseover = function () {
                        this.style.backgroundColor = '#ccc'
                        this.style.color = 'red'
                    }
                    //鼠标移出事件
                    this.divDom.children[0].children[k].onmouseout = function () {
                        this.style.backgroundColor = ''
                        this.style.color = ''
                    }
                }
            }
            /*设置弹窗位置*/
            this.element.style.position = 'relative'
            this.divDom.style.position = 'absolute'
            this.setPlacement(this.divDom, this.element, this.placement)
            /*获取弹窗初始 高 宽*/
            if (typeof window.getComputedStyle == "undefined") return
            this.Height = parseFloat(window.getComputedStyle(this.divDom).height) //内容撑开的元素 getComputedStyle(element)获取宽高
            this.Width = parseFloat(window.getComputedStyle(this.divDom).width)
        },
        /**事件处理 */
        event: function (element, triggle) {
            var that = this
            /*点击事件 */
            if (triggle === 'click') {
                var flag = true
                element.onclick = function () {
                    if (flag) {
                        that.setShow(that.divDom, that.show, that.time)
                    } else {
                        that.setHide(that.divDom, that.show, that.time)
                    }
                    flag = that.toggle(flag)
                }
            }
            /*鼠标移入移出事件 */
            if (triggle === 'hover') {
                element.onmouseenter = function (e) {
                    //e = window.event || e
                    //var s = e.fromElement || e.relatedTarget
                    that.setShow(that.divDom, that.show, that.time)
                }
                element.onmouseleave = function (e) {
                    //e = window.event || e
                    //var s = e.fromElement || e.relatedTarget
                    that.setHide(that.divDom, that.show, that.time)
                }
            }
        },
        /**工具函数 */
        /*切换状态函数*/
        toggle: function (flag) {
            return flag = flag ? false : true
        },
        /*设置元素弹出位置函数*/
        setPlacement: function (element, referenceElement, placement) {
            switch (placement) {
                case 'left':
                    element.style.right = (referenceElement.offsetWidth - 2) + "px"
                    element.style.top = 0 + "px"
                    break
                case 'top':
                    element.style.left = 0 + "px"
                    element.style.bottom = (referenceElement.offsetHeight - 2) + "px"
                    break
                case 'right':
                    element.style.left = (referenceElement.offsetWidth - 2) + "px"
                    element.style.top = 0 + "px"
                    break
                case 'bottom':
                    element.style.left = 0 + "px"
                    element.style.top = (referenceElement.offsetHeight - 2) + "px"
                    break
                default:
                    element.style.left = 0 + "px"
                    element.style.top = (referenceElement.offsetHeight - 2) + "px"
            }
        },
        /**弹窗显示分类处理函数 */
        setShow: function (element, show, time, callback) {
            if (show === 'fade') {
                this.setAttr(element, "opacity", 1, time)
            }
            if (show === 'slide') {
                /* top bottom 上下弹窗*/
                if (element.style.left === '0px') {
                    element.style.height = 0
                    element.style.opacity = 1
                    this.setAttr(element, "height", this.Height, time)
                }
                /*left right 左右弹窗 */
                else {
                    element.style.width = 0
                    element.style.opacity = 1
                    this.setAttr(element, "width", this.Width, time)
                }
            }
            callback && callback(element)
        },
        /**弹窗隐藏分类处理函数 */
        setHide: function (element, show, time, callback) {
            if (show === 'fade') {
                this.setAttr(element, "opacity", 0, time)
            }
            if (show === 'slide') {
                /* top bottom 上下弹窗*/
                if (element.style.left === '0px') {
                    this.setAttr(element, "height", 0, time, function (element) {
                        element.style.opacity = 0
                    })
                    //element.style.opacity = 0
                }
                /*left right 左右弹窗 */
                else {
                    this.setAttr(element, "width", 0, time, function (element) {
                        element.style.opacity = 0
                    })
                    element.style.opacity = 0
                }
            }
            callback && callback(element)
        },
        getStyle: function (ele, attr) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(ele, false)[attr];
            } else {
                return ele.currentStyle[attr];
            }
        },
        setAttr: function (ele, attr, target, time, callback) {
            if (parseFloat(ele.style[attr]) === target) {
                return false
            }
            var interval = 25
            var count = time * 1000 / interval
            var speed = (target - parseFloat(ele.style[attr])) / count
            clearInterval(ele.timer);
            ele.timer = setInterval(function () {
                var current = parseFloat(ele.style[attr])
                if (attr === "opacity") {
                    ele.style[attr] = current + speed
                } else {
                    ele.style[attr] = current + speed + "px"
                }
                if (speed > 0) {
                    if (current >= target) {
                        clearInterval(ele.timer);
                        (attr === "opacity") ? (ele.style[attr] = target) : (ele.style[attr] = target + "px");
                        callback && callback(ele)
                    }
                } else {
                    if (current <= 0) {
                        clearInterval(ele.timer);
                        (attr === "opacity") ? (ele.style[attr] = 0) : (ele.style[attr] = 0 + "px");
                        callback && callback(ele)
                    }
                }
            }, interval);
        }
    }
    // 兼容处理 全局挂载
    _global = (function () { return this || (0, eval)('this') }())
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Popover
    } else if (typeof define === "function" && define.amd) {
        define(function () { return Popover })
    } else {
        !('Popover' in _global) && (_global.Popover = Popover)
    }

}())