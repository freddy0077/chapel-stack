import { gql } from "@apollo/client";

export const CREATE_CONTRIBUTION = gql`
  mutation CreateContribution($input: CreateContributionInput!) {
    createContribution(input: $input) {
      id
      amount
      date
      notes
      receiptNumber
      isAnonymous
      contributionTypeId
      fundId
      paymentMethodId
      memberId
      donorName
      donorEmail
      donorPhone
      donorAddress
      batchId
      pledgeId
      transactionId
      transactionStatus
      paymentGateway
      branchId
      createdAt
      updatedAt
      fund {
        id
        name
        description
        isActive
        branchId
        createdAt
        updatedAt
      }
      contributionType {
        id
        name
        description
        isActive
        branchId
        createdAt
        updatedAt
      }
      paymentMethod {
        id
        name
        description
        isActive
        branchId
        createdAt
        updatedAt
      }
      member {
        id
        firstName
        middleName
        lastName
        email
        phoneNumber
        address
        city
        state
        postalCode
        country
        dateOfBirth
        gender
        maritalStatus
        occupation
        employerName
        status
        membershipDate
        baptismDate
        confirmationDate
        statusChangeDate
        statusChangeReason
        profileImageUrl
        customFields
        privacySettings
        notes
        branchId
        spouseId
        memberId
        createdAt
        updatedAt
      }
    }
  }
`;
