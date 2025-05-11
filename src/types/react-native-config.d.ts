declare module 'react-native-config' {
  export interface NativeConfig {
    HOSTNAME?: string;
    LINK: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
