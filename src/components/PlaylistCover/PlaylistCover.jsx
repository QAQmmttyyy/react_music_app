import React from 'react';

import './PlaylistCover.less';

class PlaylistCover extends React.Component {
  render() {
    const { src, style, playCount } = this.props;

    return (
      <div className="pl-cover" style={style}>
        <img 
          className="cover" 
          src={src}
          alt="cover"
        />
        <span className="u-earp play-num">{playCount}</span>
      </div>
    );
  }
}

export default PlaylistCover;