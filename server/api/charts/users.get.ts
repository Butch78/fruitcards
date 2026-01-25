export default defineEventHandler((event) => {
  const { timeRange } = getQuery(event);

  const generateData = (points: number) => {
    return Array.from({ length: points }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        hour: date.toISOString().split('T')[0],
        newUsers: Math.floor(Math.random() * 10),
        returningUsers: Math.floor(Math.random() * 30),
      };
    }).reverse();
  };

  let data;
  switch (timeRange) {
    case 'Last 24 Hours':
      data = generateData(24);
      break;
    case 'Last 7 Days':
      data = generateData(7);
      break;
    case 'Last 30 Days':
      data = generateData(30);
      break;
    case 'Last Year':
      data = generateData(365);
      break;
    default:
      data = generateData(7);
  }

  return data;
});
