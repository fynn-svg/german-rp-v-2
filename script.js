// Bewerben Button
function bewerben(){
  window.location.href="https://teams.galaxybot.app/application/1475499329723826198";
}

// Zur Webseite Button
function zurWebseite(){
  alert("Webseite wird bald verfügbar sein!");
}

// Login Funktion (Test)
function login(){
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  // Test-Benutzer: Owner / 1234
  if(user === "Owner" && pass === "1234"){
    document.getElementById("loginstatus").innerText = "Login erfolgreich!";
  } else {
    document.getElementById("loginstatus").innerText = "Falsche Login Daten!";
  }
}