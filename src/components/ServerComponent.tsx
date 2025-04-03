import { toPlainObject } from '../utils/serialization';
import { DataType } from '../types/data';

async function ServerComponent() {
  // Assuming you have some data from a class instance
  const data = await fetchData();
  
  // Transform to plain object before passing to client component
  const plainData = toPlainObject<DataType>(data);
  
  return <ClientComponent data={plainData} />;
}
