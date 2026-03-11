// -------------------------------
// 1️⃣ Supabase Verbindung
// -------------------------------
const supabaseUrl = "https://uvcrjnjnsmbppmupaelb.supabase.co";
const supabaseKey = "sb_publishable_0MMa0Z5JQhbTkzE2q2ngcA_nlPoO5A4";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// -------------------------------
// 2️⃣ Login Funktion
// -------------------------------
async function login(){
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', user)
        .eq('password', pass);

    if(error){
        document.getElementById("loginstatus").innerText = "Fehler beim Login";
        return;
    }

    if(data.length > 0){
        localStorage.setItem("currentUser", JSON.stringify(data[0]));
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("loginstatus").innerText = "Falsche Login Daten!";
    }
}

// -------------------------------
// 3️⃣ Dashboard Buttons anzeigen nach Rolle
// -------------------------------
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(!currentUser) return;

    if(currentUser.role === "Owner"){
        document.getElementById("owner-buttons").style.display = "block";
    }
}

// -------------------------------
// 4️⃣ Schicht starten / stoppen
// -------------------------------
let currentShiftId = null;

async function startShift(){
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const { data, error } = await supabase
        .from('shifts')
        .insert([{ user_id: user.id, start_time: new Date() }])
        .select();

    if(error){ alert("Fehler beim Starten"); return; }

    currentShiftId = data[0].id;
    alert("Schicht gestartet!");

    // Stoppen nach Start
    if(confirm("Schicht stoppen?")){
        stopShift();
    }
}

async function stopShift(){
    const task = prompt("Was hast du gemacht? (Pflichtfeld)");
    if(!task) { alert("Pflichtfeld muss ausgefüllt werden"); return; }

    await supabase
        .from('shifts')
        .update({ end_time: new Date(), task: task })
        .eq('id', currentShiftId);

    alert("Schicht beendet!");
}

// -------------------------------
// 5️⃣ Owner Funktionen
// -------------------------------
async function createUser(){
    const username = prompt("Neuen Benutzername eingeben:");
    const password = prompt("Passwort eingeben:");
    const role = prompt("Rolle auswählen: Owner, Manager, Admin, Teammitglied, Gast, Assistent");

    if(!username || !password || !role) { alert("Ungültige Eingaben!"); return; }

    await supabase.from('users').insert([{ username, password, role }]);
    alert("Benutzer erstellt!");
}

async function deleteUser(){
    const username = prompt("Benutzername zum Löschen eingeben:");
    if(!username) return;

    await supabase.from('users').delete().eq('username', username);
    alert("Benutzer gelöscht!");
}

async function trackUser(){
    const username = prompt("Benutzername zum Tracken eingeben:");
    if(!username) return;

    const { data: userData } = await supabase.from('users').select('*').eq('username', username);
    if(userData.length === 0) { alert("Benutzer nicht gefunden"); return; }

    const userId = userData[0].id;
    const { data: shifts } = await supabase.from('shifts').select('*').eq('user_id', userId);

    let msg = "Schichten von "+username+":\n";
    shifts.forEach(s => {
        msg += `Start: ${s.start_time}, Ende: ${s.end_time}, Aufgabe: ${s.task}\n`;
    });

    alert(msg);
}