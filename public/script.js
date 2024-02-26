const socket = io();

const peer = new Peer();

const video = document.createElement('video');
document.body.appendChild(video);

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();

    const myPeer = new Peer();

    myPeer.on('open', (userId) => {
      socket.emit('join-room', 'roomId', userId);

      myPeer.on('call', (call) => {
        call.answer(stream);
        const userVideo = document.createElement('video');
        call.on('stream', (userVideoStream) => {
          userVideo.srcObject = userVideoStream;
          document.body.appendChild(userVideo);
          userVideo.play();
        });
      });

      socket.on('user-connected', (userId) => {
        const call = myPeer.call(userId, stream);
        const userVideo = document.createElement('video');
        call.on('stream', (userVideoStream) => {
          userVideo.srcObject = userVideoStream;
          document.body.appendChild(userVideo);
          userVideo.play();
        });
      });

      socket.on('user-disconnected', (userId) => {
        // Handle user disconnection, remove video element, etc.
      });

      socket.on('offer', (offer, targetUserId) => {
        const call = myPeer.call(targetUserId, stream);
        call.on('stream', (userVideoStream) => {
          const userVideo = document.createElement('video');
          userVideo.srcObject = userVideoStream;
          document.body.appendChild(userVideo);
          userVideo.play();
        });

        call.answer(offer);
      });

      socket.on('answer', (answer, targetUserId) => {
        // Handle answer from target user
        myPeer.connections[targetUserId].peerConnection.setRemoteDescription(answer);
      });

      socket.on('ice-candidate', (candidate, targetUserId) => {
        // Handle ICE candidate from target user
        myPeer.connections[targetUserId].peerConnection.addIceCandidate(candidate);
      });
    });
  });
