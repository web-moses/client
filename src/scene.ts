import { SceneType } from './type';
import { uid } from './util';

export const normal: SceneType = {
  id: uid(),
  title: '普通',
  urlPattern: '.*',
  data: {
    steps: [
      {
        title: '第1步',
        urlPattern: '.*',
        selector: '#m1',
        overlay: '<p>dddd</p>',
        focusMode: 'visible',
      },
      {
        title: '第2步',
        urlPattern: '.*',
        selector: '#m2',
        overlay: '<p>m2</p>',
        focusMode: 'scrollTo',
      },
    ],
  }

};


export default normal;
