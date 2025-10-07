/**
 * Sample Test Script for AI Assignment Checker
 *
 * This file demonstrates how to use the API endpoints
 * Run this after starting the server with: pnpm run start:dev
 */

const BASE_URL = 'http://localhost:4000';

// Example 1: Create an Assignment
async function createAssignment() {
  const response = await fetch(`${BASE_URL}/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: 'Climate Change Essay',
      instructions:
        'Write a comprehensive essay on the impacts of climate change on global ecosystems. Include scientific evidence, real-world examples, and potential solutions. Discuss both environmental and socio-economic impacts.',
      wordCount: 500,
      mode: 'strict', // or 'loose'
    }),
  });

  const data = await response.json();
  console.log('Assignment Created:', data);
  return data.data.id; // Return assignment ID for next steps
}

// Example 2: Upload Submissions (using FormData in Node.js would require additional setup)
// In a browser or with proper libraries:
async function uploadSubmissions(assignmentId, files) {
  const formData = new FormData();

  // Add files to form data
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(
    `${BASE_URL}/assignments/${assignmentId}/submissions/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data = await response.json();
  console.log('Submissions Uploaded:', data);
  return data;
}

// Example 3: Evaluate Submissions
async function evaluateSubmissions(assignmentId) {
  const response = await fetch(
    `${BASE_URL}/assignments/${assignmentId}/evaluate`,
    {
      method: 'POST',
    },
  );

  const data = await response.json();
  console.log('Evaluation Results:', data);
  return data;
}

// Example 4: Get Assignment with Submissions
async function getAssignment(assignmentId) {
  const response = await fetch(`${BASE_URL}/assignments/${assignmentId}`);
  const data = await response.json();
  console.log('Assignment Details:', data);
  return data;
}

// Example 5: Get All Assignments
async function getAllAssignments() {
  const response = await fetch(`${BASE_URL}/assignments`);
  const data = await response.json();
  console.log('All Assignments:', data);
  return data;
}

// Example 6: Download Marks Sheet (Browser only - will trigger download)
function downloadMarksSheet(assignmentId, format = 'xlsx') {
  window.location.href = `${BASE_URL}/assignments/${assignmentId}/marks-sheet?format=${format}`;
}

// Complete workflow example
async function completeWorkflow() {
  try {
    // Step 1: Create assignment
    console.log('Step 1: Creating assignment...');
    const assignmentId = await createAssignment();

    // Step 2: Upload submissions (you would need actual PDF files here)
    // console.log('Step 2: Uploading submissions...');
    // await uploadSubmissions(assignmentId, yourPdfFiles);

    // Step 3: Evaluate submissions
    console.log('Step 3: Evaluating submissions...');
    await evaluateSubmissions(assignmentId);

    // Step 4: Get results
    console.log('Step 4: Getting results...');
    const results = await getAssignment(assignmentId);

    console.log('Workflow completed!', results);
  } catch (error) {
    console.error('Error in workflow:', error);
  }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createAssignment,
    uploadSubmissions,
    evaluateSubmissions,
    getAssignment,
    getAllAssignments,
    downloadMarksSheet,
    completeWorkflow,
  };
}
