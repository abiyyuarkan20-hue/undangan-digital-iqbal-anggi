function increment() {
  document.getElementById("count").innerText++;

  if (document.getElementById("count").innerText == 7) {
    const hiddenMessage = document.createElement("h4");
    hiddenMessage.innerText = "selamat anda mendapatkan kejutan terbaru";

    const image = document.createElement("img");
    image.setAttribute("src", "Bahlil.jpg");

    const content = document.querySelector(".contents");
    content.classList.add("content-new");
    content.appendChild(hiddenMessage);
    content.appendChild(image);
  }
}

function welcome() {
  alert("Selamat, Kamu Berhasil Memasuki Web Ini");

  const content = document.querySelector(".contents");
  content.removeAttribute("hidden");
}

document.getElementById("incrementButton").onclick = increment;
document.body.onload = welcome;
