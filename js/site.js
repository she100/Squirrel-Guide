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
  $("#theme-style").attr("href", `${scene.style}`);

  // Set the background image
  $("body").css("background-image", `url(${scene.image})`);

  // Update the audio
  $("#scene-audio").attr("src", `./Scenes/${scene.id}/${scene.audio}`);

  // Clear and add options
  $("#options-container").empty();

  // Update the description
  updateDescription();

  //show the options
  scene.options.forEach(option => {
    const button = $("<button></button>").text(option.text);
    button.on("click", function() {
      resetScene(); // Reset the scene
      loadScene(option.nextScene); // Load the next scene on click
    });
    $("#options-container").append(button);
  });
  // Update the current scene ID
  currentSceneId = sceneId;
}

// Uses the TypewriterJS library to type out the description
function typeDescription() { 
  const descriptionContainer = document.getElementById("scene-description");
  const scene = tourData.scenes.find(s => s.id === currentSceneId); // Find the current scene

  if (scene && scene.description) { // If the scene has a description
    // Clear previous content
    descriptionContainer.innerHTML = "";

    // Initialize TypewriterJS
    const typewriter = new Typewriter(descriptionContainer, {
      loop: false, // No looping
      delay: 20,   // Typing speed
      cursor: "", // Cursor appearance
      // deleteSpeed: 10 // Delete speed
    });

    if (Array.isArray(scene.description)) { // If there are multiple descriptions
      scene.description.forEach((description, index) => { // Loop through each description
        typewriter // Type the description
          .typeString(description)
          .pauseFor(1000)
          .start()
        if(index < scene.description.length - 1) { // only delete if there are more descriptions
          typewriter.deleteAll(1).start(); // Delete the description
        }
      });
    } else {
      // Single description
      typewriter.typeString(scene.description).start();
    }
  }}

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

// Event listener to play the audio and show the thought bubble
$("#play-button").on("click", function() {
  //play the audio for that scene
  $("#scene-audio").trigger("play");
  //change opacity to 1 to show thought bubble
  $("#thought,#tail-box").css("opacity", "1");
  //stop play button animation
  $("#play").attr("class", "play-container");
  // Type the description
  typeDescription();  
});