export default function update(AMap, map, markers) {
  const $markersDom = document.querySelectorAll(".mapicon-root");
  $markersDom.forEach((item) => {
    const $icon = item.querySelector(".mapicon-img");
    const $content = item.querySelector(".mapicon-container");
    const $close = item.querySelector(".mapicon-close");
    $icon.addEventListener("click", () => {
      if (AMap.DomUtil.hasClass($content, "hide")) {
        AMap.DomUtil.removeClass($content, "hide");
      } else {
        AMap.DomUtil.addClass($content, "hide");
      }
    });
    $close.addEventListener("click", () => {
      AMap.DomUtil.addClass($content, "hide");
    });
  });
}
