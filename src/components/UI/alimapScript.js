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

export default function update(AMap) {
  const $root = document.querySelectorAll('.mapicon-root');

  $root.forEach((item) => {
    const $icon = item.querySelector('.mapicon-img');
    const dataSource = JSON.parse($icon.dataset.item || '{}');
    const $close = item.querySelector('.mapicon-close');
    const $reload = item.querySelector('.mapicon-reload');
    const $content = item.querySelector('.mapicon-content');

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
      setHtml();
    });
    $close.addEventListener('click', () => {
      AMap.DomUtil.removeClass(item, 'isActive');
    });

    function setHtml(callback) {
      if (dataSource.deviceType === 2) {
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
    $root.forEach((item) => {
      AMap.DomUtil.removeClass(item, 'isActive');
    });
  }
}
