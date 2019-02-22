import React from 'react';
import { NavBar, Icon, List } from 'antd-mobile';
import BScroll from 'better-scroll';

import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';
import PlayIcon from './images/playall.png';
import PlaylistCover from '../PlaylistCover/PlaylistCover.jsx';

import './PlaylistDetail.less';

const Item = List.Item;

class PlaylistDetail extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      plDetail: {}
    };
    this.plID = '';

    this.SWrapperRef = React.createRef();
  }

  componentDidMount() {
    this.initScroll();
    // window.setTimeout(this.getPldData, 100);
    this.getPldData();
  }

  componentDidUpdate() {
    this.refreshScroll();
  }

  componentWillUnmount() {
    this.scroll && this.scroll.destroy();
  }
  
  initScroll = () => {
    if (!this.SWrapperRef.current) {
      return;
    }

    this.scroll = new BScroll(this.SWrapperRef.current, {
      bounce: false,
    });
  }

  refreshScroll = () => {
    this.scroll && this.scroll.refresh();
  }

  destroyScroll = () => {
    this.scroll.destroy();
  }

  getPldData = () => {
    // p0 页数 可变
    const pldUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/playlist_detail/all/pl-${this.plID}.json`;
  
    window.fetch(pldUrl).then(
      response => response.statusText === 'OK' ? response.json() : {}
    ).then(
      data => {
        this.setState({ plDetail: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }

  handleClickPlayallOrAddall(funcPlayallOrAddall) {
    const songlist = _.cloneDeep(this.state.plDetail.songlist);
    funcPlayallOrAddall(songlist);
  }

  handlePlaySong(ev, funcPlaySong, songIndex) {
    ev.stopPropagation();
    funcPlaySong(_.cloneDeep(this.state.plDetail.songlist[songIndex]));
  }

  render() {
    const { location, history } = this.props
    this.plID = location.search.split('=')[1];

    if (this.state.plDetail.hasOwnProperty('id')) {
      
      const {
        coverUrl,
        title,
        author,
        songNum,
        playNum,
        songlist,
      } = this.state.plDetail;
  
      const playCount = playNum >= 10000 ? `${parseInt(playNum / 10000)}万` : playNum;

      
      return (
        <PlayerContext.Consumer>
          {({ playerState, playAll, addAll, playSong }) => {

            const listItemArr = songlist.map((song, idx) => {
              const {
                id,
                name,
                artists,
                album,
              } = song;
      
              let artistsTitle = artists.map(
                artist => artist.name
              ).join('/');
      
              return (
                <Item 
                  key={id}
                  className="mty-list-item"
                  activeStyle={{
                    backgroundColor: '#ccc'
                  }}
                  onClick={(ev) => {this.handlePlaySong(ev, playSong, idx)}}
                >
                  <div className="s-index">{idx + 1}</div>
                  <div className="s-detail-wrap">
                    <div className="s-info">
                      <div className="s-name f-thide">
                        {name}
                      </div>
                      <div className="s-artists-alb f-thide">
                        {artistsTitle} - {album.name}
                      </div>
                    </div>
                  </div>
                </Item>
              );
            });

            return (
              <div className="PlaylistDetail">
                <NavBar
                  className="my-pld-navbar"
                  icon={<Icon type="left"/>}
                  onLeftClick={() => history.goBack()}
                >
                  歌单
                </NavBar>
                
                <div 
                  ref={this.SWrapperRef}
                  className="scroll-wrapper"
                  style={playerState.playingList.length ? {paddingBottom: '56px'} : {paddingBottom: '0px'}}
                >
                  <div className="scroll-content">

                    {/* info sec 可抽出为容器组件 */}
                    <section className="my-plinfo-wrap">
                      <PlaylistCover
                        src={`${coverUrl}?param=512y512`}
                        style={{
                          width: '1.12rem',
                          height: '1.12rem',
                        }}
                        playCount={playCount}
                      />

                      {/* intro */}
                      <div className="plinfo-right">
                        <h2 className="f-brk title">
                          {title}
                        </h2>
                        <div className="author f-thide">
                          <div className="avatar">
                            <img src={author.avatarUrl} alt="ava" />
                          </div>
                          {author.name}
                        </div>
                      </div>
                    </section>
                    
                    {/* plyall btn */}
                    <div className="playall-btn-wrapper">
                      <Item 
                        className="mty-list-item"
                        activeStyle={{
                          backgroundColor: '#ddd'
                        }}
                        onClick={() => {this.handleClickPlayallOrAddall(playAll)}}
                      > 
                        <div className="playall-btn">
                          <img 
                            src={PlayIcon} 
                            alt="playicon"
                          />
                          <span>播放全部</span>
                          <span className="song-num">
                            共({songNum})首
                          </span>
                        </div>
                      </Item>
                    </div>
                    {/* song list */}
                    <List>
                      {listItemArr}
                    </List>

                  </div>
                </div>

                {/* 模糊背景 可抽出为组件 */}
                <div className="bg-wrap">
                  <div 
                    className="fullscreen-blur-bg" 
                    style={{
                      backgroundImage: `url(${coverUrl}?param=512y512)`
                    }}
                  >
                  </div>
                </div>
              </div>
            );
          }}
        </PlayerContext.Consumer>
      );

    } else {
      // TODO 占位符元素
      return (
        <div></div>
        // <Loading key="loading"/>
      );
    }
  }
}

export default PlaylistDetail;