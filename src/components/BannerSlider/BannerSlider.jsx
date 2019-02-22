import React, { Component } from 'react';
import Slide from '../Slide/Slide';

class BannerSlider extends Component {
  state = {
    banners: [
      'https://p1.music.126.net/PzonwsvcSEEsr-uhJXE2_g==/109951163871296308.jpg',
      'https://p1.music.126.net/thHP6ooWw893Ccfk_iXG5w==/109951163866743145.jpg',
      'https://p1.music.126.net/VO_0urbXu_PytHjhjfj4Zw==/109951163871298888.jpg',
      'https://p1.music.126.net/kEGOOxh_p6H7UHKuOOFkFg==/109951163871789068.jpg',
      'https://p1.music.126.net/wa7Oxq5yysZgGBvOlivwEg==/109951163871318124.jpg'
    ]
  }
  render() {
    const { banners } = this.state;

    return (
      <Slide>
        {banners.map((val, idx) => (
          <div key={idx}>
            <img src={val} alt="banner"/>
          </div>
        ))}
      </Slide>
    );
  }
}

export default BannerSlider;