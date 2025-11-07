export const showLoader = () => {
  const elem = document.querySelector(".loader-overlay");
  if (!elem) return;
  elem.style.display = "flex";
};

export const hideLoader = () => {
  const elem = document.querySelector(".loader-overlay");
  if (!elem) return;
  elem.style.display = "none";
};

export const showPage = () => {
  const elem = document.querySelector(".sd-row");
  if (!elem) return;
  elem.classList.remove("hidden");
  elem.classList.add("visible");
};

export const hidePage = () => {
  const elem = document.querySelector(".sd-row");
  if (!elem) return;
  elem.classList.add("hidden");
  elem.classList.remove("visible");
};

export const showBody = () => {
  const elem = document.querySelector(".sd-body");
  if (!elem) return;
  elem.style.animation = "fadeIn 1.5s ease-in-out forwards";
};

export const hideBody = () => {
  const elem = document.querySelector(".sd-body");
  if (!elem) return;
  elem.style.animation = "fadeOut 1.5s ease-in-out forwards";
};