type Keys = 'FollowArtist';
const PREFIX = '!!!!';

export const done = (key: Keys) => {
  window.localStorage.setItem(`${PREFIX}${key}`, 'done');
};

export const isDone = (key: Keys) => {
  return window.localStorage.getItem(`${PREFIX}${key}`);
};

export const reset = (key: Keys) => {
  return window.localStorage.removeItem(`${PREFIX}${key}`);
};
