import DPlayer from 'dplayer';
import Flv from 'flv.js'
// const Flv = require('flv.js');

import policeService from '../../services/police.service';

export default function update(AMap) {
  const $root = document.querySelectorAll('.mapicon-root');
<<<<<<< HEAD
  let playerMap = new Map()
=======
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb

  $root.forEach((item) => {
    const $icon = item.querySelector('.mapicon-img');
    const dataSource = JSON.parse($icon.dataset.item || '{}');
    const $close = item.querySelector('.mapicon-close');
    const $reload = item.querySelector('.mapicon-reload');
    const $content = item.querySelector('.mapicon-content');
<<<<<<< HEAD
    const $video = item.querySelector('.mapicon-video');

    // if (dataSource.deviceType === 2) {
    //   const player = new DPlayer({
    //     container: $video,
    //     autoplay: true,
    //     live: true,
    //     video: {
    //       url: dataSource.privateM3u8Url,
    //       type: 'customFlv',
    //       customType: {
    //         customFlv: function (video, player) {
    //           const flvPlayer = Flv.createPlayer({
    //             type: 'flv',
    //             url: video.src,
    //           });
    //           flvPlayer.attachMediaElement(video);
    //           flvPlayer.load();
    //         },
    //       },
    //     },
    //   });
    //   playerMap.set(dataSource.deviceId, player)
    // }
=======
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb

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
      AMap.DomUtil.removeClass(item, 'isActive');
    });

    function setHtml(callback) {
      if (dataSource.deviceType === 2) {
<<<<<<< HEAD

      } else {
        const html = `<div class="ant-row"><div style="flex:auto" class="ant-col">在线状态</div><div style="text-align:right" class="ant-col">${dataSource.isOnline ? `在线` : `离线`
          }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">设备状态</div><div style="text-align:right" class="ant-col">${dataSource.isActive ? `启用` : `停用`
          }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">今日通行人数</div><div style="text-align:right" class="ant-col">${dataSource.inOutCount || '0'
          }人</div></div>`;
        $content.innerHTML = html;
      }

=======
        callback && callback();
        return;
      }
      const html = `<div class="ant-row"><div style="flex:auto" class="ant-col">在线状态</div><div style="text-align:right" class="ant-col">${
        dataSource.isOnline ? `在线` : `离线`
      }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">设备状态</div><div style="text-align:right" class="ant-col">${
        dataSource.isActive ? `启用` : `停用`
      }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">今日通行人数</div><div style="text-align:right" class="ant-col">${
        dataSource.inOutCount || '0'
      }人</div></div>`;
      $content.innerHTML = html;
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
      callback && callback();
    }
  });

  function hide() {
    $root.forEach((item) => {
<<<<<<< HEAD
      // const player = playerMap.get(item.deviceId)
      // if (player) {
      //   player.pause()
      // }
=======
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
      AMap.DomUtil.removeClass(item, 'isActive');
    });
  }
}
