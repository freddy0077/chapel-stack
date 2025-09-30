# Member Import Guide

## Overview
The Chapel Stack member import feature allows you to bulk import member data using CSV or Excel files. This guide provides instructions and examples for preparing your data.

## Sample Files
- **sample-member-import.csv** - A complete example with all supported fields
- Download the sample CSV directly from the import modal in the application

## Required Fields
The following fields are **required** for every member:
- `firstName` - Member's first name
- `lastName` - Member's last name

## Optional Fields
All other fields are optional but recommended for complete member profiles:

### Personal Information
- `middleName` - Middle name or initial
- `email` - Primary email address
- `phoneNumber` - Primary phone number
- `alternativeEmail` - Secondary email address
- `alternatePhone` - Secondary phone number
- `dateOfBirth` - Format: YYYY-MM-DD (e.g., 1990-01-15)
- `gender` - Values: MALE, FEMALE, NOT_SPECIFIED
- `maritalStatus` - Values: SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED
- `occupation` - Job title or profession
- `employerName` - Name of employer
- `education` - Education level or degree

### Address Information
- `address` - Street address
- `city` - City name
- `state` - State or province
- `postalCode` - ZIP or postal code
- `country` - Country name

### Church Information
- `membershipStatus` - Values: ACTIVE, INACTIVE, PENDING, VISITOR, DECEASED, TRANSFERRED
- `membershipType` - Values: REGULAR, ASSOCIATE, HONORARY
- `membershipDate` - Date joined church (YYYY-MM-DD)
- `baptismDate` - Date of baptism (YYYY-MM-DD)
- `baptismLocation` - Where baptism took place
- `confirmationDate` - Date of confirmation (YYYY-MM-DD)
- `salvationDate` - Date of salvation (YYYY-MM-DD)

### Family Information
- `fatherName` - Father's full name
- `motherName` - Mother's full name
- `fatherOccupation` - Father's occupation
- `motherOccupation` - Mother's occupation

### Emergency Contact
- `emergencyContactName` - Emergency contact's name
- `emergencyContactPhone` - Emergency contact's phone
- `emergencyContactRelation` - Relationship to member

### Additional
- `notes` - Any additional notes or comments

## Data Format Guidelines

### Dates
- Use YYYY-MM-DD format (e.g., 1990-01-15)
- Invalid dates will cause import errors

### Phone Numbers
- Include country code if international (e.g., +1234567890)
- Can include spaces, dashes, or parentheses (they will be cleaned)

### Email Addresses
- Must be valid email format
- Duplicates will be detected and handled based on import options

### Enum Values
Use exact values (case-sensitive):

**Gender:**
- MALE
- FEMALE
- NOT_SPECIFIED

**Marital Status:**
- SINGLE
- MARRIED
- DIVORCED
- WIDOWED
- SEPARATED

**Membership Status:**
- ACTIVE
- INACTIVE
- PENDING
- VISITOR
- DECEASED
- TRANSFERRED

**Membership Type:**
- REGULAR
- ASSOCIATE
- HONORARY

## Import Options

### Skip Duplicates
- Enabled: Duplicate members (same email or phone) will be skipped
- Disabled: Duplicate members will cause import errors

### Update Existing
- Enabled: Existing members will be updated with new data
- Disabled: Existing members will be skipped or cause errors

## Best Practices

1. **Start Small**: Test with a few records first
2. **Clean Data**: Remove empty rows and ensure consistent formatting
3. **Validate Dates**: Double-check all date formats
4. **Check Emails**: Ensure email addresses are valid
5. **Review Enums**: Use exact values for status fields
6. **Backup**: Keep a backup of your original data

## Common Issues

### Import Errors
- Missing required fields (firstName, lastName)
- Invalid date formats
- Invalid email addresses
- Incorrect enum values

### Duplicate Handling
- Members are considered duplicates if they have the same email OR phone number
- Choose appropriate import options based on your needs

## Example CSV Structure

```csv
firstName,lastName,email,phoneNumber,membershipStatus
John,Doe,john.doe@email.com,+1234567890,ACTIVE
Jane,Smith,jane.smith@email.com,+1234567891,VISITOR
```

## Support
If you encounter issues during import:
1. Check the error messages in the import results
2. Verify your data format against this guide
3. Try importing a smaller subset of data
4. Contact your system administrator for assistance

## File Size Limits
- Maximum file size: 10MB
- Recommended: Under 1000 members per import for optimal performance
- For larger imports, consider splitting into multiple files
