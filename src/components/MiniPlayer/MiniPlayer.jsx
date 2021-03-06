import React, { Component } from 'react';
import { List } from "antd-mobile";

import _ from 'lodash';

import CoverPlaceholder from '../../images/cover-placeholder.png';
import './MiniPlayer.less';

const Item = List.Item;
const Brief = Item.Brief;

class MiniPlayer extends Component {

  render() {
    let {
      transitionClass,
      curSong,
      isPauseIcon,
      clickPlayPauseHandler,
      toggleFullplayer,
      togglePlayingList,
    } = this.props;
    // test
    // curSong = {
    //   "id": 437608773,
    //   "name": "无法长大",
    //   "artists": [{
    //     "name": "赵雷",
    //     "link": "/artist?id=6731"
    //   }],
    //   "album": {
    //     "name": "无法长大",
    //     "link": "/album?id=34943558",
    //     "picUrl": "http://p1.music.126.net/zy9EZ2dcsofYlVAn-nb-wA==/3412884129074161.jpg"
    //   },
    // };

    // play plp btns
    const extraContent = (
      <div className="miniplayer-btns-wrapper">
        <div 
          className={`btn ${isPauseIcon ? 'pause' : 'play'}-icon`}
          onClick={clickPlayPauseHandler}
        ></div>
        <div
          className="btn playlist-icon"
          onClick={togglePlayingList}
        ></div>
      </div>
    );

    let contentItem = null;

    if (_.isEmpty(curSong)) {
      contentItem = (
        <Item
          className="miniplayer-content"
          extra={extraContent}
          multipleLine
        >
          听我想听的歌
        </Item>
      );
    } else {
      const {
        name,
        artists,
        album,
      } = curSong;
  
      // album cover 
      let imgSrc = '';
      // 判断条件可能要改
      if (album.picUrl && album.picUrl.length && album.picUrl.includes('http')) {
        imgSrc = `${album.picUrl}`;
      } else {
        imgSrc = CoverPlaceholder;
      }

      contentItem = (
        <Item
          className="miniplayer-content"
          thumb={imgSrc}
          extra={extraContent}
          onClick={toggleFullplayer}
          activeStyle={{ backgroundColor: '#fff'}}
          multipleLine
        >
          {name}
          <Brief>{artists.map(val => val.name).join('/')}</Brief>
        </Item>
      );
    }

    return (
      <div className={`miniplayer ${transitionClass}`}>
        {contentItem}
      </div>
    );
  }
}
 
export default MiniPlayer;