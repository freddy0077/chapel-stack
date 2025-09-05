import { gql } from "@apollo/client";

export const VERIFY_PAYMENT_AND_CREATE_SUBSCRIPTION = gql`
  mutation VerifyPaymentAndCreateSubscription($input: VerifyPaymentInput!) {
    verifyPaymentAndCreateSubscription(input: $input) {
      id
      status
      currentPeriodStart
      currentPeriodEnd
      plan {
        id
        name
        amount
        currency
        interval
      }
      organisation {
        id
        name
        email
      }
    }
  }
`;
