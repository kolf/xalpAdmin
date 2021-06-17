import React, { useEffect } from "react";
import F2 from "@antv/f2";

const data = [
  {
    year: "1951 年",
    sales: 38,
  },
  {
    year: "1952 年",
    sales: 52,
  },
  {
    year: "1956 年",
    sales: 61,
  },
  {
    year: "1957 年",
    sales: 145,
  },
  {
    year: "1958 年",
    sales: 48,
  },
  {
    year: "1959 年",
    sales: 38,
  },
  {
    year: "1960 年",
    sales: 38,
  },
  {
    year: "1962 年",
    sales: 38,
  },
];

export default React.memo(function DataTable1Chart({ id, dataSource }) {
  useEffect(() => {
    if (id) {
      renderChart(id);
    }

    function renderChart(id) {
      const chart = new F2.Chart({
        id,
        pixelRatio: window.devicePixelRatio,
      });

      chart.source(data, {
        sales: {
          tickCount: 5,
        },
      });
      chart.tooltip({
        showItemMarker: false,
        onShow: function onShow(ev) {
          const items = ev.items;
          items[0].name = null;
          items[0].name = items[0].title;
          items[0].value = "¥ " + items[0].value;
        },
      });
      chart.interval().position("year*sales");
      chart.render();
    }
  }, [dataSource, id]);

  return <canvas id={id} width="800" height="320"></canvas>;
});
