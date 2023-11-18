// import * as THREE from "three";
import * as THREE from "three";

const parameters = {
  mass: 70,
  gravity: 10,
  density: 1,
  radius: 2,
  angle: 0,
  left_brake: 0,
  right_brake: 0,
  constant: 1500,
  Drop: false,
};
var location = new THREE.Vector3(0, -50, 0);
var velocity = new THREE.Vector3(0, 0, 0);
var Acc = new THREE.Vector3(0, 0, 0);
var myWind = new THREE.Vector3(0, 0, 0);
var plane = new THREE.Vector3(-0.001, 0, 0);
const clock = new THREE.Clock();

function tick(left, right, Drop, mass, radius, gravity, wind) {
  // console.log(wind);
  const elapsedTime = clock.getElapsedTime();
  parameters.mass = mass;
  parameters.radius = radius;
  parameters.gravity = gravity;
  // console.log(parameters.gravity);

  if (Drop == true) {
    var totalForce = new THREE.Vector3(0, 0, 0);
    myWind.set(wind.x, wind.y, wind.z);

    totalForce.add(myWind.clone());

    totalForce.add(
      new THREE.Vector3(0, -parameters.mass * parameters.gravity, 0)
    );

    const factor =
      (-1 / 2) *
      parameters.radius *
      parameters.radius *
      Math.PI *
      parameters.density *
      velocity.length();

    totalForce.add(velocity.clone().multiplyScalar(factor));
    totalForce.multiplyScalar(0.0001);

    Acc = totalForce.clone().multiplyScalar(1 / parameters.mass);
    console.log("acceleration");
    console.log(Acc);

    console.log("velocity");
    console.log(velocity);

    console.log("location");
    console.log(location);

    velocity.add(Acc.clone().multiplyScalar(elapsedTime));
    //

    location.add(velocity.clone().multiplyScalar(elapsedTime));

    const barkeTotal = parameters.right_brake + parameters.left_brake;
    // console.log(barkeTotal);

    const torque = parameters.radius * barkeTotal;
    const inertiaMoment =
      (parameters.mass / 2) * parameters.radius * parameters.radius;
    const radialAcc = torque / inertiaMoment;
    const radialVelocity = radialAcc * elapsedTime;

    const tempAngel = parameters.angle;

    if (barkeTotal != 0) {
      parameters.angle = tempAngel + radialVelocity;
    }

    // console.log(parameters.angle);

    // testCube.position.copy(location);

    if (location.y < -200000) {
      location.y = -200000;
      velocity.y *= 0;
      velocity.x *= 0;
    }

    const cos =
      ((-barkeTotal -
        (-1 / 2) *
          parameters.radius *
          parameters.radius *
          Math.PI *
          parameters.density *
          velocity.length() *
          velocity.length()) /
        parameters.mass) *
      parameters.gravity;

    if (left == false && parameters.right_brake != 0.0) {
      if (parameters.right_brake > 0) {
        parameters.right_brake -= 0.1;
      }
      if (parameters.right_brake < 0) {
        parameters.right_brake += 0.1;
      }
      parameters.right_brake = 0;
    }

    if (right == false && parameters.left_brake != 0.0) {
      if (parameters.left_brake > 0) {
        parameters.left_brake -= 0.1;
      }
      if (parameters.left_brake < 0) {
        parameters.left_brake += 0.1;
      }
      parameters.left_brake = 0;
    }

    // console.log(location);
    // console.log(Acc);
    postMessage([location, parameters.constant, parameters.angle, velocity]);
  } else {
    velocity.add(plane.clone().multiplyScalar(elapsedTime));

    if (velocity.x <= -2) {
      velocity.x = -2;
    }
    location.add(velocity.clone().multiplyScalar(elapsedTime));
    postMessage([location, parameters.constant, parameters.angle, velocity]);
  }
}

onmessage = function (e) {
  if (e.data[1] == true) {
    parameters.right_brake += 0.01;
    parameters.constant += 10;
    if (parameters.right_brake >= 10) {
      parameters.right_brake = 10;
    }
  } else if (e.data[2] == true) {
    // console.log("dasdaaaaaaaaaaaa");

    parameters.left_brake += 0.01 * -1;
    parameters.constant += 10;
    if (parameters.left_brake <= -10) {
      parameters.left_brake = -10;
    }
  }

  tick(
    e.data[1],
    e.data[2],
    e.data[3],
    e.data[4],
    e.data[5],
    e.data[6],
    e.data[7]
  );
};
// onmessage = function (e) {
//   if (e.data.length == 2) {
//     parameters.right_brake += e.data[0];
//     parameters.constant += e.data[1];
//   }
// };
