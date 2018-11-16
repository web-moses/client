export type SimplePositionType = 'left' | 'right';

export interface SceneStepType {
  title: string;
  urlPattern: string;
  selector: string;
  overlay: string;
  position?: SimplePositionType;
  /** 聚焦模式 */
  focusMode: 'scrollTo' | 'visible';
  ensureSelectors?: string[];
}

export interface SceneType {
  id: number;
  title: string;
  urlPattern: string;
  data: {
    steps: SceneStepType[];
  };
}

export interface SceneProgress {
  scene: SceneType;
  stepQueue: SceneStepType[];
}

export interface ServiceType {
  getScene: () => Promise<SceneType>;
  finishScene: (sceneId: number) => Promise<void>;
}
