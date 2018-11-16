import { render, h } from 'preact';
import { App, Props } from './app';
import { ServiceType } from './type';

const makeMountPoint = () => {
  const mount = document.createElement('div');
  mount.id = 'web-moses';
  document.body.appendChild(mount);
  return mount;
};

class Service {
  getScene = async () => {
    return import('./scene').then(m => m.default);
  };

  finishScene = async (sceneId: number) => {
    console.log('finishScene', sceneId);
  };
}

export interface RunConfigType {
  service?: ServiceType
}

export const run = (opt: RunConfigType = {}) => {
  render(<App service={opt.service || new Service()} />, makeMountPoint());
};
