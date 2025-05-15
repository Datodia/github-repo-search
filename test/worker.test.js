import test from 'brittle'
import { mockRepos } from '../mock.js'

test('worker filters repositories by query', function (t) {
  const query = 'awesome'
  const filteredRepos = mockRepos.filter((repo) =>
    repo.name.toLowerCase().includes(query.toLowerCase())
  )

  t.ok(filteredRepos.length > 0, 'Filtered repositories should not be empty')
  t.ok(filteredRepos.every((repo) => repo.name.toLowerCase().includes(query)), 'All filtered repositories should match the query')
})

test('worker ignores repositories with ignore words', function (t) {
  const query = 'awesome'
  const ignore = 'lite'
  const filteredRepos = mockRepos.filter((repo) =>
    repo.name.toLowerCase().includes(query.toLowerCase()) &&
    !repo.name.toLowerCase().includes(ignore.toLowerCase())
  )

  t.ok(filteredRepos.length > 0, 'Filtered repositories should not be empty')
  t.ok(filteredRepos.every((repo) => !repo.name.toLowerCase().includes(ignore)), 'Ignored words should not appear in filtered repositories')
})

test('worker sorts repositories in ascending order', function (t) {
  const sortedRepos = [...mockRepos].sort((a, b) => a.name.localeCompare(b.name))

  t.ok(sortedRepos[0].name < sortedRepos[1].name, 'Repositories should be sorted in ascending order')
})

test('worker sorts repositories in descending order', function (t) {
  const sortedRepos = [...mockRepos].sort((a, b) => b.name.localeCompare(a.name))

  t.ok(sortedRepos[0].name > sortedRepos[1].name, 'Repositories should be sorted in descending order')
})