import { API_TYPE } from '../constants'
import { requestExtensionAPI } from './utils'
import { ISignMessageRequestPayload, ISignMessageResponsePayload } from '../types'

export const processingSignRequests: { [id: string]: IProcessingSignRequest } = {}

export function signMessage(message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString().slice(-8)
    processingSignRequests[id] = { resolve, reject }

    requestExtensionAPI<ISignMessageRequestPayload>({
      type: API_TYPE.SIGN_MESSAGE,
      payload: { message, id },
    })
  })
}

export function handleSignMessageResponse(response: ISignMessageResponsePayload) {
  const request = processingSignRequests[response.id]
  if (!request) {
    return
  }

  if (response.error != null) {
    request.reject(response.error)
    return
  }

  request.resolve(response.signature)
}

interface IProcessingSignRequest {
  resolve: (signature?: string) => void
  reject: (reason?: any) => void
}
