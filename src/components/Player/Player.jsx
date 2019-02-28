import React from 'react';
import { Transition } from 'react-transition-group';

import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';
import MiniPlayer from '../MiniPlayer/MiniPlayer.jsx';
import FullPlayer from '../FullPlayer/FullPlayer.jsx';
import PlayingList from '../PlayingList/PlayingList.jsx';

// import './Player.less';

class Player extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      modeIndex: 0,
      duration: '00:00',
      curTime: '00:00',
      playProgress: '0',
      // 歌词相关
      // curTimestamp: 0, 
      lyric: [],
      timestampArr: [],
      curLyricIndex: -1,
      curLyricIndexChange: false,
      isPauseIcon: false,
      // showMiniplayer: false,
      showFullplayer: false,
      showPlayingList: false,
    };
    this.audioRef = React.createRef();
    // this.handleChangeProgress = this.handleChangeProgress.bind(this);
    // this.handleAfterChangeProgress = this.handleAfterChangeProgress.bind(this);

    this.songId = 0; // lyric
    this.diffSong = false; // lyric
    this.curSongIndex = -1;
    this.audioAmount = 0;
    this.isPause = true; // 指示 进行播放还是暂停
    this.songUrlApi = 'https://music.163.com/song/media/outer/url?id='; // ?id=350909 会返回一个重定向响应
    this.currentSong = {};

    this.playMode = [
      {
        desc: '列表循环',
        className: 'loop',
      },
      {
        desc: '单曲循环',
        className: 'single',
      },
      {
        desc: '随机播放',
        className: 'random',
      }
    ];
  }

  componentDidMount() {
    // console.log('player mount');
    // this.getLyric();
  }

  componentDidUpdate() {
    // console.log('player Update');
    if (this.isNoAudio()) {
      return;
    }
    if (this.isPause) {
      if (!(this.audioRef.current.paused)) {
        this.pauseAudio();
      }
    } else {
      if (this.audioRef.current.paused) {
        this.playAudio();
      }
    }
    // lyric
    // console.log(this.diffSong);
    if (this.diffSong) {
      this.getLyric();
    }
  }

  getLyric = () => {
    const lrcUrl = `https://api.mlwei.com/music/api/wy/?key=523077333&cache=1&type=lrc&id=${this.songId}`;
    // console.log(lrcUrl);
    
    window.fetch(lrcUrl, {
      method: 'GET',
      headers: { 'Accept': '*' },
      mode: 'cors'
    }).then(
      response => {
        // console.log(response);
        return response.status === 200 ? response.text() : null;
      }
    ).then(
      data => {
        const 
          lyric = [],
          timestampArr = [];

        if (data) {
          // console.log(data);
          const lrcArr = data.split('\n');
          // state
  
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
  
          // console.log(lyric);
          // console.log(timestampArr);
        }

        this.setState({
          lyric: lyric,
          timestampArr: timestampArr,
          curLyricIndex: -1,
        });
      }
    ).catch(
      reason => {
        // console.log(reason);
        this.setState({
          lyric: [],
          timestampArr: [],
        });
      }
    );
  }

  playAudio() {
    this.audioRef.current.play().then(() => {
      // console.log('play.then');
      this.setState({ isPauseIcon: true });
    }, (reason) => {
      console.log(reason);
    });
  }

  pauseAudio() {
    this.audioRef.current.pause();
    this.setState({ isPauseIcon: false });
  }

  handleClickPlayPause(ev, funcPlay, funcPause) {
    ev.stopPropagation();
    if (this.isNoAudio()) {
      return;
    }
    if (this.audioRef.current.paused) {
      const index = this.curSongIndex;
      funcPlay(index);
    } else {
      funcPause();
    }
  }

  handleClickPrevBtn(funcPlay) {
    if (this.isNoAudio()) {
      return;
    }
    this.setState({ playProgress: '0' });
    const index = this.getIndex(true);
    funcPlay(index);
  }

  handleClickNextBtn(funcPlay) {
    if (this.isNoAudio()) {
      return;
    }
    this.setState({ playProgress: '0' });
    const index = this.getIndex();
    funcPlay(index);
  }

  handleClickModeBtn() {
    if (this.isNoAudio()) {
      return;
    }
    const nextIndex = (this.state.modeIndex + 1) % this.playMode.length;

    this.audioRef.current.loop = nextIndex === 1;
    this.setState({ modeIndex: nextIndex });
  }

  toggleFullplayer = () => {
    this.setState(state => ({
      showFullplayer: !state.showFullplayer
    }));
  }

  togglePlayingList = (ev) => {
    ev.stopPropagation();
    this.setState(state => ({
      showPlayingList: !state.showPlayingList
    }));
  }
  
  // audio
  handleDurationChange() {
    // console.log('handleDurationChange');
    this.setState({
      duration: this.timeFormat(this.audioRef.current.duration),
      playProgress: '0',
      curTime: '00:00'
    });
  }
  // use by fullplayer
  updateCurrentTime = (playPercentage) => {
    const 
      audioElem = this.audioRef.current,
      duration = audioElem.duration;
      
    audioElem.currentTime = duration * playPercentage;
  }

  handleTimeUpdate() {
    const
      { curTime, curLyricIndex, timestampArr } = this.state,
      { duration, currentTime } = this.audioRef.current;
    
    const
      nextCurTime = this.timeFormat(currentTime),
      nextPlayProgress = `${(currentTime / duration).toFixed(3)}`,
      // nextPlayProgress = `${(currentTime / duration * 100).toFixed(2)}%`,
      nextCurLyricIndex = _.findLastIndex(timestampArr, val => val <= currentTime);
  
    if (curTime !== nextCurTime) {
      this.setState({
        curTime: nextCurTime,
        playProgress: nextPlayProgress,
      });
    } else if (currentTime === duration) {
      this.setState({
        playProgress: nextPlayProgress
      });
    }
    // lyric
    if (curLyricIndex !== nextCurLyricIndex) {
      this.setState({
        curLyricIndex: nextCurLyricIndex,
        curLyricIndexChange: true,
      });
    } else {
      this.setState({
        curLyricIndexChange: false,
      });
    }
  }

  handleEnded(funcPlay) {
    const index = this.getIndex();
    this.setState({ loadProgress: '0', playProgress: '0' });
    funcPlay(index);
  }

  handleAudioError() {
    const audioElem = this.audioRef.current;
    // console.log(audioElem.error);
    
    // TODO 完善无版权歌曲处理
    if (audioElem.error.code === 2) {
      audioElem.load();
      audioElem.currentTime = parseFloat(this.state.playProgress) / 100;
      // console.log(this.state.playProgress);
    }
  }

  // Util
  isNoAudio() {
    return (this.audioAmount === 0);
  }

  timeFormat(timeNum) {// mm:ss
    const minutes = parseInt(`${timeNum / 60}`),  // 商
          seconds = parseInt(`${timeNum % 60}`),  // 余数
          minStr = minutes < 10 ? `0${minutes}` : `${minutes}`,
          secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minStr}:${secStr}`;
  }

  getIndex(isPrev) {
    if (isPrev === undefined) {
      isPrev = false;
    }
    let index = 0;
    switch (this.state.modeIndex) {
      case 0:
      case 1:
        if (isPrev) {
          index = (
              this.curSongIndex - 1 + this.audioAmount
            ) % this.audioAmount;
        } else {
          index = (this.curSongIndex + 1) % this.audioAmount;
        }
        break;
      case 2:
        index = parseInt(Math.random() * this.audioAmount);
        break;
      default:
        break;
    }
    return index;
  }

  render() {
    // console.log('player render');
    const { showFullplayer, showPlayingList } = this.state;

    return (
      <PlayerContext.Consumer>
        {({ playerState, playByIndex, pause }) => {
          const {
            playingList,
            currentSong,
            curSongIndex,
            isPause,
          } = playerState;
          
          const curSongId = currentSong.id;
          {/* console.log(curSongId); */}
          if (curSongId) {
            this.diffSong = this.songId !== curSongId;
            this.songId = curSongId;
          }
          this.curSongIndex = curSongIndex;
          this.audioAmount = playingList.length;
          this.isPause = isPause;
          this.currentSong = currentSong;
          this.isToReset = _.isEmpty(currentSong);

          return (
            <div className="audio-controls-panel">
              {/* music */}
              <audio 
                ref={this.audioRef}
                src={
                  currentSong && currentSong.link ? `${this.songUrlApi}${currentSong.id}` : ''
                }
                onDurationChange={() => this.handleDurationChange()}
                onTimeUpdate={() => this.handleTimeUpdate()}
                onEnded={() => this.handleEnded(playByIndex)}
                onError={() => this.handleAudioError()}
              >
              </audio>
              
              {/* mini full都用transition 包裹，currentSong为空时，做退出的效果。
              且各自内部也对currentSong为空的情况做处理。 */}
              <Transition
                in={!this.isToReset}
                timeout={150}
                mountOnEnter
                unmountOnExit
              >
                {(status) => {
                  return (
                    <MiniPlayer
                      transitionClass={`slide-up slide-up-${status}`}
                      curSong={currentSong}
                      isPauseIcon={this.state.isPauseIcon}
                      clickPlayPauseHandler={(ev) => this.handleClickPlayPause(ev, playByIndex, pause)}
                      toggleFullplayer={this.toggleFullplayer}
                      togglePlayingList={(ev) => this.togglePlayingList(ev)}
                    />
                  );
                }}
              </Transition>
          
              <Transition
                in={this.isToReset ? false : showFullplayer}
                timeout={250}
                mountOnEnter
                unmountOnExit
                onExited={() => this.setState({showFullplayer: false})}
              >
                {(status) => {
                  return (
                    <FullPlayer
                      transitionClass={`slide-up slide-up-${status}`}
                      curSong={currentSong}
                      diffSong={this.diffSong}
                      playState={this.state}
                      mode={this.playMode[this.state.modeIndex].className}
                      clickPlayPauseHandler={(ev) => this.handleClickPlayPause(ev, playByIndex, pause)}
                      clickPrevBtnHandler={() => this.handleClickPrevBtn(playByIndex)}
                      clickNextBtnHandler={() => this.handleClickNextBtn(playByIndex)}
                      clickModeBtnHandler={() => this.handleClickModeBtn()}
                      changeProgressHandler={this.handleChangeProgress}
                      afterChangeProgressHandler={this.handleAfterChangeProgress}
                      toggleFullplayer={this.toggleFullplayer}
                      togglePlayingList={(ev) => this.togglePlayingList(ev)}
                      updateCurrentTime={this.updateCurrentTime}
                    />
                  );
                }}
              </Transition>
              
              {/* plp */}
              <Transition
                in={this.isToReset ? false : showPlayingList}
                timeout={250}
                mountOnEnter
                unmountOnExit
                onExited={() => this.setState({showPlayingList: false})}
              >
                {(status) => {
                  return (
                    <PlayingList
                      maskFadeClass={`fade fade-${status}`}
                      transitionClass={`slide-up slide-up-${status}`}
                      listData={playingList}
                      curSongIndex={curSongIndex}
                      togglePlayingList={(ev) => this.togglePlayingList(ev)}
                    />
                  );
                }}
              </Transition>
            </div>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default Player;