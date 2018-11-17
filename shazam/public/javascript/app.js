//TODO... check if it makes a difference to select the mic of a "groupId"... and not just "deviceId"


$( document ).ready(function() {

    audioDevices = []
    var currentRecorder

    //Output details before allowing the user to start recording
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) == false) {
        $("#notrecording").text("Our App Doesn't work from this browser :(")
    } else {
        navigator.mediaDevices.enumerateDevices().then(gotDevices)
    
        function gotDevices(deviceInfos) {
            //iterate through all our audio and video devices
            for (var i = 0; i < deviceInfos.length; i++) {
                deviceInfo = deviceInfos[i]
                if(deviceInfo.kind == 'audioinput'){
                    audioDevices.push(deviceInfo)
                }
            }
    
            //display microphone message
            if(audioDevices.length == 0){
                $("#notrecording").text("No Microphone Detected")
            }
            else if(audioDevices.length == 1){
                $("#notrecording").text("Using the Only Microphone detected " + audioDevices[0].deviceId + " : " + audioDevices[0].label)
            }
            else{
                //create select tag
                $("#notrecording").text("Multiple Microphones detected, one selected\n")
                $("#notrecording").append(`<br>`)
                $("#notrecording").append(`<label for="audioSource">Audio source: </label><select id="audioSource"></select>`)

                //create a function that keep track of what mic is selected
                $("#notrecording > select").change(function() {
                    selectNewDevice((this).val());
                });

                //add in the selection options
                for(i = 0; i < audioDevices.length; i++){
                    audioDevice = audioDevices[i]
                    option = document.createElement('option');
                    option.value = i
                    option.text = "groupID: " + audioDevice.groupId + " deviceID: " + audioDevice.deviceId + " deviceLabel: " + audioDevice.label || 'unlabeled'
                    $("#notrecording > select").append(option)
                }

                //select default device
                selectNewDevice(0)
            }
        }
    }

    function selectNewDevice(index){
        var constraints = {
            audio: {
                deviceId: {exact: audioDevices[index].deviceId}
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            currentRecorder = new MediaRecorder(stream)
        })
    }

    function startRecording(){
        currentRecorder.start()
    }

    function stopRecording(){
        currentRecorder.stop()
    }

    function saveRecording(){

    }

    $( "#record" ).click(function() {
        if(currentRecorder.state == "inactive"){
            startRecording()
        }
        else{
            stopRecording()
        }
    })

    /*
    $( "#record" ).click(function() {
        if(recording){
            mediaRecorder.stop()
            recording = false
        }
        else{
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
            });

            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
            });

            recording = true
        }
    });
    */

    /*
    function getStream() {
                if (window.stream) {
                    window.stream.getTracks().forEach(function(track) {
                    track.stop();
                    });
                }
                
                var constraints = {
                    audio: {
                    deviceId: {exact: audioSelect.value}
                    }
                };
                
                navigator.mediaDevices.getUserMedia(constraints)
                .then(gotStream).catch(handleError);
            }
            
            function gotStream(stream) {
                window.stream = stream; // make stream available to console
                videoElement.srcObject = stream;
            }

            function handleError(error) {
                oldText = $("#microphone").text()
                $("#microphone").text(oldText + " AND " + error)
            }
            */

    /*
    recording = false

    $( "#record" ).click(function() {
        if(recording){
            mediaRecorder.stop()
            recording = false
        }
        else{
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
            });

            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
            });

            recording = true
        }
    });
    */

});
/*
function hasGetUserMedia() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
  // Good to go!
} else {
  alert('getUserMedia() is not supported by your browser');
}
*/



