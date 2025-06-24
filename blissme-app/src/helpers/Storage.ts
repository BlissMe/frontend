// import { decrypt, encrypt } from "./encryptionHelper";

export function setLocalStorageData(key: string, data: any): void {
  // let encryptData = encrypt(data);
  localStorage.setItem(key, data);
}

export function getLocalStoragedata(key: string): string | null {
  const data = localStorage.getItem(key);
  return data !== null ? data : null;
}
