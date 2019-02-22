import React from 'react';
import { Tabs } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

// import Discover from '../Discover/Discover';
// import Playlists from '../Playlists/Playlists.jsx';
// import Albums from '../Albums/Albums.jsx';

function renderTabBar(props) {
  return (
    <Sticky>
      {({ style }) => (
        <div style={{ ...style, zIndex: 1 }}>
          <Tabs.DefaultTabBar {...props} />
        </div>
      )}
    </Sticky>
  );
}

const tabs = [
  { title: '发现' },
  { title: '歌单' },
  { title: '专辑' },
];

class Home extends React.Component {
  render() {
    return (
      <StickyContainer>
        <Tabs 
          tabs={tabs}
          initalPage={'t1'}
          renderTabBar={renderTabBar}
        >
          
        </Tabs>
      </StickyContainer>
    );
  }
}

export default Home;