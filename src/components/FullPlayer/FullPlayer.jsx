import React from 'react';
import { NavBar, Icon, Slider } from 'antd-mobile';
import { Transition } from 'react-transition-group';
import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';
import CoverPlaceholder from '../../images/cover-placeholder.png';
import './FullPlayer.less';

class FullPlayer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      lyric: [],
      timestampArr: [],
      showCover: true,
      showLyric: false,
    };

    this.songId = 0;
    this.diffSong = false;
    this.curLyricIndex = -1;
  }

  componentDidMount() {
    this.getLyric();
  }
  componentDidUpdate() {
    if (this.diffSong) {
      this.getLyric();
    }
  }

  getLyric = () => {
    // const lrcUrl = `/api_mock_data/lyric/lyric-${this.songId}.json`;
    // const lrcUrl = `/api_mock_data/lyric/lyric-64063.json`;
    const lrcUrl = `https://api.mlwei.com/music/api/wy/?key=523077333&cache=1&type=lrc&id=${this.songId}`;
    console.log(lrcUrl);
    
    window.fetch(
      lrcUrl,
      {
        method: 'GET',
        headers: {
          'Accept': '*'
        },
        mode: 'cors'
      }
    ).then(
      response => {
        console.log(response);
        return response.status === 200 ? response.text() : null;
      }
    ).then(
      data => {
        if (data) {
          
          console.log(data);
          const lrcArr = data.split('\n');
          // state
          const 
            lyric = [],
            timestampArr = [];
  
          lrcArr.forEach((lrc) => {
            const matchPart = lrc.match(/\[(.*)\](.*)/);
  
            if (matchPart) {
              
              const 
                timestampParts = matchPart[1].trim().split(':'),
                part1 = parseInt(timestampParts[0]) * 60,
                part2 = parseFloat(timestampParts[1]),
                timestamp = part1 + part2;
              
              if (!isNaN(timestamp)) {
                lyric.push(matchPart[2].trim());
                timestampArr.push(timestamp);
              }
            }
          });
  
          console.log(lyric);
          console.log(timestampArr);
  
          this.setState({
            lyric: lyric,
            timestampArr: timestampArr,
            curLyricIndex: 0,
          });
        }
      }
    ).catch(
      reason => {
        console.log(reason);
        this.setState({
          lyric: [],
          timestampArr: [],
        });
      }
    );
  }

  handleClickLyric = () => {
    this.setState({
      showCover: true,
      showLyric: false,
    });
  }
  handleClickCover = () => {
    this.setState({
      showCover: false,
      showLyric: true,
    });
  }

  render() {
    let {
      transitionClass,
      curSong,
      playState,
      mode,
      clickPlayPauseHandler,
      clickPrevBtnHandler,
      clickNextBtnHandler,
      clickModeBtnHandler,
      changeProgressHandler,
      afterChangeProgressHandler,
      toggleFullplayer,
      togglePlayingList,
    } = this.props;

    const { lyric, timestampArr, showCover, showLyric } = this.state;

    if (_.isEmpty(curSong)) {
      return (
        <div className={`fullplayer ${transitionClass}`}>
          <NavBar
            className="my-fullplayer-navbar"
            icon={<Icon type="down"/>}
            onLeftClick={toggleFullplayer}
          >
            听我想听的歌
          </NavBar>

          <div className="mid-wrapper">
            <div className="cd-box">
              <div className="cd-wrapper">
                <div className="cd">
                  <img
                    className="image"
                    src={CoverPlaceholder}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="background"></div>
        </div>
      );
    }

    // else
    const { id, name, artists, album} = curSong;

    const {
      duration,
      curTime,
      playProgress,
      isPauseIcon,
      curTimestamp,
    } = playState;

    this.diffSong = this.songId !== id;
    this.songId = id;

    const navBarTitleCnt = (
      <div className="navbar-title-content">
        <p className="song-name f-thide">{name}</p>
        <p className="artists-name f-thide">
          - {artists.map(val => val.name).join('/')} -
        </p>
      </div>
    );

    // lyric
    let 
      curLyricIndex = 0,
      lyricContent = null,
      translateY = 0,
      maxTranslateY = 0;

    if (lyric.length) {
      // curLyricIndex
      curLyricIndex = _.findLastIndex(timestampArr, val => val < curTimestamp);
      this.curLyricIndex = curLyricIndex;
      // lyricContent
      lyricContent = lyric.map((val, idx) => {
        const lrcCls = `sentence${
          idx === curLyricIndex ? ' is-curSentence' : ''
        }`;

        const sentenceEl = (
          <p 
            id={idx}
            key={idx}
            style={(val === '') ? {height: '18px'} : {}}
            className={lrcCls}
          >
            {val}
          </p>
        );

        return sentenceEl;
      });

      // 34px 为一行歌词的行高
      translateY = 128 - curLyricIndex * 40;
      maxTranslateY = 128 - lyric.length * 40;

      if (translateY < maxTranslateY) {
        translateY = maxTranslateY;
      }
    }

    // album cover 
    let imgSrc = '';
    // 判断条件可能要改
    if (album.picUrl && album.picUrl.length && album.picUrl.includes('http')) {
      imgSrc = `${album.picUrl}`;
    } else {
      imgSrc = CoverPlaceholder;
    }

    const progress = parseFloat(playProgress);

    return (
      <PlayerContext.Consumer>
        {({ playerState, play, pause }) => {
          const {
            curSongIndex,
          } = playerState;

          return (
            <div className={`fullplayer ${transitionClass}`}>
              <NavBar
                className="my-fullplayer-navbar"
                icon={<Icon type="down"/>}
                onLeftClick={toggleFullplayer}
              >
                {navBarTitleCnt}
              </NavBar>

              <div className="mid-wrapper">
                {/* cd */}
                <Transition
                  in={showCover}
                  timeout={200}
                  mountOnEnter
                  unmountOnExit
                >
                  {(status) => {
                    return (
                      <div
                        className={`cd-box fade fade-${status}`}
                        onClick={() => this.handleClickCover()}
                      >
                        <div className="cd-wrapper">
                          <div className="cd">
                            <img
                              className="image"
                              src={imgSrc}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Transition>

                {/* lyric */}
                <Transition
                  in={showLyric}
                  timeout={200}
                  mountOnEnter
                  unmountOnExit
                >
                  {(status) => {
                    return (
                      <div
                        className={`lyric-box fade fade-${status}`}
                        onClick={() => this.handleClickLyric()}
                      >
                        {lyricContent ? (
                          <div 
                            className="lyric"
                            style={{
                              transition: 'transform 0.35s ease-out 0s',
                              transform: `translateY(${translateY}px)`,
                            }}
                          >
                            {lyricContent}
                          </div>
                        ) : (
                          <p className="no-lyric">暂无歌词</p>
                        )}
                      </div>
                    );
                  }}
                </Transition>
              </div>

              <div className="btm-wrapper">
                <div className="progress-wrapper">

                  <p className="time time-cur">{curTime}</p>
                  
                  <Slider
                    style={{
                      marginLeft: 12,
                      marginRight: 12,
                      paddingTop: 22,
                      paddingBottom: 24,
                    }}
                    defaultValue={0}
                    min={0}
                    max={100}
                    step={0.1}
                    value={progress}
                    handleStyle={{
                      marginLeft: '-8px',
                      marginTop: '-7px',
                      width: '16px',
                      height: '16px',
                      border: 'none',
                    }}
                    trackStyle={{
                      backgroundColor: '#ffd426'
                    }}
                    railStyle={{
                      backgroundColor: 'rgba(225,225,225, 0.4)'
                    }}
                    onChange={(value) => {
                      pause();
                      changeProgressHandler(value);
                    }}
                    onAfterChange={(curVal) => {
                      afterChangeProgressHandler(curVal);
                      play(curSongIndex);
                    }}
                  />

                  <p className="time time-dur">{duration}</p>
                </div>

                <div className="operators">
                  <div
                    className={`btn ${mode}-icon`}
                    onClick={clickModeBtnHandler}
                  ></div>
                  <div
                    className="btn prev-icon"
                    onClick={clickPrevBtnHandler}
                  ></div>
                  <div
                    className={`btn ${isPauseIcon ? 'pause' : 'play'}-icon`}
                    onClick={clickPlayPauseHandler}
                  ></div>
                  <div
                    className="btn next-icon"
                    onClick={clickNextBtnHandler}
                  ></div>
                  <div
                    className="btn list-icon"
                    onClick={togglePlayingList}
                  ></div>
                </div>
              </div>

              <div className="background">
                <img 
                  width="100%"
                  height="100%"
                  src={imgSrc}
                />
              </div>
            </div>

          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default FullPlayer;