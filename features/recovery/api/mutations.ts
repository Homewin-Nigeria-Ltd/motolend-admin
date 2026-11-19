import { recoveryEndpoints } from "@/features/recovery/api/endpoints"
import type {
  ApiSendRecoveryOtpResponse,
  SendRecoveryOtpInput,
  VerifyRecoveryOtpInput,
} from "@/features/recovery/types"
import { api } from "@/lib/api/client"

export const recoveryMutations = {
  sendOtp: {
    mutationFn: ({
      loanId,
      recovery_method,
      amount_recovered,
      payment_reference,
    }: SendRecoveryOtpInput) =>
      api.post<ApiSendRecoveryOtpResponse>(recoveryEndpoints.sendOtp(loanId), {
        recovery_method,
        amount_recovered,
        payment_reference,
      }),
  },
  verify: {
    mutationFn: ({ loanId, otp }: VerifyRecoveryOtpInput) =>
      api.post(recoveryEndpoints.verify(loanId), { otp }),
  },
}
