export enum REGION {
  br1 = 'br1',
  eun1 = 'eun1',
  euw1 = 'euw1',
  jp1 = 'jp1',
  kr = 'kr',
  la1 = 'la1',
  la2 = 'la2',
  na1 = 'na1',
  oc1 = 'oc1',
  ph2 = 'ph2',
  ru = 'ru',
  sg2 = 'sg2',
  th2 = 'th2',
  tr1 = 'tr1',
  tw2 = 'tw2',
  vn2 = 'vn2',
}

export enum REGION_CLUSTER {
  americas = 'americas',
  asia = 'asia',
  europe = 'europe',
  sea = 'sea',
}

// https://leagueoflegends.fandom.com/wiki/Servers
// PH2, SG2, TW2, TH2, and VN2 - Sea
// LA, LA2, NA1 - Americas
// EUN1, EUW1 - Europe
// KR, RU, TR1 - Asia
export const REGION_MAPPING = {
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',
  na1: 'americas',
  eun1: 'europe',
  euw1: 'europe',
  kr: 'asia',
  ru: 'asia',
  tr1: 'asia',
  jp1: 'sea',
  oc1: 'sea',
  ph2: 'sea',
  sg2: 'sea',
  th2: 'sea',
  tw2: 'sea',
  vn2: 'sea',
};

export const RANK_EMBLEM = {
  IRON: 'emblem-iron',
  BRONZE: 'emblem-bronze',
  SILVER: 'emblem-silver',
  GOLD: 'emblem-gold',
  PLATINUM: 'emblem-platinum',
  DIAMOND: 'emblem-diamond',
  MASTER: 'emblem-master',
  GRANDMASTER: 'emblem-grandmaster',
  CHALLANGER: 'emblem-challanger',
};

export const TIER_RANKING = {
  IRON: 1,
  BRONZE: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
  DIAMOND: 6,
  MASTER: 7,
  GRANDMASTER: 8,
  CHALLANGER: 9,
};

export const RANK_RANKING = {
  I: 5,
  II: 4,
  III: 3,
  IV: 2,
  V: 1,
};

export const QUEUE_TYPE = {
  RANKED_SOLO_5x5: 'RANKED_SOLO_5x5',
  RANKED_FLEX_SR: 'RANKED_FLEX_SR',
  RANKED_TFT_DOUBLE_UP: 'RANKED_TFT_DOUBLE_UP',
};
