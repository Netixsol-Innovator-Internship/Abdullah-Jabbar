# Troubleshooting: Tasks Not Showing

## Current Issue
- `taskCounts[address]` returns **4** ✅
- `getAllTasks()` returns **empty array** ❌
- `getTasksByStatus()` returns **empty arrays** ❌
- `getTaskStats()` returns **all zeros** ❌

## Root Cause Analysis

### Most Likely Cause: Account Mismatch
The tasks were created with a **different wallet address** than the one currently connected.

In your contract, all view functions use `msg.sender`:
```solidity
function getAllTasks() external view returns (Task[] memory) {
    return userTasks[msg.sender];  // <- Uses the calling address
}
```

### How to Verify

1. **Check which address created the tasks in Remix**:
   - Go to Remix
   - Look at the "Account" dropdown in the Deploy & Run tab
   - Note the address that was used to call `createTask`

2. **Check which address is connected in MetaMask**:
   - Currently showing: `0x81310c1558073EFBC183770EB6cA8353842F12Be`

3. **These MUST be the same address!**

## Solutions

### Option 1: Use the Same Address (Recommended)
1. In MetaMask, switch to the same account you used in Remix
2. Refresh the frontend
3. Tasks should now appear

### Option 2: Recreate Tasks with Current Address
1. In Remix, switch to the account: `0x81310c1558073EFBC183770EB6cA8353842F12Be`
2. Call `clearAllTasks()` if needed
3. Create new tasks with `createTask()`
4. Refresh the frontend

### Option 3: Modify Contract to Accept Address Parameter
Add new view functions that accept an address parameter:

```solidity
function getAllTasksFor(address _user) external view returns (Task[] memory) {
    return userTasks[_user];
}

function getTaskStatsFor(address _user) external view returns (
    uint256 total,
    uint256 completed,
    uint256 pending
) {
    Task[] storage tasks = userTasks[_user];
    total = tasks.length;
    
    for (uint256 i = 0; i < tasks.length; i++) {
        if (tasks[i].isCompleted) {
            completed++;
        } else {
            pending++;
        }
    }
}
```

Then update the frontend to call these functions with the address parameter.

## Verification Steps

After refreshing with the fix:

1. Check console logs:
```
=== ACCOUNT DEBUG ===
Account used for calls: 0x81310c1558073EFBC183770EB6cA8353842F12Be
```

2. Check that tasks appear:
```
All Tasks Data: [Array with 4 tasks]
Stats Data: [4n, 2n, 2n]  // Example: 4 total, 2 completed, 2 pending
```

3. Verify in UI:
   - Tasks should be visible
   - Stats should show correct numbers
   - You can toggle/delete tasks

## Code Changes Made

### Frontend (`TodoApp.tsx`)
Added `account` parameter to all `useReadContract` calls:

```typescript
const { data: allTasksData } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: TODO_LIST_ABI,
  functionName: "getAllTasks",
  account: connectedAddress,  // ← Now explicitly passes the connected wallet
  query: {
    enabled: !!CONTRACT_ADDRESS && isConnected && !!connectedAddress,
  },
});
```

This ensures wagmi uses the correct account for all view function calls.

## Expected Behavior

### Before Fix
- Wagmi might use a default/zero address for view calls
- Contract returns empty data for unmapped addresses
- Tasks exist for one address but are being queried from another

### After Fix
- Wagmi explicitly uses the connected wallet address
- Contract returns data for the correct address
- Tasks should appear if the connected address matches the creator

## Still Not Working?

If tasks still don't appear after:
1. ✅ Adding `account` parameter
2. ✅ Verifying the address matches
3. ✅ Refreshing the browser

Then try:
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**
3. **Check Remix** - Call `getAllTasks()` directly in Remix with the same account
4. **Verify chain** - Ensure you're on the same network (Kasplex Testnet, Chain ID: 167012)
5. **Re-deploy** - Deploy a fresh contract and create tasks from the frontend
