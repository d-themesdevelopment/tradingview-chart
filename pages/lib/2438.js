

import { getInstance } from './49326'; // ! not completed

const quoteSessions = {};

function getQuoteSessionInstance(type = 'full') {
  return quoteSessions[type] || createQuoteSession(type);
}

function createQuoteSession(type = 'full') {
  const quoteSession = getInstance(type);
  quoteSessions[type] = quoteSession;
  return quoteSession;
}

function destroyQuoteSessions() {
  for (const type in quoteSessions) {
    if (quoteSessions.hasOwnProperty(type)) {
      const quoteSession = quoteSessions[type];
      if (quoteSession !== undefined) {
        quoteSession.destroy();
        delete quoteSessions[type];
      }
    }
  }
}

export { destroyQuoteSessions, getQuoteSessionInstance };
