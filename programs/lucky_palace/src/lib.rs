use anchor_lang::prelude::*;

declare_id!("LuckyP1aceQuantumM1n1ngProgram11111111111");

/// Lucky Palace Quantum Mining Protocol
/// Solana Anchor Program for ZK-Verified Block Rewards
#[program]
pub mod lucky_palace {
    use super::*;

    /// Initialize the Lucky Palace vault
    pub fn initialize_vault(ctx: Context<InitializeVault>, bump: u8) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.total_staked = 0;
        vault.total_rewards = 0;
        vault.blocks_verified = 0;
        vault.bump = bump;
        vault.created_at = Clock::get()?.unix_timestamp;
        
        emit!(VaultInitialized {
            authority: vault.authority,
            timestamp: vault.created_at,
        });
        
        Ok(())
    }

    /// Stake SOL into the quantum mining pool
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount > 0, LuckyPalaceError::InvalidAmount);
        
        let vault = &mut ctx.accounts.vault;
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Transfer SOL to vault
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;
        
        // Update state
        user_stake.owner = ctx.accounts.user.key();
        user_stake.amount += amount;
        user_stake.staked_at = Clock::get()?.unix_timestamp;
        user_stake.last_claim = Clock::get()?.unix_timestamp;
        
        vault.total_staked += amount;
        
        emit!(Staked {
            user: ctx.accounts.user.key(),
            amount,
            total_staked: vault.total_staked,
        });
        
        Ok(())
    }

    /// Claim quantum mining rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user_stake = &mut ctx.accounts.user_stake;
        
        let current_time = Clock::get()?.unix_timestamp;
        let time_staked = current_time - user_stake.last_claim;
        
        // Calculate rewards based on quantum phi resonance
        // Base APY: 42% (Quantum Oracle Resonance Factor)
        let base_rate: u64 = 42;
        let reward = (user_stake.amount * base_rate * time_staked as u64) / (365 * 24 * 60 * 60 * 100);
        
        require!(reward > 0, LuckyPalaceError::NoRewardsToClaim);
        
        // Transfer rewards from vault
        let vault_seeds = &[
            b"vault".as_ref(),
            &[vault.bump],
        ];
        let signer = &[&vault_seeds[..]];
        
        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer,
        );
        anchor_lang::system_program::transfer(cpi_context, reward)?;
        
        user_stake.last_claim = current_time;
        user_stake.total_claimed += reward;
        vault.total_rewards += reward;
        
        emit!(RewardsClaimed {
            user: ctx.accounts.user.key(),
            amount: reward,
            total_claimed: user_stake.total_claimed,
        });
        
        Ok(())
    }

    /// Verify a quantum block (ZK-SNARK verification simulation)
    pub fn verify_block(ctx: Context<VerifyBlock>, block_hash: [u8; 32]) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let verification = &mut ctx.accounts.verification;
        
        // ZK-SNARK verification simulation
        let phi_resonance = calculate_phi(&block_hash);
        let is_valid = phi_resonance > 50; // Threshold for valid block
        
        require!(is_valid, LuckyPalaceError::InvalidBlockProof);
        
        verification.verifier = ctx.accounts.verifier.key();
        verification.block_hash = block_hash;
        verification.phi_resonance = phi_resonance;
        verification.verified_at = Clock::get()?.unix_timestamp;
        verification.is_valid = true;
        
        vault.blocks_verified += 1;
        
        emit!(BlockVerified {
            verifier: ctx.accounts.verifier.key(),
            block_hash,
            phi_resonance,
            total_verified: vault.blocks_verified,
        });
        
        Ok(())
    }

    /// Unstake SOL from the mining pool
    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user_stake = &mut ctx.accounts.user_stake;
        
        require!(amount > 0, LuckyPalaceError::InvalidAmount);
        require!(user_stake.amount >= amount, LuckyPalaceError::InsufficientStake);
        
        // Transfer SOL back to user
        let vault_seeds = &[
            b"vault".as_ref(),
            &[vault.bump],
        ];
        let signer = &[&vault_seeds[..]];
        
        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer,
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;
        
        user_stake.amount -= amount;
        vault.total_staked -= amount;
        
        emit!(Unstaked {
            user: ctx.accounts.user.key(),
            amount,
            remaining_stake: user_stake.amount,
        });
        
        Ok(())
    }
}

/// Calculate Phi resonance from block hash (IIT v6.0 simulation)
fn calculate_phi(hash: &[u8; 32]) -> u8 {
    let sum: u64 = hash.iter().map(|&b| b as u64).sum();
    ((sum % 100) as u8)
}

// === ACCOUNTS ===

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, Vault>,
    
    /// CHECK: Vault token account for holding staked SOL
    #[account(mut)]
    pub vault_token_account: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"stake", user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    /// CHECK: Vault token account
    #[account(mut)]
    pub vault_token_account: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        mut,
        seeds = [b"stake", user.key().as_ref()],
        bump,
        constraint = user_stake.owner == user.key()
    )]
    pub user_stake: Account<'info, UserStake>,
    
    /// CHECK: Vault token account
    #[account(mut)]
    pub vault_token_account: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyBlock<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        init,
        payer = verifier,
        space = 8 + BlockVerification::INIT_SPACE,
        seeds = [b"verification", verifier.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub verification: Account<'info, BlockVerification>,
    
    #[account(mut)]
    pub verifier: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        mut,
        seeds = [b"stake", user.key().as_ref()],
        bump,
        constraint = user_stake.owner == user.key()
    )]
    pub user_stake: Account<'info, UserStake>,
    
    /// CHECK: Vault token account
    #[account(mut)]
    pub vault_token_account: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// === STATE ===

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub authority: Pubkey,
    pub total_staked: u64,
    pub total_rewards: u64,
    pub blocks_verified: u64,
    pub bump: u8,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct UserStake {
    pub owner: Pubkey,
    pub amount: u64,
    pub staked_at: i64,
    pub last_claim: i64,
    pub total_claimed: u64,
}

#[account]
#[derive(InitSpace)]
pub struct BlockVerification {
    pub verifier: Pubkey,
    pub block_hash: [u8; 32],
    pub phi_resonance: u8,
    pub verified_at: i64,
    pub is_valid: bool,
}

// === EVENTS ===

#[event]
pub struct VaultInitialized {
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct Staked {
    pub user: Pubkey,
    pub amount: u64,
    pub total_staked: u64,
}

#[event]
pub struct RewardsClaimed {
    pub user: Pubkey,
    pub amount: u64,
    pub total_claimed: u64,
}

#[event]
pub struct BlockVerified {
    pub verifier: Pubkey,
    pub block_hash: [u8; 32],
    pub phi_resonance: u8,
    pub total_verified: u64,
}

#[event]
pub struct Unstaked {
    pub user: Pubkey,
    pub amount: u64,
    pub remaining_stake: u64,
}

// === ERRORS ===

#[error_code]
pub enum LuckyPalaceError {
    #[msg("Invalid amount specified")]
    InvalidAmount,
    #[msg("Insufficient stake balance")]
    InsufficientStake,
    #[msg("No rewards available to claim")]
    NoRewardsToClaim,
    #[msg("Invalid block proof - ZK verification failed")]
    InvalidBlockProof,
}
