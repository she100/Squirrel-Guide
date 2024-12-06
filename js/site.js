// index.js - Handle JSON data
// Author: Your Name
// Date:


let tourData = {};
let currentSceneId = "Rave"; //first scene
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

  if (sceneId === "Rave") {
    addRaveElements();
  }

  // Find the scene by ID
  const scene = tourData.scenes.find(s => s.id === sceneId);
  if (!scene) return; // Exit if the scene is not found

  // Update the scene title
  if (scene.title === "" || scene.title === " ") {
    $("#scene-title").css("display", "none");
  }else{
    $("#scene-title").text(scene.title);
    $("#scene-title").show();
  }

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
  
  //load the CSS for this specific scene only if there is a specific style (this stops the browser from throwing an error if the link is empty)
  if (scene.style && scene.style !== "") {
    if ($("#theme-style").length === 0) {
      $("head").append('<link id="theme-style" rel="stylesheet" href="">');
    }
    $("#theme-style").attr("href", `${scene.style}`);
  } else {
    $("#theme-style").remove(); // Remove the link element if no specific style is provided
  }

  // Set the background image
  $("body").css("background-image", `url(${scene.image})`);

  // Update the audio
  $("#scene-audio").attr("src", `${scene.audio}`);

  // Clear and add options
  $("#options-container").empty();

  // Update the description
  updateDescription();

  // Show the options if the scene has been visited before
  if (sceneHistory.includes(sceneId)){
    showOptions(scene);
  }
  
  // Update the current scene ID
  currentSceneId = sceneId;
}

function showOptions(scene){
  scene.options.forEach(option => {
    const button = $("<button></button>").text(option.text);
    button.on("click", function() {
      resetScene(); // Reset the scene
      loadScene(option.nextScene); // Load the next scene on click
    });
    $("#options-container").append(button);
    button.show();
  });
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
          typewriter.pauseFor(500); // Pause before typing the next description
        }
      });
    } else {
      // Single description
      typewriter.typeString(scene.description).start();
    }
    if(!sceneHistory.includes(currentSceneId)) { // If the scene has not been visited before (the options are already shown if the scene has been visited before)
      typewriter.callFunction(() => { 
        showOptions(scene); // Show the options after typing the description
      }).start();
    }
  }}

// add lasers
function addRaveElements() {
  $("#header").prepend('<div class="lasers"><div class="l"></div></div>');
  $("#header").append('<div class="lasers"><div id="second"></div></div>');
}

function resetScene() {
  // Hide the thought bubble
  $("#thought,#tail-box").css("opacity", "0");
  // Restart animation
  $("#play").attr("class", "play-container animated");
  //hide the options
  $("#options-container button").hide();
  // make sure lasers are hidden
  $(".lasers").hide();
  // remove the rave elements if they exist
  $(".lasers").remove();
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
    show
  }
});

// Event listener to play the audio and show the thought bubble
$("#play-button").on("click", function() {
  //play the audio for that scene only if there is audio
  if ($("#scene-audio").attr("src") !== ""){
    $("#scene-audio").trigger("play");
  }
  //change opacity to 1 to show thought bubble
  $("#thought,#tail-box").css("opacity", "1");
  //stop play button animation
  $("#play").attr("class", "play-container");
  // Type the description
  typeDescription();
  
  if (currentSceneId === "Rave") {
    $(".lasers").show();
  }
});