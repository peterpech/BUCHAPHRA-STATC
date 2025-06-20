export async function fetcher(path: string) {
  const res = await fetch(path)
  if (!res.ok) throw new Error('API Error')
  return res.json()
}
