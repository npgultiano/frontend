const form = document.getElementById("form_notes");

if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    let notes = formData.get("notes");
    if (notes.length <= 5) {
      alertMessage("error", "Please input at least 5 characters!");

      return;
    }

    try {
      const response = await window.axios.openAI(notes);
      document.getElementById("summarize").innerText = response.choices[0].text;
    } catch (error) {
      console.error(error);
      alertMessage("error", "An error occurred while processing the request.");
    }
  };
}

function alertMessage(status, sentence) {
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    stopOnFocus: true,
    style: {
      textAlign: "center",
      background: "grey",
      color: "white",
      padding: "5px",
      marginTop: "2px",
    },
  });
}
