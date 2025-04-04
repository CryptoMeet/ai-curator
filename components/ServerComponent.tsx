import { ClientComponent } from './ClientComponent'
import { toPlainObject } from '../src/utils/serialization'

interface DataType {
  // Add your data structure here
  [key: string]: any;
}

async function getData(): Promise<DataType> {
  // Implement your data fetching logic here
  return { /* your data */ };
}

export default async function ServerComponent() {
  const data = await getData()
  const plainData = toPlainObject<Record<string, any>>(data)
  
  return <ClientComponent data={plainData} />
}
