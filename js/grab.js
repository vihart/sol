
var debug = false;

var hands = [];
var colorArray = [];

// var gravity = -0.0001;

var vrModeGamePadButtonPressed = false; // because of annoying way gamepad buttons work
var squeezing = false;
var pressedController = -1;

function doGrab(){
	// HANDS!!!!
	for (j in controls.controllers) {
		if(debug) {
			console.time("controls");
		}


		var handControl = controls.controllers[j];
		if (!hands[j]) {
			//create a new hands[j] for each controller
			hands[j] = new THREE.Mesh(new THREE.OctahedronGeometry(.05), new THREE.MeshBasicMaterial({color: 0xEE0443, wireframe: true}));
			scene.add(hands[j]);
			colorArray[j] = new THREE.Color(1, 1/(2*(j+1)), 1/(2*j+1));
			hands[j].material.color.setRGB(colorArray[j].r, colorArray[j].g, colorArray[j].b);
		}
		if(handControl.pose){ //set hand vis at controller location
			hands[j].position.set(handControl.pose.position[0], handControl.pose.position[1], handControl.pose.position[2]);
			hands[j].quaternion.set(handControl.pose.orientation[0],handControl.pose.orientation[1],handControl.pose.orientation[2],handControl.pose.orientation[3]);
		}

		if (handControl.pose && handControl.buttons[3].pressed) { // enter VR mode
			pressedController = j;
			vrModeGamePadButtonPressed = true;
		} else if (vrModeGamePadButtonPressed && pressedController === j) {
			vrModeGamePadButtonPressed = false;
			pressedController = -1;
			vrMode = !vrMode;
			effect.setVRMode(vrMode);
		}

		//get vectors for things so that collision!
		if (handControl.pose){
			handPosVector.set(handControl.pose.position[0],handControl.pose.position[1],handControl.pose.position[2]);
		}
		for (var i = 0; i < grabbables.length; i++){
			if (grabbables[i]){
				relative[i] = new THREE.Vector3(everything.position.x + grabbables[i].position.x*everything.scale.x, everything.position.y + grabbables[i].position.y*everything.scale.y, everything.position.z + grabbables[i].position.z*everything.scale.z );
			}
		}


		//edit mode for grabbing and moving objects during scene setup:
		if (handControl.pose && handControl.buttons[1].pressed && editMode == true) { //grab stuff
			for (var i = grabbables.length; i > -1; i--){
				if (grabbables[i]&&(relative[i].distanceTo(handPosVector) < grabRadius[i])){
					grabbables[i].position.set((handControl.pose.position[0] - everything.position.x)/everything.scale.x, (handControl.pose.position[1] - everything.position.y)/everything.scale.y, (handControl.pose.position[2] - everything.position.z)/everything.scale.z);
					grabbables[i].quaternion.set(handControl.pose.orientation[0],handControl.pose.orientation[1],handControl.pose.orientation[2],handControl.pose.orientation[3]);
					// grabbables[i].scale.set(handControl.axes[0], handControl.axes[1], handControl.buttons[1].value);
					break;
				}
			}
		}


		if(debug) {
			console.timeEnd("controls");
			console.log(handControl.pose.position);
		}
	}
}	