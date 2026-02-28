const DEVICE_KEY = 'inyouth-device-id'
const PRAYED_KEY = 'inyouth-prayed'

export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

export function hasPrayed(prayerId) {
  const list = JSON.parse(localStorage.getItem(PRAYED_KEY) || '[]')
  return list.includes(prayerId)
}

export function markPrayed(prayerId) {
  const list = JSON.parse(localStorage.getItem(PRAYED_KEY) || '[]')
  if (!list.includes(prayerId)) {
    list.push(prayerId)
    localStorage.setItem(PRAYED_KEY, JSON.stringify(list))
  }
}
