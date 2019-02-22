import React from 'react';
import { Link } from 'react-router-dom';
import { List } from 'antd-mobile';

import PlayerContext from '../../context/PlayerContext';
import './Playlists.less';
// import Loading from '../Loading/Loading.jsx';
import Search from '../Search/Search';
import PlaylistCover from '../PlaylistCover/PlaylistCover.jsx';
import BannerSlider from '../BannerSlider/BannerSlider';

const Item = List.Item;
const Brief = Item.Brief;

// TODO: 无限加载
class Playlists extends React.Component {
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
    };
    this.getPlaylists = this.getPlaylists.bind(this);
    // this.diffPage = false;
    this.curPage = 1;
  }

  componentDidMount() {
    window.setTimeout(() => {this.getPlaylists(this.curPage - 1);}, 100);
  }

  getPlaylists(pageIndex) {
    const plsUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/playlists/all/p${pageIndex}.json`;

    window.fetch(plsUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => {
        this.setState({ playlists: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }

  render() {
    const { location, history } = this.props;
    const { rcmdPlaylists, playlists } =this.state;

    // tuijian gedan
    const rcmdlist = rcmdPlaylists.map((playlist) => {
      const {
        id,
        coverUrl,
        name,
        link,
        playCount,
      } = playlist;

      // const plPath = link.split('?')[0];

      return (
        <Link 
          key={id}
          className="pl-li"
          to={link}
        >
          <div className="cover-wrapper">
            <PlaylistCover
              src={`${coverUrl}?param=250y250`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              playCount={playCount}
            />
          </div>
          <p className="dec">{name}</p>
        </Link>
      );
    });
    //  quanbu gedan
    const allPlContent = playlists.map((playlist) => {
      const {
        id,
        coverUrl,
        name,
        link,
        playCount,
        author,
      } = playlist;

      return (
        <Item
          key={id}
          thumb={`${coverUrl}?param=512y512`}
          onClick={() => history.push(link)}
          multipleLine
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
              <div key="cvrlst" className="pl-cvrlst">
                {rcmdlist}
              </div>
              {/* all pl */}
              <List renderHeader={() => '全部歌单'}>
                {allPlContent}
              </List>
            </div>
          </React.Fragment>
        )}
      </PlayerContext.Consumer>
    );
  }
}

export default Playlists;
