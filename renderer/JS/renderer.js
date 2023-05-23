const form = document.getElementById("form_notes");

if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const sentence = formData.get("sentence");

    console.log(sentence);

    try {
      const response = await window.axios.openAI(sentence);
      const summary = response.choices[0].text.trim();
      document.getElementById("summarize").innerHTML = summary;
    } catch (error) {
      console.log(error);
    }
  };
}
