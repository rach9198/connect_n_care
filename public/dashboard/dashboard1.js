let USER_REF;
const USER = {};

const navHTML = document.querySelector("#nav");
const messageHTML = document.querySelector("#message");
const messageSuccessHTML = document.querySelector("#messageSuccess");
const messageErrorHTML = document.querySelector("#messageError");
const consultationsHTML = document.querySelector("#consultations");
const userUpdateFormHTML = document.querySelector("#userUpdateForm");
const memberUpdateFormHTML = document.querySelector("#memberUpdateForm");
const userUpdateMsgSuccessHTML = document.querySelector('#userUpdateMsgSuccess');
const userUpdateMsgErrorHTML = document.querySelector('#userUpdateMsgError');
const memberUpdateMsgSuccessHTML = document.querySelector('#memberUpdateMsgSuccess');
const memberUpdateMsgErrorHTML = document.querySelector('#memberUpdateMsgError');
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

const updateData = async(uid) => {
  USER_REF = await db.collection("customers").doc(uid);
    await USER_REF.get().then((userDoc) => {
      let userData = userDoc.data();
      // console.log(userData);
      USER.id = uid;
      USER.details = userData;
    });
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    let uid = user.uid;
    // console.log(uid);
    await updateData(uid);
    creditsHTML = document.querySelector("#credits");
    // console.log(creditsHTML);
    await displayNavBtn();
    if(USER.details.userInfo) {
      displayUserInfo();
    } 
    if(USER.details.familyMemberInfo) {
      displayFamilyMemberInfo();
    }
    signoutBtnHTML = document.querySelector("#signout-button");
    signoutBtnHTML.addEventListener("click", signoutUser);
    displayServices();
  } else {
    window.location.href = `../index.html`;
  }
});

const displayUserInfo = () => {
  userUpdateFormHTML['username'].value = USER.details.userInfo.username;
  userUpdateFormHTML['address'].value = USER.details.userInfo.address;
  userUpdateFormHTML['landmark'].value = USER.details.userInfo.landmark;
  userUpdateFormHTML['city'].value = USER.details.userInfo.city;
  userUpdateFormHTML['state'].value = USER.details.userInfo.state;
  userUpdateFormHTML['phone'].value = USER.details.userInfo.phone;
  userUpdateFormHTML['dob'].value = USER.details.userInfo.dob;
}

const displayFamilyMemberInfo = () => {
  memberUpdateFormHTML['name'].value = USER.details.familyMemberInfo.name;
  memberUpdateFormHTML['realtion'].value = USER.details.familyMemberInfo.realtion;
  memberUpdateFormHTML['email'].value = USER.details.familyMemberInfo.email;
  memberUpdateFormHTML['address'].value = USER.details.familyMemberInfo.address;
  memberUpdateFormHTML['city'].value = USER.details.familyMemberInfo.city;
  memberUpdateFormHTML['state'].value = USER.details.familyMemberInfo.state;
  memberUpdateFormHTML['phone'].value = USER.details.familyMemberInfo.phone;
}

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

  creditsHTML.innerHTML = `
  <i class="fas fa-coins"></i>${USER.details.credits}
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
      if (USER.details.familyMemberInfo) {
        USER.details.credits = USER.details.credits - sInfo.price;
        creditsHTML.innerHTML = `<i class="fas fa-coins"></i>${USER.details.credits}`;
        USER_REF.update('credits', USER.details.credits);
        messageHTML.style.display = "block";
        messageSuccessHTML.innerHTML = `😍Your ${sInfo.name} is booked 😇`;
        setTimeout(() => {
          messageSuccessHTML.innerHTML = '';
          messageHTML.style.display = "none";
        }, 3000);
      } else {
        messageHTML.style.display = "block";
        messageErrorHTML.innerHTML = `😶Last one more step please🤐 <br> 🙄Please update your family member info, incase of any emergency. 🧐`;
        setTimeout(() => {
          messageErrorHTML.innerHTML = '';
          messageHTML.style.display = "none";
        }, 3000);
      }
    } else {
      messageHTML.style.display = "block";
      messageErrorHTML.innerHTML = `🙇🏻‍♂️Sorry!!!🙇🏻‍♀️ <br> 😃 Please update your info so that we can reach you asap. 😁`;
      setTimeout(() => {
        messageErrorHTML.innerHTML = '';
        messageHTML.style.display = "none";
      }, 3000);
    }
  } else {
    messageHTML.style.display = "block";
    messageErrorHTML.innerHTML = `Opps!!! <br> You dont have enough credits to book a service 💰<i class="fas fa-coins">`;
    setTimeout(() => {
      messageErrorHTML.innerHTML = '';
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
    dob: dob 
  }
  USER_REF.update(USER.details).then(() => {
    userUpdateMsgSuccessHTML.style.display = 'block';
    userUpdateMsgSuccessHTML.innerHTML = `Your Info Updated Successfully!! 🎉`;
    setTimeout(async() => {
      userUpdateMsgSuccessHTML.style.display = 'none';
      await updateData(USER.id);
      console.log(USER);
      $('#personal-modal').modal('hide');
    }, 1000);
  }).catch(error => {
    userUpdateMsgErrorHTML.style.display = 'block';
    userUpdateMsgErrorHTML.innerHTML = `Try Aagin <br> ${error.message} 😥`;
    setTimeout(() => {
      userUpdateMsgErrorHTML.style.display = 'none';
    }, 2500);
  })
};

userUpdateFormHTML.addEventListener("submit", userUpdateFormSubmit);

const memberUpdateFormSubmit = e => {
  e.preventDefault();
  const name = memberUpdateFormHTML['name'].value;
  const realtion = memberUpdateFormHTML['realtion'].value;
  const email = memberUpdateFormHTML['email'].value;
  const address = memberUpdateFormHTML['address'].value;
  const city = memberUpdateFormHTML['city'].value;
  const state = memberUpdateFormHTML['state'].value;
  const phone = memberUpdateFormHTML['phone'].value;

  USER.details.familyMemberInfo = {
    name: name,
    realtion: realtion,
    email: email,
    address: address,
    city: city,
    state: state,
    phone: phone
  }

  USER_REF.update(USER.details).then(() => {
    memberUpdateMsgSuccessHTML.style.display = 'block';
    memberUpdateMsgSuccessHTML.innerHTML = `Member Info Updated Successfully!! 🎉`;
    setTimeout(async() => {
      memberUpdateMsgSuccessHTML.style.display = 'none';
      await updateData(USER.id);
      console.log(USER);
      $('#member-modal').modal('hide');
    }, 1000);
  }).catch(error => {
    memberUpdateMsgErrorHTML.style.display = 'block';
    memberUpdateMsgErrorHTML.innerHTML = `Try Aagin <br> ${error.message} 😥`;
    setTimeout(() => {
      memberUpdateMsgErrorHTML.style.display = 'none';
    }, 2500);
  })
}

memberUpdateFormHTML.addEventListener('submit', memberUpdateFormSubmit)
