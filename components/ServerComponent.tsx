import { ClientComponent } from './ClientComponent'

// Mark as server component
export default async function ServerComponent() {
  // Convert complex data to plain object
  const data = await fetchData()

  // Debugging log to inspect the structure of data
  console.log('Fetched data:', data)

  const plainData = JSON.parse(JSON.stringify(data))

  return <ClientComponent data={plainData} />
}
