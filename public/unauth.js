	
const reg_username = /^[0-9a-zA-Z]{3,32}$/;
const reg_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\.\,\-\_\?\!\+\/\&])[a-zA-Z0-9\.\,\-\_\?\!\+\/\&]{8,32}$/;

function registerCheck() {
	let uname = document.getElementById('username').value;
	let p1 = document.getElementById('password').value;
	let p2 = document.getElementById('password_confirm').value;
	
	let b0 = document.getElementById("username_warning").hidden = reg_username.test(uname);
	let b1 = document.getElementById("password_warning").hidden = reg_password.test(p1);
	let b2 = document.getElementById("unequal").hidden = p1 === p2;
	
	document.getElementById("register").disabled = !(b0 && b1 && b2)
}