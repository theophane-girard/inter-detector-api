export const CONFIG: any = {
  apiUrl: 'https://euw1.api.riotgames.com/lol',
  apiUrlMatchesByPuuidPrefix: '/match/v5/matches/by-puuid/',
  apiUrlMatchesByPuuidSuffix: '/ids',
  apiUrlMatchesByAccountId: '/match/v4/matchlists/by-account/',
  apiUrlMatchesById: '/match/v4/matches/',
  apiUrlGetSummoner: '/summoner/v4/summoners/by-name/',
  apiUrlGetSummonerLeague: '/league/v4/entries/by-summoner/',
  matchStartIndex: 0,
  win: {
      'Win': {
        label: 'V',
        value: true
      },
      'Fail': {
        label: 'D',
        value: false
      }
  },
  daysOfWeek : {
      0: 7,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
  },
  locale: 'fr-FR',
  soloRankedLabel: 'RANKED_SOLO_5x5',
  championsUrl: 'https://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json',
  championsSplashArtUrl: 'https://ddragon.leagueoflegends.com/cdn/11.11.1/img/champion/',
  championsSplashArtExtension: '.png',
  rankedPositionsExtension: '.png',
  rankedPositionLabel: 'Position_',
  rankedPositionTier: {
    'Platinum': 'Plat',
  },
  rankedPositionLane: {
    'Bottom': 'Bot',
  },
  rankedQueueId: 420,
  maxInterWinRate: 49,
  minQuiteInterWinRate: 49,
  maxQuiteInterWinRate: 50,
  minRandomPlayerWinRate: 50,
  maxRandomPlayerWinRate: 52,
  minQuiteCarryWinRate: 52,
  maxQuiteCarryWinRate: 55,
  minHyperCarryWinRate: 56,

  maxInterKda: 1,
  minQuiteInterKda: 1,
  maxQuiteInterKda: 1.2,
  minRandomPlayerKda: 1.2,
  maxRandomPlayerKda: 3.0,
  minQuiteCarryKda: 3.0,
  maxQuiteCarryKda: 3.5,
  minHyperCarryKda: 3.5,
  label: {
    inter: {
      name: 'INTER',
      class: 'inter'
    },
    troll: {
      name: 'TROLL',
      class: 'troll'
    },
    newAccount: {
      name: 'New account',
      class: 'newAccount'
    },
    hyperCarry: {
      name: 'HYPER CARRY',
      class: 'hyperCarry'
    },
    carry: {
      name: 'Carry',
      class: 'carry'
    },
  },
  newAccountValue: 100,
  unrankedLabel: 'unranked',
  rankedLabel: 'RANKED_SOLO_5x5'
}