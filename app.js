/** @typedef {import('pear-interface')} */ /* global Pear */

import { debounce } from './utils'

Pear.updates(() => Pear.reload())

const app = document.querySelector('#app')
const worker = Pear.worker.run('./worker.js')

let container, layoutSelect, sortSelect

worker.on('data', data => {
    const resp = JSON.parse(Buffer.from(data).toString('utf8'))
    if (Array.isArray(resp)) renderResults(resp)
})

async function handleOnChange() {
    const query = document.querySelector('input[type="text"]').value.trim()
    const ignoreWord = document.querySelector('#ignore-word').value.trim()
    if (query.length < 3) return

    const payload = {
        query,
        sort: sortSelect.value,
        ignore: ignoreWord
    }

    worker.write(JSON.stringify(payload))
}

function renderResults(repos) {
    container.innerHTML = ''
    container.className = layoutSelect.value === 'card' ? 'card-view' : 'table-view'

    if (layoutSelect.value === 'card') {
        repos.forEach(repo => {
            const card = document.createElement('div')
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description}</p>
                <a href="/detail.html?id=${repo.id}">Details</a>
                <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
            `
            container.appendChild(card)
        })
    } else {
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
                ${repos.map(repo => `
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
    }
}

function init() {
    const controls = document.createElement('div')
    controls.id = 'controls'

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Search GitHub repo'
    input.addEventListener('input', debounce(handleOnChange, 500))

    const ignoreInput = document.createElement('input')
    ignoreInput.type = 'text'
    ignoreInput.id = 'ignore-word'
    ignoreInput.placeholder = 'Ignore words (comma-separated)'
    ignoreInput.addEventListener('input', debounce(handleOnChange, 500))


    layoutSelect = document.createElement('select')
    layoutSelect.innerHTML = `
        <option value="card">Card View</option>
        <option value="table">Table View</option>
    `
    layoutSelect.addEventListener('change', handleOnChange)

    sortSelect = document.createElement('select')
    sortSelect.innerHTML = `
        <option value="asc">Sort: Ascending</option>
        <option value="desc">Sort: Descending</option>
    `
    sortSelect.addEventListener('change', handleOnChange)

    container = document.createElement('div')

    controls.appendChild(input)
    controls.appendChild(layoutSelect)
    controls.appendChild(sortSelect)
    controls.appendChild(ignoreInput)

    app.appendChild(controls)
    app.appendChild(container)

    const urlParams = new URLSearchParams(window.location.search)
    const prefill = urlParams.get('query')
    if (prefill) {
        input.value = prefill
        handleOnChange()
    }
}

init()
