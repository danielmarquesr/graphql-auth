import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';

const typeDefsFiles = loadFilesSync(
  path.join(__dirname, 'modules', '**', '*.gql')
);
const typeDefs = mergeTypeDefs(typeDefsFiles);

export default typeDefs;
