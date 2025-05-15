import { mockRepos } from "./mock"

const pipe = Pear.worker.pipe()


pipe.on('data', async data => {
  const message = JSON.parse(Buffer.from(data).toString('utf-8'))

  console.log('[Request Log]:', message)

  try {
    const searchTerm = message.query.toLowerCase()
    const ignoreTerm = message.ignore?.toLowerCase() || ''
    const sort = message.sort || 'asc'

    let results = mockRepos.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm) 
    )

    if (ignoreTerm.trim()) {
      const ignoreWords = ignoreTerm.split(',').map(word => word.trim())
      results = results.filter(repo =>
        !ignoreWords.some(ignoreWord => repo.name.toLowerCase().includes(ignoreWord))
      )
    }

    results.sort((a, b) => {
      if (sort === 'desc') return b.name.localeCompare(a.name)
      return a.name.localeCompare(b.name)
    })

    pipe.write(JSON.stringify(results))
  } catch (error) {
    pipe.write(JSON.stringify({ error: error.message }))
  }
})
