import React from 'react';
import { NavBar, Icon, Slider } from 'antd-mobile';
import { Transition } from 'react-transition-group';
import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';
import CoverPlaceholder from '../../images/cover-placeholder.png';
import './FullPlayer.less';

import Scroll from '../Scroll/Scroll.jsx';

class FullPlayer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      // lyric: [],
      // timestampArr: [],
      showCover: true,
      showLyric: false,
      progress: 0,
    };
    this.ScrollRef = React.createRef();
    this.ProgressWrapRef = React.createRef();
    this.ProgressBarRef = React.createRef();
    
    // this.songId = 0;
    this.diffSong = true;
    this.curLyricIndex = -1;
    this.curLyricIndexChange = false;
  }

  // componentDidMount() {
  //   this.getLyric();
  // }
  componentDidUpdate() {
    if (this.state.showLyric) {
      
      if (this.diffSong) {
        this.ScrollRef.current.scrollToElement('p.sentence',1000,false,true);
      } else {
        if (this.curLyricIndexChange && this.curLyricIndex >= 5) {
          this.ScrollRef.current.scrollToElement('p.is-curSentence',1000,false,true);
        }
      }
    }
  }
  handleTouchStart = (ev, playFunc) => {
    if (_.isEmpty(this.curSong)) { return; }

    const target = ev.target;
    console.log(target);
    console.log(ev.type);
    console.log(ev.targetTouches);

    const ProgressBarElem = this.ProgressBarRef.current;
    this.progressBarWidth = ProgressBarElem.clientWidth;
    console.log('progressBarWidth', this.progressBarWidth);
    this.progressBarOffsetLeft = ProgressBarElem.offsetLeft;
    console.log('offsetLeft', this.progressBarOffsetLeft);
    this.touchmoveLeftEdge = this.progressBarOffsetLeft - 8;
    this.touchmoveRightEdge = this.progressBarOffsetLeft + this.progressBarWidth + 8;
    console.log(this.touchmoveLeftEdge, this.touchmoveRightEdge)

    this.prevTouchX = ev.targetTouches[0].clientX;
    console.log('prevTouchX', this.prevTouchX);

    const ProgressWrapElem = this.ProgressWrapRef.current;
    // console.log(ProgressWrapElem.offsetWidth);
    ProgressWrapElem.addEventListener('touchmove', this.handleTouchMove);
    ProgressWrapElem.addEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchMove = (ev) => {
    console.log(ev.type);
    // console.log(ev.touches);
    const nextTouchX = ev.touches[0].clientX;
    console.log('nextTouchX', nextTouchX);

    if (this.touchmoveLeftEdge < nextTouchX && nextTouchX < this.touchmoveRightEdge) {
      const deltaX = nextTouchX - this.prevTouchX;
      this.prevTouchX = nextTouchX;
      console.log(deltaX);

      this.setState(prevState => {
        let nextProgress = prevState.progress + deltaX;
        if (nextProgress < 0) {
          nextProgress = 0;
        } else if (nextProgress > this.progressBarWidth) {
          nextProgress = this.progressBarWidth;
        }
        return { progress: nextProgress };
      });
    }
  }

  handleTouchEnd = (ev, pauseFunc) => {
    console.log(ev.type);
    console.log(ev.changedTouches);

    const ProgressWrapElem = this.ProgressWrapRef.current;
    ProgressWrapElem.removeEventListener('touchmove', this.handleTouchMove);
    ProgressWrapElem.removeEventListener('touchend', this.handleTouchEnd);

    pauseFunc()
  }

  // getLyric = () => {
  //   const lrcUrl = `https://api.mlwei.com/music/api/wy/?key=523077333&cache=1&type=lrc&id=${this.songId}`;
  //   // console.log(lrcUrl);
    
  //   window.fetch(lrcUrl, {
  //     method: 'GET',
  //     headers: { 'Accept': '*' },
  //     mode: 'cors'
  //   }).then(
  //     response => {
  //       console.log(response);
  //       return response.status === 200 ? response.text() : null;
  //     }
  //   ).then(
  //     data => {
  //       if (data) {
          
  //         // console.log(data);
  //         const lrcArr = data.split('\n');
  //         // state
  //         const 
  //           lyric = [],
  //           timestampArr = [];
  
  //         lrcArr.forEach((lrc) => {
  //           const matchPart = lrc.match(/\[(.*)\](.*)/);
  
  //           if (matchPart) {
              
  //             const 
  //               timestampParts = matchPart[1].trim().split(':'),
  //               part1 = parseInt(timestampParts[0]) * 60,
  //               part2 = parseFloat(timestampParts[1]),
  //               timestamp = part1 + part2;
              
  //             if (!isNaN(timestamp)) {
  //               lyric.push(matchPart[2].trim());
  //               timestampArr.push(timestamp);
  //             }
  //           }
  //         });
  
  //         console.log(lyric);
  //         console.log(timestampArr);
  
  //         this.setState({
  //           lyric: lyric,
  //           timestampArr: timestampArr,
  //           curLyricIndex: 0,
  //         });
  //       }
  //     }
  //   ).catch(
  //     reason => {
  //       console.log(reason);
  //       this.setState({
  //         lyric: [],
  //         timestampArr: [],
  //       });
  //     }
  //   );
  // }

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
      diffSong,
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

    const {
      // lyric,
      // timestampArr,
      showCover,
      showLyric,
      progress,
    } = this.state;

    this.curSong = curSong;

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
      lyric,
      curLyricIndex,
      curLyricIndexChange,
    } = playState;

    // this.diffSong = this.songId !== id;
    // this.songId = id;
    this.diffSong = diffSong;
    this.curLyricIndex = curLyricIndex;
    this.curLyricIndexChange = curLyricIndexChange;

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
      // curLyricIndex = 0,
      lyricContent = null,
      translateY = 0,
      maxTranslateY = 0;

    if (lyric.length) {
      // curLyricIndex
      // curLyricIndex = _.findLastIndex(timestampArr, val => val <= curTimestamp);
      // this.curLyricIndexChange = this.curLyricIndex === curLyricIndex;
      // this.curLyricIndex = curLyricIndex;
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
      translateY = (curLyricIndex <= 3) ? 0 : -(curLyricIndex - 3) * 40;
      maxTranslateY =  -(lyric.length * 40);

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

    return (
      <PlayerContext.Consumer>
        {({ playerState, playByIndex, pause }) => {
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

              {/* cd */}
              <Transition
                in={showCover}
                timeout={100}
                mountOnEnter
                unmountOnExit
              >
                {(status) => {
                  return (
                    <div className={`mid-wrapper fade fade-${status}`}>
                      <div
                        className="cd-box"
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
                    </div>
                  );
                }}
              </Transition>

              {/* lyric */}
              <Transition
                in={showLyric}
                timeout={100}
                mountOnEnter
                unmountOnExit
              >
                {(status) => {
                  return (
                    <Scroll
                      ref={this.ScrollRef}
                      className={`lyric-wrapper fade fade-${status}`}
                      onClick={() => this.handleClickLyric()}
                    >
                      <div className="scroll-content">
                        {lyricContent ? (
                          <div className="lyric">
                            {lyricContent}
                          </div>
                        ) : (
                          <p className="no-lyric">暂无歌词</p>
                        )}
                      </div>
                    </Scroll>
                  );
                }}
              </Transition>
              
              <div className="btm-wrapper">
                <div className="progress-wrapper" ref={this.ProgressWrapRef}>

                  <p className="time time-cur">{curTime}</p>

                  <div className="progress-bar-wrapper">
                    <div
                      ref={this.ProgressBarRef}
                      className="progress-bar"
                    >
                      <div className="bar-inner">
                        <div
                          className="progress"
                          style={{width: `${progress}px`}}
                        ></div>
                        <div
                          className="progress-btn-wrapper"
                          style={{transform: `translate3d(${progress}px, 0px, 0px)`}}
                          onTouchStart={(ev) => this.handleTouchStart(ev)}
                        >
                          <div className="progress-btn"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <Slider
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
                      backgroundColor: '#31c27c'
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
                      playByIndex(curSongIndex);
                    }}
                  /> */}

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