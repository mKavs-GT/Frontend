document.addEventListener('DOMContentLoaded', () => {
    const userListContainer = document.getElementById('usersList');
    const userDetailsPanel = document.getElementById('userDetailsPanel');
    const emptyState = document.querySelector('.empty-state');
    const detailsContent = document.querySelector('.details-content');
    const searchInput = document.getElementById('userSource');
    const saveBtn = document.getElementById('saveAdminDataBtn');

    // UI Elements for Data Binding
    const els = {
        name: document.getElementById('userName'),
        email: document.getElementById('userEmail'),
        joined: document.getElementById('userJoined'),
        activeProjects: document.getElementById('activeProjects'),
        projectProgress: document.getElementById('projectProgress'),
        progressVal: document.getElementById('progressVal'),
        consultList: document.getElementById('consultationList'),
        favPalettes: document.getElementById('favPalettes'),
        favFonts: document.getElementById('favFonts') // Placeholder
    };

    let users = [];
    let selectedUserEmail = null;

    // Initialize
    loadUsers();
    setInterval(updateClock, 1000);
    updateClock();

    // Event Listeners
    searchInput.addEventListener('input', (e) => filterUsers(e.target.value));
    saveBtn.addEventListener('click', saveAdminChanges);
    els.projectProgress.addEventListener('input', (e) => {
        els.progressVal.textContent = e.target.value;
    });

    async function loadUsers() {
        if (!window.mkavsDataService) {
            console.error('DataService not found!');
            return;
        }

        userListContainer.innerHTML = '<div class="loading">Loading users...</div>';

        users = await window.mkavsDataService.getAllUsers();
        renderUserList(users);
    }

    function renderUserList(list) {
        userListContainer.innerHTML = '';
        if (list.length === 0) {
            userListContainer.innerHTML = '<div class="user-item">No users found</div>';
            return;
        }

        list.forEach(user => {
            const div = document.createElement('div');
            div.className = `user-item ${selectedUserEmail === user.email ? 'active' : ''}`;
            div.onclick = () => selectUser(user.email);
            div.innerHTML = `
                <span class="name">${user.displayName || user.username || 'Unknown'}</span>
                <span class="email">${user.email}</span>
            `;
            userListContainer.appendChild(div);
        });
    }

    function filterUsers(query) {
        const lower = query.toLowerCase();
        const filtered = users.filter(u =>
            u.email.toLowerCase().includes(lower) ||
            (u.displayName && u.displayName.toLowerCase().includes(lower)) ||
            (u.username && u.username.toLowerCase().includes(lower))
        );
        renderUserList(filtered);
    }

    function selectUser(email) {
        selectedUserEmail = email;
        const user = users.find(u => u.email === email);

        if (!user) return;

        // UI Update
        renderUserList(users); // Re-render to update active state

        emptyState.classList.add('hidden');
        detailsContent.classList.remove('hidden');

        // Bind Basic Info
        els.name.textContent = user.displayName || user.username || 'Account Holder';
        els.email.textContent = user.email;
        els.joined.textContent = 'Joined: ' + new Date(user.createdAt).toLocaleDateString();

        // Bind Admin Data
        const adminData = user.adminData || {};
        els.activeProjects.value = adminData.activeProjects || '';
        els.projectProgress.value = adminData.projectProgress || 0;
        els.progressVal.textContent = adminData.projectProgress || 0;

        // Render Consultations
        els.consultList.innerHTML = '';
        if (user.consultations && user.consultations.length > 0) {
            user.consultations.reverse().forEach(c => { // Show newest first
                const item = document.createElement('div');
                item.className = 'consult-item';
                item.innerHTML = `
                    <small>${new Date(c.timestamp).toLocaleString()}</small>
                    <strong>${c.plan || 'General Request'}</strong>
                    <div class="hover-detail">
                        ${c.projectInfo ? `<p>${c.projectInfo}</p>` : ''}
                        ${c.phone ? `<div>Phone: ${c.phone}</div>` : ''}
                        ${c.discord === 'yes' ? `<div>Discord: Yes</div>` : ''}
                    </div>
                `;
                els.consultList.appendChild(item);
            });
        } else {
            els.consultList.innerHTML = '<div class="consult-item">No consultations recorded.</div>';
        }

        // Render Favorites
        els.favPalettes.innerHTML = '';
        if (user.favoritePalettes && user.favoritePalettes.length > 0) {
            const paletteData = window.PALETTE_DATA || [];
            user.favoritePalettes.forEach(pName => {
                const p = paletteData.find(item => item.name === pName);
                const item = document.createElement('div');
                item.className = 'palette-chip';

                if (p) {
                    const swatches = p.colors.slice(0, 3).map(c =>
                        `<div class="mini-swatch" style="background: ${c}; width: 10px; height: 10px; border-radius: 2px;"></div>`
                    ).join('');
                    item.innerHTML = `
                        <div style="display: flex; gap: 2px; margin-bottom: 2px;">${swatches}</div>
                        <span>${pName}</span>
                    `;
                } else {
                    item.innerHTML = `<span>${pName}</span>`;
                }
                els.favPalettes.appendChild(item);
            });
        } else {
            els.favPalettes.innerHTML = '<span style="color:var(--text-dim)">No palettes favorited.</span>';
        }

        els.favFonts.innerHTML = '';
        if (user.favoriteFonts && user.favoriteFonts.length > 0) {
            user.favoriteFonts.forEach(fName => {
                const item = document.createElement('div');
                item.className = 'palette-chip';
                item.innerHTML = `<span>${fName}</span>`;
                els.favFonts.appendChild(item);
            });
        } else {
            els.favFonts.innerHTML = '<span style="color:var(--text-dim)">No fonts favorited.</span>';
        }
    }

    async function saveAdminChanges() {
        if (!selectedUserEmail) return;

        const newData = {
            activeProjects: els.activeProjects.value,
            projectProgress: parseInt(els.projectProgress.value) || 0
        };

        const result = await window.mkavsDataService.updateAdminData(selectedUserEmail, newData);
        if (result && result.success) {
            const btn = saveBtn;
            const originalText = btn.innerText;
            btn.innerText = 'Saved!';
            btn.style.background = '#4CAF50';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
            }, 2000);

            // Refresh local data model
            await loadUsers();
        } else {
            console.error('Save failed:', result);
            alert('Failed to save data: ' + (result?.error || 'Unknown error'));
        }
    }

    function updateClock() {
        const clock = document.getElementById('admin-clock');
        if (clock) {
            const now = new Date();
            clock.textContent = now.toLocaleTimeString();
        }
    }
});
