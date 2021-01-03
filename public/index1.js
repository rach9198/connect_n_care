

const signupFormHTML = document.querySelector("#signupForm");
const signupFormBtnHTML = document.querySelector("#signupFormBtn");
const successSignInHTML = document.querySelector("#successSignIn");
const errorSignInHTML = document.querySelector("#errorSignIn");
const successSignUpHTML = document.querySelector("#successSignUp");
const errorSignUpHTML = document.querySelector("#errorSignUp");
const navHTML = document.querySelector("#nav");
const successMsgBody = document.querySelector("#successMsgBody");
const errorMsgBody = document.querySelector("#errorMsgBody");

let dashboardBtnHTML, signoutBtnHTML, loginBtnHTML, regsisterBtn;

const redirectDashboard = (e) => {
  let uid = e.target.dataset.userid;
  window.location.href = `./dashboard/dashboard.html?user=${uid}`;
};



auth.onAuthStateChanged((user) => {
  if (user) {
    let uid = user.uid;
    console.log(uid);
    navHTML.innerHTML = `
    <div class="title-contents">
      <img src="./assets/img/healthLogo.png" />
      <div class="title-logo">
        <h1 id="main-title">Connect n Care</h1>
      </div>
    </div>
    <div class="login-buttons">
      <button
        data-userid="${uid}"
        id="dashboard-button"
      >
        DASHBOARD
      </button>

      <button
        data-userid="${uid}"
        id="signout-button"
      >
        SIGNOUT
      </button>
    </div>`;

    dashboardBtnHTML = document.querySelector("#dashboard-button");
    signoutBtnHTML = document.querySelector("#signout-button");
    dashboardBtnHTML.addEventListener("click", redirectDashboard);
    signoutBtnHTML.addEventListener("click", signoutUser);
  } else {
    console.log('else');
    navHTML.innerHTML = `
    <div class="title-contents">
      <img src="./assets/img/healthLogo.png" />
      <div class="title-logo">
        <h1 id="main-title">Connect n Care</h1>
        <!-- <p id="sub-title">Health Care</p> -->
      </div>
    </div>
    <div class="login-buttons">
      <button
        id="login-button"
        data-toggle="modal"
        data-target="#login-modal"
      >
        LOGIN
      </button>

      <button
        id="register-button"
        data-toggle="modal"
        data-target="#register-modal"
      >
        REGISTER
      </button>
    </div>
    `;
  }
});

const submitSignupForm = (e) => {
  console.log(e);
  // e.preventDefault();
  e.preventDefault();
  const name = signupFormHTML["name"].value;
  const email = signupFormHTML["email"].value;
  const password = signupFormHTML["password"].value;
  const cpassword = signupFormHTML["cpassword"].value;
  const credits = 800;
  if (password === cpassword) {
    let uid;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        uid = user.user.uid;
        console.log(uid);
        return db.collection("customers").doc(uid).set({
          email: email,
          name: name,
          credits: credits,
        });
      })
      .then((savedData) => {
        // console.log("dataSaved");
        successSignUpHTML.getElementsByClassName.display = "block";
        successSignUpHTML.innerHTML = `Registered Successfully`;
        setTimeout(() => {
          successSignUpHTML.style.display = "none";
        }, 3000);
        window.location.href = `./dashboard/dashboard.html?user=${uid}`;
      })
      .catch((error) => {
        // let errorCode = error.code;
        let errorMessage = error.message;
        // console.log(errorCode);
        // console.log(errorMessage);
        errorSignUpHTML.style.display = "block";
        errorSignUpHTML.innerHTML = `${errorMessage}`;
        setTimeout(() => {
          errorSignUpHTML.style.display = "none";
        }, 3000);
      });
  }
};

signupFormBtnHTML.addEventListener("click", submitSignupForm);

const signinFormHTML = document.querySelector("#signinForm");
const signinFormBtnHTML = document.querySelector("#signinFormBtn");

const submitSigninForm = (e) => {
  e.preventDefault();
  const email = signinFormHTML["email"].value;
  const password = signinFormHTML["password"].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(async(user) => {
      successSignInHTML.getElementsByClassName.display = "block";
      successSignInHTML.innerHTML = `LoggedIn Successfully`;
      setTimeout(() => {
        successSignInHTML.style.display = "none";
      }, 3000);
      await db.collection('customers').doc(user.user.uid).get().then(uDoc => {
        let uData = uDoc.data();
        if(uData.isAdmin) {
          window.location.href = `./admin/admin.html?admin=${user.user.uid}`;
        } else {
          window.location.href = `./dashboard/dashboard.html?user=${user.user.uid}`;
        }
      })
      // console.log(user);
      // console.log(user.user.uid);
      // console.log('userSigniN');
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      // console.log(errorCode);
      // console.log(errorMessage);
      errorSignInHTML.style.display = "block";
      errorSignInHTML.innerHTML = `${errorMessage}`;
      setTimeout(() => {
        errorSignInHTML.style.display = "none";
      }, 3000);
    });
};

signinFormBtnHTML.addEventListener("click", submitSigninForm);
