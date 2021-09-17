import DPlayer from 'dplayer';
import Hls from 'hls.js';
// const Flv = require('flv.js');

import policeService from '../../services/police.service';

export default function update(AMap) {
  const $root = document.querySelectorAll('.mapicon-root');
  let player = null;

  $root.forEach((item) => {
    const $icon = item.querySelector('.mapicon-img');
    const dataSource = JSON.parse($icon.dataset.item || '{}');
    const $close = item.querySelector('.mapicon-close');
    const $reload = item.querySelector('.mapicon-reload');
    const $content = item.querySelector('.mapicon-content');
    const $video = item.querySelector('.mapicon-video');

    $icon.addEventListener('click', () => {
      if (!AMap.DomUtil.hasClass(item, 'isActive')) {
        setHtml(() => {
          hide();
          const $parent = item.parentNode;
          AMap.DomUtil.setCss($parent, {
            'z-index': 100,
          });
          AMap.DomUtil.addClass(item, 'isActive');
        });
      } else {
        AMap.DomUtil.removeClass(item, 'isActive');
      }
    });
    $reload.addEventListener('click', () => {
      // setHtml();
    });
    $close.addEventListener('click', () => {
      if (player) {
        player.pause();
      }
      AMap.DomUtil.removeClass(item, 'isActive');
    });

    function setHtml(callback) {
      if (dataSource.deviceType === 2) {
        setVideo($video, dataSource.deviceId);
      } else {
        const html = `<div class="ant-row"><div style="flex:auto" class="ant-col">在线状态</div><div style="text-align:right" class="ant-col">${dataSource.isOnline ? `在线` : `离线`
          }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">设备状态</div><div style="text-align:right" class="ant-col">${dataSource.isActive ? `启用` : `停用`
          }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">今日通行人数</div><div style="text-align:right" class="ant-col">${dataSource.inOutCount || '0'
          }人</div></div>`;
        $content.innerHTML = html;
      }

      callback && callback();
    }
  });

  async function setVideo(ele, id) {
    try {
      const res = await policeService.getCameraDetails({
        deviceId: id,
        duration: 300,
        type: 'HLS',
      });
      player = new DPlayer({
        container: ele,
        live: true,
        screenshot: true,
        preload: 'auto',
        autoplay: true,
        mutex: false,
        video: {
          url: res.hlsUrl,
          type: 'customHls',
          contextmenu: [],
          customType: {
            customHls: (video) => {
              const hls = new Hls();
              hls.loadSource(video.src);
              hls.attachMedia(video);
            },
          },
        },
      });
    } catch (error) { }
  }

  function hide() {
    $root.forEach((item) => {
      // if (player) {
      //   player.pause()
      // }
      AMap.DomUtil.removeClass(item, 'isActive');
    });
  }
}