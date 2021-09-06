import validateWalletAddress from '../../helpers/validateWalletAddress';

describe('Validate coin address', () => {
  it('validates valid BTC address', () => {
    expect(validateWalletAddress('1C394PrnPG1bw3r7ERJS1pbauRbtf1Kxcx', 'BTC')).toEqual(true);
  });

  it('invalidates invalid BTC address', () => {
    expect(validateWalletAddress('random address', 'BTC')).toEqual(false);
  });

  it('validates valid LTC address', () => {
    expect(validateWalletAddress('LKJNbqWg49qQJtPuBDJLEUz4f4Jm4fttZ4', 'LTC')).toEqual(true);
  });

  it('invalidates invalid LTC address', () => {
    expect(validateWalletAddress('random address', 'LTC')).toEqual(false);
  });

  it('validates valid ETH and ERC20 tokens addresses', () => {
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'ETH')).toEqual(true);
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'EOS')).toEqual(true);
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'BDG')).toEqual(true);
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'GNT')).toEqual(true);
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'OMG')).toEqual(true);
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'QTM')).toEqual(true);
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'BAT')).toEqual(true);
    expect(validateWalletAddress('0x5B93162D7A375323964Acdca69705981a7643cBE', 'REP')).toEqual(true);
  });

  it('invalidates invalid ETH and ERC20 tokens address', () => {
    expect(validateWalletAddress('random address', 'ETH')).toEqual(false);
    expect(validateWalletAddress('random address', 'EOS')).toEqual(false);
    expect(validateWalletAddress('random address', 'BDG')).toEqual(false);
    expect(validateWalletAddress('random address', 'GNT')).toEqual(false);
    expect(validateWalletAddress('random address', 'OMG')).toEqual(false);
    expect(validateWalletAddress('random address', 'QTM')).toEqual(false);
    expect(validateWalletAddress('random address', 'BAT')).toEqual(false);
    expect(validateWalletAddress('random address', 'REP')).toEqual(false);
  });

  it('validates valid DOGE address', () => {
    expect(validateWalletAddress('D9Sm7iavFzbCbRKRVBVDHrqgA9XHjcNvBE', 'DOGE')).toEqual(true);
  });

  it('invalidates invalid DOGE address', () => {
    expect(validateWalletAddress('random address', 'DOGE')).toEqual(false);
  });

  it('validates valid XVG address', () => {
    expect(validateWalletAddress('DLCw22a8B8Roetqp2t2q7zop8SYZp9wY5E', 'XVG')).toEqual(true);
  });

  it('invalidates invalid XVG address', () => {
    expect(validateWalletAddress('random address', 'XVG')).toEqual(false);
  });

  it('validates valid BCH address', () => {
    expect(validateWalletAddress('1C394PrnPG1bw3r7ERJS1pbauRbtf1Kxcx', 'BCH')).toEqual(true);
  });

  it('invalidates invalid BCH address', () => {
    expect(validateWalletAddress('random address', 'BCH')).toEqual(false);
  });

  it('validates valid NANO address', () => {
    expect(validateWalletAddress('xrb_1nanode8ngaakzbck8smq6ru9bethqwyehomf79sae1k7xd47dkidjqzffeg', 'NANO')).toEqual(true);
  });

  it('invalidates invalid NANO address', () => {
    expect(validateWalletAddress('random address', 'NANO')).toEqual(false);
  });

  it('validates valid ZEC address', () => {
    expect(validateWalletAddress('t1TQr7VnRK524FmUNtjcpFLpGzsmyrRXcJm', 'ZEC')).toEqual(true);
  });

  it('invalidates invalid ZEC address', () => {
    expect(validateWalletAddress('random address', 'ZEC')).toEqual(false);
  });

  it('validates valid USDT address', () => {
    expect(validateWalletAddress('1C394PrnPG1bw3r7ERJS1pbauRbtf1Kxcx', 'USDT')).toEqual(true);
  });

  it('invalidates invalid USDT address', () => {
    expect(validateWalletAddress('random address', 'USDT')).toEqual(false);
  });
});
