
function navigate(input, record = true) {
  const value = input.trim();
  if (!value) return;

  // Detect a URL versus a search phrase.
  const isURL =
    /^https?:\/\//i.test(value) ||
    (/^[\w-]+(\.[\w-]+)+(\/.*)?$/i.test(value));

  let url;

  if (isURL) {
    url = /^https?:\/\//i.test(value)
      ? value
      : "https://" + value;
  } else {
    // Use a regular search URL, not an iframe.
    url = "https://www.google.com/search?q=" +
      encodeURIComponent(value);
  }

  if (record) {
    const tab = current();
    tab.history = tab.history.slice(0, tab.pos + 1);
    tab.history.push(url);
    tab.pos = tab.history.length - 1;
  }

  current().url = url;
  current().title = isURL ? safeTitle(url) : "Search results";
  renderTabs();

  // Open in the normal browser, not the embedded viewer.
  const opened = window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

  $("notice").textContent = opened
    ? "Opened in a new browser tab."
    : "Pop-up blocked. Allow pop-ups or use the link below.";

  showExternalLink(url);
}

function showExternalLink(url) {
  $("home").style.display = "block";
  $("frame").style.display = "none";

  let link = document.getElementById("openExternal");
  if (!link) {
    link = document.createElement("p");
    link.id = "openExternal";
    link.style.textAlign = "center";
    $("notice").after(link);
  }

  link.replaceChildren();

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = "Click here to open your page";
  a.style.color = "#5794ff";

  link.appendChild(a);
}
