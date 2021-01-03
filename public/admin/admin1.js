let USER_REF;
const USER = {};
const CREDITS = [];

const navHTML = document.querySelector("#nav");
const messageHTML = document.querySelector("#message");
const messageSuccessHTML = document.querySelector("#messageSuccess");
const messageErrorHTML = document.querySelector("#messageError");
const creditsCardsHTML = document.querySelector("#creditsCards");
let signoutBtnHTML, creditsHTML;

const adminData = async (uid) => {
  USER_REF = await db.collection("customers").doc(uid);
  await USER_REF.get().then((userDoc) => {
    let userData = userDoc.data();
    // console.log(userData);
    USER.id = uid;
    USER.details = userData;
  });
};

const allCreditsBuy = () => {
  db.collection("customers")
    .get()
    .then((snaps) => {
      let snapDocs = snaps.docs;
      for (let doc of snapDocs) {
        let data = doc.data();
        if (data.boughtCredits) {
          data.boughtCredits.map((bc) => {
            CREDITS.push({
              bcDetils: bc,
              id: doc.id,
              credits: data.credits,
              name: data.name,
            });
          });
        }
      }
    });
};

auth.onAuthStateChanged(async (user) => {
  if (user) {
    let uid = user.uid;
    // console.log(uid);
    await allCreditsBuy();
    await adminData(uid);
    await displayNavBtn();
    displayAllCreditsBuy();
    signoutBtnHTML = document.querySelector("#signout-button");
    signoutBtnHTML.addEventListener("click", signoutUser);
  } else {
    window.location.href = `../index.html`;
  }
});

const displayNavBtn = () => {
  // console.log(USER);
  navHTML.innerHTML = `
  <div class="title-contents">
    <img src="../assets/img/healthLogo.png" />
    <div class="title-logo">
      <h1 id="main-title">Connect n Care</h1>
    </div>
  </div>
  <div class="login-buttons">
    <button id="dashboard-button">
      ${USER.details.name}😎 
    </button>
    <button id="signout-button">
      SIGNOUT
    </button>
  </div>
  `;
};

// const consultationsHTML = document.querySelector('#consultations');

const displayAllCreditsBuy = () => {
  let creditBuyRow = "";
  CREDITS.map((c, index) => {
    console.log(c);

    let transationStatus = '';
    if(c.bcDetils.status === false) {
      transationStatus = `
      <button onclick="authorizePayment(event, this, ${index})" class="btn btn-success">Authorize</button>
      <button onclick="blockPayment(event, this, ${index})" class="btn btn-warning">Block</button>
      `;
    } else if(c.bcDetils.status === 'authorized') {
      transationStatus = `
      <button class="btn btn-success" disabled >Payment Authorized</button>
      `;
    } else if(c.bcDetils.status === 'blocked') {
      transationStatus = `
      <button class="btn btn-warning" disabled>Payment Blockd</button>
      `;
    } else {
      transationStatus = ``;
    }

    creditBuyRow += `
    <div class="card">
      <div class="img-user-holder">
        <img
          class="card-img-top img-user"
          src="./../assets/img/user1.jpg"
          alt="Card image cap"
        />
      </div>
      <div class="card-body">
        <h4 class="card-title" style="color: gold; text-align: center">
          <i class="fas fa-coins"></i> ${c.bcDetils.amount}
        </h4>
        <p class="card-text" style="color: whitesmoke">
          <b>Payment Mode</b>: ${c.bcDetils.paymentMode} <br />
          <b>Transation Number</b>: ${c.bcDetils.transationNum} <br />
          <b>User Name</b>: ${c.name}<br />
          <b>Note</b>: ${c.bcDetils.note}<br />
        </p>
        <div style="text-align: center;">
          ${transationStatus}
        </div>
      </div>
    </div>
    `;
  });
  creditsCardsHTML.innerHTML = creditBuyRow;
};

const authorizePayment = async(e, current, index) => {
  console.log('authorizePayment');
  let updateRef = await db.collection('customers').doc(CREDITS[index].id);
  await updateRef.get().then(doc => {
    let data = doc.data();
    data.credits = +data.credits + +CREDITS[index].bcDetils.amount;
    data.boughtCredits.map(ubc => {
      if(ubc.id === CREDITS[index].bcDetils.id) {
        ubc.status = 'authorized';
        CREDITS[index].bcDetils.status = 'authorized';
      }
    })
    updateRef.update(data).then(() => {
      messageSuccessHTML.style.display = 'block';
      messageSuccessHTML.innerHTML = `Payment got Authorized 🔥`;
      setTimeout(() => {
        messageSuccessHTML.style.display = 'none';
      }, 3000);
      displayAllCreditsBuy();
    })
  })
}

const blockPayment = async(e, current, index) => {
  let updateRef = await db.collection('customers').doc(CREDITS[index].id);
  await updateRef.get().then(doc => {
    let data = doc.data();
    data.boughtCredits.map(ubc => {
      if(ubc.id === CREDITS[index].bcDetils.id) {
        ubc.status = 'blocked';
        CREDITS[index].bcDetils.status = 'blocked';
      }
    })
    updateRef.update(data).then(() => {
      messageErrorHTML.style.display = 'block';
      messageErrorHTML.innerHTML = `Payment Blocked ❌`;
      setTimeout(() => {
        messageErrorHTML.style.display = 'none';
      }, 3000);
      displayAllCreditsBuy();
    })
  })
}