import { useContext, useMemo } from "react"
import { Web3Context } from "../../context/web3-context"
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import allowlist from "../../assets/whitelist.json";

const useAllowlist = () => {
  const { account } = useContext(Web3Context)
  if (!account) return {isAllowlist: false, proof: []}

  const lowercaseAllowlist = allowlist.map((address) => address.toLowerCase())
  const leafNodes = allowlist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const accountSafe = account.toLocaleLowerCase()
  const isAllowlist = lowercaseAllowlist.includes(accountSafe)
  const leaf = keccak256(accountSafe);
  const proof = merkleTree.getProof(leaf).map(p => `0x${p.data.toString("hex")}`);
  return {isAllowlist, proof}
}

export default useAllowlist
