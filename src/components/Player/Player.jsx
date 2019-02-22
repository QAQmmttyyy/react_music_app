import React from 'react';
import { Transition } from 'react-transition-group';

import l_lang from 'lodash/lang';

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
      curTimestamp: 0, // 歌词相关
      isPauseIcon: false,
      // showMiniplayer: false,
      showFullplayer: false,
      showPlayingList: false,
    };
    this.audioRef = React.createRef();
    this.handleChangeProgress = this.handleChangeProgress.bind(this);
    this.handleAfterChangeProgress = this.handleAfterChangeProgress.bind(this);

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

  componentDidUpdate() {
    console.log('componentDidUpdate');
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
  }

  playAudio() {
    this.audioRef.current.play().then(() => {
      console.log('play.then');
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

  handleChangeProgress(value) {
    if (this.isNoAudio()) {
      return;
    }
    const
      prevCurTime = this.state.curTime,
      duration = this.audioRef.current.duration;

    const
      curTimeStr = this.timeFormat(parseFloat((value / 100 * duration).toFixed(6))),
      progress = `${value}%`;

      if (prevCurTime !== curTimeStr) {
        this.setState({
          curTime: curTimeStr,
          playProgress: progress,
        });
      } else {
        this.setState({ playProgress: progress });
      }
  }

  handleAfterChangeProgress(value) {
    if (this.isNoAudio()) {
      return;
    }
    const audio = this.audioRef.current;
    audio.currentTime = parseFloat((value / 100 * audio.duration).toFixed(6));
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
    console.log('handleDurationChange');
    this.setState({
      duration: this.timeFormat(this.audioRef.current.duration),
      playProgress: '0',
      curTime: '00:00'
    });
  }

  handleTimeUpdate() {
    const
      old = this.state.curTime,
      duration = this.audioRef.current.duration,
      currentTime = this.audioRef.current.currentTime;
    
    const
      curTimeStr = this.timeFormat(currentTime),
      progress = `${(currentTime / duration * 100).toFixed(2)}%`;
  
    if (old !== curTimeStr) {
      this.setState({
        curTime: curTimeStr,
        playProgress: progress,
        curTimestamp: currentTime,
      });
    } else {

      if (currentTime === duration) {
        this.setState({ 
          playProgress: progress,
          curTimestamp: currentTime,
        });
      } else {
        this.setState({ curTimestamp: currentTime });
      }
    }
  }

  handleEnded(funcPlay) {
    const index = this.getIndex();
    this.setState({ loadProgress: '0', playProgress: '0' });
    funcPlay(index);
  }

  handleAudioError() {
    const audioElem = this.audioRef.current;
    console.log(audioElem.error);
    
    // TODO 完善无版权歌曲处理
    if (audioElem.error.code === 2) {
      audioElem.load();
      audioElem.currentTime = parseFloat(this.state.playProgress) / 100;
      console.log(this.state.playProgress);
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
    const { showFullplayer, showPlayingList } = this.state;

    return (
      <PlayerContext.Consumer>
        {({ playerState, play, pause, deleteSong, clearPlaylist }) => {
          const {
            playingList,
            currentSong,
            curSongIndex,
            isPause,
          } = playerState;

          this.curSongIndex = curSongIndex;
          this.audioAmount = playingList.length;
          this.isPause = isPause;
          this.currentSong = currentSong;
          this.isToReset = l_lang.isEmpty(currentSong);

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
                onEnded={() => this.handleEnded(play)}
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
                      clickPlayPauseHandler={(ev) => this.handleClickPlayPause(ev, play, pause)}
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
                      playState={this.state}
                      mode={this.playMode[this.state.modeIndex].className}
                      clickPlayPauseHandler={(ev) => this.handleClickPlayPause(ev, play, pause)}
                      clickPrevBtnHandler={() => this.handleClickPrevBtn(play)}
                      clickNextBtnHandler={() => this.handleClickNextBtn(play)}
                      clickModeBtnHandler={() => this.handleClickModeBtn()}
                      changeProgressHandler={this.handleChangeProgress}
                      afterChangeProgressHandler={this.handleAfterChangeProgress}
                      toggleFullplayer={this.toggleFullplayer}
                      togglePlayingList={(ev) => this.togglePlayingList(ev)}
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