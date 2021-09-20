import StorageStack from './StorageStack';
import ApiStack from './ApiStack';
import AuthStack from './AuthStack';

export default function main(app) {
  // new StorageStack(app, 'storage');
  const storageStack = new StorageStack(app, 'storage');

  const apiStack = new ApiStack(app, 'api', {
    // using the public reference of the table from the StorageStack and passing it in to our ApiStack
    table: storageStack.table,
  });

  new AuthStack(app, 'auth', {
    api: apiStack.api,
    bucket: storageStack.bucket,
  });
}
