import { AsyncLocalStorage } from 'async_hooks'

interface RequestStore {
  kongRequestId: string
}

// kho lưu trữ vô hình có thể chứa thông tin của từng request tách bạch với các request khác
export const requestContext = new AsyncLocalStorage<RequestStore>()

export function getKongRequestId(): string {
  return requestContext.getStore()?.kongRequestId || 'no-request-id'
}
