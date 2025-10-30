#!/usr/bin/env node

/**
 * Simple script to update payment status for orders
 * Usage: node update-payment-status.js [orderNumber] [sessionId]
 */

const axios = require('axios');

const API_BASE = 'http://localhost:4000';

async function updatePaymentStatus(orderNumber, sessionId, paymentIntentId) {
  try {
    console.log('Updating payment status...');
    console.log('Order Number:', orderNumber || 'Not provided');
    console.log('Session ID:', sessionId || 'Not provided');
    console.log('Payment Intent ID:', paymentIntentId || 'Not provided');

    const response = await axios.post(
      `${API_BASE}/orders/update-payment-status`,
      {
        orderNumber,
        sessionId,
        paymentIntentId,
      },
    );

    console.log('\n✅ Success!');
    console.log('Response:', response.data);

    if (response.data.order) {
      console.log('\n📦 Order Details:');
      console.log(`Order Number: ${response.data.order.orderNumber}`);
      console.log(`Payment Status: ${response.data.order.paymentStatus}`);
      console.log(`Order ID: ${response.data.order._id}`);
    }
  } catch (error) {
    console.error('\n❌ Error updating payment status:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function findPendingOrders() {
  try {
    console.log('🔍 Looking for orders with pending payment status...\n');

    const { MongoClient } = require('mongodb');
    const uri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db();
    const orders = await db
      .collection('orders')
      .find({ paymentStatus: 'pending' })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    if (orders.length === 0) {
      console.log('No pending orders found.');
    } else {
      console.log(`Found ${orders.length} pending orders:`);
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order: ${order.orderNumber}`);
        console.log(`   ID: ${order._id}`);
        console.log(`   Session ID: ${order.paymentSessionId || 'Not set'}`);
        console.log(`   Total: $${order.total}`);
        console.log(`   Created: ${order.createdAt || order.placedAt}`);
        console.log('');
      });
    }

    await client.close();
  } catch (error) {
    console.error('Error finding pending orders:', error.message);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📋 Payment Status Updater\n');
    console.log('Usage:');
    console.log('  node update-payment-status.js [orderNumber]');
    console.log('  node update-payment-status.js --session [sessionId]');
    console.log(
      '  node update-payment-status.js --list     (show pending orders)',
    );
    console.log('\nExamples:');
    console.log('  node update-payment-status.js ORD-12345678-123');
    console.log('  node update-payment-status.js --session cs_test_1234567890');
    console.log('  node update-payment-status.js --list');
    return;
  }

  if (args[0] === '--list') {
    await findPendingOrders();
    return;
  }

  if (args[0] === '--session' && args[1]) {
    await updatePaymentStatus(null, args[1], args[2]);
    return;
  }

  // Assume first argument is order number
  await updatePaymentStatus(args[0], args[1], args[2]);
}

main().catch(console.error);
