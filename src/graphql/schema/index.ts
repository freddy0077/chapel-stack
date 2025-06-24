import { join } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import fs from 'fs';

// Load all schema files
const typesArray = loadFilesSync(join(__dirname, './**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

// Export the merged schema as a string
export const schema = print(typeDefs);

// Write the complete schema to a single file for reference
fs.writeFileSync(join(__dirname, '../schema.graphql'), schema);

export default schema;
