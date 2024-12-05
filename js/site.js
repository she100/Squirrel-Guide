// index.js - Handle JSON data
// Author: Your Name
// Date:


let tourData = {};
let currentSceneId = "Welcome"; //first scene
let currentDescriptionIndex = 0;
let sceneHistory = []; // Array to keep track of visited scenes

// Function to load and display a scene
function loadScene(sceneId) {
  console.log(`Loading Scene: ${sceneId}`);
  // Add the current scene to the history before changing it
  if (currentSceneId !== sceneId) {
    console.log(`New Scene, you have visited: ${sceneHistory}`);
    sceneHistory.push(currentSceneId);
  }

  // Find the scene by ID
  const scene = tourData.scenes.find(s => s.id === sceneId);
  if (!scene) return; // Exit if the scene is not found

  // Update the scene title
  $("#scene-title").text(scene.title);

  // Reset the description index
  currentDescriptionIndex = 0;

  // Function to update the description
  function updateDescription() {
    if (Array.isArray(scene.description)) {
      $("#scene-description").text(scene.description[currentDescriptionIndex]);
    } else {
      $("#scene-description").text(scene.description);
    }
  }
  
  //load the CSS for this specific scene
  $("#theme-style").attr("href", `./Scenes/${scene.id}/css/${scene.style}`);

  // Set the background image
  $("body").css("background-image", `url(${scene.image})`);

  // Update the audio
  $("#scene-audio").attr("src", `./Scenes/${scene.id}/${scene.audio}`);

  // Clear and add options
  $("#options-container").empty();

  // Update the description
  updateDescription();

  // Handle multiple descriptions
  if (Array.isArray(scene.description) && scene.description.length > 1) {
    const nextButton = $("<button></button>").text("Next");
    nextButton.on("click", function() {
      currentDescriptionIndex++;
      if (currentDescriptionIndex < scene.description.length) {
        updateDescription();
      } else {
        // Show the options once all descriptions are displayed
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
    });
    $("#options-container").append(nextButton);
  } else {
    // Show the options if there is only one description
    scene.options.forEach(option => {
      const button = $("<button></button>").text(option.text);
      button.on("click", function() {
        resetScene(); // Reset the scene
        loadScene(option.nextScene); // Load the next scene on click
      });
      $("#options-container").append(button);
    });
  }
  // Update the current scene ID
  currentSceneId = sceneId;
}

function resetScene() {
  // Hide the thought bubble
  $("#thought,#tail-box").css("opacity", "0");
  // Restart animation
  $("#play").attr("class", "play-container animated");
}

// Load the JSON data and initialize the first scene
$(document).ready(function() {
  $.getJSON('./js/sceneData.json', function(data) {
    tourData = data;
    loadScene(currentSceneId); // Load the initial scene
  });
});

// Event listener for the "Go to Previous Scene" button
$("#previous-scene-button").on("click", function() {
  console.log(`Going back to the previous scene from: ${currentSceneId} to ${sceneHistory[sceneHistory.length - 1]}`);
  if (sceneHistory.length > 0) {
    const previousSceneId = sceneHistory.pop();
    loadScene(previousSceneId);
  }
});

// Event listener for the audio
$("#play-button").on("click", function() {
  //play the audio for that scene
  $("#scene-audio").trigger("play");
  //change opacity to 1 to show thought bubble
  $("#thought,#tail-box").css("opacity", "1");
  //stop play button animation
  $("#play").attr("class", "play-container");
});