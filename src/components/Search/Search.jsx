import React, { Component } from 'react';
import { SearchBar, List } from 'antd-mobile';
import { Transition } from 'react-transition-group';
import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';
import Loading from '../Loading/Loading';
import './Search.less';

const Item = List.Item;
const Brief = Item.Brief;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      hotKeywords: ['起风了', 'A妹新专辑', '有可能的夜晚', '出山', '流浪地球', 'Counting Sheep', '空心', '水星记', '东西', '梦龙'],
      historyKeywords: [],
      searchResult: [],
      showSearchBox: false,
      showSearchKeywordBox: false,
      showSearchResultBox: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    const historyKeywords = window.localStorage.getItem('historyKeywords');
    if (historyKeywords) {
      this.setState({ historyKeywords: JSON.parse(historyKeywords) });
    }
  }

  submit = (value) => {
    if (value) {
      // set loading
      this.setState({
        showSearchKeywordBox: false,
        showSearchResultBox: true,
        isLoading: true,
      });
  
      // set localstorage
      const historyKws = this.state.historyKeywords;
      let cpHistoryKws = [];
      if (historyKws && historyKws.length) {
        cpHistoryKws = historyKws.slice(0);
        cpHistoryKws.push(value);
      } else {
        cpHistoryKws.push(value);
      }
      const uniqCpHistoryKws = _.uniq(cpHistoryKws);
      window.localStorage.setItem('historyKeywords', JSON.stringify(uniqCpHistoryKws));
      // console.log(cpHistoryKws);
  
      // req, url encode?
      const searchApi = `https://api.mlwei.com/music/api/wy/?key=523077333&id=${value}&type=so&cache=1&nu=60`;
      
      const encoded = encodeURI(searchApi);
      // console.log(encoded);
      window.fetch(
        encoded,
        {
          method: 'GET',
          headers: {
            'Accept': '*'
          },
          mode: 'cors'
        }
      ).then(
        response => {
          // console.log(response);
          return response.status === 200 ? response.json() : {};
        }
      ).then(
        data => {
          // console.log('data',data);
          let resultData = [];
          if (data.Body) {
            
            resultData = data.Body.map(song => {
              const { author, id, pic, title } = song;
              return {
                id: id,
                link: `/song?id=${id}`,
                name: title,
                artists: [{name: author}],
                album: {picUrl: pic}
              };
            });
          }
          // console.log('resultData',resultData);
          this.setState({
            historyKeywords: uniqCpHistoryKws,
            searchResult: resultData,
            isLoading: false,
          });
        }
      ).catch(
        reason => {
          console.log(reason);
          this.setState({
            historyKeywords: cpHistoryKws,
            isLoading: false,
          });
        }
      );
    }
  }

  change= (value) => {
    this.setState({ keyword: value });
  }

  clear = () => {
    // unshow result/ show search-keyword-box
    this.setState({ keyword: '' });
  }

  focus = () => {
    // show search-keyword-box
    // console.log('focus');
    this.setState({
      showSearchBox: true,
      showSearchKeywordBox: true,
      showSearchResultBox: false,
      isLoading: false,
    });
  }

  cancel = () => {
    // unshow search-keyword-box/result
    this.setState({
      keyword: '',
      showSearchBox: false,
      showSearchKeywordBox: false,
      showSearchResultBox: false,
      isLoading: false,
    })
  }

  handlePlaySong = (ev, funcPlaySong, songIndex) => {
    ev.stopPropagation();
    funcPlaySong(_.cloneDeep(this.state.searchResult[songIndex]));
  }

  handleClickKeyword = (ev) => {
    ev.stopPropagation();
    // this.manualFocusInst.focus();
    const val = ev.target.textContent;
    // console.log(val);
    if (ev.target.className === 'item') {
      this.setState({ keyword: val });
      this.submit(val);
    }
  }

  clearHistoryKeywords = (ev) => {
    ev.stopPropagation();
    window.localStorage.removeItem('historyKeywords');
    this.setState({ historyKeywords: [] });
  }

  render() {
    const {
      hotKeywords,
      historyKeywords,
      searchResult,
      showSearchBox,
      showSearchKeywordBox,
      showSearchResultBox,
      isLoading,
    } =this.state;

    return (
      <PlayerContext.Consumer>
        {({ playerState, playSong }) => {
          let resultContent;
          if (searchResult && searchResult.length) {
            resultContent = searchResult.map((song, idx) => {
      
              const { id, name, artists } = song;
        
              return (
                <Item 
                  key={id}
                  className="result-list-item"
                  activeStyle={{ backgroundColor: '#ccc' }}
                  onClick={(ev) => {this.handlePlaySong(ev, playSong, idx)}}
                  multipleLine
                >
                  {name}
                  <Brief>{artists.map(val => val.name).join('/')}</Brief>
                </Item>
              );
            });
      
          } else {
            resultContent = (
              <div style={{height:'calc(100vh - 100px)',textAlign: 'center'}}>网络出了点问题</div>
            );
          }

          return (
            <div className="my-search">
              <SearchBar
                ref={ref => this.manualFocusInst = ref}
                value={this.state.keyword}
                cancelText="返回"
                placeholder="Search"
                onSubmit={this.submit}
                onChange={this.change}
                onClear={this.clear}
                onFocus={this.focus}
                onBlur={() => console.log('onBlur')}
                onCancel={this.cancel}
              />
              
              {showSearchBox ? (
                <div
                  className="search-box"
                  style={playerState.playingList.length ? {bottom: '56px'} : {bottom: '0'}}
                >
                  {/* hot history */}
                  <Transition
                    in={showSearchKeywordBox}
                    timeout={150}
                    mountOnEnter
                    unmountOnExit
                    // onExited={() => this.setState({showSearchKeywordBox: false})}
                  >
                    {(status) => {
                      return (
                        <div
                          className={`search-keyword-box fade fade-${status}`}
                          onClick={(ev) => this.handleClickKeyword(ev)}
                        >
                          <div className="hot-keyword">
                            <h4 className="title">热门搜索</h4>
                            <ul>
                              {hotKeywords.map((kw, idx) => (
                                <li
                                  key={idx}
                                  className="item"
                                >
                                  {kw}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {historyKeywords.length > 0 ? (
                            <div className="history-keyword">
                              <h4 className="title">
                                搜索历史
                                <i
                                  className="delete-btn"
                                  onClick={(ev) => this.clearHistoryKeywords(ev)}
                                ></i>
                              </h4>
                              <ul>
                                {historyKeywords.map((kw, idx) => (
                                  <li
                                    key={idx}
                                    className="item"
                                  >
                                    {kw}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      );
                    }}
                  </Transition>

                  {/* result */}
                  <Transition
                    in={showSearchResultBox}
                    timeout={150}
                    mountOnEnter
                    unmountOnExit
                    // onExited={() => this.setState({showSearchResultBox: false})}
                  >
                    {(status) => {
                      return (
                        <div className={`search-result-box fade fade-${status}`}>
                          {isLoading ? (
                            <Loading />
                          ) : (
                            <List>{resultContent}</List>
                          )}
                        </div>
                      );
                    }}
                  </Transition>
                </div>
              ) : null}

            </div>
            
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default Search;