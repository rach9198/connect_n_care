const USER = {};

const navHTML = document.querySelector("#nav");
let signoutBtnHTML, creditsHTML;

auth.onAuthStateChanged(async(user) => {
  if (user) {
    let uid = user.uid;
    console.log(uid);
    await db.collection("customers").doc(uid)
      .get()
      .then((userDoc) => {
        let userData = userDoc.data();
        console.log(userData);
        USER.id = uid;
        USER.details = userData;
      });
      creditsHTML = document.querySelector('#credits');
      console.log(creditsHTML);
      await displayNavBtn();
      signoutBtnHTML = document.querySelector("#signout-button");
      signoutBtnHTML.addEventListener("click", signoutUser);
  } else {
    window.location.href = `../index.html`;
  }
});

const displayNavBtn = () => {
  console.log(USER);
  navHTML.innerHTML = `
  <div class="title-contents">
    <img src="../assets/img/healthLogo.png" />
    <div class="title-logo">
      <h1 id="main-title">Connect n Care</h1>
    </div>
  </div>
  <div class="login-buttons">
  <button
        id="dashboard-button"
      >
        Hey ${USER.details.name}
      </button>
    <button
      id="signout-button"
    >
      SIGNOUT
    </button>
  </div>
  `;

  creditsHTML.innerHTML  = `
  <i class="fas fa-coins"></i>${USER.details.credits}
  `;
};
