// index.js - purpose and description here
// Author: Team Squirrel Guide
// Date: 11/19/24

function animationSpeechBubble() {
  const animatedElement = document.getElementById('speech-bubble');
  animatedElement.classList.add('active');
}
function moreText(){
  $("#speech").text("Next line of dialogue");
  $("#speech").css("opacity", 0);
  $("#speech").animate({ opacity: 1 }, 1000);
}
function closeText(){
  $("body").css("opacity", 1);
  const animatedElement = document.getElementById('speech-bubble');
  animatedElement.classList.remove('active');
}
function modifyColor(element){
  const red = $("#redSlider").val();
  const green = $("#greenSlider").val();
  const blue = $("#blueSlider").val();
  switch (element){
    case 0:
      $("#testing1").css("border-color", "rgb(" + red + "," + green + "," + blue + ")");
      break;
    case 1:
      $("#testing1").css("background-image", "none");
      $("#testing1").css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
      break;
    case 2:
      $("#testing1 h1").css("color", "rgb(" + red + "," + green + "," + blue + ")");
      break;
    case 3:
      $("#testing1 p").css("color", "rgb(" + red + "," + green + "," + blue + ")");
      break;
    default:
      break;
  }

}

function main() {
  console.log("Main function started.");
  $(document).ready(function() {
    $("#redSlider, #greenSlider, #blueSlider").on("input", function() {
      const red = $("#redSlider").val();
      const green = $("#greenSlider").val();
      const blue = $("#blueSlider").val();
  
      $("#red").text(red);
      $("#green").text(green);
      $("#blue").text(blue);
    });
    $()
  });
}

// let's get this party started
main();
