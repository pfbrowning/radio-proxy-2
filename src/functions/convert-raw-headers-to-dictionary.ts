export const convertRawHeadersToDictionary = (
  icyResponse: any
): Record<string, string> => {
  const rawHeaders: string[] = icyResponse.rawHeaders;
  const dictionary = {};
  if (rawHeaders.length % 2 === 1) {
    throw new Error("Raw headers length must be even");
  }
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const key = rawHeaders[i].toLowerCase();
    const value = rawHeaders[i + 1];
    dictionary[key] = value;
  }
  return dictionary;
};
