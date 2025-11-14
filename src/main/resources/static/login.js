const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const pw = document.getElementById('password');
const toggle = document.querySelector('.pw-toggle');
const status = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const strengthBar = document.getElementById('strengthBar');

// Password toggle
toggle.addEventListener('click', () => {
	const isHidden = pw.type === 'password';
	pw.type = isHidden ? 'text' : 'password';
	toggle.setAttribute('aria-pressed', String(isHidden));
	toggle.title = isHidden ? 'Hide password' : 'Show password';
});

// Simple strength estimator (original and lightweight)
function estimateStrength(s) {
	let score = 0;
	if (s.length >= 8) score += 1;
	if (s.length >= 12) score += 1;
	if (/[a-z]/.test(s) && /[A-Z]/.test(s)) score += 1;
	if (/[0-9]/.test(s)) score += 1;
	if (/[^A-Za-z0-9]/.test(s)) score += 1;
	// score: 0..5
	return Math.min(score, 5);
}

function renderStrength() {
	const s = pw.value || '';
	const score = estimateStrength(s);
	const pct = (score / 5) * 100;
	strengthBar.style.width = pct + '%';
	let color;
	if (pct <= 20) color = 'linear-gradient(90deg,#ff6b6b,#ff9a9a)';
	else if (pct <= 40) color = 'linear-gradient(90deg,#f59e0b,#fbbf24)';
	else if (pct <= 70) color = 'linear-gradient(90deg,#60a5fa,#34d399)';
	else color = 'linear-gradient(90deg,#34d399,#6ee7b7)';
	strengthBar.style.background = color;
}

pw.addEventListener('input', renderStrength);
window.addEventListener('load', renderStrength);

// Client-side validation + prevent insecure form submissions
form.addEventListener('submit', function(ev) {
	ev.preventDefault();
	status.style.display = 'none';
	status.textContent = '';
	submitBtn.disabled = true;
	submitBtn.textContent = 'Checking...';

	// Basic checks
	if (!username.value || !pw.value) {
		showStatus('Please fill in both username and password.');
		return;
	}
	if (pw.value.length < 8) {
		showStatus('Password must be at least 8 characters.');
		return;
	}

	// Example: check that form is served over HTTPS (UX hint)
	if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
		showStatus('Warning: connection is not secure. Use HTTPS in production.');
		// continue — not blocking, only warning
	}

	// Prepare data to send — note: implement server-side handling!
	const payload = {
		username: username.value.trim(),
		password: pw.value
	};

	// This example demonstrates how you might POST; it does not finalize auth here.
	// Replace '/api/login' with your secure server endpoint.
	fetch('/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include', // include cookies for same-site sessions
		body: JSON.stringify(payload)
	})
		.then(async res => {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Sign in';
			if (!res.ok) {
				// display server-provided error if available
				let text = await res.text().catch(() => res.statusText);
				try {
					const json = JSON.parse(text);
					showStatus(json?.error || json?.message || res.statusText);
				} catch (e) {
					showStatus(text || res.statusText || 'Login failed');
				}
				return;
			}
			// on success, the server should redirect or return a JSON token/session
			// For UX demo we'll redirect to /dashboard if server returns success
			try {
				const data = await res.json();
				// if server returns {redirect: "/dashboard"} use it
				if (data?.redirect) {
					window.location.href = data.redirect;
				} else {
					// fallback
					window.location.href = '/';
				}
			} catch (e) {
				window.location.href = '/';
			}
		})
		.catch(err => {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Sign in';
			showStatus('Network error. Try again.');
			console.error(err);
		});
});

function showStatus(msg) {
	status.style.display = 'block';
	status.textContent = msg;
	submitBtn.disabled = false;
	submitBtn.textContent = 'Sign in';
}