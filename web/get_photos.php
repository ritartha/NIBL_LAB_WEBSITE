<?php
header('Content-Type:  application/json');
header('Access-Control-Allow-Origin:  *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Get the folder parameter
$folder = isset($_GET['folder']) ? $_GET['folder'] : '';

if (empty($folder)) {
    echo json_encode(['success' => false, 'error' => 'No folder specified']);
    exit;
}

// Sanitize folder name to prevent directory traversal
$folder = preg_replace('/[^a-zA-Z0-9_-]/', '', $folder);

// Define the base image directory
$baseDir = 'img/' .$folder .'/';

// Check if directory exists
if (!is_dir($baseDir)) {
    echo json_encode(['success' => false, 'error' => 'Directory not found']);
    exit;
}

// Allowed image extensions
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

// Get all files in the directory
$files = scandir($baseDir);
$photos = [];

foreach ($files as $file) {
    // Skip .and ..directories
    if ($file === '.' || $file === '..') {
        continue;
    }
    
    // Skip cover image
    if (strtolower($file) === 'cover.jpg' || strtolower($file) === 'cover.png' || strtolower($file) === 'cover.jpeg') {
        continue;
    }
    
    // Check if file is an image
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (in_array($extension, $allowedExtensions)) {
        // Verify it's actually a file (not a directory)
        if (is_file($baseDir .$file)) {
            $photos[] = $file;
        }
    }
}

// Sort photos naturally (1, 2, 10 instead of 1, 10, 2)
natsort($photos);
$photos = array_values($photos); // Reindex array

// Return the results
echo json_encode([
    'success' => true,
    'photos' => $photos,
    'count' => count($photos),
    'folder' => $folder
]);
?>