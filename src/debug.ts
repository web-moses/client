import * as debug from 'debug';

const scopeDebug = debug('MO');

function makeBizDebugBase(name: string) {
  return class Base {
    default = scopeDebug.extend(name);
    info = this.default.extend('info');
    log = this.default.extend('log');
    warn = this.default.extend('warn');
    error = this.default.extend('error');
  };
}

class NormalDebug extends makeBizDebugBase('normal') {}

/** 通用 debug */
export const normalDebug = new NormalDebug();
