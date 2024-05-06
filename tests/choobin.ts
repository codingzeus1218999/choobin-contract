import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Choobin } from "../target/types/choobin";

import {
  PublicKey,
  Connection,
  SYSVAR_RENT_PUBKEY,
  Keypair,
  Secp256k1Program,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
  Message,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY
} from "@solana/web3.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";


async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  ))[0];
};

describe("choobin", async() => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Choobin as Program<Choobin>;

  const mint_pubkey = new PublicKey("3fMqXxHJ1dUGxxpKmpZRbDJ5fyx6dUcgrwureSuQJjd1");
  console.log("bridge token: ", mint_pubkey.toBase58())

  const treasury_pubkey = new PublicKey("....");
  console.log("treasury_pubkey: ", treasury_pubkey.toBase58())

  const PRESALE_INFO_SEED = "presale_info";
  const presale_info = await PublicKey.findProgramAddress(
    [
      Buffer.from(PRESALE_INFO_SEED),
    ],
    program.programId
  );
  console.log("presale_info : ", presale_info[0].toBase58());

  it("Is initialized!", async () => {
    const tx = await program.methods
    .initialize()
    .accounts({
      presaleInfo: presale_info[0],
      initializer: adminKeypair.publicKey,
      mint: mint_pubkey,
      treasury: treasury_pubkey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([adminKeypair])
    .rpc();
    console.log("Your transaction signature", tx);
  });

});
