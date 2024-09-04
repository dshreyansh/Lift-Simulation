let targetFloors = [];

function onSimulate(event) {
    event.preventDefault();

    // Clear previous simulation
    simulator.innerHTML = '';

    //Validations
    if(floors.value <=0 || lifts.value <=0){
        alert('Please enter positive number.')
    }
    else{
        // Create floors
        for (let i = floors.value - 1; i >= 0; i--) {
            createFloors(i, floors.value-1);
        }
        
        // Create lifts on the ground floor (floor 0)
        createLifts();
    }
}

function createFloors(floor, maxFloor) {
    const line = document.createElement('hr');

    const floorContainer = document.createElement('div');
    floorContainer.setAttribute('class', 'floor');

    const btnContainer = document.createElement('div');
    btnContainer.setAttribute('class', 'btn-div');
    
    const upBtn = document.createElement('button');
    upBtn.innerHTML = 'UP';
    upBtn.setAttribute('class', 'up-down');
    upBtn.dataset.floor = floor;
    upBtn.onclick = () => callLift(floor, upBtn);
    btnContainer.append(upBtn);
    if(floor === maxFloor){
        upBtn.disabled = true;
    }
    
    const downBtn = document.createElement('button');
    downBtn.innerHTML = 'DOWN';
    downBtn.setAttribute('class', 'up-down');
    downBtn.dataset.floor = floor;
    downBtn.onclick = () => callLift(floor, downBtn);
    btnContainer.append(downBtn);
    if(floor === 0){
        downBtn.disabled = true;
    }

    let floorNum = document.createElement('p');
    floorNum.innerHTML = `Floor ${floor}`;
    floorNum.setAttribute('class', 'floorName');

    floorContainer.append(btnContainer);
    floorContainer.append(floorNum);
    floorContainer.append(line);
    simulator.append(floorContainer);
}

function createLifts() {
    const liftContainer = document.createElement('div');
    liftContainer.setAttribute('class', 'lift-container');

    for (let i = 0; i < lifts.value; i++) {
        let lift = document.createElement('div');
        lift.setAttribute('class', 'lift-div');
        lift.setAttribute('data-current-floor', '0');
        lift.setAttribute('data-busy', 'false');

        let leftDoor = document.createElement('div');
        leftDoor.setAttribute('class', 'left-door');

        let rightDoor = document.createElement('div');
        rightDoor.setAttribute('class', 'right-door');

        lift.appendChild(leftDoor);
        lift.appendChild(rightDoor);

        liftContainer.appendChild(lift);
    }

    simulator.appendChild(liftContainer);
}

function callLift(floor, button) {
    const lifts = document.querySelectorAll('.lift-div');
    let closestLift = null;
    let minDistance = Infinity;

    // Find the closest free lift
    lifts.forEach(lift => {
        if (lift.getAttribute('data-busy') === 'false') {
            const currentFloor = parseInt(lift.getAttribute('data-current-floor'));
            const distance = Math.abs(currentFloor - floor);

            if (distance < minDistance) {
                minDistance = distance;
                closestLift = lift;
            }
        }
    });

    // If a lift is found, move it to the requested floor
    if (closestLift) {
        moveLift(closestLift, floor, button);
    } else {
        // If no lifts are available, add the floor to the target queue
        targetFloors.push(floor);
    }
}

function moveLift(lift, targetFloor, button) {
    const currentFloor = parseInt(lift.getAttribute('data-current-floor'));
    const distance = Math.abs(currentFloor - targetFloor);
    const travelTime = distance * 2; // 2 seconds per floor
    button.disabled=true;

    lift.setAttribute('data-busy', 'true');
    lift.style.transition = `transform ${travelTime}s linear`;

    lift.style.transform = `translateY(-${targetFloor * 130}px)`;
    lift.setAttribute('data-current-floor', targetFloor);

    // Open and close doors
    setTimeout(() => {
        lift.classList.add('open');
        
        setTimeout(() => {
            lift.classList.remove('open');
            lift.setAttribute('data-busy', 'false');
            button.disabled=false;
            // Check if there are more floors in the queue
            if (targetFloors.length > 0) {
                const nextFloor = targetFloors.shift();
                moveLift(lift, nextFloor);
            }
        }, 2500); // 2.5 seconds to close doors
    }, travelTime*1000); // 2.5 seconds to open doors
       
}


function openLiftDoors(lift) {
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");

    leftDoor.style.transform = "translateX(-50%)";
    rightDoor.style.transform = "translateX(50%)";
}

function closeLiftDoors(lift) {
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");

    leftDoor.style.transform = "translateX(0)";
    rightDoor.style.transform = "translateX(0)";
}

