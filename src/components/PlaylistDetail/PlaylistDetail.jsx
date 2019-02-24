import React from 'react';
import { NavBar, Icon, List, Result } from 'antd-mobile';
// import BScroll from 'better-scroll';
import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';
import PlaylistCover from '../PlaylistCover/PlaylistCover.jsx';
import Loading from '../Loading/Loading.jsx';

import PlayIcon from './images/playall.png';
import './PlaylistDetail.less';

const Item = List.Item;

class PlaylistDetail extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      songlist: [],
      isLoading: false,
    };
    this.SWrapperRef = React.createRef();
  }

  componentDidMount() {
    // this.initScroll();
    this.getSonglist();
  }

  // componentDidUpdate() {
  //   this.refreshScroll();
  // }

  // componentWillUnmount() {
  //   this.scroll && this.scroll.destroy();
  // }
  
  // initScroll = () => {
  //   if (!this.SWrapperRef.current) {
  //     return;
  //   }

  //   this.scroll = new BScroll(this.SWrapperRef.current);
  // }

  // refreshScroll = () => {
  //   this.scroll && this.scroll.refresh();
  // }

  // destroyScroll = () => {
  //   this.scroll.destroy();
  // }

  getSonglist = () => {
    this.setState({isLoading: true});

    const searchApi = `https://api.mlwei.com/music/api/wy/?key=523077333&cache=1&type=songlist&id=${this.plId}`;

    window.fetch(searchApi, {
      method: 'GET',
      headers: { 'Accept': '*' },
      mode: 'cors'
    }).then(response => {
      // console.log(response);
      return response.status === 200 ? response.json() : {};
    }).then(data => {
      // console.log('data',data);
      let resultData = [];
      if (data.Body) {
        resultData = data.Body.map(song => {
          const { id, title, author, pic } = song;
          return {
            id: id,
            link: `/song?id=${id}`,
            name: title,
            artists: [{name: author}],
            album: {picUrl: pic}
          };
        });
      }
      console.log('resultData',resultData);
      this.setState({
        songlist: resultData,
        isLoading: false,
      });
      
    }).catch(reason => {
      console.log(reason);
      this.setState({isLoading: false});
    });
  }

  handleClickPlayallOrAddall(funcPlayallOrAddall) {
    const songlist = _.cloneDeep(this.state.songlist);
    funcPlayallOrAddall(songlist);
  }

  handlePlaySong(ev, funcPlaySong, songIndex) {
    ev.stopPropagation();
    funcPlaySong(_.cloneDeep(this.state.songlist[songIndex]));
  }

  render() {
    const { transitionClass, playlistIntro, toggleShowPlDetail } = this.props;
    const { songlist, isLoading } = this.state;
      
    const {
      id,
      coverUrl,
      name,
      playCount,
      author,
    } = playlistIntro;

    this.plId = id;
    
    return (
      <PlayerContext.Consumer>
        {({ playerState, playAll, playSong }) => {

          const listContent = songlist.length && songlist.map((song, idx) => {
            const {
              id,
              name,
              artists,
              album,
            } = song;
    
            let artistsTitle = artists.map(artist => artist.name).join('/');
    
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

          console.log('listContent',!(listContent));

          return (
            <div className={`PlaylistDetail ${transitionClass}`}>
              <div className="pld-navbar-wrapper">
                <NavBar
                  icon={<Icon type="left"/>}
                  onLeftClick={toggleShowPlDetail}
                >
                  歌单
                </NavBar>
              </div>
              
              <div 
                // ref={this.SWrapperRef}
                className="scroll-wrapper"
                style={playerState.playingList.length ? {paddingBottom: '56px'} : {paddingBottom: '0px'}}
              >
                <div className="scroll-content">

                  {/* info sec 可抽出为容器组件 */}
                  <section className="my-plinfo-wrap">
                    <PlaylistCover
                      src={`${coverUrl}?param=336y336`}
                      style={{
                        width: '1.12rem',
                        height: '1.12rem',
                      }}
                      playCount={playCount}
                    />

                    {/* intro */}
                    <div className="plinfo-right">
                      <h2 className="f-brk title">
                        {name}
                      </h2>
                      <div className="author f-thide">
                        {/* <div className="avatar">
                          <img src={author.avatarUrl} alt="ava" />
                        </div> */}
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
                          共({songlist.length})首
                        </span>
                      </div>
                    </Item>
                  </div>
                  {/* song list */}
                  <List className={listContent ? '':'no-content'}>
                    {listContent ? listContent : (
                      isLoading ? (
                        <div className="loading-box"><Loading /></div>
                      ) : (
                        <div className="result-box"><Result title="网络开小差了" /></div>
                        
                      )
                    )}
                  </List>

                </div>
              </div>

              {/* 模糊背景 可抽出为组件 */}
              <div className="bg-wrap">
                <div 
                  className="fullscreen-blur-bg" 
                  style={{
                    backgroundImage: `url(${coverUrl}?param=336y336)`
                  }}
                >
                </div>
              </div>
            </div>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default PlaylistDetail;