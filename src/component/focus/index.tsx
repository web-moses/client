import {h, ComponentChildren} from 'preact';
import {SimplePositionType} from '../../type';
import './style.less';

export interface Props {
  targetDom: HTMLElement;
  position?: SimplePositionType;
  onNext?: () => void;
  onFinish?: () => void;
  children: ComponentChildren;
}

export type SimpleAnchorType = {
  [key in SimplePositionType]: {
    anchor: {x: number; y: number};
    offset: {x: string; y: string};
  }
};

const makePosition = (height: number, width: number): SimpleAnchorType => ({
  left: {
    anchor: {
      x: 0,
      y: height / 2,
    },
    offset: {
      x: '-100%',
      y: '-50%',
    },
  },
  right: {
    anchor: {
      x: width,
      y: height / 2,
    },
    offset: {
      x: '0',
      y: '-50%',
    },
  },
});

export const Focus = ({targetDom, position = 'right', children, onNext, onFinish}: Props) => {
  const offset = targetDom.getBoundingClientRect();

  /**
   * 这里的位置计算用了两层节点。外层是 anchor，内层是 offset。
   * anchor 绝对定位配合 offset 位置偏移来实现 8 个定位位置。
   */
  const posDef = makePosition(offset.height, offset.width)[position];
  const anchorStyle: any = {
    top: offset.top + posDef.anchor.y,
    left: offset.left + posDef.anchor.x,
  };
  const offsetStyle: any = {
    transform: `translate(${posDef.offset.x}, ${posDef.offset.y})`,
  };

  return (
    <div className="MO-focus" style={anchorStyle}>
      <div className="MO-focus-offset" style={offsetStyle}>
        <div className="MO-focus-content">{children}</div>
        <footer>
          {onNext && <a onClick={onNext}>下一步</a>}
          {onFinish && <a onClick={onFinish}>完成</a>}
        </footer>
      </div>
    </div>
  );
};
