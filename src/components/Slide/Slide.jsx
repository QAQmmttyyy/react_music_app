import React, { Component } from 'react';
import BScroll from 'better-scroll';

import './Slide.less';

class Slide extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      dots: [],
      currentPageIndex: 0,
    }
    this.slideRef = React.createRef()
    this.slideGroupRef = React.createRef()
  }

  componentDidMount() {
    this.update()

    window.addEventListener('resize', () => {
      if (!this.slide || !this.slide.enabled) {
        return
      }
      window.clearTimeout(this.resizeTimer)
      this.resizeTimer = window.setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.props.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  }
  componentWillMount() {
    // this.slide.disable()
    window.clearTimeout(this.timer)
  }
  // methods: 
  update = () => {
    if (this.slide) {
      this.slide.destroy()
    }
    this.init()
  }
  refresh = () => {
    this._setSlideWidth(true)
    this.slide.refresh()
  }
  prev = () => {
    this.slide.prev()
  }
  next = () => {
    this.slide.next()
  }
  init = () => {
    window.clearTimeout(this.timer)
    this.setState({currentPageIndex: 0})
    this._setSlideWidth()
    if (this.props.showDot) {
      this._initDots()
    }
    this._initSlide()
    if (this.props.autoPlay) {
      this._play()
    }
  }
  _setSlideWidth = (isResize) => {
    this.children = this.slideGroupRef.current.children
    let width = 0
    let slideWidth = this.slideRef.current.clientWidth
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i]
      this.addClass(child, 'slide-item')
      child.style.width = slideWidth + 'px'
      width += slideWidth
    }
    if (this.props.loop && !isResize) {
      width += 2 * slideWidth
    }
    this.slideGroupRef.current.style.width = width + 'px'
  }
  _initSlide = () => {
    // console.log(this.props.threshold)
    this.slide = new BScroll(this.slideRef.current, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      snap: {
        loop: this.props.loop,
        threshold: this.props.threshold,
        speed: this.props.speed
      },
      bounce: false,
      stopPropagation: true,
      click: this.props.click
    })
    this.slide.on('scrollEnd', this._onScrollEnd)
    this.slide.on('touchEnd', () => {
      if (this.props.autoPlay) {
        this._play()
      }
    })
    this.slide.on('beforeScrollStart', () => {
      if (this.props.autoPlay) {
        window.clearTimeout(this.timer)
      }
    })
  }
  _onScrollEnd = () => {
    let pageIndex = this.slide.getCurrentPage().pageX
    this.setState({currentPageIndex: pageIndex})
    if (this.autoPlay) {
      this._play()
    }
  }
  _initDots = () => {
    let dots = new Array(this.children.length)
    for (let idx = 0; idx < dots.length; idx++) {
      dots[idx] = idx;
    }
    this.setState({dots: dots})
  }
  _play = () => {
    window.clearTimeout(this.timer)
    this.timer = window.setInterval(() => {
      this.slide.next()
    }, this.props.interval)
  }
  // common method dom
  hasClass = (el, className) => {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }
  
  addClass = (el, className) => {
    if (this.hasClass(el, className)) {
      return
    }
  
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }

  render() {
    const { dots, currentPageIndex } = this.state;

    return (
      <div className="slide" ref={this.slideRef}>
        <div className="slide-group" ref={this.slideGroupRef}>
          {this.props.children}
        </div>
        {this.props.showDot ? (
          <div className="dots">
            {dots.map((val, idx) => (
              <span
                key={idx}
                className={
                  `dot ${currentPageIndex === idx ? 'active':''}`
                }
              ></span>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

Slide.defaultProps = {
  loop: true,
  autoPlay: true,
  interval: 4000,
  showDot: true,
  click: true,
  threshold: 0.3,
  speed: 400,
}

export default Slide;