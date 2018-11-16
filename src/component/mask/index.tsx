import { h, ComponentChildren, Component } from 'preact';
import './style.less';

export interface Props {
  children: ComponentChildren;
}

export class Mask extends Component {
  componentDidMount() {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.width = 'auto';
  }

  render() {
    const { children } = this.props;
    return <div className="MO-mask">{children}</div>;
  }
}
