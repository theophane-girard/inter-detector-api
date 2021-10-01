export const CONFIG: any = {
  apiV4Base: 'https://euw1.',
  apiV5Base: 'https://europe.',
  apiUrl: 'api.riotgames.com/lol',
  apiUrlMatchesByPuuidPrefix: '/match/v5/matches/by-puuid/',
  apiUrlMatchesByPuuidSuffix: '/ids',
  apiUrlMatchesById: '/match/v5/matches/',
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
  rankedLabel: 'RANKED_SOLO_5x5',
  badRequestMessage: {
    status: 500,
    msg: 'Bad request'
  },
  bankDaysPerGame: 7,
  countDownTemplate:(date: Date) => `
  <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700|Montserrat:900">
            <title>Document</title>
            <style>
        
        body{
            background-color: white;
        }
          
        #timer {
          color: #eeeeee;
          text-align: center;
          text-transform: uppercase;
          font-family: 'Lato', sans-serif;
          font-size: .7em;
          letter-spacing: 5px;
        }
        
        .days, .hours, .minutes, .seconds {
          display: inline-block;
          padding: 20px;
          width: 100px;
          border-radius: 5px;
        }
        
        .days {
          background: #EF2F3C;
        }
        
        .hours {
          background: #eeeeee;
          color: #183059;
        }
        
        .minutes {
          background: #276FBF;
        }
        
        .seconds {
          background: #F0A202;
        }
        
        .numbers {
          font-family: 'Montserrat', sans-serif;
          color:  #183059;
          font-size: 4em;
          text-align: center;
        }
        
        .white {
          position: absolute;
          background:  #eeeeee;
          height: 85px;
          width: 75px;
          left: 30%;
          top: 2%;
        }
        
        .red {
          position: absolute;
          background:  #EF2F3C;
          left: 18%;
          top: 9%;
          height: 65px;
          width: 70px;
         
        }
        
        .blue {
          position: absolute;
          background:  #276FBF;
          height: 80px;
          width: 80px;
          left: 60%;
          top: 5%;
        
        
        }
        
        
            </style>
        </head>
        <body>
            
        <div id="timer">
        
            <div class="days"> 
                <div id="days" class="numbers "> </div>days</div> 
              <div class="hours"> 
                <div  id="hours" class="numbers"> </div>hours</div> 
              <div class="minutes"> 
                <div  id="minutes" class="numbers"> </div>minutes</div> 
              <div   class="seconds"> 
                <div id="seconds" class="numbers"> </div>seconds</div> 
              </div>
        
        </div>
        
        </body>
        <script>
            const year = new Date().getFullYear();
        const myDate = new Date(${date.getTime()});
        
        // countdown
        let timer = setInterval(function() {
        
          // get today's date
          const today = new Date().getTime();
        
          // get the difference
          const diff = myDate - today;
        
          // math
          let days = Math.floor(diff / (1000 * 60 * 60 * 24));
          let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
          // display
          document.getElementById("days").innerHTML=days
          document.getElementById("hours").innerHTML=hours
          document.getElementById("minutes").innerHTML=minutes
          document.getElementById("seconds").innerHTML=seconds
        
        
        
        }, 1);
        </script>
        </html>
  `
}