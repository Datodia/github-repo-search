import test from 'brittle' // https://github.com/holepunchto/brittle
import { JSDOM } from 'jsdom'
import { mockRepos } from '../mock.js'

test('renders card view correctly', function (t) {
  const dom = new JSDOM('<div id="app"></div>')
  global.document = dom.window.document

  const container = document.createElement('div')
  container.className = 'card-view'

  mockRepos.slice(0, 2).forEach((repo) => {
    const card = document.createElement('div')
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description}</p>
      <a href="/detail.html?id=${repo.id}">Details</a>
      <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
    `
    container.appendChild(card)
  })

  t.ok(container.children.length === 2, 'Card view should render the correct number of repositories')
  t.ok(container.querySelector('h3').textContent === mockRepos[0].name, 'First card should have the correct repository name')
})

test('renders table view correctly', function (t) {
  const dom = new JSDOM('<div id="app"></div>')
  global.document = dom.window.document

  const container = document.createElement('div')
  container.className = 'table-view'

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Stars</th>
        <th>Forks</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      ${mockRepos.slice(0, 2).map((repo) => `
        <tr>
          <td>${repo.name}</td>
          <td>${repo.description}</td>
          <td>${repo.stargazers_count}</td>
          <td>${repo.forks_count}</td>
          <td><a href="detail.html?id=${repo.id}">Details</a></td>
        </tr>
      `).join('')}
    </tbody>
  `
  container.appendChild(table)

  t.ok(container.querySelectorAll('tr').length === 3, 'Table view should render the correct number of rows (including header)')
  t.ok(container.querySelector('td').textContent === mockRepos[0].name, 'First row should have the correct repository name')
})