const sendEmail = (event) => {
  event.preventDefault();

  const name = document.getElementById("your-name").value;
  const message = document.getElementById("contact-msg").value;

  Email.send({
    Host: "smtp.gmail.com",
    Username: "tochecontact@gmail.com",
    Password: "ddvunfjvmhpkjqxn",
    To: "play@toche.com",
    From: "tochecontact@gmail.com",
    Subject: `Contact from Toche User: ${name}`,
    Body: message,
  }).then(function () {
    Toastify({
      text: "Email send successfully",
      style: { background: "#2ecc71" },
    }).showToast();
  });
};

window.onload = () => {
  document.getElementById("contact-form").addEventListener("submit", sendEmail);
};
