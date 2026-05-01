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

    // Meeting Modal Handlers
    window.openMeetingModal = function(title, dateStr, status, recordingLink, notes, documentsJson) {
        const modal = document.getElementById('meetingResourceModal');
        const documents = JSON.parse(decodeURIComponent(documentsJson));
        
        document.getElementById('modalMeetingTitle').textContent = title;
        document.getElementById('modalMeetingDate').textContent = dateStr;
        const statusEl = document.getElementById('modalMeetingStatus');
        statusEl.textContent = status;
        statusEl.style.color = status === 'Completed' ? '#00ff88' : '#ff3b30';
        statusEl.style.background = status === 'Completed' ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,48,0.1)';
        statusEl.style.borderColor = status === 'Completed' ? 'rgba(0,255,136,0.2)' : 'rgba(255,59,48,0.2)';

        let bodyHtml = '';

        // Recording Section
        if (recordingLink) {
            bodyHtml += `
                <div style="margin-bottom: 32px;">
                    <h4 style="font-size: 11px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-video"></i> Session Recording
                    </h4>
                    <a href="${recordingLink}" target="_blank" style="display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(204, 255, 0, 0.03); border: 1px solid rgba(204, 255, 0, 0.1); border-radius: 20px; text-decoration: none; transition: 0.3s;" onmouseover="this.style.background='rgba(204, 255, 0, 0.06)'; this.style.borderColor='rgba(204, 255, 0, 0.2)';" onmouseout="this.style.background='rgba(204, 255, 0, 0.03)'; this.style.borderColor='rgba(204, 255, 0, 0.1)';">
                        <div style="width: 44px; height: 44px; border-radius: 14px; background: var(--accent); color: #000; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <div style="flex: 1;">
                            <p style="margin: 0; font-size: 14px; font-weight: 800; color: #fff;">Watch Cloud Recording</p>
                            <p style="margin: 2px 0 0; font-size: 11px; color: var(--text-muted); font-weight: 600;">Access the full video archive</p>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.8rem;"></i>
                    </a>
                </div>
            `;
        }

        // Notes Section
        if (notes) {
            bodyHtml += `
                <div style="margin-bottom: 32px;">
                    <h4 style="font-size: 11px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-note-sticky"></i> Meeting Summary
                    </h4>
                    <div style="padding: 24px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px;">
                        <p style="margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.7; font-weight: 500;">${notes}</p>
                    </div>
                </div>
            `;
        }

        // Documents Section
        if (documents && documents.length > 0) {
            bodyHtml += `
                <div>
                    <h4 style="font-size: 11px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-folder-open"></i> Shared Assets & Docs
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                        ${documents.map(doc => {
                            const downloadUrl = doc.path.startsWith('http') ? doc.path : `/api/download?file=${encodeURIComponent(doc.path)}`;
                            return `
                                <a href="${downloadUrl}" target="_blank" style="display: flex; align-items: center; gap: 14px; padding: 14px 20px; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; text-decoration: none; transition: 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'; this.style.borderColor='rgba(255,255,255,0.08)';" onmouseout="this.style.background='rgba(255,255,255,0.015)'; this.style.borderColor='rgba(255,255,255,0.04)';">
                                    <i class="fa-solid fa-file-lines" style="color: var(--text-muted); font-size: 1rem;"></i>
                                    <div style="flex: 1;">
                                        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #fff;">${doc.name}</p>
                                        <p style="margin: 2px 0 0; font-size: 10px; color: var(--text-muted); font-weight: 600;">${doc.size || 'Unknown size'}</p>
                                    </div>
                                    <i class="fa-solid fa-arrow-down-to-bracket" style="color: var(--text-muted); font-size: 0.8rem;"></i>
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        if (!recordingLink && !notes && (!documents || documents.length === 0)) {
            bodyHtml = `
                <div style="padding: 60px 20px; text-align: center; color: var(--text-muted); opacity: 0.6;">
                    <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 16px;"></i>
                    <p style="font-size: 14px; font-weight: 700;">No additional assets were shared for this session.</p>
                </div>
            `;
        }

        document.getElementById('modalBody').innerHTML = bodyHtml;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

        if (!recordingLink && !notes && (!documents || documents.length === 0)) {
            bodyHtml = `
                <div style="padding: 60px 20px; text-align: center; color: var(--text-muted); opacity: 0.6;">
                    <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 16px;"></i>
                    <p style="font-size: 14px; font-weight: 700;">No additional assets were shared for this session.</p>
                </div>
            `;
        }

        document.getElementById('modalBody').innerHTML = bodyHtml;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeMeetingModal = function() {
        document.getElementById('meetingResourceModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Render Meetings
    function renderMeetings(adminData) {
        const upContainer = document.getElementById('upcomingMeetingsContainer');
        const histContainer = document.getElementById('meetingHistoryContainer');
        if (!upContainer || !histContainer) return;

        const meetings = adminData?.meetings || [];
        const upcoming = meetings.filter(m => m.status === 'Upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
        const history = meetings.filter(m => m.status !== 'Upcoming').sort((a, b) => new Date(b.date) - new Date(a.date));

        if (upcoming.length === 0) {
            upContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.05); border-radius: 24px;">
                    <i class="fa-solid fa-calendar-day" style="font-size: 2rem; margin-bottom: 12px; opacity: 0.2;"></i>
                    <p style="font-size: 12px; font-weight: 500;">No upcoming meetings. <a href="/consult/consult.html" style="color: var(--accent); text-decoration: none; font-weight: 700;">Schedule one?</a></p>
                </div>`;
        } else {
            upContainer.innerHTML = upcoming.map(m => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; margin-bottom: 12px; position: relative; overflow: hidden; transition: 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.025)'; this.style.borderColor='rgba(255,255,255,0.1)';">
                    <div style="display: flex; align-items: center; gap: 24px;">
                        <div style="width: 60px; height: 60px; background: var(--accent); border-radius: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #000; box-shadow: 0 10px 30px rgba(204, 255, 0, 0.2);">
                            <span style="font-size: 10px; font-weight: 900; text-transform: uppercase;">${new Date(m.date).toLocaleDateString([], { month: 'short' })}</span>
                            <span style="font-size: 1.4rem; font-weight: 900; line-height: 1;">${new Date(m.date).getDate()}</span>
                        </div>
                        <div>
                            <h4 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0;">${m.title}</h4>
                            <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">
                                <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;"><i class="fa-regular fa-clock" style="margin-right: 4px;"></i> ${m.time}</span>
                                <span style="width: 4px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 50%;"></span>
                                <span style="font-size: 11px; color: var(--accent); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Confirmed</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${m.link ? `
                            <a href="${m.link}" target="_blank" class="btn-primary" style="padding: 10px 24px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; box-shadow: 0 8px 25px rgba(204, 255, 0, 0.25);">Join Session</a>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }

        if (history.length === 0) {
            histContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-muted); opacity: 0.6;">
                    <i class="fa-solid fa-clock-rotate-left" style="font-size: 2rem; margin-bottom: 12px; opacity: 0.2;"></i>
                    <p style="font-size: 12px; font-weight: 500;">Your past sessions will appear here.</p>
                </div>`;
        } else {
            const assets = adminData?.meetingAssets || {};
            histContainer.innerHTML = history.map(m => {
                const recording = (assets.recordings || []).find(r => r.meetingTitle === m.title && r.meetingDate === m.date);
                const note = (assets.notes || []).find(n => n.meetingTitle === m.title && n.meetingDate === m.date);
                const docs = (assets.documents || []).filter(d => d.meetingTitle === m.title && d.meetingDate === m.date);

                const docsJson = encodeURIComponent(JSON.stringify(docs));
                const dateStr = new Date(m.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                const hasAssets = recording?.link || docs.length > 0;
                
                return `
                <div onclick="openMeetingModal('${m.title.replace(/'/g, "\\'")}', '${dateStr}', '${m.status}', '${(recording?.link || '').replace(/'/g, "\\'")}', '${(note?.content || '').replace(/'/g, "\\'")}', '${docsJson}')" 
                     style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 20px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;"
                     onmouseover="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(-2px)';"
                     onmouseout="this.style.background='rgba(255,255,255,0.01)'; this.style.borderColor='rgba(255,255,255,0.04)'; this.style.transform='translateY(0)';"
                >
                    <div style="display: flex; align-items: center; gap: 18px;">
                        <div style="width: 40px; height: 40px; border-radius: 12px; background: ${m.status === 'Completed' ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 59, 48, 0.05)'}; border: 1px solid ${m.status === 'Completed' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 59, 48, 0.1)'}; display: flex; align-items: center; justify-content: center; color: ${m.status === 'Completed' ? '#00ff88' : '#ff3b30'};">
                            <i class="fa-solid ${m.status === 'Completed' ? 'fa-check' : 'fa-xmark'}" style="font-size: 0.9rem;"></i>
                        </div>
                        <div>
                            <h5 style="font-size: 14px; font-weight: 700; color: #fff; margin: 0;">${m.title}</h5>
                            <p style="font-size: 10px; color: var(--text-muted); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">${dateStr} at ${m.time}</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${hasAssets ? `
                            <span style="font-size: 9px; font-weight: 800; color: var(--accent); background: rgba(204, 255, 0, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(204, 255, 0, 0.15); text-transform: uppercase; letter-spacing: 0.5px;">Assets Ready</span>
                        ` : ''}
                        <i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.7rem; opacity: 0.5;"></i>
                    </div>
                </div>
            `;}).join('');
        }
    }

    // Render Billing
    function renderBilling(adminData) {
        const subContainer = document.getElementById('subscriptionContainer');
        const invContainer = document.getElementById('invoicesContainer');
        if (!subContainer || !invContainer) return;

        const sub = adminData?.subscription;
        if (!sub || !sub.planName) {
            subContainer.innerHTML = `
                <div class="card billing-card active-plan" style="text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
                    <i class="fa-solid fa-credit-card" style="font-size: 1.5rem; margin-bottom: 0.8rem; opacity: 0.3;"></i>
                    <h4 style="margin: 0; font-size: 0.9rem;">NO ACTIVE SUBSCRIPTION</h4>
                    <p style="font-size: 0.75rem; margin-top: 5px; opacity: 0.6;">Your project is currently in review.</p>
                </div>`;
        } else {
            subContainer.innerHTML = `
                <div class="card billing-card active-plan" style="padding: 24px; border: 1px solid rgba(204, 255, 0, 0.15); background: linear-gradient(165deg, rgba(204, 255, 0, 0.08) 0%, rgba(0, 0, 0, 0.2) 100%); position: relative; overflow: hidden;">
                    <!-- Decorative background element -->
                    <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: var(--accent); opacity: 0.03; filter: blur(40px); border-radius: 50%;"></div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                <span style="font-size: 10px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 1.5px; background: rgba(204, 255, 0, 0.1); padding: 2px 8px; border-radius: 4px;">Active Plan</span>
                                ${sub.invoiceNumber ? `<span style="font-size: 10px; color: var(--text-muted); font-weight: 600;">#${sub.invoiceNumber}</span>` : ''}
                            </div>
                            <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 0; letter-spacing: -0.5px;">${sub.planName}</h2>
                        </div>
                        <div style="text-align: right;">
                             <div style="font-size: 1.8rem; font-weight: 900; color: #fff; letter-spacing: -0.5px;">${sub.price}</div>
                             <div style="font-size: 10px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; margin-top: 2px;">Monthly</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                                <i class="fa-regular fa-calendar-check" style="font-size: 0.9rem;"></i>
                            </div>
                            <div>
                                <p style="font-size: 9px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">Next Payment</p>
                                <p style="font-size: 13px; color: #fff; font-weight: 700; margin: 0;">${sub.nextBilling || 'To be scheduled'}</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); padding: 6px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent);"></span>
                            <span style="font-size: 10px; color: #fff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Renewal Sync</span>
                        </div>
                    </div>
                </div>
            `;
        }

        const invoices = adminData?.invoices || [];
        if (invoices.length === 0) {
            invContainer.innerHTML = `
                <div class="empty-consultation" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                    <i class="fa-solid fa-file-invoice-dollar" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.2;"></i>
                    <p>No payment history available yet.</p>
                </div>`;
        } else {
            invContainer.innerHTML = invoices.map(i => {
                let downloadLink = i.link;
                if (i.link && i.link.includes('/uploads/')) {
                    const path = i.link.includes('://') ? new URL(i.link).pathname : i.link;
                    downloadLink = `${MKAVS_CONFIG.API_BASE_URL}/api/download?file=${encodeURIComponent(path)}`;
                }

                const isPaid = i.status?.toLowerCase() === 'paid';
                const method = i.paymentMethod || 'Other';
                
                // Color mapping for methods
                const methodColors = {
                    'UPI': { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' },
                    'Bank Transfer': { bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399', border: 'rgba(16, 185, 129, 0.2)' },
                    'Credit Card': { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
                    'Stripe': { bg: 'rgba(99, 102, 241, 0.1)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.2)' }
                };
                const mStyle = methodColors[method] || { bg: 'rgba(255, 255, 255, 0.05)', text: '#94a3b8', border: 'rgba(255, 255, 255, 0.1)' };

                return `
                <div class="invoice-item" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; margin-bottom: 14px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: default; position: relative; overflow: hidden;" onmouseover="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255,255,255,0.015)'; this.style.borderColor='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; align-items: center; gap: 20px; flex: 1; min-width: 0;">
                        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0;">
                            <i class="fa-solid fa-receipt" style="font-size: 1.2rem; opacity: 0.8;"></i>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1;">
                            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
                                <span style="font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6;">${i.date}</span>
                                <span style="width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.1);"></span>
                                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: ${mStyle.bg}; color: ${mStyle.text}; padding: 2px 8px; border-radius: 6px; border: 1px solid ${mStyle.border};">${method}</span>
                                ${i.transactionId ? `
                                    <span style="width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.1);"></span>
                                    <span style="font-size: 10px; color: var(--accent); font-weight: 700; letter-spacing: 0.2px; opacity: 0.9; font-family: 'JetBrains Mono', 'Courier New', monospace;">ID: ${i.transactionId}</span>
                                ` : ''}
                            </div>
                            <span style="font-size: 15px; font-weight: 800; color: #fff; letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${i.description}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 32px; flex-shrink: 0; margin-left: 20px;">
                        <div style="text-align: right;">
                            <span style="display: block; font-size: 18px; font-weight: 900; color: #fff; letter-spacing: -0.5px; margin-bottom: 2px;">${i.amount}</span>
                            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                                <span style="width: 6px; height: 6px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 12px rgba(0, 255, 136, 0.5);"></span>
                                <span style="font-size: 10px; color: #00ff88; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">${i.status || 'PAID'}</span>
                            </div>
                        </div>
                        
                        ${downloadLink ? `
                            <a href="${downloadLink}" target="_blank" rel="noreferrer" title="Download Official Invoice" style="width: 40px; height: 40px; border-radius: 12px; background: rgba(204, 255, 0, 0.04); border: 1px solid rgba(204, 255, 0, 0.1); color: var(--accent); display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-decoration: none;" onmouseover="this.style.background='var(--accent)'; this.style.color='#000'; this.style.boxShadow='0 0 15px rgba(204, 255, 0, 0.2)';" onmouseout="this.style.background='rgba(204, 255, 0, 0.04)'; this.style.color='var(--accent)'; this.style.boxShadow='none';">
                                <i class="fa-solid fa-arrow-down-to-bracket" style="font-size: 1rem;"></i>
                            </a>
                        ` : `
                            <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;" title="Invoice not attached">
                                <i class="fa-solid fa-slash" style="font-size: 0.8rem;"></i>
                            </div>
                        `}
                    </div>
                </div>
            `}).join('');
        }
        }
    }

    // Render Messages
    let showAllMessages = false;
    window.toggleArchivedMessages = () => {
        showAllMessages = !showAllMessages;
        // Re-render the tab
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab && activeTab.textContent.includes('Messages')) {
            activeTab.click(); // Trigger re-render
        }
    };

    function renderMessages(adminData) {
        const msgContainer = document.getElementById('messagesContainer');
        if (!msgContainer) return;

        const allMessages = adminData?.messages || [];
        const hasArchived = allMessages.some(m => m.isArchived);
        const messages = allMessages.filter(m => showAllMessages || !m.isArchived);
        
        // Header and Compose area
        let html = `
            <div style="margin-bottom: 24px; padding: 24px; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04); border-radius: 24px;">
                <h4 style="font-size: 11px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-paper-plane"></i> Quick Message to Admin
                </h4>
                <div style="position: relative;">
                    <textarea id="clientMsgInput" placeholder="How can we help you today?..." style="width: 100%; height: 100px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 16px; color: #fff; font-size: 13px; resize: none; focus: outline-none; transition: all 0.3s ease;" onfocus="this.style.borderColor='var(--accent)'; this.style.background='rgba(0,0,0,0.3)';" onblur="this.style.borderColor='rgba(255,255,255,0.06)'; this.style.background='rgba(0,0,0,0.2)';"></textarea>
                    <button onclick="sendClientMessage()" style="position: absolute; bottom: 12px; right: 12px; padding: 8px 16px; background: var(--accent); color: #000; border: none; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; gap: 6px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(204, 255, 0, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        Send Message <i class="fa-solid fa-arrow-right" style="font-size: 0.7rem;"></i>
                    </button>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">
                    <i class="fa-solid fa-comments"></i> Direct Support Thread
                </h4>
                ${hasArchived ? `
                    <button onclick="toggleArchivedMessages()" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: var(--text-muted); padding: 4px 12px; border-radius: 8px; font-size: 9px; font-weight: 800; cursor: pointer; transition: all 0.3s;">
                        ${showAllMessages ? 'HIDE HISTORY' : 'SHOW HISTORY'}
                    </button>
                ` : ''}
            </div>
            
            <div id="messageThread" style="display: flex; flex-direction: column; gap: 12px;">
        `;

        if (messages.length === 0) {
            html += `
                <div style="padding: 40px; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.05); border-radius: 24px;">
                    <i class="fa-solid fa-comment-dots" style="font-size: 2rem; margin-bottom: 12px; opacity: 0.1;"></i>
                    <p style="font-size: 13px; font-weight: 500;">Your conversation history will appear here.</p>
                </div>`;
        } else {
            const sorted = [...messages].reverse();
            html += sorted.map(m => {
                const isAdmin = m.senderRole === 'admin';
                const date = new Date(m.date);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                
                // Subject colors
                const getSubjectStyles = (sub) => {
                    switch(sub) {
                        case 'Milestone Reached': return 'background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.2); color: #00ff88;';
                        case 'Action Required': return 'background: rgba(255, 170, 0, 0.1); border-color: rgba(255, 170, 0, 0.2); color: #ffaa00;';
                        case 'Billing Update': return 'background: rgba(255, 0, 102, 0.1); border-color: rgba(255, 0, 102, 0.2); color: #ff0066;';
                        case 'File Uploaded': return 'background: rgba(0, 204, 255, 0.1); border-color: rgba(0, 204, 255, 0.2); color: #00ccff;';
                        default: return 'background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: #fff;';
                    }
                };

                return `
                <div style="display: flex; flex-direction: column; align-items: ${isAdmin ? 'flex-start' : 'flex-end'}; max-width: 90%; align-self: ${isAdmin ? 'flex-start' : 'flex-end'}; position: relative; margin-bottom: 8px; ${m.isArchived ? 'opacity: 0.5;' : ''}">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; padding: 0 4px;">
                        ${isAdmin ? `<div style="width: 24px; height: 24px; border-radius: 8px; background: var(--accent); color: #000; display: flex; align-items: center; justify-content: center; font-size: 10px;"><i class="fa-solid fa-headset"></i></div>` : ''}
                        <span style="font-size: 10px; font-weight: 900; color: ${isAdmin ? 'var(--accent)' : 'var(--text-muted)'}; text-transform: uppercase; letter-spacing: 1px;">${isAdmin ? 'Official Support' : 'Your Message'}</span>
                        <span style="font-size: 9px; color: rgba(255,255,255,0.2); font-weight: 700;">${dateStr} • ${timeStr}</span>
                    </div>
                    
                    <div style="padding: 18px 24px; background: ${isAdmin ? 'rgba(255,255,255,0.02)' : 'rgba(204, 255, 0, 0.03)'}; border: 1px solid ${isAdmin ? 'rgba(255,255,255,0.05)' : 'rgba(204, 255, 0, 0.1)'}; border-radius: ${isAdmin ? '4px 24px 24px 24px' : '24px 24px 4px 24px'}; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.1);" onmouseover="this.style.background='${isAdmin ? 'rgba(255,255,255,0.04)' : 'rgba(204, 255, 0, 0.05)'}'; this.style.borderColor='${isAdmin ? 'rgba(255,255,255,0.1)' : 'rgba(204, 255, 0, 0.2)'}';">
                        
                        ${m.subject && m.subject !== 'Update' ? `
                            <div style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border: 1px solid transparent; ${getSubjectStyles(m.subject)}">
                                ${m.subject}
                            </div>
                        ` : ''}

                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${isAdmin ? '#cbd5e1' : '#fff'}; font-weight: 500; letter-spacing: 0.2px;">${m.content}</p>
                        
                        ${!m.isRead && isAdmin ? `
                            <div style="position: absolute; top: 12px; right: 12px; display: flex; align-items: center; gap: 4px;">
                                <span style="width: 6px; height: 6px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); animation: pulse 2s infinite;"></span>
                                <span style="font-size: 8px; color: var(--accent); font-weight: 900; text-transform: uppercase;">New</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `}).join('');
        }
        
        html += `</div>`;
        msgContainer.innerHTML = html;
    }

    // Client Message Logic
    window.sendClientMessage = async function() {
        const input = document.getElementById('clientMsgInput');
        const content = input.value.trim();
        if (!content) return;

        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;

        try {
            const res = await fetch(`${MKAVS_CONFIG.API_BASE_URL}/api/user/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust if session based
                },
                body: JSON.stringify({ content })
            });

            if (res.ok) {
                input.value = '';
                // Reload data to show new message
                const data = await res.json();
                renderMessages({ messages: data.messages });
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };

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
