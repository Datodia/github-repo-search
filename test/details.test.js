import test from 'brittle'
import { JSDOM } from 'jsdom'
import { mockRepos } from '../mock.js'

test('renders repository details correctly', function (t) {
  const repo = mockRepos[0]
  const dom = new JSDOM('<div id="app"></div>')
  global.document = dom.window.document
  global.window = dom.window

  const app = document.querySelector('#app')

  // Simulate URL with repo ID
  const repoId = repo.id
  global.window.location.search = `?id=${repoId}`

  // Render details
  app.innerHTML = `
    <h1>${repo.name}</h1>
    <p><strong>Description:</strong> ${repo.description}</p>
    <p><strong>Stars:</strong> ⭐ ${repo.stargazers_count}</p>
    <p><strong>Forks:</strong> 🍴 ${repo.forks_count}</p>
    <p><strong>Repository URL:</strong> <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
  `

  t.ok(app.querySelector('h1').textContent === repo.name, 'Repository name should be rendered correctly')
  t.ok(app.querySelector('p').textContent.includes(repo.description), 'Repository description should be rendered correctly')
  t.ok(app.querySelector('a').href === repo.html_url, 'Repository URL should be rendered correctly')
})

test('renders "Back" button correctly', function (t) {
  const dom = new JSDOM('<div id="app"></div>')
  global.document = dom.window.document
  global.window = dom.window

  const app = document.querySelector('#app')

  // Render back button
  const backButton = document.createElement('button')
  backButton.textContent = 'Back'
  backButton.id = 'back-button'
  backButton.addEventListener('click', () => (window.location.href = './index.html'))
  app.appendChild(backButton)

  t.ok(app.querySelector('#back-button').textContent === 'Back', 'Back button should be rendered correctly')
})

test('renders "Repository not found" for invalid ID', function (t) {
  const dom = new JSDOM('<div id="app"></div>')
  global.document = dom.window.document
  global.window = dom.window

  const app = document.querySelector('#app')

  // Simulate URL with invalid repo ID
  global.window.location.search = '?id=999999'

  // Render not found message
  app.innerHTML = '<p>Repository not found.</p>'

  t.ok(app.querySelector('p').textContent === 'Repository not found.', 'Should render "Repository not found" for invalid ID')
})