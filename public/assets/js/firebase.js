const firebaseConfig = {
  apiKey: "AIzaSyC06Hl9ACc8D3EIrKwwuY5rPfcdCpSrBQM",
  authDomain: "connect-n-care.firebaseapp.com",
  projectId: "connect-n-care",
  storageBucket: "connect-n-care.appspot.com",
  messagingSenderId: "773828390722",
  appId: "1:773828390722:web:07f0822b375ba9866062db",
  measurementId: "G-NN4QB2C3KH",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();
const auth = firebase.auth();


const signoutUser = (e) => {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
      // console.log('loggedOut');
      successMsgBody.getElementsByClassName.display = "block";
      successMsgBody.innerHTML = `Signed Out Successfully`;
      setTimeout(() => {
        successMsgBody.style.display = "none";
      }, 3000);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      // console.log(errorCode);
      // console.log(errorMessage);
      // An error happened.
      errorMsgBody.getElementsByClassName.display = "block";
      errorMsgBody.innerHTML = `${errorMessage}`;
      setTimeout(() => {
        errorMsgBody.style.display = "none";
      }, 3000);
    });
};