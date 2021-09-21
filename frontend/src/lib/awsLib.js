import { Storage } from 'aws-amplify';

/*
- It takes a file object as a paramater
- Generates a unique file name using the current timestamp.
- Upload the file to the user's folder in S3 using the Storage.vault.put() object.
Alternatively, if we were uploading publicly you can use the Storage.put() method.
- Returns the stored object's key.
*/
export const s3Upload = async (file) => {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
};
