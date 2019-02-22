import React, { Component } from 'react'
import BScroll from 'better-scroll';

class Scroll extends Component {

  SWrapperRef = React.createRef();

  componentDidMount() { this.initScroll(); }

  componentWillUnmount() { this.scroll && this.scroll.destroy(); }
  
  initScroll = () => {
    if (!this.SWrapperRef.current) { return; }
    this.scroll = new BScroll(this.SWrapperRef.current);
  }

  refreshScroll = () => { this.scroll && this.scroll.refresh(); }

  destroyScroll = () => { this.scroll.destroy(); }

  render() {
    const { style, className, children } = this.props;

    return (
      <div 
        ref={this.SWrapperRef}
        style={style}
        className={`scroll-wrapper ${className}`}
      >
        <div className="scroll-content">
          {children}
        </div>
      </div>
    );
  }
}

export default Scroll;