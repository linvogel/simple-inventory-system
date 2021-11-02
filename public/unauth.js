function registerCheck() {
	let uname = document.getElementById('username').value;
	let p1 = document.getElementById('password').value;
	let p2 = document.getElementById('password_confirm').value;
	
	let b0 = document.getElementById("username_warning").hidden = uname.length >= 3 && uname.length <= 32;
	let b1 = document.getElementById("password_warning").hidden = p1.length >= 8 && p1.length <= 32;
	let b2 = document.getElementById("unequal").hidden = p1 === p2;
	
	document.getElementById("register").disabled = !(b0 && b1 && b2)
}