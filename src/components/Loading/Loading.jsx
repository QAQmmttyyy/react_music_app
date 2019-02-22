import React from 'react';
import './Loading.less';

class Loading extends React.Component {
  render() {
    return (
      <div className="loading">
        <i className="loading-icon"></i>
        <p className="loading-text">正在加载</p>
      </div>
    );
  }
}

export default Loading;