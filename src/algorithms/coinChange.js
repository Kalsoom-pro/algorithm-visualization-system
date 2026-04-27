export function coinChange(coins, amount) {
    const steps = [];
    const coinArray = [...coins];
    const targetAmount = amount;

    // Initialize DP array
    const dp = new Array(targetAmount + 1).fill(Infinity);
    dp[0] = 0;

    // Store which coin was used to achieve minimum
    const coinUsed = new Array(targetAmount + 1).fill(-1);

    steps.push({
        explanation: 'Initial',
        description: `Finding minimum coins for amount ${targetAmount} using coins [${coinArray.join(', ')}]`,
        amount: 0,
        coin: null,
        minCoins: 0,
        dpTable: [...dp],
        coinsUsed: []
    });

    for (let i = 1; i <= targetAmount; i++) {
        for (let coin of coinArray) {
            if (i - coin >= 0 && dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
                coinUsed[i] = coin;

                steps.push({
                    explanation: 'Try Coin',
                    description: `Amount ${i}: trying coin ${coin} → minimum ${dp[i]} coins so far`,
                    amount: i,
                    coin: coin,
                    minCoins: dp[i],
                    dpTable: [...dp],
                    coinsUsed: []
                });
            }
        }
    }

    // Reconstruct coins used
    const usedCoins = [];
    let remaining = targetAmount;
    while (remaining > 0 && coinUsed[remaining] !== -1) {
        usedCoins.unshift(coinUsed[remaining]);
        remaining -= coinUsed[remaining];
    }

    const finalMinCoins = dp[targetAmount] === Infinity ? -1 : dp[targetAmount];

    steps.push({
        explanation: 'Complete',
        description: finalMinCoins === -1 ?
            `Cannot make amount ${targetAmount} with given coins` : `Minimum coins needed: ${finalMinCoins}. Coins used: ${usedCoins.join(' + ')} = ${targetAmount}`,
        amount: targetAmount,
        coin: null,
        minCoins: finalMinCoins,
        dpTable: [...dp],
        coinsUsed: usedCoins
    });

    return steps;
}