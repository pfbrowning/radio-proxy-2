import express from 'express';
import cors from 'cors';
import icy from 'icy';

const app = express();

const PORT = process.env.PORT ?? 3000;

const convertRawHeadersToDictionary = (icyResponse: any): Record<string, string> => {
  const rawHeaders: string[] = icyResponse.rawHeaders;
  const dictionary = {};
  if (rawHeaders.length % 2 === 1) {
    throw new Error('Raw headers length must be even');
  }
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const key = rawHeaders[i].toLowerCase();
    const value = rawHeaders[i + 1];
    dictionary[key] = value;
  }
  return dictionary;
}

app.use(cors());

app.get('/listen', (expressRequest, expressResponse) => {
  const icyClient = icy.get(expressRequest.query.url, icyResponse => {
    icyResponse.on('metadata', (metadata) => {
      const parsed = icy.parse(metadata);

      console.log('metadata received', expressRequest.query.url, parsed);
    });

    const headers = convertRawHeadersToDictionary(icyResponse);
    expressResponse.setHeader('Content-Type', headers['content-type']);

    icyResponse.pipe(expressResponse);
  });

  icyClient.on('error', (error) => {
    const statusCode = error.code === 'ECONNREFUSED' ? 503 : 500;
    return expressResponse.status(statusCode).json();
  });
});

app.listen(PORT);

