import request, {
  busyRequest
} from '@/utils/request'

const busyReq = busyRequest()

export function test(data) {
  return request('/test', {
    params: data
  })
}

export function busytest(data) {
  return busyReq('/test', {
    method: 'POST',
    headers: {},
    data,
  })
}
