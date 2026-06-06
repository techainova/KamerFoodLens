const MAX_AGE_MS = 30_000; // 30 secondes

export function generateRID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function addTimestamp<T extends object>(
  payload: T,
): T & { ts: number; rid: string } {
  return {
    ...payload,
    ts:  Date.now(),
    rid: generateRID(),
  };
}

export function verifyTimestamp(ts: number): boolean {
  return Math.abs(Date.now() - ts) < MAX_AGE_MS;
}










// // src/crypto/anti-replay.ts
// // Protection anti-rejeu : timestamp + Request ID unique

// import 'react-native-get-random-values';

// const MAX_AGE_MS = 30_000; // 30 secondes

// export function generateRID(): string {
//   // UUID v4 simple
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === 'x' ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// export function addTimestamp<T extends object>(
//   payload: T,
// ): T & { ts: number; rid: string } {
//   return {
//     ...payload,
//     ts:  Date.now(),
//     rid: generateRID(),
//   };
// }

// export function verifyTimestamp(ts: number): boolean {
//   const age = Math.abs(Date.now() - ts);
//   return age < MAX_AGE_MS;
// }