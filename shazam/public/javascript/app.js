$( document ).ready(function() {

    //TODO... check if it makes a difference to select the mic of a "groupId"... and not just "deviceId"

    class Recording{
        constructor(){
            this.audioChunks = []
        }

        setMediaRecorder(value){
            this.mediaRecorder = value
        }
    }

    audioDevices = []
    recordingCount = 5 //how many recordings you want to be created max (used to identify things faster by recording as little as possible)
    recordings = []

    function saveEverySecond(index){
        setTimeout(stopAndSaveEverySecond, 1000, index)
    }

    function stopAndSaveEverySecond(index){ 
        if(index < recordingCount){
            stopAndDownloadRecording(index)
            index += 1
            setTimeout(stopAndSaveEverySecond, 1000, index)
        }
    }

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
                    selectNewDevice($(this).val());
                });

                //add in the selection options
                for(i = 0; i < audioDevices.length; i++){
                    audioDevice = audioDevices[i]
                    option = document.createElement('option');
                    option.value = i
                    option.text = "deviceID: " + audioDevice.deviceId + " deviceLabel: " + audioDevice.label || 'unlabeled' //+ " groupID: " + audioDevice.groupId
                    $("#notrecording > select").append(option)
                }

                //select the first item
                selectNewDevice(0)
            }
        }
    }

    function initRecordings(){
        //create recording objects
        for(i = 0; i < recordingCount; i++){
            recordings.push(new Recording())
        }
    }

    function clearRecordings(){
        recordings.splice(0, recordings.length)
    }

    function generateRecordings(index){
        var constraints = {
            audio: {
                deviceId: {exact: audioDevices[index].deviceId}
            }
        };

        for(i = 0; i < recordingCount; i++){
            navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                //create a recorder that is available for manuipulation
                currMediaRecorder = new MediaRecorder(stream)
                recordings[i].setMediaRecorder(currMediaRecorder)
    
                recordings[i].mediaRecorder.ondataavailable = function (event){
                    recordings[i].audioChunks.push(event.data)
                }
            })
        }
    }

    function selectNewDevice(index){
        clearRecordings()
        initRecordings()
        generateRecordings(index)
    }

    function startRecordings(){
        //start every individual recording
        for(i = 0; i < recordings.length; i++){
            if(recordings[i].mediaRecorder.state == "inactive"){
                console.log("Recording " + i + " started")
                recordings[i].mediaRecorder.start()
            }
        }

        //start the function that saves every second
        //saveEverySecond(0)
    }

    function stopRecordings(){
        for(i = 0; i < recordings.length; i++){
            if(recordings[i].mediaRecorder.state == "recording"){
                console.log("Recording " + i + " stopped")
                recordings[i].mediaRecorder.stop()
            }
        }
    }

    function stopAndDownloadRecording(index){
        //stop the recording to we can retreive its data
        recordings[i].mediaRecorder.stop()

        //audio chunk conversion
        const audioBlob = new Blob(recordings[i].audioChunks, { type: 'audio/mpeg' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        //link hacking to save the file
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.style = 'display: none'
        a.href = audioUrl
        a.download = 'test' + index + '.mp3'
        a.click()
        a.remove()
    }

    isRecording = false

    $( "#record" ).click(function() {
        if(isRecording){
            stopRecordings()
            $("#record").text("record")
            isRecording = false
        }
        else{
            startRecordings()
            $("#record").text("stop")
            isRecording = true
        }
    })
})