import React from 'react';
import { List } from 'antd-mobile';
import { Transition } from 'react-transition-group';

import PlayerContext from '../../context/PlayerContext';
import './Home.less';

import Search from '../Search/Search';
import BannerSlider from '../BannerSlider/BannerSlider';
import PlaylistCover from '../PlaylistCover/PlaylistCover.jsx';
import PlaylistDetail from '../PlaylistDetail/PlaylistDetail.jsx';

const Item = List.Item;
const Brief = Item.Brief;

// TODO: 无限加载
class Home extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rcmdPlaylists: [
        {
          "id": 2406347748,
          "coverUrl": "http://p2.music.126.net/tkQ6Zb_eBdUsFAeD6PM-2A==/109951163547241213.jpg",
          "name": "2018全美音乐奖提名名单（AMAs）",
          "link": "/playlist?id=2406347748",
          "playCount": "126万",
          "author": {
            "name": "DoubleRainbow_",
            "homeLink": "/user/home?id=3226705"
          }
        }, {
          "id": 2439954234,
          "coverUrl": "http://p2.music.126.net/dBdq_Rs_pexuA8GqkZLcKA==/109951163599919632.jpg",
          "name": "听首情歌说唱 | 做个甜甜的梦",
          "link": "/playlist?id=2439954234",
          "playCount": "211万",
          "author": {
            "name": "章若楠nn",
            "homeLink": "/user/home?id=640698142"
          }
        }, {
          "id": 2497731034,
          "coverUrl": "http://p2.music.126.net/AtlN3uAvGczoL-xQN7FTtQ==/109951163643083559.jpg",
          "name": "初恋糖配料表：你的马尾辫和衬衫味道",
          "link": "/playlist?id=2497731034",
          "playCount": "542万",
          "author": {
            "name": "驴子鬼",
            "homeLink": "/user/home?id=246029257"
          }
        }, {
          "id": 2390539027,
          "coverUrl": "http://p2.music.126.net/8BZpZdDiDZatIiQMJnoKyg==/109951163736178562.jpg",
          "name": "那些超带感的英文歌曲~『一秒沦陷』",
          "link": "/playlist?id=2390539027",
          "playCount": "351万",
          "author": {
            "name": "Mysterious-Box",
            "homeLink": "/user/home?id=1558934331"
          }
        }, {
          "id": 2554253084,
          "coverUrl": "http://p2.music.126.net/mP8ulkyTDGmoj6jlZ_sblQ==/109951163722284832.jpg",
          "name": "Future Bass丨醉寻心涧跳动的梦幻电子⚡️",
          "link": "/playlist?id=2554253084",
          "playCount": "61万",
          "author": {
            "name": "Kirin电子站",
            "homeLink": "/user/home?id=1489420441"
          }
        }, {
          "id": 2312165875,
          "coverUrl": "http://p2.music.126.net/Cl0-NpZ0ESTDjJ1HmZ33KA==/109951163460576279.jpg",
          "name": "100首华语民谣，因为懂得才有共鸣",
          "link": "/playlist?id=2312165875",
          "playCount": "1107万",
          "author": {
            "name": "情思天鹅",
            "homeLink": "/user/home?id=108952364"
          }
        }
      ],
      playlists: [],
      showPlDetail: false,
      clickedPl: {},
    };
    this.curPage = 0;
  }

  componentDidMount() {
    this.getPlaylists(this.curPage);
  }

  toggleShowPlDetail = () => {
    this.setState(prevState => {
      return { showPlDetail: !prevState.showPlDetail };
    });
  }

  handleClickPlaylist = (ev) => {
    // ev.stopPropagation();
    const elem = ev.currentTarget;
    // console.log(elem);
    // console.log(ev.currentTarget.attributes);
    // console.log(elem.hasAttribute('data-index'));

    if (elem.hasAttribute('data-index')) {

      const index = elem.getAttribute('data-index');
      // console.log(index);
      let pl = null;

      this.setState(prevState => {
        if (elem.getAttribute('data-plcate') === 'rcmd') {
          pl = prevState.rcmdPlaylists[index];
        } else {
          pl = prevState.playlists[index];
        }
        return {
          showPlDetail: true,
          clickedPl: pl,
        };
      });
    }
  }

  getPlaylists = (pageIndex) => {
    const plsUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/playlists/all/p${pageIndex}.json`;

    window.fetch(plsUrl).then(
      response => response.status === 200 ? response.json() : ''
    ).then(
      data => {
        this.setState({ playlists: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }

  render() {
    const { rcmdPlaylists, playlists, showPlDetail, clickedPl } =this.state;

    // tuijian gedan
    const rcmdlist = rcmdPlaylists.map((playlist, idx) => {
      const {
        id,
        coverUrl,
        name,
        playCount,
      } = playlist;

      return (
        <li
          key={id}
          className="pl-li"
          data-index={idx}
          data-plcate="rcmd"
          onClick={(ev) => this.handleClickPlaylist(ev)}
        >
          <div className="cover-wrapper">
            <PlaylistCover
              src={`${coverUrl}?param=400y400`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              playCount={playCount}
            />
          </div>
          <p className="dec">{name}</p>
        </li>
      );
    });
    //  quanbu gedan
    const allPlContent = playlists && playlists.map((playlist, idx) => {
      const {
        id,
        coverUrl,
        name,
        playCount,
        author,
      } = playlist;

      return (
        <Item
          key={id}
          thumb={`${coverUrl}?param=200y200`}
          onClick={(ev) => this.handleClickPlaylist(ev)}
          multipleLine
          data-index={idx}
          data-plcate="all"
        >
          {name} <Brief>{`${author.name} · ${playCount}次播放`}</Brief>
        </Item>
      );
    });

    return (
      <PlayerContext.Consumer>
        {({playerState}) => (
          <React.Fragment>
            <Search />
            <div
              className="playlists"
              style={playerState.playingList.length ? {paddingBottom: '56px'} : {paddingBottom: '0px'}}
            >
              <BannerSlider/>
              <div key="cate" className="pl-cat">
                推荐歌单
              </div>
              <ul
                key="cvrlst"
                className="pl-cvrlst"
              >
                {rcmdlist}
              </ul>
              {/* all pl */}
              <List renderHeader={() => '全部歌单'}>
                {allPlContent}
              </List>
            </div>

            <Transition
              in={showPlDetail}
              timeout={150}
              mountOnEnter
              unmountOnExit
            >
              {(status) => {
                return (
                  <PlaylistDetail
                    transitionClass={`slide-up slide-up-${status}`}
                    playlistIntro={clickedPl}
                    toggleShowPlDetail={this.toggleShowPlDetail}
                  />
                );
              }}
            </Transition>
          </React.Fragment>
        )}
      </PlayerContext.Consumer>
    );
  }
}

export default Home;
