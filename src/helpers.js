import TimeFormat from 'hh-mm-ss';
import consoleLog from './consoleLog';

export const shuffleArray = array => {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
  ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const convertTimeToSeconds = time => {
  if (time) {
    try {
      return TimeFormat.toS(time);
    } catch (e) {
      consoleLog("Error calculating the time", time, e);
      return 0;
    }
  }
}

export const currentSecondsPastTheHour = () => {
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();

  return (currentMinutes * 60) + currentSeconds;
}

export const calculateSecondsUntilNextProgram = () => {
  const oneHourInSeconds = 60 * 60;
  let secondsUntilNextProgram = oneHourInSeconds - currentSecondsPastTheHour();

  if (secondsUntilNextProgram < 0) {
    secondsUntilNextProgram = 3600;
  }

  return secondsUntilNextProgram;
}
