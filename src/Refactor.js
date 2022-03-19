/* eslint-disable no-restricted-syntax */
const playList = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  'as-like': { name: 'As You Like It', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' },
};

const bills = {
  customer: 'BigCo',
  performances: [
    {
      playID: 'hamlet',
      audience: 55,
    },
    {
      playID: 'as-like',
      audience: 35,
    },
    {
      playID: 'othello',
      audience: 40,
    },
  ],
};

const playFor = (aPerformance) => playList[aPerformance.playID];

const amountFor = (aPerformance) => {
  let result = 0;

  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break; default:
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
  }

  return result;
};

const volumeCreditsFor = (aPerformance) => {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);

  // add extra credit for every ten comedy attendees
  if (playFor(aPerformance).type === 'comedy') result += Math.floor(aPerformance.audience / 5);

  return result;
};

const formatUSD = (aNumber) => new Intl.NumberFormat(
  'en-US',
  {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  },
).format(aNumber / 100);

const totalVolumeCredits = (invoice) => {
  let volumeCredits = 0;

  for (const perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }

  return volumeCredits;
};

const statement = (invoice) => {
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (const perf of invoice.performances) {
    // print line for this order
    result += ` ${playFor(perf).name}: ${formatUSD(amountFor(perf))} (${perf.audience} seats)\n`;
  }

  for (const perf of invoice.performances) {
    totalAmount += amountFor(perf);
  }


  result += `Amount owed is ${formatUSD(totalAmount)}\n`;
  result += `You earned ${totalVolumeCredits(invoice)} credits\n`;

  return result;
};

console.log(statement(bills));
