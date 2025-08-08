<?php
header('Content-Type: application/json');
session_start();

// Minimum bet amount in USDT
define('MIN_BET', 20);

// Fake user balance stored in session (in real case, use DB)
if (!isset($_SESSION['balance'])) {
    $_SESSION['balance'] = 1000; // Initial balance: 1000 USDT
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

// Helper function to send response
function sendResponse($status, $data = []) {
    echo json_encode(array_merge(['status' => $status], $data));
    exit;
}

// Place a bet
if ($action === 'bet') {
    $amount = floatval($input['amount'] ?? 0);

    if ($amount < MIN_BET) {
        sendResponse('error', ['message' => 'Minimum bet is 20 USDT']);
    }
    if ($amount > $_SESSION['balance']) {
        sendResponse('error', ['message' => 'Insufficient balance']);
    }

    // Deduct bet amount from balance
    $_SESSION['balance'] -= $amount;

    // Almost win: 0.5% chance to win (RTP ~0)
    $randomChance = mt_rand(9500, 9900) / 10000;
    $win = false;
    $winAmount = 0;

    if ($randomChance > 0.995) { // 0.5% chance to win
        $win = true;
        $winAmount = $amount * 2; // Win 2x bet amount
        $_SESSION['balance'] += $winAmount;
    }

    sendResponse('ok', [
        'win' => $win,
        'win_amount' => $winAmount,
        'balance' => $_SESSION['balance'],
        'message' => $win ? 'You won!' : 'Almost won, try again!'
    ]);
}

// Get current balance
if ($action === 'balance') {
    sendResponse('ok', ['balance' => $_SESSION['balance']]);
}

// Default invalid action response
sendResponse('error', ['message' => 'Invalid action']);
?>
