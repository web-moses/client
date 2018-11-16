export const makeScrollTrigger = callback => {
  window.addEventListener('scroll', callback);

  return {
    stop: () => window.removeEventListener('scroll', callback),
  };
};
