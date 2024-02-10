import express, { response } from 'express';
import cors from 'cors';
import icy from 'icy';

const app = express();

const PORT = process.env.PORT || 3000;

const convertRawHeadersToDictionary = (rawHeaders: string[]): { [key: string]: string } => {
  const dictionary = {};
  if (rawHeaders.length % 2 == 1) {
    throw new Error('Raw headers length must be even');
  }
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const key = rawHeaders[i];
    const value = rawHeaders[i + 1];
    dictionary[key] = value;
  }
  return dictionary;
}

app.use(cors());

app.get('/listen', async (expressRequest, expressResponse) => {
  const icyClient = icy.get(expressRequest.query.url, icyResponse => {
      icyResponse.on('metadata', (metadata) => {
          var parsed = icy.parse(metadata);

          console.log('metadata received', expressRequest.query.url, parsed);
      });

      const headers = convertRawHeadersToDictionary(icyResponse.rawHeaders);
      expressResponse.setHeader('Content-Type', headers['content-type']);

      icyResponse.pipe(expressResponse);
  });

  icyClient.on('error', (error) => {
      const statusCode = error.code === 'ECONNREFUSED' ? 503 : 500;
      return expressResponse.status(statusCode).json();
  });
});

app.listen(PORT);

