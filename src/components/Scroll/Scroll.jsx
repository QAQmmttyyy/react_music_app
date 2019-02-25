import React, { Component } from 'react'
import BScroll from 'better-scroll';

import './Scroll.less';

class Scroll extends Component {

  SWrapperRef = React.createRef();

  componentDidMount() {
    this.initScroll();
  }

  componentWillUnmount() { this.scroll && this.scroll.destroy(); }
  
  initScroll = () => {
    if (!this.SWrapperRef.current) { return; }
    this.scroll = new BScroll(this.SWrapperRef.current, {click: true});
  }

  refreshScroll = () => { this.scroll && this.scroll.refresh(); }

  destroyScroll = () => { this.scroll.destroy(); }
  
  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }

  render() {
    const { style, className, children, ...restProps } = this.props;

    return (
      <div 
        ref={this.SWrapperRef}
        style={style}
        className={`scroll-wrapper ${className}`}
        {...restProps}
      >
        {children}
      </div>
    );
  }
}

export default Scroll;