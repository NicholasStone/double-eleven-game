export function getRandomNumber (min = 0, max = 1): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getRandomInArray<T> (arr: Array<T>, min = 0, max = -1): T {
  return arr[getRandomNumber(min, max > 0 ? max : arr.length - 1)]
}
