// index.js - Handle JSON data
// Author: Your Name
// Date:


let tourData = {};
let currentSceneId = "Cowell"; //first scene right now is Stevenson (can change that later)

// Function to load and display a scene
function loadScene(sceneId) {
  // Find the scene by ID
  const scene = tourData.scenes.find(s => s.id === sceneId);
  if (!scene) return; // Exit if the scene is not found

  // Update the scene title
  $("#scene-title").text(scene.id);

  // Update the description
  $("#scene-description").text(scene.description);

  // Set the background image
  $("body").css("background-image", `url(${scene.image})`);

  // Update the audio
  $("#scene-audio").attr("src", scene.audio);

  //load the CSS for this specific scene
  $("#theme-style").attr("href", `../css/${scene.style}`);

  // Clear and add options
  $("#options-container").empty();
  scene.options.forEach(option => {
    const button = $("<button></button>").text(option.text);
    button.on("click", function() {
      resetScene(); // Reset the scene
      loadScene(option.nextScene); // Load the next scene on click
    });
    $("#options-container").append(button);
  });
}

function resetScene(){
  $("#thought,#tail-box").css("opacity", "0");
}

// Load the JSON data and initialize the first scene
$(document).ready(function() {
  $.getJSON('./js/sceneData.json', function(data) {
    tourData = data;
    loadScene(currentSceneId); // Load the initial scene
  });
});

// Event listener for the audio
$("#play-button").on("click", function() {
  //play the audio for that scene
  $("#scene-audio").trigger("play");
  //change opacity to 1 to show thought bubble
  $("#thought,#tail-box").css("opacity", "1");
});