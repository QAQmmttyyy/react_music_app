import React from 'react';
import { List } from 'antd-mobile';

import PlayerContext from '../../context/PlayerContext';

import './PlayingList.less';

const Item = List.Item;

class PlayingList extends React.Component {

  componentDidMount() {
    window.document.querySelector('.playing-list .active-song').scrollIntoView();
  }
  
  render() {
    const { transitionClass, togglePlayingList } = this.props;
    
    return (
      <PlayerContext.Consumer>
        {({ playerState, play, deleteSong, clearPlaylist }) => {
          const {
            playingList,
            curSongIndex,
          } = playerState;

          const extraClearBtn = (
            <div
              className="btn delete-icon"
              onClick={() => clearPlaylist()}
            ></div>
          );

          const listItemArr = playingList.map((song, idx) => {
            const {
              id,
              name,
              artists,
            } = song;
    
            const extraCloseBtn = (
              <div
                className="btn close-icon"
                onClick={(ev) => {
                  ev.stopPropagation();
                  deleteSong(idx);
                }}
              ></div>
            );

            return (
              <Item 
                key={id}
                className={`${curSongIndex === idx ? 'active-song' : ''}`}
                extra={extraCloseBtn}
                onClick={() => play(idx)}
              >
                {name}
                <span className="song-artists-alb">
                  {' - ' + artists.map(val => val.name).join('/')}
                </span>
              </Item>
            );
          });

          return (
            <div 
              className={`playing-list ${transitionClass}`}
              onTouchStart={(ev) => ev.stopPropagation()}
            >
              <Item
                extra={extraClearBtn}
                multipleLine
              >
                播放列表
                <span className="song-num">
                  共({playingList.length})首
                </span>
              </Item>
              <List>
                {listItemArr}
              </List>
              <Item
                className="close-btn"
                onClick={togglePlayingList}
                multipleLine
              >
                关闭
              </Item>
            </div>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default PlayingList;