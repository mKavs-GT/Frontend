document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoriteFontsGrid = document.getElementById('favoriteFontsGrid');
    const palettesSection = document.getElementById('palettes');

    const paletteData = window.PALETTE_DATA || [];
    const fontData = window.FONT_DATA || [];

    // Load user profile from backend
    async function loadUserProfile() {
        try {
            const response = await fetch(MKAVS_CONFIG.API_BASE_URL + '/api/user/me', {
                credentials: 'include'
            });

            if (response.ok) {
                const user = await response.json();
                const userNameElements = document.querySelectorAll('.user-name');
                if (userNameElements.length > 0 && user.displayName) {
                    const firstName = user.displayName.split(' ')[0];
                    userNameElements.forEach(el => el.textContent = firstName);
                }
                const userEmailEl = document.getElementById('userEmail');
                if (userEmailEl) {
                    userEmailEl.textContent = user.email || user.username || 'user@mkavs.com';
                }
                const userPhotoEl = document.getElementById('userProfilePhoto');
                if (userPhotoEl) {
                    userPhotoEl.src = user.image || user.picture || user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=ccff00&color=000&size=150`;
                }

                // Render Project Details
                renderProjectDetails(user.adminData);

                // Render Consultations
                renderConsultations(user.consultations);

                // Render Deliverables
                renderDeliverables(user.adminData);

                // Render Uploaded Attachments
                renderAttachments(user.adminData);

                // Render New Admin Fields
                renderMeetings(user.adminData);
                renderBilling(user.adminData);
                renderMessages(user.adminData);

                // Store user data for potential later use
                window.currentUser = user;
                
                const profilePhoneInput = document.getElementById('profilePhone');
                if (profilePhoneInput) profilePhoneInput.value = user.phone || '';
                
                const profileTitleInput = document.getElementById('profileTitle');
                if (profileTitleInput) profileTitleInput.value = user.jobTitle || '';

                const userJobTitleEl = document.getElementById('userJobTitle');
                if (userJobTitleEl) userJobTitleEl.textContent = user.jobTitle || '';

                const userCompanyEl = document.getElementById('userCompanyName');
                if (userCompanyEl) userCompanyEl.textContent = user.company ? `@ ${user.company}` : '';

                // Show the content now that we are authenticated
                const mainContent = document.querySelector('.main-content');
                if (mainContent) mainContent.style.display = 'block';

                // Sync backend favorites to localStorage
                if (user.favoritePalettes && user.favoritePalettes.length > 0) {
                    localStorage.setItem('mKavs_palette_likes', JSON.stringify(user.favoritePalettes));
                }
                if (user.favoriteFonts && user.favoriteFonts.length > 0) {
                    localStorage.setItem('mKavs_font_likes', JSON.stringify(user.favoriteFonts));
                }

                // Reload grids to reflect merged data
                loadFavorites();
                loadFontFavorites();
            } else if (response.status === 401) {
                // Not authenticated - redirect to login
                window.location.href = '../loginpg/login.html';
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    // Render project details
    function renderProjectDetails(adminData) {
        const container = document.getElementById('activeProjectContainer');
        if (!container) return;

        if (!adminData || !adminData.activeProjects) {
            container.innerHTML = `
                <div class="empty-project">
                    <p>No active projects at the moment.</p>
                </div>
            `;
            return;
        }

        const project = adminData.activeProjects;
        const progress = adminData.projectProgress || 0;

        container.innerHTML = `
            <div class="project-item">
                <div class="project-info">
                    <h4>${project}</h4>
                    <span class="status in-progress">${progress === 100 ? 'Completed' : 'In Progress'}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%;"></div>
                </div>
                <p class="meta">Status: ${progress}% complete</p>
            </div>
        `;
    }

    // Render Consultations
    function renderConsultations(consultations) {
        const container = document.getElementById('consultationContainer');
        if (!container) return;

        if (!consultations || consultations.length === 0) {
            container.innerHTML = `
                <div class="empty-consultation">
                    <i class="fa-solid fa-file-contract"></i>
                    <p>No active consultations requested.</p>
                    <a href="../consult/consult.html" class="request-btn" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #c7f908; color: #000; border-radius: 8px; text-decoration: none; font-weight: 600;">Request Now</a>
                </div>
            `;
            return;
        }

        let html = '<div class="consultation-list" style="display:flex; flex-direction:column; gap:15px; width: 100%;">';
        
        // Sort by timestamp descending
        const sorted = [...consultations].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        sorted.forEach(c => {
            const date = c.timestamp ? new Date(c.timestamp).toLocaleDateString() : 'N/A';
            const planDisplay = c.plan || 'Not selected';
            html += `
                <div class="consultation-item" style="padding: 15px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #c7f908; font-weight: 600;">${planDisplay.toUpperCase()}</span>
                        <span style="color: var(--text-muted, #9ca3af); font-size: 0.85rem;">${date}</span>
                    </div>
                    <p style="margin-bottom: 8px; font-size: 0.95rem; color: #fff;">${c.projectInfo || 'No project description provided.'}</p>
                    <p style="margin-bottom: 0; font-size: 0.85rem; color: var(--text-muted, #9ca3af);">Preference: ${c.connectPreference || 'Not specified'}</p>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    // Render Deliverables
    function renderDeliverables(adminData) {
        const container = document.getElementById('deliverablesContainer');
        if (!container) return;

        if (!adminData || !adminData.deliverables || adminData.deliverables.length === 0) {
            container.innerHTML = `
                <div class="empty-consultation" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent);"></i>
                    <p>No final deliverables have been uploaded yet.</p>
                </div>
            `;
            return;
        }

        let html = '';
        const deliverables = adminData.deliverables;

        deliverables.forEach(item => {
            const isFile = item.link && item.link.includes('/uploads/');
            
            // Determine icon based on file type or if it's a link
            let iconClass = isFile ? 'fa-solid fa-file-arrow-down' : 'fa-solid fa-arrow-up-right-from-square';
            let iconColor = isFile ? 'var(--accent)' : '#6366f1'; // Green for files, Indigo for links

            if (isFile) {
                const titleLower = item.title.toLowerCase();
                if (titleLower.includes('zip') || titleLower.includes('pack')) iconClass = 'fa-solid fa-file-zipper';
                else if (titleLower.includes('pdf')) iconClass = 'fa-solid fa-file-pdf';
                else if (titleLower.includes('image') || titleLower.includes('png') || titleLower.includes('svg')) iconClass = 'fa-solid fa-image';
            }

            const dateStr = item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : 'Recently calculated';

            // Determine the final link and action UI
            let downloadLink = item.link;
            let actionIcon = 'fa-solid fa-download';
            let actionTitle = 'Download File';

            if (isFile) {
                const path = item.link.includes('://') ? new URL(item.link).pathname : item.link;
                downloadLink = `${MKAVS_CONFIG.API_BASE_URL}/api/download?file=${encodeURIComponent(path)}`;
            } else {
                actionIcon = 'fa-solid fa-arrow-up-right-from-square';
                actionTitle = 'Open Link';
                if (item.link && !item.link.includes('://') && !item.link.startsWith('/') && !item.link.startsWith('#')) {
                    downloadLink = `https://${item.link}`;
                }
            }

            html += `
                <div style="display: flex; align-items: center; gap: 15px; padding: 18px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; transition: all 0.2s; margin-bottom: 12px;" onmouseover="this.style.background='rgba(255, 255, 255, 0.04)'; this.style.borderColor='rgba(255, 255, 255, 0.15)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
                    <div style="width: 42px; height: 42px; border-radius: 12px; background: ${isFile ? 'rgba(199, 249, 8, 0.1)' : 'rgba(99, 102, 241, 0.1)'}; border: 1px solid ${isFile ? 'rgba(199, 249, 8, 0.2)' : 'rgba(99, 102, 241, 0.2)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="${iconClass}" style="color: ${iconColor}; font-size: 1.1rem;"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <h4 style="margin: 0; font-size: 15px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
                            <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${isFile ? 'rgba(199, 249, 8, 0.1)' : 'rgba(99, 102, 241, 0.1)'}; color: ${isFile ? 'var(--accent)' : '#818cf8'}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${isFile ? 'rgba(199, 249, 8, 0.2)' : 'rgba(99, 102, 241, 0.2)'};">${isFile ? 'File' : 'Link'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
                            <p style="margin: 0; font-size: 11px; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${dateStr}</p>
                            <span style="color: rgba(255,255,255,0.2); font-size: 10px;">•</span>
                            <p style="margin: 0; font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.7;">${item.link}</p>
                        </div>
                    </div>
                    <a href="${downloadLink}" target="_blank" title="${actionTitle}" style="width: 38px; height: 38px; background: rgba(255, 255, 255, 0.05); color: ${iconColor}; border-radius: 10px; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='${iconColor}'; this.style.color='#000'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.color='${iconColor}'; this.style.transform='scale(1)';">
                        <i class="${actionIcon}"></i>
                    </a>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Render Uploaded Attachments
    function renderAttachments(adminData) {
        const container = document.getElementById('uploadedFilesContainer');
        if (!container) return;

        if (!adminData || !adminData.attachments || adminData.attachments.length === 0) {
            container.innerHTML = '';
            return;
        }

        let html = '<h3 style="font-size: 14px; margin-bottom: 5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Uploaded Reference Files</h3>';
        
        adminData.attachments.forEach(att => {
            const dateStr = att.uploadDate ? new Date(att.uploadDate).toLocaleDateString() : 'Recently uploaded';
            const downloadLink = att.path ? `${MKAVS_CONFIG.API_BASE_URL}/api/download?file=${encodeURIComponent(att.path)}` : '#';

            html += `
                <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; transition: all 0.2s;">
                    <i class="fa-solid fa-paperclip" style="font-size: 1.5rem; color: var(--text-muted);"></i>
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin: 0; font-size: 14px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${att.name || 'File'}</h4>
                        <p style="margin: 3px 0 0; font-size: 12px; color: var(--text-muted);">${att.size} • ${dateStr}</p>
                    </div>
                    <a href="${downloadLink}" target="_blank" style="padding: 10px; background: rgba(255, 255, 255, 0.05); color: #fff; border-radius: 8px; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" onmouseover="this.style.background='var(--accent)'; this.style.color='#000';" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.color='#fff';"><i class="fa-solid fa-download"></i></a>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Render Meetings
    function renderMeetings(adminData) {
        const upContainer = document.getElementById('upcomingMeetingsContainer');
        const histContainer = document.getElementById('meetingHistoryContainer');
        if (!upContainer || !histContainer) return;

        const meetings = adminData?.meetings || [];
        const upcoming = meetings.filter(m => m.status === 'Upcoming');
        const history = meetings.filter(m => m.status !== 'Upcoming');

        if (upcoming.length === 0) {
            upContainer.innerHTML = '<div class="empty-consultation">No upcoming meetings scheduled.</div>';
        } else {
            upContainer.innerHTML = upcoming.map(m => `
                <div class="meeting-card">
                    <div class="meeting-date" style="padding: 10px; text-align: center;">
                        <span class="day" style="font-size: 1.2rem; display: block; font-weight: bold; color: var(--accent);">${m.date}</span>
                    </div>
                    <div class="meeting-details">
                        <h4>${m.title}</h4>
                        <p>${m.time}</p>
                    </div>
                    <div class="meeting-actions">
                        ${m.link ? `<a href="${m.link}" target="_blank" class="btn-primary join-btn" style="text-decoration:none;">Join Now</a>` : ''}
                    </div>
                </div>
            `).join('');
        }

        if (history.length === 0) {
            histContainer.innerHTML = '<div class="empty-consultation">No meeting history.</div>';
        } else {
            histContainer.innerHTML = history.map(m => `
                <div class="history-item">
                    <div>
                        <h5>${m.title}</h5>
                        <p class="meta">${m.date} at ${m.time} - <span style="color: ${m.status === 'Completed' ? 'var(--accent)' : 'var(--text-danger)'}">${m.status}</span></p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Render Billing
    function renderBilling(adminData) {
        const subContainer = document.getElementById('subscriptionContainer');
        const invContainer = document.getElementById('invoicesContainer');
        if (!subContainer || !invContainer) return;

        const sub = adminData?.subscription;
        if (!sub || !sub.planName) {
            subContainer.innerHTML = '<div class="card billing-card active-plan" style="text-align: center; color: var(--text-muted);"><h4>No Active Subscription</h4></div>';
        } else {
            subContainer.innerHTML = `
                <div class="card billing-card active-plan">
                    <h4>Active Subscription</h4>
                    <div class="plan-price"><h2>${sub.price}</h2></div>
                    <p class="plan-name">${sub.planName}</p>
                    <p class="renewal">Next billing: ${sub.nextBilling}</p>
                </div>
            `;
        }

        const invoices = adminData?.invoices || [];
        if (invoices.length === 0) {
            invContainer.innerHTML = '<div class="empty-consultation">No payment history available.</div>';
        } else {
            invContainer.innerHTML = invoices.map(i => `
                <div class="invoice-item">
                    <span class="inv-date">${i.date}</span>
                    <span class="inv-desc">${i.description}</span>
                    <span class="inv-amount">${i.amount}</span>
                    <span class="status status-paid" style="background: ${i.status.toLowerCase() !== 'paid' ? 'rgba(255,59,48,0.1)' : ''}; color: ${i.status.toLowerCase() !== 'paid' ? '#ff3b30' : ''}">${i.status}</span>
                    ${i.link ? `<a href="${i.link}" target="_blank" class="btn-icon" title="View"><i class="fa-solid fa-download"></i></a>` : ''}
                </div>
            `).join('');
        }
    }

    // Render Messages
    function renderMessages(adminData) {
        const msgContainer = document.getElementById('messagesContainer');
        if (!msgContainer) return;

        const messages = adminData?.messages || [];
        if (messages.length === 0) {
            msgContainer.innerHTML = '<div class="empty-consultation">Inbox is empty.</div>';
        } else {
            // Reverse so newest is first
            const sorted = [...messages].reverse();
            msgContainer.innerHTML = sorted.map(m => `
                <div class="message-item ${m.isRead ? '' : 'unread'}">
                    <div class="msg-avatar"><img src="../images/LOGOI.png" alt="Admin"></div>
                    <div class="msg-content">
                        <div class="msg-header">
                            <h5>${m.sender || 'System Admin'}</h5>
                            <span class="time">${new Date(m.date).toLocaleDateString()}</span>
                        </div>
                        <p>${m.content}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Initialize profile
    loadUserProfile();

    function loadFavorites() {
        const storedLikes = localStorage.getItem('mKavs_palette_likes');
        let likedIds = new Set();

        if (storedLikes) {
            try {
                likedIds = new Set(JSON.parse(storedLikes));
            } catch (e) {
                console.error("Error parsing favorites:", e);
            }
        }

        if (likedIds.size === 0) {
            // No favorites, do not hide the section. Just let it show the 'Add New' button.
            if (palettesSection) {
                palettesSection.style.display = 'block';
            }
            // We still need to clear any potential garbage if we weren't reloading
            // But the rest of the function handles clearing below.
        } else {
            // Show section if hidden
            if (palettesSection) {
                palettesSection.style.display = 'block';
            }
        }

        // Clear existing generated items (keeping the 'add-new' button)
        // We can just iterate backwards or remove elements that are not .add-new
        // Or cleaner: clear innerHTML and rebuild, appending 'add-new' at the end.
        // But 'add-new' is hardcoded in HTML. Let's find it.
        const addNewBtn = favoritesGrid.querySelector('.add-new');

        // Remove all palette-cards except add-new
        const cards = favoritesGrid.querySelectorAll('.palette-card:not(.add-new)');
        cards.forEach(card => card.remove());

        // Filter and render
        const likedPalettes = paletteData.filter(p => likedIds.has(p.name));

        likedPalettes.forEach(palette => {
            const card = createPaletteCard(palette);
            favoritesGrid.insertBefore(card, addNewBtn);
        });
    }

    function createPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'palette-card';

        // Create colors HTML
        const colorsHtml = palette.colors.map(color => `
            <div class="color" style="background: ${color};" title="${color}"></div>
        `).join('');

        card.innerHTML = `
            <div class="colors">
                ${colorsHtml}
            </div>
            <span>${palette.name}</span>
        `;

        return card;
    }

    loadFavorites();
    loadFontFavorites();

    function loadFontFavorites() {
        if (!favoriteFontsGrid) return;

        const storedLikes = localStorage.getItem('mKavs_font_likes');
        let likedIds = new Set();

        if (storedLikes) {
            try {
                likedIds = new Set(JSON.parse(storedLikes));
            } catch (e) {
                console.error("Error parsing font favorites:", e);
            }
        }

        const addNewBtn = favoriteFontsGrid.querySelector('.add-new');

        // Remove all palette-cards except add-new
        const cards = favoriteFontsGrid.querySelectorAll('.palette-card:not(.add-new)');
        cards.forEach(card => card.remove());

        // Filter and render
        const likedFonts = fontData.filter(f => likedIds.has(f.name));

        likedFonts.forEach(font => {
            const card = createFontCard(font);
            favoriteFontsGrid.insertBefore(card, addNewBtn);
        });
    }

    function createFontCard(font) {
        const card = document.createElement('div');
        card.className = 'palette-card font-card';
        // Add font-card class for potential formatting

        card.innerHTML = `
            <div class="font-preview" style="font-family: ${font.family}; display: flex; align-items: center; justify-content: center; height: 120px; font-size: 3rem; color: var(--text-main);">Ag</div>
            <span>${font.name}</span>
        `;

        return card;
    }

    // Profile image upload handling removed as per user request

    // Logout and local storage clearing
    const logoutLinks = document.querySelectorAll('.logout-header-btn.with-text, a[href="/auth/logout"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', () => {
            localStorage.removeItem('mKavs_palette_likes');
            localStorage.removeItem('mKavs_font_likes');
        });
    });

    // Dashboard Tabs Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find matching tab content and activate it
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    // Handle Client File Uploads
    const fileUploadInput = document.getElementById('fileUploadInput');
    if (fileUploadInput) {
        fileUploadInput.addEventListener('change', async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            // Simple loading feedback
            const uploadArea = document.querySelector('.upload-area');
            const originalText = uploadArea.innerHTML;
            uploadArea.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><p>Uploading files...</p>';
            uploadArea.style.pointerEvents = 'none';

            try {
                const response = await fetch(MKAVS_CONFIG.API_BASE_URL + '/api/user/upload', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Files uploaded successfully. They will now be visible to the admin.');
                    // Optionally update the UI or reload
                    window.location.reload();
                } else {
                    alert('Upload failed: ' + (result.error || 'Server error'));
                    uploadArea.innerHTML = originalText;
                }
            } catch (err) {
                console.error("Upload Error:", err);
                alert("An error occurred while uploading. Please check connection.");
                uploadArea.innerHTML = originalText;
            } finally {
                uploadArea.style.pointerEvents = 'auto';
                fileUploadInput.value = ''; // Reset input
            }
        });
    }

    // Handle Profile Update Submission
    const updateProfileForm = document.getElementById('updateProfileForm');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (updateProfileForm && saveProfileBtn) {
        updateProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalText = saveProfileBtn.textContent;
            saveProfileBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            saveProfileBtn.disabled = true;

            const updateData = {
                displayName: document.getElementById('profileName')?.value.trim(),
                company: document.getElementById('profileCompany')?.value.trim(),
                phone: document.getElementById('profilePhone')?.value.trim(),
                jobTitle: document.getElementById('profileTitle')?.value.trim()
            };

            try {
                const response = await fetch(MKAVS_CONFIG.API_BASE_URL + '/api/user/me', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData),
                    credentials: 'include'
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Profile Updated Successfully!');
                    // Update side panel info immediately
                    if (updateData.displayName) {
                        const userNameElements = document.querySelectorAll('.user-name');
                        const firstName = updateData.displayName.split(' ')[0];
                        userNameElements.forEach(el => el.textContent = firstName);
                    }
                    if (updateData.jobTitle !== undefined) {
                        const userJobTitleEl = document.getElementById('userJobTitle');
                        if (userJobTitleEl) userJobTitleEl.textContent = updateData.jobTitle;
                    }
                    if (updateData.company !== undefined) {
                        const userCompanyEl = document.getElementById('userCompanyName');
                        if (userCompanyEl) userCompanyEl.textContent = updateData.company ? `@ ${updateData.company}` : '';
                    }
                } else {
                    alert('Failed to update profile: ' + (result.error || 'Server error'));
                }
            } catch (error) {
                console.error('Update Profile Error:', error);
                alert('An error occurred. Please check connection.');
            } finally {
                saveProfileBtn.textContent = originalText;
                saveProfileBtn.disabled = false;
            }
        });
    }

    // Handle Password Change Submission
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordMessage = document.getElementById('passwordMessage');
    if (updatePasswordForm && changePasswordBtn && passwordMessage) {
        updatePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword')?.value;
            const newPassword = document.getElementById('newPassword')?.value;
            
            if (!currentPassword || !newPassword) return;

            if (newPassword.length < 6) {
                passwordMessage.textContent = 'New password must be at least 6 characters.';
                passwordMessage.style.color = '#ff3b30';
                return;
            }

            const originalText = changePasswordBtn.textContent;
            changePasswordBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Changing...';
            changePasswordBtn.disabled = true;
            passwordMessage.textContent = '';

            try {
                const response = await fetch(MKAVS_CONFIG.API_BASE_URL + '/api/user/me/password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPassword, newPassword }),
                    credentials: 'include'
                });

                const result = await response.json();

                if (response.ok) {
                    passwordMessage.textContent = 'Password changed successfully!';
                    passwordMessage.style.color = 'var(--accent)';
                    updatePasswordForm.reset();
                } else {
                    passwordMessage.textContent = result.error || 'Failed to change password.';
                    passwordMessage.style.color = '#ff3b30';
                }
            } catch (error) {
                console.error('Change Password Error:', error);
                passwordMessage.textContent = 'An error occurred. Please try again later.';
                passwordMessage.style.color = '#ff3b30';
            } finally {
                changePasswordBtn.textContent = originalText;
                changePasswordBtn.disabled = false;
            }
        });
    }

});
