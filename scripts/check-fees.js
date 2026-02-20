/**
 * check claimable fees from clanker fee locker
 */
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

const FEE_LOCKER = '0xF3622742b1E446D92e45E22923Ef11C2fcD55D68';
const WETH = '0x4200000000000000000000000000000000000006';
const MYCEL = '0x94222fbc9ff779f7b02E77B60411BBAC6420f1B3';
const FEE_OWNER = '0x9FffCdb0bB65Ac66D20179A4874fD965F1b1b2be';

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC || 'https://mainnet.base.org'),
});

const feeLockerAbi = parseAbi([
  'function availableFees(address feeOwner, address token) view returns (uint256)',
  'function claim(address feeOwner, address token) external',
]);

async function checkFees() {
  console.log('checking claimable fees...');
  console.log('fee owner:', FEE_OWNER);
  console.log('');

  try {
    // check WETH fees
    const wethFees = await client.readContract({
      address: FEE_LOCKER,
      abi: feeLockerAbi,
      functionName: 'availableFees',
      args: [FEE_OWNER, WETH],
    });
    console.log('WETH claimable:', wethFees.toString(), '=', Number(wethFees) / 1e18, 'WETH');
  } catch (e) {
    console.log('WETH check failed:', e.message);
  }

  try {
    // check DAIMON fees
    const daimon = '0x28d2f4e91b521c22255747eb7d0d04f2ab06373d';
    const daimonFees = await client.readContract({
      address: FEE_LOCKER,
      abi: feeLockerAbi,
      functionName: 'availableFees',
      args: [FEE_OWNER, daimon],
    });
    console.log('DAIMON claimable:', daimonFees.toString(), '=', Number(daimonFees) / 1e18, 'DAIMON');
  } catch (e) {
    console.log('DAIMON check failed:', e.message);
  }

  try {
    // check MYCEL fees (should be 0 since i'm the creator)
    const mycelFees = await client.readContract({
      address: FEE_LOCKER,
      abi: feeLockerAbi,
      functionName: 'availableFees',
      args: [FEE_OWNER, MYCEL],
    });
    console.log('MYCEL claimable:', mycelFees.toString(), '=', Number(mycelFees) / 1e18, 'MYCEL');
  } catch (e) {
    console.log('MYCEL check failed:', e.message);
  }
}

checkFees();
