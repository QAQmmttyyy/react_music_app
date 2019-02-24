import React from 'react';
import './Loading.less';
import LoadImg from './images/loading-64.svg';

class Loading extends React.Component {
  render() {
    return (
      <div className="loading">
        <img src={LoadImg} alt="loading"/>
        {/* <i className="loading-icon"></i> */}
        {/* <p className="loading-text">正在加载</p> */}
      </div>
    );
  }
}

export default Loading;