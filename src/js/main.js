let liftQueue = [];

function onSimulate(event) {
    event.preventDefault();

    // Clear previous simulation
    simulator.innerHTML = '';
    liftQueue = [];

    //Validations
    if(floors.value <= 0 || lifts.value <= 0){
        alert('Please enter positive numbers.')
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
    button.disabled = true;
    button.style.background = '#23b123';

    liftQueue.push({floor, button});
    processLiftQueue();
}

function processLiftQueue() {
    if (liftQueue.length === 0) return;

    const lifts = Array.from(document.querySelectorAll('.lift-div'));
    const freeLift = lifts.find(lift => lift.getAttribute('data-busy') === 'false');

    if (freeLift) {
        const request = liftQueue.shift();
        moveLift(freeLift, request.floor, request.button);
    }
}

function findNearestLift(targetFloor) {
    const lifts = Array.from(document.querySelectorAll('.lift-div'));
    return lifts.reduce((nearest, lift) => {
        if (lift.getAttribute('data-busy') === 'true') return nearest;

        const liftFloor = parseInt(lift.getAttribute('data-current-floor'));
        const distance = Math.abs(liftFloor - targetFloor);

        if (!nearest || distance < nearest.distance) {
            return { lift, distance };
        }
        return nearest;
    }, null);
}

function moveLift(lift, targetFloor, button) {
    const currentFloor = parseInt(lift.getAttribute('data-current-floor'));
    const distance = Math.abs(currentFloor - targetFloor);
    const travelTime = distance * 2;
    
    lift.setAttribute('data-busy', 'true');
    lift.style.transition = `transform ${travelTime}s linear`;

    const newPosition = -targetFloor * 130;
    lift.style.transform = `translateY(${newPosition}px)`;
    lift.setAttribute('data-current-floor', targetFloor);

    setTimeout(() => {
        openLiftDoors(lift);
        
        setTimeout(() => {
            closeLiftDoors(lift);
            
            setTimeout(() => {
                lift.setAttribute('data-busy', 'false');
                button.disabled = false;
                button.style.background = 'revert';
                
                processLiftQueue();
            }, 2500);
        }, 2500);
    }, travelTime * 1000); 
}

function openLiftDoors(lift) {
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");

    leftDoor.style.transition = "transform 2.5s";
    rightDoor.style.transition = "transform 2.5s";

    leftDoor.style.transform = "translateX(-50%)";
    rightDoor.style.transform = "translateX(50%)";
}

function closeLiftDoors(lift) {
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");

    leftDoor.style.transition = "transform 2.5s";
    rightDoor.style.transition = "transform 2.5s";

    leftDoor.style.transform = "translateX(0)";
    rightDoor.style.transform = "translateX(0)";
}