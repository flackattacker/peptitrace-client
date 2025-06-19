declare module 'json-bigint' {
  const JSONbig: {
    parse: (text: string) => any;
    stringify: (value: any) => string;
  };
  export default JSONbig;
} 