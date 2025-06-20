-- Fix Payment Transactions Table - Run this in Supabase SQL Editor
-- This script adds missing columns to the payment_transactions table

-- Add missing columns to payment_transactions table
DO $$
BEGIN
    -- Add credits column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'credits'
    ) THEN
        ALTER TABLE payment_transactions ADD COLUMN credits INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added credits column to payment_transactions';
    ELSE
        RAISE NOTICE 'Credits column already exists in payment_transactions';
    END IF;

    -- Add package_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'package_name'
    ) THEN
        ALTER TABLE payment_transactions ADD COLUMN package_name TEXT;
        RAISE NOTICE 'Added package_name column to payment_transactions';
    ELSE
        RAISE NOTICE 'Package_name column already exists in payment_transactions';
    END IF;

    -- Add status column if it doesn't exist (alternative to payment_status)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE payment_transactions ADD COLUMN status TEXT CHECK (status IN ('pending', 'pending_review', 'completed', 'failed', 'cancelled', 'refunded')) DEFAULT 'pending';
        RAISE NOTICE 'Added status column to payment_transactions';
    ELSE
        RAISE NOTICE 'Status column already exists in payment_transactions';
    END IF;

    -- Add reference_number column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'reference_number'
    ) THEN
        ALTER TABLE payment_transactions ADD COLUMN reference_number TEXT;
        RAISE NOTICE 'Added reference_number column to payment_transactions';
    ELSE
        RAISE NOTICE 'Reference_number column already exists in payment_transactions';
    END IF;

    -- Add receipt_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'receipt_url'
    ) THEN
        ALTER TABLE payment_transactions ADD COLUMN receipt_url TEXT;
        RAISE NOTICE 'Added receipt_url column to payment_transactions';
    ELSE
        RAISE NOTICE 'Receipt_url column already exists in payment_transactions';
    END IF;

    -- Add payer_email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'payer_email'
    ) THEN
        ALTER TABLE payment_transactions ADD COLUMN payer_email TEXT;
        RAISE NOTICE 'Added payer_email column to payment_transactions';
    ELSE
        RAISE NOTICE 'Payer_email column already exists in payment_transactions';
    END IF;

    -- Add transaction_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'transaction_id'
    ) THEN
        ALTER TABLE payment_transactions ADD COLUMN transaction_id TEXT;
        RAISE NOTICE 'Added transaction_id column to payment_transactions';
    ELSE
        RAISE NOTICE 'Transaction_id column already exists in payment_transactions';
    END IF;

    RAISE NOTICE 'Payment transactions table update completed successfully!';
END $$;
