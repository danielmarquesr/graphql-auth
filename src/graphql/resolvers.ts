import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';

const mutationFiles = loadFilesSync(
  path.join(__dirname, 'modules', '**', 'mutation.ts')
);
const queryFiles = loadFilesSync(
  path.join(__dirname, 'modules', '**', 'query.ts')
);
const resolvers = mergeResolvers([...mutationFiles, ...queryFiles]);

export default resolvers;
