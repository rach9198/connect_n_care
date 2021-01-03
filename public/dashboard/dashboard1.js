let USER_REF;
const USER = {};

const navHTML = document.querySelector("#nav");
const messageHTML = document.querySelector("#message");
const messageSuccessHTML = document.querySelector("#messageSuccess");
const messageErrorHTML = document.querySelector("#messageError");
const consultationsHTML = document.querySelector("#consultations");
const userUpdateFormHTML = document.querySelector("#userUpdateForm");
const memberUpdateFormHTML = document.querySelector("#memberUpdateForm");
const userUpdateMsgSuccessHTML = document.querySelector(
  "#userUpdateMsgSuccess"
);
const userUpdateMsgErrorHTML = document.querySelector("#userUpdateMsgError");
const memberUpdateMsgSuccessHTML = document.querySelector(
  "#memberUpdateMsgSuccess"
);
const memberUpdateMsgErrorHTML = document.querySelector(
  "#memberUpdateMsgError"
);
let signoutBtnHTML, creditsHTML;

const services = [
  {
    id: "1",
    price: 300,
    name: "Doctor 🩺",
    description: "Communicate with your doctor",
    img: "doctor.png",
  },
  {
    id: "2",
    price: 200,
    name: "Dentist 🦷",
    description: "Your smile is our passion",
    img: "dentist.png",
  },
  {
    id: "3",
    price: 100,
    name: "Yoga 🧘🏻‍♀️",
    description: "Bring out your flexibility",
    img: "yoga.png",
  },
  {
    id: "4",
    price: 800,
    name: "Nurse 👩🏻‍⚕️",
    description: "Nursing is the gentle art of caring",
    img: "nurse.png",
  },
  {
    id: "5",
    price: 700,
    name: "Nutritionist 🍽",
    description: "Step Up To the Plate and Change Your Life",
    img: "nutrition.png",
  },
  {
    id: "6",
    price: 500,
    name: "Mental Health 🧠",
    description: "When you take therapies, you heal from within",
    img: "mentalHealth.png",
  },
  {
    id: "7",
    price: 400,
    name: "Blood Test 🩸",
    description: "Your blood is replaceable. A life is not!",
    img: "bloodtest.png",
  },
  {
    id: "8",
    price: 300,
    name: "Medicines 💊",
    description: "Don’t you fuss – get meds from us.",
    img: "medicine.png",
  },
];

const updateData = async (uid) => {
  USER_REF = await db.collection("customers").doc(uid);
  await USER_REF.get().then((userDoc) => {
    let userData = userDoc.data();
    // console.log(userData);
    USER.id = uid;
    USER.details = userData;
  });
};

auth.onAuthStateChanged(async (user) => {
  if (user) {
    let uid = user.uid;
    // console.log(uid);
    await updateData(uid);
    creditsHTML = document.querySelector("#credits");
    // console.log(creditsHTML);
    await displayNavBtn();
    if (USER.details.userInfo) {
      displayUserInfo();
    }
    displayfamilyMembersInfo();

    signoutBtnHTML = document.querySelector("#signout-button");
    signoutBtnHTML.addEventListener("click", signoutUser);
    displayServices();
  } else {
    window.location.href = `../index.html`;
  }
});

const displayUserInfo = () => {
  userUpdateFormHTML["username"].value = USER.details.userInfo.username;
  userUpdateFormHTML["address"].value = USER.details.userInfo.address;
  userUpdateFormHTML["landmark"].value = USER.details.userInfo.landmark;
  userUpdateFormHTML["city"].value = USER.details.userInfo.city;
  userUpdateFormHTML["state"].value = USER.details.userInfo.state;
  userUpdateFormHTML["phone"].value = USER.details.userInfo.phone;
  userUpdateFormHTML["dob"].value = USER.details.userInfo.dob;
};


const allFamilyMemebersHTML = document.querySelector('#allFamilyMemebers');

const displayfamilyMembersInfo = () => {
  let eachTable = '';
  if ((USER.details.familyMembersInfo)) {
    USER.details.familyMembersInfo.map((fam, index) => {
      eachTable += `
      <div class="panel-heading" role="tab" id="heading${fam.name}">
        <h4 class="panel-title">
          <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse${fam.name}" aria-expanded="true" aria-controls="collapse${fam.name}">
            #${index +1} ${fam.name}
          </a>
        </h4>
      </div>
      <div id="collapse${fam.name}" class="panel-collapse collapse ${index === 0 ? 'in' : ''}" role="tabpanel" aria-labelledby="heading${fam.name}">
        <div class="panel-body">
          <table class="table table-hover">
            <tbody>
              <tr style="color: aliceblue; background-color: red;">
                <th>Name</th>
                <td>${fam.name}</td>
              </tr>
              <tr style="color: aliceblue; background-color: orange;">
                <th>Relation</th>
                <td>${fam.realtion}</td>
              </tr>
              <tr style="color: aliceblue; background-color: black;">
                <th>Email</th>
                <td>${fam.email}</td>
              </tr>
              <tr style="color: aliceblue; background-color: green;">
                <th>Address</th>
                <td>${fam.address}</td>
              </tr>
              <tr style="color: aliceblue; background-color: blue;">
                <th>City</th>
                <td>${fam.city}</td>
              </tr>
              <tr style="color: aliceblue; background-color: indigo;">
                <th>State</th>
                <td>${fam.state}</td>
              </tr>
              <tr style="color: aliceblue; background-color: violet;">
                <th>Phone No.</th>
                <td>${fam.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      `;
    });
    allFamilyMemebersHTML.innerHTML = eachTable;
  } else {
    allFamilyMemebersHTML.innerHTML = `<b style="color: red; font-size: larger;">😑 Please Add Your Family Members 😥</b>`;
  }
};

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
      👋🏻 ${USER.details.name}
    </button>
    <button id="signout-button">
      SIGNOUT
    </button>
  </div>
  `;

  creditsHTML.innerHTML = `
  <i class="fas fa-coins"></i>${USER.details.credits} <button id="buyCreditsBtn"  data-toggle="modal" data-target="#credits-modal">Buy Credits</button>
  `;
};

const displayServices = () => {
  let serviceDiv = "";
  services.map((service) => {
    // console.log(service);
    serviceDiv += `
    <div class="consultation">
      <img src="../assets/img/${service.img}" alt="${service.name}" />
      <div class="consult-content">
        <h2>${service.name}</h2>
        <p>${service.description}</p>
        <p id="amount">${service.price}</p>
      </div>
      <input type="button" onclick="bookService(event, this, ${service.id})" value="Book" />
    </div>
    `;
  });
  consultationsHTML.innerHTML = serviceDiv;
};

const bookService = (e, current, sid) => {
  let sInfo = services[+sid - 1];
  if (sInfo.price <= USER.details.credits) {
    if (USER.details.userInfo) {
      if (USER.details.familyMembersInfo) {
        USER.details.credits = USER.details.credits - sInfo.price;
        creditsHTML.innerHTML = `<i class="fas fa-coins"></i>${USER.details.credits}  <button id="buyCreditsBtn"  data-toggle="modal" data-target="#credits-modal">Buy Credits</button>`;
        USER_REF.update("credits", USER.details.credits);
        messageHTML.style.display = "block";
        messageSuccessHTML.innerHTML = `😍Your ${sInfo.name} is booked 😇`;
        setTimeout(() => {
          messageSuccessHTML.innerHTML = "";
          messageHTML.style.display = "none";
        }, 3000);
      } else {
        messageHTML.style.display = "block";
        messageErrorHTML.innerHTML = `😶Last one more step please🤐 <br> 🙄Please add atleast one of your family member info, incase of any emergency. 🧐`;
        setTimeout(() => {
          messageErrorHTML.innerHTML = "";
          messageHTML.style.display = "none";
        }, 3000);
      }
    } else {
      messageHTML.style.display = "block";
      messageErrorHTML.innerHTML = `🙇🏻‍♂️Sorry!!!🙇🏻‍♀️ <br> 😃 Please update your info so that we can reach you asap. 😁`;
      setTimeout(() => {
        messageErrorHTML.innerHTML = "";
        messageHTML.style.display = "none";
      }, 3000);
    }
  } else {
    messageHTML.style.display = "block";
    messageErrorHTML.innerHTML = `Opps!!! <br> You dont have enough credits to book a service 💰<i class="fas fa-coins">`;
    setTimeout(() => {
      messageErrorHTML.innerHTML = "";
      messageHTML.style.display = "none";
    }, 3000);
  }
};

const userUpdateFormSubmit = (e) => {
  e.preventDefault();
  const username = userUpdateFormHTML["username"].value;
  const address = userUpdateFormHTML["address"].value;
  const landmark = userUpdateFormHTML["landmark"].value;
  const city = userUpdateFormHTML["city"].value;
  const state = userUpdateFormHTML["state"].value;
  const phone = userUpdateFormHTML["phone"].value;
  const dob = userUpdateFormHTML["dob"].value;

  USER.details.userInfo = {
    username: username,
    address: address,
    landmark: landmark,
    city: city,
    state: state,
    phone: phone,
    dob: dob,
  };
  USER_REF.update(USER.details)
    .then(() => {
      userUpdateMsgSuccessHTML.style.display = "block";
      userUpdateMsgSuccessHTML.innerHTML = `Your Info Updated Successfully!! 🎉`;
      setTimeout(async () => {
        userUpdateMsgSuccessHTML.style.display = "none";
        await updateData(USER.id);
        console.log(USER);
        $("#personal-modal").modal("hide");
      }, 1000);
    })
    .catch((error) => {
      userUpdateMsgErrorHTML.style.display = "block";
      userUpdateMsgErrorHTML.innerHTML = `Try Aagin <br> ${error.message} 😥`;
      setTimeout(() => {
        userUpdateMsgErrorHTML.style.display = "none";
      }, 2500);
    });
};

userUpdateFormHTML.addEventListener("submit", userUpdateFormSubmit);

const memberUpdateFormSubmit = (e) => {
  e.preventDefault();
  const name = memberUpdateFormHTML["name"].value;
  const realtion = memberUpdateFormHTML["realtion"].value;
  const email = memberUpdateFormHTML["email"].value;
  const address = memberUpdateFormHTML["address"].value;
  const city = memberUpdateFormHTML["city"].value;
  const state = memberUpdateFormHTML["state"].value;
  const phone = memberUpdateFormHTML["phone"].value;

  if (!USER.details.familyMembersInfo) {
    USER.details.familyMembersInfo = [];
  }
  USER.details.familyMembersInfo.push({
    name: name,
    realtion: realtion,
    email: email,
    address: address,
    city: city,
    state: state,
    phone: phone,
  });

  USER_REF.update(USER.details)
    .then(() => {
      memberUpdateMsgSuccessHTML.style.display = "block";
      memberUpdateMsgSuccessHTML.innerHTML = `Member Info Updated Successfully!! 🎉`;
      setTimeout(async () => {
        memberUpdateMsgSuccessHTML.style.display = "none";
        await updateData(USER.id);
        displayfamilyMembersInfo();
        // console.log(USER);
        $("#member-modal").modal("hide");
      }, 1000);
    })
    .catch((error) => {
      memberUpdateMsgErrorHTML.style.display = "block";
      memberUpdateMsgErrorHTML.innerHTML = `Try Aagin <br> ${error.message} 😥`;
      setTimeout(() => {
        memberUpdateMsgErrorHTML.style.display = "none";
      }, 2500);
    });
};

memberUpdateFormHTML.addEventListener("submit", memberUpdateFormSubmit);

const creditsFormHTML = document.querySelector("#creditsForm");
const creditsMsgSuccessHTML = document.querySelector("#creditsMsgSuccess");
const creditsMsgErrorHTML = document.querySelector("#creditsMsgError");

const creditsFormSubmit = (e) => {
  console.log("dfghjhgfghj");
  e.preventDefault();
  const paymentMode = creditsFormHTML["paymentMode"].value;
  const amount = creditsFormHTML["amount"].value;
  const transationNum = creditsFormHTML["transationNum"].value;
  const note = creditsFormHTML["note"].value;

  if (!USER.details.boughtCredits) {
    USER.details.boughtCredits = [];
  }
  USER.details.boughtCredits.push({
    paymentMode: paymentMode,
    amount: amount,
    transationNum: transationNum,
    note: note,
    status: false,
    id: Math.random()
  });
  USER_REF.update(USER.details)
    .then(() => {
      creditsMsgSuccessHTML.style.display = "block";
      creditsMsgSuccessHTML.innerHTML = `Paid Successfully!! 🤑 <br> Your transation will be processed soon. 💸💸`;
      setTimeout(async () => {
        creditsMsgSuccessHTML.style.display = "none";
        // await updateData(USER.id);
        // console.log(USER);
        $("#credits-modal").modal("hide");
      }, 2500);
    })
    .catch((error) => {
      creditsMsgErrorHTML.style.display = "block";
      creditsMsgErrorHTML.innerHTML = `Try Aagin <br> ${error.message} 😥`;
      setTimeout(() => {
        creditsMsgErrorHTML.style.display = "none";
      }, 2000);
    });
};

creditsFormHTML.addEventListener("submit", creditsFormSubmit);
