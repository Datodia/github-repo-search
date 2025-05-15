import test from 'brittle'
import { debounce } from '../utils.js'

test('debounce delays function execution', async function (t) {
  let counter = 0
  const increment = () => counter++
  const debouncedIncrement = debounce(increment, 100)

  debouncedIncrement()
  debouncedIncrement()
  debouncedIncrement()

  t.is(counter, 0, 'Counter should not increment immediately')

  await new Promise((resolve) => setTimeout(resolve, 150))
  t.is(counter, 1, 'Counter should increment after debounce delay')
})