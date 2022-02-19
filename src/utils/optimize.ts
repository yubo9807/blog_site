/**
 * 节流
 * @param handler 
 * @param wait 
 * @returns 
 */
 export function throttle(handler: () => void, wait: number) {
  let lastTime = 0;
  return function() {
    let nowTime = new Date().getTime();
    if (nowTime - lastTime > wait) {
      handler.apply(this, arguments);
      lastTime = nowTime;
    }
  }
}

/**
* 防抖
* @param handler 
* @param delay 
* @returns 
*/
export function debounce(handler: () => void, delay: number){
  let timer: NodeJS.Timeout;
  return function() {
    let _self = this, _arg = arguments;
    clearTimeout(timer);
    timer = setTimeout(function(){
      handler.apply(_self, _arg);
    }, delay);
  }
}
