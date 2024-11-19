// index.js - Handle JSON data
// Author: Your Name
// Date:

// Functions
let tourData = {};
let currentSceneId = "Stevenson"; // Start with the first scene

// Function to load and display a scene
function loadScene(sceneId) {
  // Find the scene by ID
  const scene = tourData.scenes.find(s => s.id === sceneId);
  if (!scene) return; // Exit if the scene is not found

  // Update the description
  $("#scene-description").text(scene.description);

  // Update the image
  $("#scene-image").attr("src", scene.image);

  // Update the audio
  $("#scene-audio").attr("src", scene.audio);

  // Clear and add options
  $("#options-container").empty();
  scene.options.forEach(option => {
    const button = $("<button></button>").text(option.text);
    button.on("click", function() {
      loadScene(option.nextScene); // Load the next scene on click
    });
    $("#options-container").append(button);
  });
}

// Load the JSON data and initialize the first scene
$(document).ready(function() {
  $.getJSON('../js/sceneData.json', function(data) {
    tourData = data;
    loadScene(currentSceneId); // Load the initial scene
  });
});
