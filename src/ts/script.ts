import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    enable(chainIds: string | string[]): Promise<void>

    getKey(chainId: string): Promise<{
        // Name of the selected key store.
        name: string;
        algo: string;
        pubKey: Uint8Array;
        address: Uint8Array;
        bech32Address: string;
    }>


    signArbitrary(
        chainId: string,
        signer: string,
        data: string | Uint8Array
    ): Promise<StdSignature>;
    verifyArbitrary(
        chainId: string,
        signer: string,
        data: string | Uint8Array,
        signature: StdSignature
    ): Promise<boolean>;
        
    
  }

  
}

