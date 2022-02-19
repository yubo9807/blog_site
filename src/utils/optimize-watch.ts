import { isClient } from './browser';

declare const window: any;
const { log } = console;

if (isClient()) {
  optimizeWacth();
}

function optimizeWacth() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = window.performance.timing, loadObj = {};
      const paint = window.performance.getEntriesByType('paint');
  
      loadObj['DNS查询耗时'] = timing.domainLookupEnd - timing.domainLookupStart;
      loadObj['TCP链接耗时'] = timing.connectEnd - timing.connectStart;
      loadObj['request耗时'] = timing.responseEnd - timing.responseStart;
      loadObj['解析DOM树耗时'] = timing.domComplete - timing.domInteractive;
      loadObj['白屏时间'] = timing.domLoading - timing.fetchStart;
      loadObj['domready'] = timing.domContentLoadedEventEnd - timing.fetchStart;
      loadObj['onload'] = timing.loadEventEnd - timing.fetchStart;
  
      loadObj['首次绘制时间(FC)'] = paint[0]?.startTime;
      loadObj['首次内容绘制时间(FCP)'] = paint[1]?.startTime;

      window.load = loadObj;
    }, 0);
  })

  // 采集JS Error
  window.onerror = (errorMsg, url, lineNumber, columnNumber, errorObj) => {
    let errorStack = errorObj ? errorObj.stack : null;

    log(errorMsg, url, lineNumber, columnNumber, errorStack);
  };
  window.onunhandledrejection = (e) => {
    let errorMsg = "", errorStack = "";
    if (typeof e.reason === "object") {
      errorMsg = e.reason.message;
      errorStack = e.reason.stack;
    } else {
      errorMsg = e.reason;
    }

    log(errorMsg, errorStack);
  }
}