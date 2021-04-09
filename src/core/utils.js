// Pure functions
export function capitalize(string) {
  if (typeof string !== 'string') {
    return ''
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function range(start, end) {
  if (start > end) {
    [end, start] = [start, end]
  }
  return new Array(end - start + 1)
      .fill('')
      // .map(item => {
      //   item = start
      //   start++
      //   return item
      // })
      .map((_, index) => start + index)
}

// const arr = []
// for (let i = start; i <= end; i++) {
//   arr.push(i)
// }
// return arr

// input: 0, 3
// output: [0, 1, 2, 3]
