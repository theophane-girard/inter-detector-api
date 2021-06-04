import {writeFile} from 'fs';

const targetPath = './src/config/credentials.ts';
const prodCredentialsFile = `export const CREDENTIALS = {
    CREDENTIALS: {
      summonerName: '${process.env.SUMMONER_NAME}',
      apiKey: '${process.env.RIOT_API_KEY}'
    }
};
`;

writeFile(targetPath, prodCredentialsFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});