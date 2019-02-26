import React from 'react';
import l_array from 'lodash/array';

import PlayerContext from './context/PlayerContext';
import Home from './components/Home/Home.jsx';
import Player from './components/Player/Player.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playingList: [],
      currentSong: {},
      curSongIndex: -1,
      isPause: true,
      isLogin: false
    };
    // bind this to method
    this.playByIndex = this.playByIndex.bind(this);
    this.pause = this.pause.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
    this.clearPlaylist = this.clearPlaylist.bind(this);
    this.playAll = this.playAll.bind(this);
    this.addAll = this.addAll.bind(this);
    this.playSong = this.playSong.bind(this);
    this.addSongToNext = this.addSongToNext.bind(this);
  }

  componentDidMount() {
    // console.log('app mount');
    const localData = window.localStorage.getItem('playData');
    this.setState(JSON.parse(localData));
  }

  componentDidUpdate() {
    const { playingList, currentSong, curSongIndex } = this.state;
    window.localStorage.setItem('playData',JSON.stringify({ playingList, currentSong, curSongIndex }));
  }

  playByIndex(index) {
    if (index >= 0) {
      if (index === this.state.curSongIndex) {
        if (this.state.isPause) {
          this.setState({ isPause: false });
        }
      } else {
        this.setState({
          currentSong: this.state.playingList[index],
          curSongIndex: index,
          isPause: false,
        });
      } 
    }
  }

  pause() {
    this.setState({ isPause: true });
  }

  // 删除歌曲
  deleteSong(songIndex) {
    const appState = this.state;

    const playingList = appState.playingList;
    let curSongIndex = appState.curSongIndex;

    l_array.remove(playingList, (val, idx) => idx === songIndex);

    if (playingList.length) {
      
      if (songIndex < curSongIndex) {
        this.setState({
          playingList: playingList,
          curSongIndex: curSongIndex - 1,
        });
      } else if (songIndex === curSongIndex) {

        curSongIndex = songIndex === playingList.length ? 0 : songIndex;

        this.setState({
          playingList: playingList,
          currentSong: playingList[curSongIndex],
          curSongIndex: curSongIndex,
          isPause: false,
        });
      } else {
        this.setState({ playingList: playingList });
      }
      
    } else {
      this.clearPlaylist();
    }
  }

  clearPlaylist() {
    this.setState({
      playingList: [],
      currentSong: {},
      curSongIndex: -1,
      isPause: true,
    });
  }

  playAll(songlist) {
    this.setState({
      playingList: songlist,
      curSongIndex: -1,
    }, () => this.playByIndex(0));
  }

  addAll(songlist) {
    const playingList = this.state.playingList;

    if (playingList.length) {

      // 歌单间重复的歌曲也被去重了
      const songToAdd = l_array.differenceBy(songlist, playingList, 'id');
      // console.log(songToAdd);

      if (songToAdd.length) {
        // 这一行直接以非 setState 的方式对 this.state 做了修改
        playingList.splice(this.state.curSongIndex + 1, 0, ...songToAdd);
        // 这一行只是单纯地要触发 render
        this.setState({ playingList: playingList });
      }
    } else {
      this.playAll(songlist);
    }
  }
  // 添加并播放单首歌曲
  playSong(song) {
    const appState = this.state;
    const playingList = appState.playingList;
    const curSongIndex = appState.curSongIndex;
    const indexToInsert = curSongIndex + 1;

    if (playingList.length) {// 播放列表不为空

      const matchedSongIdx = l_array.findIndex(playingList, ['id', song.id]);
  
      // 已有这首歌
      if (matchedSongIdx !== -1) {
        
        if (matchedSongIdx === curSongIndex) {// 且为正在播放的歌
          // 直接播放这首歌
          this.playByIndex(matchedSongIdx);

        } else if (matchedSongIdx < curSongIndex) {// 在正在播放的歌之前
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 更新 ui
          this.setState({
            playingList: playingList,
            curSongIndex: curSongIndex - 1,
          }, () => this.playByIndex(indexToInsert - 1));

        } else {// 在正在播放的歌之后
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 更新 ui
          this.setState({ playingList: playingList }, () => this.playByIndex(indexToInsert));
        }

      } else {// 没有这首歌
        // 添加到正播放的歌的后面
        playingList.splice(indexToInsert, 0, song);
        // console.log(playingList);
        // 更新 ui
        this.setState({ playingList: playingList }, () => this.playByIndex(indexToInsert));
      }

    } else {// 播放列表为空
      this.setState({ playingList: [song] }, () => this.playByIndex(indexToInsert));
    }
  }
  // 下一首播放
  addSongToNext(song) {
    const appState = this.state;
    const playingList = appState.playingList;
    const curSongIndex = appState.curSongIndex;
    const indexToInsert = curSongIndex + 1;

    if (playingList.length) {// 播放列表不为空

      const matchedSongIdx = l_array.findIndex(playingList, ['id', song.id]);
  
      // 已有这首歌
      if (matchedSongIdx !== -1) {
        
        if (matchedSongIdx === curSongIndex) {// 且为正在播放的歌
          // 直接播放这首歌
          this.playByIndex(matchedSongIdx); 

        } else if (matchedSongIdx < curSongIndex) {// 在正在播放的歌之前
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 更新 ui
          this.setState({
            playingList: playingList,
            curSongIndex: curSongIndex - 1,
          });

        } else {// 在正在播放的歌之后
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 更新 ui
          this.setState({ playingList: playingList });
        }

      } else {// 没有这首歌
        // 添加到正播放的歌的后面
        playingList.splice(indexToInsert, 0, song);
        // 更新 ui
        this.setState({ playingList: playingList });
      }

    } else {// 播放列表为空
      this.setState({ playingList: [song] }, () => this.playByIndex(0));
    }

  }
  // render
  render() {
    // console.log('app render');
    return (
      
        <PlayerContext.Provider 
          value={{
            playerState: this.state,
            playByIndex: this.playByIndex,
            pause: this.pause,
            deleteSong: this.deleteSong,
            clearPlaylist: this.clearPlaylist,
            playAll: this.playAll,
            addAll: this.addAll,
            playSong: this.playSong,
            addSongToNext: this.addSongToNext,
          }}
        >
          <Home />
          <Player />
          
        </PlayerContext.Provider>
      
    );
  }
}

export default App;
