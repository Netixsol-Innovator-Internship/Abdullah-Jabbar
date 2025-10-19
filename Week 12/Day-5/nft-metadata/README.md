# How to Upload NFT Metadata to IPFS (Pinata)

## Step 1: Create Pinata Account
1. Go to https://pinata.cloud
2. Sign up for a free account
3. Get your API keys from the dashboard

## Step 2: Upload Images
1. Create 10-20 unique NFT images (PNG, JPG, or GIF)
2. Name them: 0.png, 1.png, 2.png, etc.
3. Upload all images to Pinata as a folder
4. Copy the IPFS CID (Content Identifier)

## Step 3: Update Metadata Files
1. Update the `image` field in each JSON file with your IPFS CID
2. Format: `ipfs://YOUR_CID/0.png`
3. Customize attributes for each NFT

## Step 4: Upload Metadata
1. Upload all JSON files to Pinata as a folder
2. Copy the metadata folder CID
3. Update this CID in your deployment script and NFT contract

## Example:
If your metadata CID is `QmXxYy123...`, your base URI would be:
`ipfs://QmXxYy123.../`

Then token 0 would resolve to:
`ipfs://QmXxYy123.../0.json`
