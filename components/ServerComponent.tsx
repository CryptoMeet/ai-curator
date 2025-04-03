import { ClientComponent } from './ClientComponent'

// Mark as server component
export default async function ServerComponent() {
  // Convert complex data to plain object
  const data = await fetchData()
  const plainData = JSON.parse(JSON.stringify(data))

  return <ClientComponent data={plainData} />
}
