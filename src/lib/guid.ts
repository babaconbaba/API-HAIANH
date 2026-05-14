import { v4 as uuidv4 } from 'uuid';

/** Generate uppercase GUID matching MISA convention */
export function generateGUID(): string {
  return uuidv4().toUpperCase();
}
