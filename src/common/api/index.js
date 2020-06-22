import request, {
  busyRequest
} from '@/utils/request'

const busyReq = busyRequest()

export function test(data) { // get
  return request('/test', {
    params: data
  })
}

export function busytest(data) { // post
  return busyReq('/test', {
    method: 'POST',
    headers: {},
    data,
  })
}
