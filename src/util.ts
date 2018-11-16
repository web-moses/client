import { SceneProgress } from './type';

export function readLocalProgress(): SceneProgress {
  return JSON.parse(window.localStorage.getItem('_web_moses_') || 'null');
}

export function saveLocalProgress(progress: SceneProgress) {
  window.localStorage.setItem('_web_moses_', JSON.stringify(progress));
}

export function isElementVisible(target: Element): boolean {
  if (!target) return;
  const offset = target.getBoundingClientRect();
  return (
    offset.top > 0 &&
    offset.right <= window.innerWidth &&
    offset.bottom > 0 &&
    offset.bottom <= window.innerHeight
  );
}

export function scrollToElement(target: Element): Promise<void> {
  const offset = target.getBoundingClientRect();
  const top = window.pageYOffset + offset.top;
  let currentTop = 0;
  let requestId;
  return new Promise(resolve => {
    // 平滑动画
    function step() {
      currentTop += 100;
      if (currentTop <= top) {
        window.scrollTo(0, currentTop);
        requestId = window.requestAnimationFrame(step);
      } else {
        window.cancelAnimationFrame(requestId);
        resolve();
      }
    }
    window.requestAnimationFrame(step);
  });
}

export function throttle(method: Function, delay: number = 200) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      method.apply(context, args);
    }, delay);
  };
}

let index = 0;
export function uid() {
  return index++;
}