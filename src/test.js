
// prev = 1011
// next = 1100
// => 2

// prev = 0
// next = 1
// => 0

// prev = 1
// next = 10
// => 1

function whereOneAppeared(prev, next) {
  return prev.length - next.findIndex((el, i) => el === '1' && prev[i] === '0') - 1
}

prev = '10011'.split('')
next = '10100'.split('')

console.log(whereOneAppeared(prev, next))