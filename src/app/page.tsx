'use client'
import { useState } from 'react'
import Swal from 'sweetalert2'

export default function Home() {
  const [concurrency, setConcurrency] = useState(10)
  const [results, setResults] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const handleStart = async () => {
    if (concurrency > 0 && concurrency <= 100) {
      setIsLoading(true)
      setResults([])
      const totalRequests = 1000
      let completedRequests = 0

      const sendRequest = async (index: any) => {
        try {
          const response = await fetch(`/api?index=${index}`)
          const data = await response.json()
          setResults((prev: any) => [...prev, data.index])
        } catch (error) {
          console.error('Error:', error)
        }
      }

      const sendBatchRequests = async () => {
        const promises = []
        for (let i = 0; i < concurrency && completedRequests < totalRequests; i++) {
          completedRequests++
          promises.push(sendRequest(completedRequests))
        }
        await Promise.all(promises)
      }

      const interval = setInterval(async () => {
        if (completedRequests >= totalRequests) {
          clearInterval(interval)
          setIsLoading(false)
        } else {
          await sendBatchRequests()
        }
      }, 1000)

      await sendBatchRequests()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'The value must be from 0 to 100',
      })
    }
  }

  return (
    <div className='bg-blue-500 min-h-screen pt-10'>
      <h1 className='text-2xl text-center'>Concurrent Requests Demo</h1>
      <div className='flex justify-center px-2 my-2'>
        <div className='flex flex-col max-w-[20rem] w-full gap-2'>
          <input
            className='text-black'
            type='number'
            min='1'
            max='100'
            value={concurrency}
            onChange={(e) => setConcurrency(parseInt(e.target.value))}
            required
            disabled={isLoading}
          />
          <button onClick={handleStart} disabled={isLoading}>
            {isLoading ? 'Running...' : 'Start'}
          </button>
          <div className='flex justify-between'>
            <label>
              <input
                type='radio'
                value='grid'
                checked={viewMode === 'grid'}
                onChange={() => setViewMode('grid')}
              />
              Grid View
            </label>
            <label>
              <input
                type='radio'
                value='list'
                checked={viewMode === 'list'}
                onChange={() => setViewMode('list')}
              />
              List View
            </label>
          </div>
        </div>
      </div>

      <div
        className={`grid ${
          viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'
        }  gap-4 px-4`}
      >
        {results.map((result: any, index: any) => (
          <div key={index}>Response Index: {result}</div>
        ))}
      </div>
    </div>
  )
}
