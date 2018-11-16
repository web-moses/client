import { h, Component } from 'preact';
import { Mask } from './component/mask';
import { Focus } from './component/focus';
import { SceneType, SceneStepType, ServiceType } from './type';
import { isElementVisible, scrollToElement, throttle } from './util';
import { makeDomTrigger } from './trigger/dom';
import { makeScrollTrigger } from './trigger/scroll';
import { normalDebug } from './debug';

export const EMPTY_INDEX = -1;

export interface Props {
  service: ServiceType;
}

export interface State {
  /** 当前场景 */
  currentScene: SceneType;
  /** 激活的步骤 */
  activeStepIndex: number;
  /** 待检查的下一个步骤*/
  pendingStepIndex?: number;
}

export class App extends Component<Props, State> {
  state: State = {
    currentScene: null,
    activeStepIndex: EMPTY_INDEX,
    pendingStepIndex: EMPTY_INDEX,
  };

  // trigger
  domTrigger?: ReturnType<typeof makeDomTrigger>;
  scrollTrigger?: ReturnType<typeof makeScrollTrigger>;

  componentDidMount() {
    this.loadScene().then(() => this.goToNextStep());
    const handler = throttle(this.ifIdle(this.goToNextStep));
    // 监听 body 变化
    this.domTrigger = makeDomTrigger([document.body], handler);
    // 监听滚动
    this.scrollTrigger = makeScrollTrigger(handler);
  }

  componentWillUnmount() {
    this.domTrigger && this.domTrigger.stop();
    this.scrollTrigger && this.scrollTrigger.stop();
  }

  get isLastStep(): boolean {
    const { activeStepIndex, currentScene } = this.state;
    if (!currentScene) return true;
    return activeStepIndex >= currentScene.data.steps.length - 1;
  }

  get activeStep() {
    const { currentScene, activeStepIndex } = this.state;
    if (!currentScene) return;
    return currentScene.data.steps[activeStepIndex];
  }

  get pendingStep() {
    const { currentScene, pendingStepIndex } = this.state;
    if (!currentScene) return;
    return currentScene.data.steps[pendingStepIndex];
  }

  loadScene = async () => {
    const originScene = await this.props.service.getScene();
    if (!originScene) return;
    return this.setStateAndWait({
      currentScene: originScene,
      pendingStepIndex: 0,
    });
  };

  setStateAndWait = (state: Partial<State>) =>
    new Promise(resolve => this.setState(state as any, resolve));

  ifIdle = (fn: Function) => () => {
    if (!this.activeStep) fn();
  };

  isPendingStepAvailable(): boolean {
    const pendingStep = this.pendingStep;

    if (!pendingStep) return false;

    normalDebug.info('isPendingStepAvailable: pendingStep=%s', pendingStep.title);

    const isUrlOk = new RegExp(pendingStep.urlPattern).test(window.location.href);
    const isSelectorOk = !!document.querySelector(pendingStep.selector);
    const isEnsureSelectorOk = (pendingStep.ensureSelectors || []).every(
      s => !!document.querySelector(s)
    );
    const isVisibleOk =
      pendingStep.focusMode === 'visible'
        ? isElementVisible(document.querySelector(pendingStep.selector))
        : true;

    normalDebug.log(
      'isUrlOk=%s, isSelectorOk=%s, isEnsureSelectorOk=%s, isVisibleOk=%s',
      isUrlOk,
      isSelectorOk,
      isEnsureSelectorOk,
      isVisibleOk
    );

    return isUrlOk && isSelectorOk && isEnsureSelectorOk && isVisibleOk;
  }

  focusToStep = async (step: SceneStepType) => {
    const { focusMode, selector } = step;
    const targetDom = document.querySelector(selector);
    if (focusMode === 'scrollTo') {
      await scrollToElement(targetDom);
    }
  };

  goToNextStep = async () => {
    const pendingStep = this.pendingStep;

    // 检查下一个步骤
    if (this.isPendingStepAvailable()) {
      // 下一个步骤准备好了，聚焦过去
      await this.focusToStep(pendingStep);
      await this.setStateAndWait({
        // 设置激活步骤
        activeStepIndex: this.state.pendingStepIndex,
        // 待检查步骤后移
        pendingStepIndex: this.state.pendingStepIndex + 1,
      });
      return;
    }

    // 下个步骤没有准备好，要清空当前步骤
    this.setState({ activeStepIndex: EMPTY_INDEX });
  };

  finishScene = async () => {
    this.setState({
      activeStepIndex: EMPTY_INDEX,
      pendingStepIndex: EMPTY_INDEX
    });

    try {
      await this.props.service.finishScene(this.state.currentScene.id);
    } catch (e) { }
  };

  render() {
    const activeStep = this.activeStep;

    if (!activeStep) {
      return <div />;
    }

    return (
      <Mask>
        <Focus
          targetDom={document.querySelector(activeStep.selector)}
          position={activeStep.position}
          onNext={!this.isLastStep && this.goToNextStep}
          onFinish={this.isLastStep && this.finishScene}
        >
          <div dangerouslySetInnerHTML={{ __html: activeStep.overlay }} />
        </Focus>
      </Mask>
    );
  }
}
