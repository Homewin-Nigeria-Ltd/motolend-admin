import { smsEndpoints } from "@/features/sms/api/endpoints"
import type {
  ApiRecoverySmsSendResponse,
  SendRecoverySmsInput,
} from "@/features/sms/types"
import { api } from "@/lib/api/client"

function buildSendFormData(input: SendRecoverySmsInput) {
  const formData = new FormData()
  formData.append("message", input.message)
  if (input.csvFile) {
    formData.append("csv_file", input.csvFile)
  }
  return formData
}

export const smsMutations = {
  send: {
    mutationFn: (input: SendRecoverySmsInput) =>
      api.post<ApiRecoverySmsSendResponse, FormData>(
        smsEndpoints.send(input.stage),
        buildSendFormData(input),
      ),
  },
}
