import { Md5 } from 'md5-typescript';

export const encrypt = async (data: string) => {
  return await Md5.init(data);
};
