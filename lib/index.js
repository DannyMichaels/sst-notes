import StorageStack from './StorageStack';
import ApiStack from './ApiStack';
import AuthStack from './AuthStack';
import FrontendStack from './FrontendStack';

export default function main(app) {
  // new StorageStack(app, 'storage');
  const storageStack = new StorageStack(app, 'storage');

  const apiStack = new ApiStack(app, 'api', {
    // using the public reference of the table from the StorageStack and passing it in to our ApiStack
    table: storageStack.table,
  });

  const authStack = new AuthStack(app, 'auth', {
    api: apiStack.api,
    bucket: storageStack.bucket,
  });

  new FrontendStack(app, 'frontend', {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: storageStack.bucket,
  });
}
