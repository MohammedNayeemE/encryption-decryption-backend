
function encodebase64(message:string):string{
  let encoded = btoa(message);
  return encoded;
}
function decodebase64(message :string):string{
    let decode = atob(message);
    return decode;
}
export {encodebase64 , decodebase64};
