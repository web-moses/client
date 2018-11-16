export const makeDomTrigger = (scopes: Element[], callback: MutationCallback) => {
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  const observer = new MutationObserver(callback);

  scopes.forEach(scope => {
    observer.observe(scope, config);
  });

  return {
    stop: () => observer.disconnect(),
  };
};
