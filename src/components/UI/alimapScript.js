import policeService from '../../services/police.service';

const stateMap = {
  '-1': '不可控',
  0: '开启',
  1: '关闭',
  2: '常开',
};

const openMap = {
  0: '在线',
  1: '离线',
};

export default function update(AMap, map, markers) {
  const $markersDom = document.querySelectorAll('.mapicon-root');

  $markersDom.forEach((item, index) => {
    const $icon = item.querySelector('.mapicon-img');
    const dataSource = $icon.dataset.item;
    const $container = item.querySelector('.mapicon-container');
    const $close = item.querySelector('.mapicon-close');
    const $reload = item.querySelector('.mapicon-reload');
    const $content = item.querySelector('.mapicon-content');
    $icon.addEventListener('click', () => {
      if (AMap.DomUtil.hasClass($container, 'hide')) {
        setHtml(() => {
          hide();
          AMap.DomUtil.removeClass($container, 'hide');
        });
      } else {
        AMap.DomUtil.addClass($container, 'hide');
      }
    });
    $reload.addEventListener('click', () => {
      setHtml();
    });
    $close.addEventListener('click', () => {
      AMap.DomUtil.addClass($container, 'hide');
    });

    function setHtml(callback) {
      const html = `<div class="ant-row"><div style="flex:auto" class="ant-col">在线状态</div><div style="text-align:right" class="ant-col">${
        dataSource.isOnline ? `在线` : `离线`
      }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">设备状态</div><div style="text-align:right" class="ant-col">${
        dataSource.isActive ? `启用` : `停用`
      }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">今日通行人数</div><div style="text-align:right" class="ant-col">${
        dataSource.inOutCount || '0'
      }人</div></div>`;
      $content.innerHTML = html;
      callback && callback();
    }

    // function setHtml(callback) {
    //   policeService.getDeviceMap({ deviceId: id }).then((res) => {
    //     console.log(res, 'res');
    //     const html = `<div class="ant-row"><div style="flex:auto" class="ant-col">在线状态</div><div style="text-align:right" class="ant-col">${
    //       res.isOnline ? `在线` : `离线`
    //     }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">设备状态</div><div style="text-align:right" class="ant-col">${
    //       res.isActive ? `启用` : `停用`
    //     }</div></div><div class="ant-row"><div style="flex:auto" class="ant-col">今日通行人数</div><div style="text-align:right" class="ant-col">${
    //       res.inOutCount || '0'
    //     }人</div></div>`;
    //     $content.innerHTML = html;
    //     callback && callback();
    //   });
    // }
  });

  function hide() {
    $markersDom.forEach((item) => {
      const $content = item.querySelector('.mapicon-container');
      AMap.DomUtil.addClass($content, 'hide');
    });
  }
}
