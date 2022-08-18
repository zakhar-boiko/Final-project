window.onload = websiteLoaded;
function websiteLoaded() {
  trackActivity(); // Трекає, чи користувач взаємодіє із сторінкою
  getData(); //Витягую картки із json файлу та відображаю їх на сторінці
  // Перевірка часу та увімкнення темної теми за потреби
  if (new Date().getHours() >= 21 || new Date().getHours() <= 6) {
    changeTheme();
    document.querySelector(".header__theme-changer").checked = true;
  }
}

function trackActivity() {
  let timer = setTimeout(() => {
    let isActive = confirm("Ви ще тут?");
    console.log(isActive);
    clearInterval(timer);
    if (!isActive) {
      window.close();
    }
  }, 1000 * 60);
  ["mousemove", "mousedown", "keydown"].forEach((event) =>
    document.addEventListener(event, () => {
      clearInterval(timer);
      timer = setTimeout(() => {
        let isActive = confirm("Ви ще тут?");
        if (!isActive) {
          window.close();
        }
        clearInterval(timer);
      }, 1000 * 60);
    })
  );
}

function changeTheme() {
  document.body.classList.toggle("dark-theme");
}
document
  .querySelector(".header__theme-changer")
  .addEventListener("change", changeTheme);

async function getData() {
  let data = await fetch("../json/data.json")
    .then((response) => response.json())
    .then((data) => data);
  let projects = data.projects;
  let projectsDiv = document.querySelector(".portfolio-section__projects");
  for (let i = 0; i < projects.length; i++) {
    let projectCard = document.createElement("div");
    projectCard.classList.add("portfolio-section__project-card");
    let imageCover = document.createElement("div");
    imageCover.classList.add("portfolio-section__image-cover");
    let image = document.createElement("img");
    image.src = projects[i].preview;
    image.classList.add("portfolio-section__image");
    let projectIcon = document.createElement("span");
    projectIcon.classList.add("portfolio-section__project-icon");
    projectIcon.style.backgroundImage = projects[i].icon;
    let projectCaption = document.createElement("span");
    let projectDescription = document.createElement("div");
    projectDescription.classList.add("portfolio-section__project-description");
    projectDescription.innerHTML =
      "Name: " +
      projects[i].name +
      "<br>" +
      "Date: " +
      projects[i].date +
      "<br>" +
      "Technologies: " +
      projects[i].technologies +
      "<br>" +
      "Price: " +
      projects[i].price +
      "$";
    projectCaption.classList.add("portfolio-section__project-caption");
    imageCover.append(projectDescription);
    projectCaption.innerHTML = projects[i].name;
    imageCover.append(image);
    projectCard.append(imageCover);
    projectCard.append(projectIcon);
    projectCard.append(projectCaption);
    projectsDiv.append(projectCard);
    cards.set(projects[i], projectCard);
  }
  // Підключаю до вже свторених карток події
  connectCardEvent();
  //Відображаю картки за замовчуванням із затримкою, щоб карточки з'явилися в домі, анімація появи карток на сторінці закінчилася
  setTimeout(() => {
    showRecent();
  }, 5000);
}

// Реалізація слайдера
const sliderButtons = document.querySelectorAll("[slider-button]");
sliderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    //Читаю напрямок гортання
    const direction = button.dataset.buttonaction === "forward" ? 1 : -1;
    let slides = document.querySelector(".slider-section__slides");
    let activeSlide = document.querySelector("[data-isactive]");
    // Рахую зміщення щодо поточного слайду
    let newIndex = Array.from(slides.children).indexOf(activeSlide) + direction;
    if (newIndex < 0) {
      newIndex = slides.children.length - 1;
    } else if (newIndex > slides.children.length - 1) {
      newIndex = 0;
    }
    // Роблю активним новий слайд, старий ховаю
    slides.children[newIndex].dataset.isactive = true;
    delete activeSlide.dataset.isactive;
  });
});

// Реалізація прогресбара
const progressbar = document.querySelector(".progressbar__current-progress");
["scroll", "resize"].forEach((trigger) => {
  window.addEventListener(trigger, fillProgress);
});

function fillProgress() {
  let fullHeight = document.body.scrollHeight;
  let viewportHeight = window.innerHeight;
  progressbar.style.width =
    (window.pageYOffset * 100) / (fullHeight - viewportHeight) + "%";
}

// Реалізація фільтрації
//Мап карток, тут зберігаю відповідність картки на сторінці до переданої картки з json файлу
let cards = new Map();
document
  .querySelector(".portfolio-section__filter-list")
  .addEventListener("click", filter);
function filter(event) {
  if (event.target.tagName !== "BUTTON") {
    return;
  }
  // Якщо раніше були вибрані всі фільтри (browse all)
  if (document.querySelectorAll("[data-active]").length > 1) {
    document.querySelectorAll("[data-active]").forEach((element) => {
      delete element.dataset.active;
    });
    showRecent();
    return;
  }
  // Якщо натискаємо на вже активний фільтр, показується список за замовчуванням
  if (event.target.dataset.active) {
    showRecent();
    delete event.target.dataset.active;
    return;
  }
  // Забираю прапор активності в попереднього фільтру
  if (document.querySelector("[data-active]")) {
    delete document.querySelector("[data-active]").dataset.active;
  }
  //додаю прапор активності у вибраний фільтр
  event.target.dataset.active = true;
  switch (event.target.dataset.filter) {
    case "my":
    case "free":
    case "subscription":
    case "logo": {
      cards.forEach((value, key) => {
        if (!key[event.target.dataset.filter]) {
          value.classList.add("animate");
        } else {
          value.classList.remove("animate");
          value.classList.remove("hide");
          value.classList.add("appear");
        }
      });
      break;
    }
    case "recent": {
      showRecent();
      break;
    }
    default: {
      cards.forEach((value, key) => {
        if (key["size"] !== event.target.dataset.filter) {
          value.classList.add("animate");
        } else {
          value.classList.remove("animate");
          value.classList.remove("hide");
          value.classList.add("appear");
        }
      });
      break;
    }
  }
}

document
  .querySelector(".portfolio-section__browse-all")
  .addEventListener("click", showAll);
function showAll() {
  // Якщо browse all вже натиснута, показую список за замовчуванням
  if (document.querySelectorAll("[data-active]").length > 1) {
    document.querySelectorAll("[data-active]").forEach((element) => {
      delete element.dataset.active;
    });
    showRecent();
    return;
  }
  // Показую всі картки
  cards.forEach((value) => {
    value.classList.remove("animate");
    value.classList.remove("hide");
    value.classList.add("appear");
  });
  // Засвічую всі фільтри
  document
    .querySelectorAll(".portfolio-section__filter-item")
    .forEach((element) => {
      element.dataset.active = true;
    });
}

function showRecent() {
  let projects = Array.from(cards.keys());
  projects.sort((first, second) => {
    return new Date(second.date) - new Date(first.date);
  });
  for (let i = 0; i < projects.length; i++) {
    if (i >= 6) {
      cards.get(projects[i]).classList.add("animate");
    } else {
      cards.get(projects[i]).classList.remove("animate");
      cards.get(projects[i]).classList.remove("hide");
      cards.get(projects[i]).classList.add("appear");
    }
  }
  document.querySelector('[data-filter="recent"]').dataset.active = true;
}

function connectCardEvent() {
  cards.forEach((value) => {
    //Коли картка повністю зникла,забираю її з дому, щоб не займала місця
    value.ontransitionend = () => {
      if (value.classList.contains("animate")) {
        value.classList.add("hide");
      }
    };
    //Відображаю детальну інформацію про проект
    value.onmouseover = () => {
      let image = value.children[0].children[1];
      let description = value.children[0].children[0];
      description.style.opacity = 1;
      image.dataset.darker = true;
    };
    //Ховаю детальну інформацію про проект
    value.onmouseout = () => {
      let image = value.children[0].children[1];
      let description = value.children[0].children[0];
      description.style.opacity = 0;
      delete image.dataset.darker;
    };
  });
}

//Трекаю момент попаданняя секції Blog у viewport юзера, після цього з'являються 3 перші пости
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const articles = entry.target.querySelectorAll(".blog-section__article");

    if (entry.isIntersecting) {
      articles.forEach((article) => {
        article.classList.add("article-animation");
      });
      return;
    }
    articles.forEach((article) => {
      article.classList.remove("article-animation");
    });
  });
});
observer.observe(document.querySelector(".blog-section"));

// При натисненні на кнопку Show all перевіряю, чи знвходиться останній пост у в'юпорті, якщо так,
// то підвантажую наступні 3 пости, статус останнього забираю в поточного останнього і додаю його до останнього завантаженого посту.
document
  .querySelector(".blog-section__show-all")
  .addEventListener("click", () => {
    const lastCardObserver = new IntersectionObserver(
      (entries) => {
        const lastCard = entries[0];
        if (!lastCard.isIntersecting) return;
        if (document.querySelectorAll(".blog-section__article").length < 15) {
          loadNewCards();
          lastCardObserver.unobserve(lastCard.target);
          lastCardObserver.observe(
            document.querySelector(".blog-section__article:last-child")
          );
        } else {
          lastCardObserver.unobserve(lastCard.target);
        }
      },
      { threshold: 1 }
    );
    lastCardObserver.observe(
      document.querySelector(".blog-section__article:last-child")
    );
  });

function loadNewCards() {
  for (let i = 0; i < 3; i++) {
    const card = document.createElement("div");
    const cardImage = document.createElement("div");
    const imageCover = document.createElement("div");
    const mainContent = document.createElement("div");
    const cardCaption = document.createElement("h2");
    const cardDetails = document.createElement("span");
    const cardResponses = document.createElement("span");
    const cardText = document.createElement("p");
    cardText.innerHTML =
      "Some pointless text that i was quite lazy to make up.";
    cardText.classList.add("blog-section__text");
    cardResponses.innerHTML = "0 responses";
    cardResponses.classList.add("blog-section__responses");
    cardDetails.innerHTML = "Some card details";
    cardDetails.classList.add("blog-section__article-details");
    cardCaption.innerHTML = "A freshly added card";
    cardCaption.classList.add("blog-section__caption");
    mainContent.classList.add("blog-section__main-content");
    imageCover.classList.add("blog-section__image-cover");
    cardImage.classList.add("blog-section__article-image");
    card.classList.add("blog-section__article");
    card.classList.add(".article-animation");
    cardImage.append(imageCover);
    mainContent.append(cardCaption);
    mainContent.append(cardResponses);
    mainContent.append(cardDetails);
    mainContent.append(cardText);
    card.append(cardImage);
    card.append(mainContent);
    document.querySelector(".blog-section__articles").append(card);
  }
}

//Валідація форми, збереження даних в локалсторедж, висвітлення повідомлення для людини, що бажає зробити замовлення
document
  .querySelector(".contact-section__form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;
    const numbers = /\d+/;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let form = document.querySelector(".contact-section__form");
    let inputs = form.querySelectorAll(".contact-section__input");
    inputs.forEach((input) => {
      delete input.dataset.invalid_input;
    });
    if (
      !/^[a-zA-Z]+$/.test(inputs[0].value) ||
      inputs[0].value[0].toUpperCase() !== inputs[0].value[0]
    ) {
      inputs[0].dataset.invalid_input = true;
      isValid = false;
    }
    if (specialChars.test(inputs[2].value) || numbers.test(inputs[2].value)) {
      inputs[2].dataset.invalid_input = true;
      isValid = false;
    }
    if (isValid) {
      localStorage.setItem("name", inputs[0].value);
      localStorage.setItem("email", inputs[1].value);
      localStorage.setItem("subject", inputs[2].value);
      localStorage.setItem(
        "message",
        document.querySelector(".contact-section__message").value
      );
      if (inputs[2].value.toLowerCase().includes("зробити замовлення")) {
        let congrats = document.createElement("div");
        let button = document.createElement("button");
        button.classList.add("congrats-button");
        button.innerHTML = "Close";
        congrats.innerHTML = `Dear, ${localStorage.getItem(
          "name"
        )},<br> We will contact you as soon as possible!`;
        congrats.classList.add("conratulations-message");
        congrats.append(button);
        button.onclick = () => {
          congrats.classList.add("animate");
        };
        document.querySelector(".contact-section").append(congrats);
      }
      form.reset();
    }
  });
